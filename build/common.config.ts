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
    devtool: "inline-source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".css", ".sass", ".scss"],
      alias: {
        "@components": path.resolve(dir.src, "components"),
        "@providers": path.resolve(dir.src, "providers"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ["babel-loader", "ts-loader", "eslint-loader"],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            {
              loader: "style-loader",
              options: {
                /* eslint-disable */
                insert: function insert(element) {
                  var id = "wikichan-styles";
                  var parent = document.getElementById(id);
                  if (!parent) {
                    parent = document.createElement("div");
                    parent.id = id;
                    document.querySelector("head").appendChild(parent);
                  }
                  parent.appendChild(element);
                },
                /* eslint-enable */
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
