const path = require("path");
const webpack = require("webpack");
const { CheckerPlugin } = require('awesome-typescript-loader');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const distDir = path.join(__dirname, "public", "build");
module.exports = {
    entry: [
        "./src/index.ts"
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: process.env.WEBPACK_DEVTOOL || "source-map",

    output: {
        path: distDir,
        publicPath: "/build/",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    useCache: true
                }
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new CaseSensitivePathsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                // "browser", "electron"
                RUNTIME_TARGET: JSON.stringify(process.env.RUNTIME_TARGET)
            }
        })
    ]
};
