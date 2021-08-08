#!/usr/bin/env node
const opsh = require('opsh');
const { constants, promises: fs } = require('fs');
const path = require('path');
const pkg = require('./package.json');

run();

async function run() {

	const { options, operands } = opsh(process.argv.slice(2), ['h', 'help', 'l', 'list']);

	if (options.h || options.help) {
		outputHelp();
		process.exit(0);
	}

	if (options.v || options.version) {
		console.log(pkg.version);
		process.exit(0);
	}

	if (options.l || options.list) {
		await listFiles();
		process.exit(0);
	}

	if (!operands.length) {
		outputHelp();
	}

	operands.forEach(op => {
		fs.copyFile(path.join(__dirname, 'dotfiles', op), path.join(process.cwd(), op), constants.COPYFILE_EXCL);
	});
}

async function listFiles() {
	let files = await fs.readdir(path.join(__dirname, 'dotfiles'));
	console.log(files.join('\n'));
}

function outputHelp() {
	console.log(`
------------------
@danburzo/dotfiles
v${pkg.version}
------------------

Usage:

	npx @danburzo/dotfiles [options] [operands]

Available options:

	-l, --list    List all available files


`);
}