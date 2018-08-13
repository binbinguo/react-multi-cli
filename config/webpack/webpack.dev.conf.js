const webpack = require('webpack');//引入webpack
const opn = require('opn');//打开浏览器
const merge = require('webpack-merge');//webpack配置文件合并
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");//基础配置
const webpackFile = require("./webpack.file.conf");//一些路径配置
const eslintFormatter = require('react-dev-utils/eslintFormatter');


let config = merge(baseWebpackConfig, {
    /*设置开发环境*/
    mode: 'development',
    devtool: "eval-soucre-map",

    output: {
        path: path.resolve(webpackFile.devDirectory),
        filename: 'js/[name].js',
        chunkFilename: "js/[name].js",
        publicPath: ''
    },
    plugins: [
        /*设置热更新*/
        new webpack.HotModuleReplacementPlugin(),
        /* common 业务公共代码，vendor引入第三方 */
//         new webpack.optimize.CommonsChunkPlugin({
//             name: ["common", "vendor"],
//         }),
//         /* 防止 vendor hash 变化 */
// // extract webpack runtime and module manifest to its own file in order to
// // prevent vendor hash from being updated whenever app bundle is updated
//         new webpack.optimize.CommonsChunkPlugin({
//             name: 'manifest',
//             chunks: ['vendor']
//         }),

    ],
    optimization: {
        //包清单
        runtimeChunk: {
            name: "manifest"
        },
        //拆分公共包
        splitChunks: {
            cacheGroups: {
                //项目公共组件
                common: {
                    chunks: "initial",
                    name: "common",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                //第三方组件
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'cache-loader',
                    'babel-loader',
                ],
                include: [
                    path.resolve(__dirname, "../../app"),
                    path.resolve(__dirname, "../../entry")
                ],
                exclude: [
                    path.resolve(__dirname, "../../node_modules")
                ],
            },
            {
                test: /\.(css|scss)$/,
                loader: 'style-loader?sourceMap!css-loader?sourceMap!sass-loader?sourceMap',
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            formatter: eslintFormatter,
                            eslintPath: require.resolve('eslint'),
                            // @remove-on-eject-begin
                            baseConfig: {
                                extends: [require.resolve('eslint-config-react-app')],
                            },
                            //ignore: false,
                            useEslintrc: false,
                            // @remove-on-eject-end
                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                include: [
                    path.resolve(__dirname, "../../app")
                ],
                exclude: [
                    path.resolve(__dirname, "../../node_modules")
                ],
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg|swf)$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=' + webpackFile.resource + '/'
            }

        ]
    },
    /*设置api转发*/
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        hot: true,
        inline: true,
        contentBase: path.resolve(webpackFile.devDirectory),
        historyApiFallback: true,
        disableHostCheck: true,
        proxy: [
            {
                context: ['/api/**', '/u/**'],
                target: 'http://192.168.12.100:8080/',
                secure: false
            }
        ],
        /*打开浏览器 并打开本项目网址*/
        after() {
            opn('http://localhost:' + this.port);
        }
    }
});
module.exports = config;