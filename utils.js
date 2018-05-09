var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// generate loader string to be used with extract text plugin
function generateLoaders (loaders, options) {
	var sourceLoaders = loaders.map(function (loader) {
		let loaderName = '';
		let loaderOptions = {};
		
		if (Array.isArray(loader)) {
			loaderName = loader[0] + '-loader';
			loaderOptions = loader[1];
		}
		else {
			loaderName = loader + '-loader';
		}

		const loaderObj = {
			loader: loaderName,
			options: loaderOptions,
		};

		// This is no longer needed as we are using OptimizeCssAssetsPlugin
		// which minifies the css files generated by ExtractTextPlugin
		// if (options.minify && loader === 'css-loader') {
		// 	loader = loader + extraParamChar + 'minimize';
		// 	extraParamChar = '&';
		// }

		if (options.sourceMap) {
			loaderObj.options.sourceMap = true;
		}

		return loaderObj;
	});

	if (options.extract) {
		return ExtractTextPlugin.extract({
			fallback: 'vue-style-loader',
			use: sourceLoaders,
		});
	} else {
		return [{
			loader: 'vue-style-loader',
			options: {
				sourceMap: Boolean(options.sourceMap),
			},
		}].concat(sourceLoaders);
	}
}

function cssLoaders(options) {
	options = options || {};
	const postcss = ['postcss', {config: {path: __dirname}}];

	// http://vuejs.github.io/vue-loader/configurations/extract-css.html
	return {
		css: generateLoaders(['css', postcss], options),
		postcss: generateLoaders(['css', postcss], options),
		pcss: generateLoaders(['css', postcss], options),
		less: generateLoaders(['css', 'less'], options),
		sass: generateLoaders(['css', ['sass', {indentedSyntax: true}]], options),
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

		output[extension] = {
			test: new RegExp('\\.' + extension + '$'),
			use: loader
		};
	}

	return output;
}

module.exports = {
	cssLoaders,
	styleLoaders,
};
