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
        include: srcDir,
        exclude: /node_modules/,
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
            loader: "@teamsupercell/typings-for-css-modules-loader",
            options: {
              formatter: "prettier",
            },
          },
          { loader: "css-loader", options: { modules: true } },
          { loader: "sass-loader" },
        ],
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
    extensions: [".ts", ".tsx", ".js", ".css", ".sass", ".scss"],
  },
};

export default config;
