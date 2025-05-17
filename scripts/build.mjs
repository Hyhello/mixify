import { src, dest, series } from 'gulp';

import scss2less from './scss2less.mjs';
import lint, { stylelintFn } from './lint.mjs';

import { EXT_MAP } from './config.mjs';

// copy
function copy() {
	return src(`src/*.${EXT_MAP.SCSS}`, { cwd: '../' }).pipe(dest('../'));
}

function convertToLess() {
	return src(`src/*.${EXT_MAP.SCSS}`, { cwd: '../' }).pipe(scss2less()).pipe(dest('../')).pipe(stylelintFn());
}

export default series([lint, copy, convertToLess]);
