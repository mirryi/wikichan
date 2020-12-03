import path from "path";
import webpack from "webpack";
import DotenvPlugin from "dotenv-webpack";
import TerserPlugin from "terser-webpack-plugin";

export enum Mode {
  development = "development",
  production = "production",
}

const rootDir = path.resolve(__dirname, "..");
export const dir = {
  root: rootDir,
  src: path.resolve(rootDir, "src"),
  lib: path.resolve(rootDir, "lib"),
  dist: path.resolve(rootDir, "dist"),
};

const common = (mode: Mode): webpack.Configuration => {
  const isDev = mode === Mode.development;
  return {
    mode: "production",
    devtool: isDev ? "inline-source-map" : undefined,
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".css", ".sass", ".scss"],
      alias: {
        "gm4-polyfill": path.resolve(dir.lib, "gm4-polyfill", "gm4-polyfill.js"),
        "@common": path.resolve(dir.src, "common"),
        "@components": path.resolve(dir.src, "components"),
        "@providers": path.resolve(dir.src, "providers"),
      },
    },
    plugins: [new DotenvPlugin()],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ["babel-loader", "ts-loader"],
        },
        {
          test: /\.((c|sa|sc)ss)$/i,
          use: [
            {
              loader: "style-loader",
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
                  localIdentName: "[path][name]__[local]--[hash:base64:5]",
                },
              },
            },
            { loader: "postcss-loader" },
            { loader: "sass-loader" },
          ],
        },
      ],
    },
    node: {
      fs: "empty",
      cluster: "empty",
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
    },
    performance: {
      hints: isDev ? false : "warning",
      maxAssetSize: 500000,
      maxEntrypointSize: 500000,
    },
    watch: isDev,
  };
};

export default common;
