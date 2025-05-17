// 此方法只能处理@mixin 混入，函数未测试
import { Transform } from 'stream';
import { extname, basename, dirname, join } from 'node:path';

import { PATTERN_LIST } from './config.mjs';

const convert = (contents) => {
	return PATTERN_LIST.reduce((file_str, item) => file_str.replace(item.pattern, item.replacement), contents);
};

export default function scss2less() {
	return new Transform({
		objectMode: true,
		transform(file, enc, callback) {
			if (file.isBuffer()) {
				try {
					file.contents = Buffer.from(convert(file.contents.toString(enc)));

					const ext = extname(file.path);
					if (ext === '.scss') {
						const dir = dirname(file.path);
						const name = basename(file.path, ext);
						file.path = join(dir, `${name}.less`);
					}

					callback(null, file);
				} catch (error) {
					callback(error);
				}
			} else {
				callback(null, file);
			}
		}
	});
}
