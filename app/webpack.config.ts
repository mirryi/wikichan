const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        wikichan: ['./src/wikichan.ts', './src/view/styles/inject.scss'],
        frame: ['./src/view/component/frame.ts', './src/view/styles/view.scss']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.handlebars$/,
                loader: "handlebars-loader"
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: path.resolve(__dirname, 'src/view/frame.html'), to: path.resolve(__dirname, 'ext/frame.html') }
        ]),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'ext'),
        filename: 'js/[name].js',
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                
            })
        ]
    },
    devtool: 'inline-source-map',

    node: {
        fs: 'empty',
        cluster: 'empty'
    },
};
