var path = require('path');

module.exports = {
    entry: './src/wikichan.ts',
    devtool: 'inline-source-map',
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: path.resolve(__dirname, 'src'),
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'ext/js')
    },
    externals: {
        "isomorphic-fetch": "fetch"
    }
};
