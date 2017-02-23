const webpack = require('webpack')
const base = require('./webpack.base.config')
const vueConfig = require('./vue-loader.config')
const HTMLPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const path = require('path')

const config = Object.assign({}, base, {
    resolve: {
        alias: Object.assign({}, base.resolve.alias, {
            'create-api': './create-api-client.js'
        })
    },
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new HTMLPlugin({
            template: 'src/index.template.html'
        })
    ])
})
if (process.env.NODE_ENV === 'production'){
    vueConfig.loaders = {
        stylus: ExtractTextPlugin.extract({
            loader: 'css-loader!stylus-loader',
            fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
        })
    }
    // sw filter srcDir
    const srcDir = path.resolve(__dirname, '../').replace(/\\/g, "\/")
    prefixMulti = {}
    prefixMulti[srcDir] = ''
    config.plugins.push(
        new ExtractTextPlugin('styles.[hash].css'),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new SWPrecachePlugin({
            cacheId: 'vue-hn',
            filename: 'service-worker.js',
            stripPrefixMulti: prefixMulti,
            dontCacheBustUrlsMatching: /./,
            staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
        })
    )
}
module.exports = config
