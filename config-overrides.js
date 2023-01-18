module.exports =   {
    webpack: function(config, env) {
        // ...add your webpack config
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto"
        });

        return config;
    }
};