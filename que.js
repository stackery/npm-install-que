'use strict';
var objectAssign = require('object-assign');
var spawn = require('cross-spawn-async');
var chalk = require('chalk');

// https://github.com/yeoman/yo/blob/master/lib/routes/install.js
// http://stackoverflow.com/questions/10585683/how-do-you-edit-existing-text-and-move-the-cursor-around-in-the-terminal

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
			// TODO: create a nice output message that knows how to move the cursor so that the data can be redrawn each time
			// installing: package-name <looping animation>
			// installing: package-name <green checkmark>|<red x>
			install(p);
		} else {
			// the que is empty, report and exit
			// TODO: create a nice output message
			console.log('finished!');
			console.log('successful installs: ', success.length);
			console.log('failed installs: ', errors.length);
			process.exit();
		}
	}

	function install(pkgName) {
		var child = spawn('npm', ['install', pkgName], {stdio: 'inherit'});
		console.log('installing:', pkgName);

		child.on('error', function (err) {
			errors.push({name:pkgName, err:err});
			que();
		});

		child.on('exit', function (exitCode) {
			if (exitCode === 0) {
				success.push(pkgName);
			} else {
				errors.push({name:pkgName, err:'exitCode: '+exitCode});
			}
			que();
		});
	}

	// get this [recursive] party started!
	que();
};


