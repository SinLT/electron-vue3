const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const { name } = require("../../package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const _externals = require("externals-dependencies");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const isEnvProduction = process.env.NODE_ENV === "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";


const config = {
    devtool: isEnvDevelopment ? "source-map" : false,
    mode: isEnvProduction ? "production" : "development",
    target: "electron-renderer",
    externals: _externals(),
    entry: {
        app: "./src/renderer/index.ts"
    },
    output: {
        filename: "[name].bundle.view.js",
        chunkFilename: "[id].bundle.view.js",
        path: path.resolve("dist")
    },
    node: {
        global: false,
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loader: {
                        scss: "vue-style-loader!css-loader!sass-loader"
                    }
                }
            },
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: { appendTsSuffixTo: [/\.vue$/] }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: miniCssExtractPlugin.loader,
                    options: {
                        // you can specify a publicPath here
                        // by default it use publicPath in webpackOptions.output
                        publicPath: "../"
                    }
                },
                    "css-loader"
                ]
            },
            {
                // scss
                test: /\.scss$/,
                use: [
                    {
                        loader: miniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: "../"
                        }
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: [
                    "file-loader"
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    "file-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".vue", ".json"],
        alias: {
            "vue": "@vue/runtime-dom",
            "@": path.resolve("src")
        }
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new miniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            title: name,
            template: "./resources/script/index.html"
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(isEnvProduction ? "production" : "development")
            },
            "__VUE_PROD_DEVTOOLS__": JSON.stringify(false)
        })
    ]
};

try {
    if (fs.statSync(path.join(__dirname, "../../src/lib/extern"))) {
        config.plugins.unshift(new CopyWebpackPlugin({
            patterns:
                [
                    {
                        from: "./src/lib/extern/**/*",
                        to: "./lib/extern",
                        transformPath(targetPath, absolutePath) {
                            try {
                                let path = targetPath.replace(/\\/g, "/");
                                return path.replace("src/lib/extern", "");
                            } catch (e) {
                                return false;
                            }
                        }
                    }
                ]
        }));
    }
} catch (e) {
    console.log("... 无外部引入依赖 ...");
}

module.exports = config;
