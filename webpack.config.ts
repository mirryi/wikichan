import path from "path";
import webpack from "webpack";

import TerserPlugin from "terser-webpack-plugin";

const srcDir = path.resolve(__dirname, "src");

const config: webpack.Configuration = {
  mode: "production",
  entry: {
    extension: ["./src/extension.tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader", "eslint-loader"],
      },
      {
        test: /\.html$/,
        use: "html-loader",
        include: srcDir,
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
              },
            },
          },
          {
            loader: "@teamsupercell/typings-for-css-modules-loader",
            options: {
              formatter: "prettier",
            },
          },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\..?js.map$/,
        loader: "ignore-loader",
      },
    ],
  },
  node: {
    fs: "empty",
    cluster: "empty",
  },
  output: {
    path: path.resolve(__dirname, "target"),
    filename: "[name].js",
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
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000,
  },
  resolve: {
    alias: {
      "wordpos-web": path.resolve(
        __dirname,
        "node_modules/wordpos-web/dist/wordpos.min.js",
      ),
    },
    extensions: [".ts", ".tsx", ".js", ".css", ".sass", ".scss"],
  },
};

export default config;
