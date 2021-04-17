import esbuild from "esbuild";
import dotenv from "dotenv";

const plugin = (): esbuild.Plugin => {
    dotenv.config();
    return {
        name: "envfile",
        setup(build) {
            build.onResolve({ filter: /^env$/ }, (args) => ({
                path: args.path,
                namespace: "envfile-ns",
            }));

            build.onLoad({ filter: /.*/, namespace: "envfile-ns" }, () => ({
                contents: JSON.stringify(process.env),
                loader: "json",
            }));
        },
    };
};

export default plugin;
