var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// generate loader string to be used with extract text plugin
function generateLoaders (loaders, options) {
	var sourceLoaders = loaders.map(function (loader) {
		var extraParamChar;
		if (/\?/.test(loader)) {
			loader = loader.replace(/\?/, '-loader?');
			extraParamChar = '&';
		} else {
			loader = loader + '-loader';
			extraParamChar = '?';
		}

		// This is no longer needed as we are using OptimizeCssAssetsPlugin
		// which minifies the css files generated by ExtractTextPlugin
		// if (options.minify && loader === 'css-loader') {
		// 	loader = loader + extraParamChar + 'minimize';
		// 	extraParamChar = '&';
		// }

		if (options.sourceMap) {
			loader = loader + extraParamChar + 'sourceMap';
			extraParamChar = '&';
		}

		return loader;
	});

	if (options.extract) {
		return ExtractTextPlugin.extract({
			fallback: 'vue-style-loader',
			use: sourceLoaders,
		});
	} else {
		return ['vue-style-loader'].concat(sourceLoaders).join('!');
	}
}

function cssLoaders(options) {
	options = options || {};

	// http://vuejs.github.io/vue-loader/configurations/extract-css.html
	return {
		css: generateLoaders(['css'], options),
		postcss: generateLoaders(['css'], options),
		less: generateLoaders(['css', 'less'], options),
		sass: generateLoaders(['css', 'sass?indentedSyntax'], options),
		scss: generateLoaders(['css', 'sass'], options),
		stylus: generateLoaders(['css', 'stylus'], options),
		styl: generateLoaders(['css', 'stylus'], options)
	}
}

// Generate loaders for standalone style files (outside of .vue)
function styleLoaders(options) {
	options = options || {};

	var output = {};
	var loaders = cssLoaders(options);

	for (var extension in loaders) {
		var loader = loaders[extension];

		if (extension === 'css' || extension === 'postcss') {
			loader = generateLoaders(['css', 'postcss?config=' + __dirname], options);
			// for postcss 6.x
			// loader = generateLoaders(['css', 'postcss?' + JSON.stringify({config: {path: __dirname}})], options),
		}

		output[extension] = {
			test: new RegExp('\\.' + extension + '$'),
			loader: loader
		};
	}

	return output;
}

module.exports = {
	cssLoaders,
	styleLoaders,
};
