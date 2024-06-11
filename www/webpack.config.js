const path = require('path');

module.exports = {
    entry: './spotify-oauth.ts',
    module: {
        rules: [{
            test: /(\.ts)/,
            exclude: /node_modules/,
            use: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    devtool: 'source-map',
    externals: [
        "cordova",
        "cordova/exec",
        "NativeStorage"
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'spotify-oauth.min.js',
        library: 'spotifyAuth',
        libraryTarget: 'commonjs'
    }
};
