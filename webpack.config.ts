const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const outdir = path.resolve(__dirname, 'ext');

module.exports = {
    entry: {
        wikichan: ['./src/ts/injected/wikichan.ts', './src/scss/injected.scss'],
        frame: ['./src/ts/frame/frame.ts', './src/scss/frame.scss']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: path.resolve(__dirname, 'src/ts'),
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
            { from: './src/html/frame.html',    to: './frame.html'  }
        ]),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: outdir,
        filename: 'js/[name].js',
    },

    performance: {
        hints: false
    },
    devtool: 'inline-source-map',

    node: {
        fs: 'empty',
        cluster: 'empty'
    },
};
