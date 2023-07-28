const path = require('path');
const { ProvidePlugin } = require('webpack');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer'); 

module.exports = function (config, env) {
    // Change output directory for JS and CSS assets
    config.output.path = path.resolve('build');
    config.output.filename = '[name].[chunkhash].js';
    config.output.chunkFilename = '[name].[chunkhash].js';

    // Edit MiniCssExtractPlugin options
    config.plugins.forEach((plugin) => {
        if (plugin.constructor.name === 'MiniCssExtractPlugin') {
            plugin.options.filename = '[name].css';
            plugin.options.chunkFilename = '[id].css';
        }
    });

    // Find the TerserPlugin in the plugins array
    const terserPlugin = config.optimization.minimizer.find((plugin) => plugin.constructor.name === 'TerserPlugin');

    if (terserPlugin) {
        // Disable generating LICENSE.txt files
        terserPlugin.options.extractComments = false;
    }

    const manifestPluginIndex = config.plugins.findIndex((plugin) => plugin.constructor.name === 'ManifestPlugin');

    if (manifestPluginIndex > -1) {
        config.plugins.splice(manifestPluginIndex, 1);
    }

    return {
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.m?[jt]sx?$/,
                    enforce: 'pre',
                    use: ['source-map-loader'],
                },
                {
                    test: /\.m?[jt]sx?$/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
            ],
        },
        plugins: [
            ...config.plugins,
            new ProvidePlugin({
                process: 'process/browser',
            }),
            tailwindcss,
            autoprefixer
        ],
        resolve: {
            ...config.resolve,
            fallback: {
                assert: require.resolve('assert'),
                buffer: require.resolve('buffer'),
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                zlib: require.resolve('browserify-zlib'),
                path: require.resolve('path-browserify'),
                url: require.resolve('url/'),
                fs: false,
            },
        },
        ignoreWarnings: [/Failed to parse source map/],
    };
};
