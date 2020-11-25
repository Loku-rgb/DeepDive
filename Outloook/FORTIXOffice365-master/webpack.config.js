const devCerts = require("office-addin-dev-certs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const webpack = require("webpack");

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  let mode = "production";
  var entries;
  if (mode === "development"){
    console.dir("buildng with mode development");
    entries = {
      polyfill: "@babel/polyfill",
      taskpane: "./src/taskpane/taskpane.js",
      commands: "./src/commands/commands.js",
      home: "./src/home/home.js",
      opportunities: "./src/opportunities/attach.js",
      work_requests: "./src/work_requests/attach.js",
      message: "./src/message/message.js",
      helper: "./src/helpers/helper.js",
      dialog: "./src/auth/dialog.js",
      jqueryjs: "./node_modules/jquery/dist/jquery.min.js",
      urijs: "./node_modules/urijs/src/URI.min.js",
    }
  } else {
    console.dir("buildng with mode production");
    entries = {
      polyfill: "@babel/polyfill",
      jqueryjs: "./node_modules/jquery/src/jquery.js",
      urijs: "./node_modules/urijs/src/URI.js",
      helperjs: "./src/helpers/helper.js",
      configjs: "./src/helpers/config.js",
      taskpanejs: "./src/taskpane/taskpane.js",
      homejs: "./src/home/home.js",
      opportunitiesjs: "./src/opportunities/opportunities.js",
      workrequestjs: "./src/work_requests/workrequest.js",
      messagejs: "./src/message/message.js",
      dialogjs: "./src/auth/dialog.js"
    }
  }

  const config = {
    devtool: "source-map",
    entry: entries,
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader", 
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader"
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: "file-loader"
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "jqueryjs", "urijs", "configjs", "taskpanejs"]
      }),
      new CopyWebpackPlugin([
        {
          to: "taskpane.css",
          from: "./src/taskpane/taskpane.css"
        }
      ]),
      new HtmlWebpackPlugin({
        filename: "home.html",
        template: "./src/home/home.html",
        chunks: ["polyfill", "configjs", "jqueryjs", "helperjs", "homejs"]
      }),
      new CopyWebpackPlugin([
        {
          to: "home.css",
          from: "./src/home/home.css"
        }
      ]),
      new HtmlWebpackPlugin({
        filename: "success.html",
        template: "./src/message/success.html",
        chunks: ["polyfill", "configjs", "jqueryjs", "messagejs"]
      }),
      new HtmlWebpackPlugin({
        filename: "fail.html",
        template: "./src/message/fail.html",
        chunks: ["polyfill", "configjs", "jqueryjs", "messagejs"]
      }),
      new CopyWebpackPlugin([
        {
          to: "message.css",
          from: "./src/message/message.css"
        }
      ]),
      new HtmlWebpackPlugin({
        filename: "opportunities.html",
        template: "./src/opportunities/opportunities.html",
        chunks: ["polyfill", "configjs", "jqueryjs", "helperjs", "opportunitiesjs"]
      }),
      new CopyWebpackPlugin([
        {
          to: "opportunities.css",
          from: "./src/opportunities/opportunities.css"
        }
      ]),
      new HtmlWebpackPlugin({
        filename: "workrequest.html",
        template: "./src/work_requests/workrequest.html",
        chunks: ["polyfill", "configjs", "jqueryjs", "helperjs", "workrequestjs"]
      }),
      new CopyWebpackPlugin([
        {
          to: "workrequest.css",
          from: "./src/work_requests/workrequest.css"
        }
      ]),
      new HtmlWebpackPlugin({
        filename: "dialog.html",
        template: "./src/auth/dialog.html",
        chunks: ["polyfill", "configjs", "jqueryjs", "dialogjs"]
      }),
      new CopyWebpackPlugin([
        {
          to: "helper.css",
          from: "./src/helpers/helper.css"
        }
      ]),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },      
      https: (options.https !== undefined) ? options.https : await devCerts.getHttpsServerOptions(),
      port: process.env.npm_package_config_dev_server_port || 3000
    }
  };

  return config;
};
