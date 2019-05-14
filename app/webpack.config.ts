const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: {
        wikichan: ["./src/wikichan.ts", "./src/static/style/inject.scss"],
        frame: ["./src/static/style/view.scss"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                include: path.resolve(__dirname, "src")
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: "./src/static/frame.html", to: "./frame.html" },
            { from: "./manifest.json", to: "./manifest.json" }
        ]),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        path: path.resolve(__dirname, "target"),
        filename: "js/[name].js"
    },

    optimization: {
        minimizer: [new TerserPlugin({})]
    },
    devtool: "inline-source-map",

    node: {
        fs: "empty",
        cluster: "empty"
    }
};
