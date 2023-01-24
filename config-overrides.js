const { useBabelRc } = require("customize-cra");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

module.exports =   {
    webpack: function(config, env) {
        config = useBabelRc()(config);

        const extHtmlPlugin = new ScriptExtHtmlWebpackPlugin({
            defer: ['main', 'bundle']
        });

        // const preloadWebpackPlugin = new PreloadWebpackPlugin({
        //     rel: 'preload',
        //     include: 'asyncChunks'
        // })

        config.plugins.push(extHtmlPlugin);
        // config.plugins.push(preloadWebpackPlugin);

        // ...add your webpack config
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto"
        });

        return config;
    }
};