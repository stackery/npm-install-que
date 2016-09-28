import rimraf from 'rimraf';
import chalk from 'chalk';
import test from 'ava';
import que from '../que.js';

const goodPkg = require('./success.json');
const failPkg = require('./fail.json');
const manyFailPkg = require('./manyfail.json');
const noDevsPkg = require('./nodevdeps.json');
const onlyDevsPkg = require('./onlydevdeps.json');

test.beforeEach(() => {
	rimraf.sync('node_modules');
});

test('successfully installs one at a time', async t => {
	let status = await que(goodPkg);
	status = chalk.stripColor(status);

	t.true(/100% installed successfully/g.test(status));
	t.true(/installed: noop/g.test(status));
	t.true(/installed: emtee/g.test(status));
});

test('report failed install', async t => {
	let status = await que(failPkg);
	status = chalk.stripColor(status);

	t.true(/50% installed successfully/g.test(status));
	t.true(/installed: emtee/g.test(status));
	t.true(/failed: THISMODULEWILLNEVEREXIST/g.test(status));
	t.true(/Retry failed installs by running the following command:/g.test(status));
	t.true(/npm install THISMODULEWILLNEVEREXIST/g.test(status));
});

test('report many failed installs', async t => {
	let status = await que(manyFailPkg);
	status = chalk.stripColor(status);

	t.false(/installed successfully/g.test(status));
	t.true(/100% failed install/g.test(status));
	t.true(/failed: THISMODULEWILLNEVEREXIST/g.test(status));
	t.true(/failed: ALSOTHISMODULEWILLNEVEREXIST/g.test(status));
	t.true(/Retry failed installs by running the following command:/g.test(status));
	t.true(/npm install ALSOTHISMODULEWILLNEVEREXIST && npm install THISMODULEWILLNEVEREXIST/g.test(status));
});

test('no devDependencies', async t => {
	let status = await que(noDevsPkg);
	status = chalk.stripColor(status);

	t.true(/100% installed successfully/g.test(status));
	t.true(/installed: emtee/g.test(status));
});

test('only devDependencies', async t => {
	let status = await que(onlyDevsPkg);
	status = chalk.stripColor(status);

	t.true(/100% installed successfully/g.test(status));
	t.true(/installed: emtee/g.test(status));
});
