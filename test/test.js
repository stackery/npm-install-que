import test from 'ava';
// var spawn = require('cross-spawn-async');
var rimraf = require('rimraf');
var que = require('../que.js');
// var pify = require('pify');
var chalk = require('chalk');

test.beforeEach(() => {
	rimraf.sync('node_modules');
});

test('successfully installs one at a time', async t => {
	const pkg = require('./success.json');
	let status = await que(pkg);
	status = chalk.stripColor(status);

	t.true(/100% installed successfully/g.test(status));
	t.true(/installed: noop/g.test(status));
	t.true(/installed: emtee/g.test(status));
});

test('report failed install', async t => {
	const pkg = require('./fail.json');
	let status = await que(pkg);
	status = chalk.stripColor(status);

	t.true(/50% installed successfully/g.test(status));
	t.true(/installed: emtee/g.test(status));
	t.true(/failed: THISMODULEWILLNEVEREXIST/g.test(status));
	t.true(/Retry failed installs by running the following command:/g.test(status));
	t.true(/npm install THISMODULEWILLNEVEREXIST/g.test(status));
});

test('report many failed installs', async t => {
	const pkg = require('./manyfail.json');
	let status = await que(pkg);
	status = chalk.stripColor(status);

	t.false(/installed successfully/g.test(status));
	t.true(/100% failed install/g.test(status));
	t.true(/failed: THISMODULEWILLNEVEREXIST/g.test(status));
	t.true(/failed: ALSOTHISMODULEWILLNEVEREXIST/g.test(status));
	t.true(/Retry failed installs by running the following command:/g.test(status));
	t.true(/npm install ALSOTHISMODULEWILLNEVEREXIST && npm install THISMODULEWILLNEVEREXIST/g.test(status));
});

test('no devDependencies', async t => {
	const pkg = require('./nodevdeps.json');
	let status = await que(pkg);
	status = chalk.stripColor(status);

	t.true(/100% installed successfully/g.test(status));
	t.true(/installed: emtee/g.test(status));
});

test('only devDependencies', async t => {
	const pkg = require('./onlydevdeps.json');
	let status = await que(pkg);
	status = chalk.stripColor(status);

	t.true(/100% installed successfully/g.test(status));
	t.true(/installed: emtee/g.test(status));
});
