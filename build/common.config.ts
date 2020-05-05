import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";

export enum Mode {
  development = "development",
  production = "production",
}

const rootDir = path.resolve(__dirname, "..");
export const dir = {
  root: rootDir,
  src: path.resolve(rootDir, "src"),
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
    performance: {
      hints: isDev ? false : "warning",
      maxAssetSize: 500000,
      maxEntrypointSize: 500000,
    },
  };
};

export default common;
