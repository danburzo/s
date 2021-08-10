#!/usr/bin/env node
const opsh = require('opsh');
const { constants, promises: fs, createReadStream } = require('fs');
const path = require('path');
const pkg = require('./package.json');

run();

async function run() {

	const { options, operands } = opsh(process.argv.slice(2), ['h', 'help', 'l', 'list', 'f', 'force', 'p', 'pipe']);

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
		const src = path.join(__dirname, 'snippets', op);
		if (options.p || options.pipe) {
			createReadStream(src, 'utf8').pipe(process.stdout);
		} else {
			fs.copyFile(src, path.join(process.cwd(), op), options.f || options.force ? 0 : constants.COPYFILE_EXCL);
		}
	});
}

async function listFiles() {
	let files = await fs.readdir(path.join(__dirname, 'snippets'));
	console.log(files.join('\n'));
}

function outputHelp() {
	console.log(`
----------
danburzo/s
----------

Common snippets to grab for web projects.

Usage:

	npx danburzo/s [options] [operands]

Available options:

	-l, --list      List all available files.
	-f, --force     Overwrite file if it already exists
	                in the current working directory.
	-p, --pipe      Pipe the content of the file(s)
	                to stdout instead of a file on disk.

General options:

	-h, --help      Print help information.
	-v, --version   Show current package version.

Example:

	npx danburzo/s .prettierrc.json

`);
}