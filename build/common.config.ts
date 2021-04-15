import path from "path";
import webpack from "webpack";
import DotenvPlugin from "dotenv-webpack";
import TerserPlugin from "terser-webpack-plugin";

const rootDir = path.resolve(__dirname, "..");
export const dir = {
    root: rootDir,
    src: path.resolve(rootDir, "src"),
    lib: path.resolve(rootDir, "lib"),
    dist: path.resolve(rootDir, "dist"),
};

const common = (production: boolean): webpack.Configuration => {
    return {
        mode: production ? "production" : "development",
        devtool: production ? undefined : "eval-source-map",
        output: {
            pathinfo: false,
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".css", ".sass", ".scss"],
            alias: {
                "gm4-polyfill": path.resolve(dir.lib, "gm4-polyfill", "gm4-polyfill.js"),
                cleanslate: path.resolve(dir.lib, "cleanslate"),
                "@common": path.resolve(dir.src, "common"),
                "@view": path.resolve(dir.src, "view"),
                "@providers": path.resolve(dir.src, "providers"),
            },
            symlinks: false,
        },
        plugins: [
            new DotenvPlugin(),
            new webpack.ProvidePlugin({ process: "process/browser" }),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: dir.src,
                    use: ["swc-loader"],
                },
                {
                    test: /\.((c|sa|sc)ss)$/i,
                    use: [
                        {
                            loader: "style-loader",
                            options: {
                                injectType: "singletonStyleTag",
                                attributes: { id: "wikichan-styles" },
                            },
                        },
                        {
                            loader: "@teamsupercell/typings-for-css-modules-loader",
                            options: {
                                formatter: "prettier",
                            },
                        },
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1,
                                modules: {
                                    auto: true,
                                    localIdentName: production
                                        ? "[local]__[name]--[hash:base64:5]"
                                        : "[local]__[path][name]--[hash:base64:5]",
                                },
                            },
                        },
                        { loader: "postcss-loader" },
                        { loader: "sass-loader" },
                    ],
                },
            ],
        },
        optimization: {
            minimize: production,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                }),
            ],
        },
        performance: {
            hints: production ? "warning" : false,
            maxAssetSize: 5000000,
            maxEntrypointSize: 5000000,
        },
        cache: production ? false : { type: "filesystem" },
        devServer: {
            contentBase: dir.dist,
        },
    };
};

export default common;
