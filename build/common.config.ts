import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";

const rootDir = path.resolve(__dirname, "..");
export const dir = {
  root: rootDir,
  src: path.resolve(rootDir, "src"),
  dist: path.resolve(rootDir, "dist"),
};

const common = (): webpack.Configuration => {
  return {
    mode: "production",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".css", ".sass", ".scss"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ["ts-loader", "eslint-loader"],
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
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: true,
                  localIdentName: "[path][name]__[local]--[hash:base64:5]",
                },
                localsConvention: "camelCase",
              },
            },
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
  };
};

export default common;
