export const EXT_MAP = {
	SCSS: 'scss',
	LESS: 'less'
};

// scss2less pattern 未考虑ast
// 此处参考了部分：https://github.com/wangbricks/less-plugin-sass2less-fork，由于只要mixin, 其他未做处理
export const PATTERN_LIST = Object.values({
	// $ -> @
	var: { pattern: /\$/g, replacement: '@', order: 0 },
	// delete !default
	default: { pattern: /\s*!default/g, replacement: '', order: 1 },
	nth: { pattern: /nth\(/g, replacement: 'extract(', order: 1 },
	// @mixin -> .  delete @include
	mixinInclude: { pattern: /@(?:mixin|include)\s+([\w-]+)\s*(?:\(([^)]*)\))?/g, replacement: '.$1($2)', order: 2 },
	unquote: { pattern: /unquote\("(.*)"\)/g, replacement: '~"$1"', order: 3 },
	// @extend -> &:extend()
	extend: { pattern: /@extend\s\.([a-zA-Z-_]*)/g, replacement: '&:extend(.$1)', order: 2 },
	/**
	 * @mixin text () {
	 * 	  .border {
	 *       @content;
	 *    }
	 * }
	 * ->
	 * .text(@content) {
	 *     .border {
	 *         @content();
	 *     }
	 * }
	 */
	slot: {
		pattern: /^@mixin\s+(?:[\w-]+)\s*(?:\(([^)]*)\))?[\s\S]*$/,
		replacement: (match, args, index, body) => {
			if (/@content;/.test(body)) {
				const rules = args ? `${args}; @rules` : '@rules';
				return body
					.replace(/@mixin\s+([\w-]+)\s*(?:\(([^)]*)\))?/g, `.$1(${rules})`)
					.replace(/@content;/g, '@rules();');
			}
			return match;
		},
		order: 1
	},
	// adjust-hue(#000000, 30deg) -> spin(#000000, 30deg)
	adjust: { pattern: /adjust-hue\((.+),(.+)\)/g, replacement: 'spin($1,$2)', order: 3 },
	// .#{$name} {} -> .@{name} {}
	interpolation: {
		pattern: /#\{@([^}]+?)\}/g,
		replacement: '@{$1}',
		order: 1
	},
	calc: { pattern: /(@[^{}]+?:\s*)calc\(([^)]+)\)/g, replacement: '$1($2)', order: 1 }
})
	.sort((a, b) => a.order - b.order)
	.filter((item) => !item.disabled);
