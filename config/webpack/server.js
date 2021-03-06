const merge = require("webpack-merge");
const webpack = require("webpack");

const devBuild = process.env.NODE_ENV === "production" ? "production" : "development";

const environment = require("./environment");

environment.plugins.insert(
    "DefinePlugin",
    new webpack.DefinePlugin({
        TRACE_TURBOLINKS: devBuild === "development",
        "process.env": {
            NODE_ENV: devBuild,
        },
    }),
    { after: "Environment" },
);

const serverConfig = merge(environment.toWebpackConfig(), {
    mode: "development",
    target: "web",
    entry: "./client/app/startup/serverRegistration.js",
    output: {
        filename: "server-bundle.js",
        path: environment.config.output.path,
        globalObject: "this",
    },
    optimization: {
        minimize: false,
    },
});

serverConfig.plugins = serverConfig.plugins.filter((plugin) => plugin.constructor.name !== "WebpackAssetsManifest");

module.exports = serverConfig;
