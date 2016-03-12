#!/usr/bin/env node
'use strict';
require('native-promise-only');
var pkgUp = require('pkg-up');
var que = require('./que.js');
var chalk = require('chalk');

module.exports = (function () {
	// first, get the project's package.json
	pkgUp().then(function (filepath) {
		console.log('installing dependencies from:', chalk.cyan(filepath));
		que(require(filepath));
	});
})();
