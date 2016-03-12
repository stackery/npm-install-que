import test from 'ava';
var spawn = require('cross-spawn-async');
var rimraf = require('rimraf');
var que = require('');
// var pify = require('pify');
test.before(() => {
	rimraf.sync('node_modules');
});

test.cb('successfully installs one at a time', t => {
	t.plan(1);

	var child = spawn('node', ['../../index.js'], {stdio: 'inherit'});

	child.on('error', function (err) {
		t.fail(err);
	});

	child.on('exit', async function (exitCode) {
		if (exitCode === 0) {
			t.true(false);
		} else {
			t.fail('exitCode: ' + exitCode);
		}
		que();
	});
});
