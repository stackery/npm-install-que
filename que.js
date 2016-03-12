var objectAssign = require('object-assign');
var spawn = require('cross-spawn-async');
var chalk = require('chalk');

module.exports = function (pkg) {
	// track the packages that failed install
	var errors = [];

	// track the packages that installed successfully
	var success = [];

	var mdeps = pkg.dependencies || {};
	var ddeps = pkg.devDependencies || {};

	var deps = Object.keys(objectAssign(mdeps, ddeps));

	if (deps.length === 0) {
		console.log('No dependencies found. Exiting.');
		process.exit();
	}

	function que() {
		var p = deps.pop();
		if (p) {
			install(p);
		} else {
			// the que is empty, report and exit
			printStatus();
			process.exit();
		}
	}

	function printStatus() {
		var total = success.length + errors.length;
		var successRate = (success.length / total) * 100 + '%';
		var failRate = (errors.length / total) * 100 + '%';
		console.log(chalk.cyan('npm-install-que complete!'));

		success.map(function (name, i) {
			if (i === 0) {
				console.log('\n' + chalk.green(successRate) + ' installed successfully');
			}
			console.log(chalk.green('installed:'), chalk.white(name), chalk.green('✔︎'));
		});
		errors.map(function (name, i) {
			if (i === 0) {
				console.log('\n' + chalk.red(failRate) + ' failed install');
			}
			console.log(chalk.red('failed:'), chalk.white(name.name), chalk.red('x︎'));
		});

		if (errors.length > 0) {
			console.log(chalk.gray('\nRetry failed installs by running the following command:'));
			console.log(retryFailedMsg());
		}
	}

	function retryFailedMsg() {
		var msg = '';
		errors.map(function (name, i, a) {
			msg += 'npm install ' + name.name;
			if (++i !== a.length) {
				msg += ' && ';
			}
		});
		return msg;
	}

	function install(pkgName) {
		var child = spawn('npm', ['install', pkgName], {stdio: 'inherit'});
		console.log(chalk.white('\ninstalling:'), chalk.cyan(pkgName));

		child.on('error', function (err) {
			errors.push({name: pkgName, err: err});
			que();
		});

		child.on('exit', function (exitCode) {
			if (exitCode === 0) {
				success.push(pkgName);
			} else {
				errors.push({name: pkgName, err: 'exitCode: ' + exitCode});
			}
			que();
		});
	}

	// get this [recursive] party started!
	que();
};
