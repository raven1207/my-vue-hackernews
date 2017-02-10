const path = require('path')
const vueConfig = require('./vue-loader.config')

module.exports = {
	devtool: '#source-map',
	entry: {
		app: './src/client-entry.js',
		vendor: [
			'es6-promise',
			'vue',
			'vue-router',
			'vuex',
			'vuex-router-sync'
		]
	},
	output: {
		path: path.resolve(__dirname, '../dist')
		publicPath: '/dist/',
		filename: '[name]-[chunkhash].js'
	},
	resolve: {
		alias: {
			'public': path.resolve(__dirname, '../public'),
			'components': path.resolve(__dirname, '../src/components')
		},
		extensions: ['.js', '.vue']
	},
	module: {
		noParse: /es6-promise\.js$/,
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader',
				options: vueConfig
			},
			{
				test: /\.js$/,
				use: 'buble-loader',
				exclude: /node_modeles/,
				options: {
					objectAssign: 'Object.assign'
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				use: 'url-loader',
				options: {
					limit: 10000,
					name: 'img/[name].[hash:7].[ext]'
				}
			},
			{
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: 'url-loader',
				options: {
					limit: 10000,
					name: 'fonts/[name].[hash:7].[ext]'
				}
            },
			{
                test: /\.json/,
                use: 'json-loader'
            }
		]
	}
}