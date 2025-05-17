import { src } from 'gulp';
import stylelint from 'gulp-stylelint';
import stylelintFormatter from 'stylelint-formatter-pretty';

import { EXT_MAP } from './config.mjs';

export function stylelintFn() {
	return stylelint({
		reporters: [
			{
				formatter: stylelintFormatter,
				console: true
			}
		],
		failAfterError: true // 如果有错误就让 gulp 任务失败（可选）
	});
}

export default function lint() {
	return src(`src/*.${EXT_MAP.SCSS}`, { cwd: '../' }).pipe(stylelintFn());
}
