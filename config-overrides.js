const { useBabelRc } = require("customize-cra");

module.exports =   {
    webpack: function(config, env) {
        config = useBabelRc()(config);

        // ...add your webpack config
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto"
        });

        return config;
    }
};