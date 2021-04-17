import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import sass from "sass";

import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssInitial from "postcss-initial";
import postcssModules from "postcss-modules";

export interface Opts {
    minify?: boolean;
    inject?: InjectOpts;
}

export interface InjectOpts {
    classes?: string[];
}

const plugin = (opts?: Opts): esbuild.Plugin => {
    return {
        name: "style",
        setup(build) {
            const contentMap = new Map<string, string>();

            build.onResolve({ filter: /\.(c|sc|sa)ss$/ }, async (args) => {
                const filename = args.path;
                const extension = getExtension(filename);
                const filepath = path.resolve(args.resolveDir, filename);

                const filebase = path.basename(filename, "." + extension);
                const isModule = filebase.match(/\.module$/);

                // If sass file, process it. Otherwise, simply read the contents in.
                let contents: string;
                if (extension === "sass" || extension == "scss") {
                    const sassOpts = {
                        file: filepath,
                    };
                    contents = sass.renderSync(sassOpts).css.toString();
                } else {
                    contents = (await fs.promises.readFile(filepath)).toString();
                }

                // Process with PostCSS.
                const result = await postcss([
                    postcssInitial({ reset: "inherited" }),
                    autoprefixer,

                    // If this is a CSS module, add the postcss-modules plugin.
                    ...(isModule
                        ? [
                              postcssModules({
                                  scopeBehavior: "local",
                                  // Save module code into CSS.
                                  getJSON(
                                      inpath: string,
                                      json: { [key: string]: string },
                                      _outpath: string,
                                  ) {
                                      contentMap.set(inpath, JSON.stringify(json));
                                  },
                              }),
                          ]
                        : []),

                    // If minify option is true, use cssnano to minify.
                    ...(opts?.minify ? [cssnano()] : []),
                ]).process(contents, { from: filepath });
                const css = result.css;

                // Save the CSS and the json data into the modules map for CSS
                // modules and globals map for non-modules.
                let moduleContent = "";
                if (isModule) {
                    const json = contentMap.get(filepath);
                    moduleContent = `const data = ${json};
export default data;`;
                }

                moduleContent += injectCodegen(css, opts?.inject);
                contentMap.set(filepath, moduleContent);

                return {
                    path: filepath,
                    namespace: "style-ns",
                };
            });

            build.onLoad({ filter: /\.(c|sa|sc)ss$/, namespace: "style-ns" }, (args) => {
                const contents = contentMap.get(args.path);
                return {
                    contents,
                    loader: "js",
                };
            });
        },
    };
};

function injectCodegen(css: string, opts?: InjectOpts): string {
    return `

const tag = document.createElement("style");
tag.type = 'text/css';
if (tag.styleSheet) {
    tag.styleSheet.cssText = \`${css}\`;
} else {
    tag.appendChild(document.createTextNode(\`${css}\`))
}
${opts?.classes ? `tag.className = "${opts.classes.join(" ")}"` : ""}

const head = document.head || document.getElementsByTagName("head")[0];
head.appendChild(tag);

`;
}

function getExtension(path: string): string {
    return path.substring(path.lastIndexOf(".") + 1, path.length) || path;
}

export default plugin;
