const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const { AutoComplete } = require('enquirer');
const ThreeWebpackPlugin = require('@wildpeaks/three-webpack-plugin');
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { sync } = require('rimraf');
const { DefinePlugin } = require('webpack');

module.exports = (env) => {
  const webpackObj = {
    entry: './src/index.tsx',
    target: 'web',
    mode: 'development',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: function (modulePath) {
            return (modulePath.endsWith('.ts') || modulePath.endsWith('.tsx')) && !modulePath.endsWith('test.tsx');
          },
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.build.json',
              },
            },
          ],
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
        {
          test: /\.(css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { url: false },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: { modules: true, url: false },
            },
            { loader: 'sass-loader' },
          ],
        },
      ],
    },
    externals: {},
    plugins: [],
    watchOptions: {
      ignored: [path.resolve(__dirname, 'node_modules'), '.test.tsx'],
    },
    devServer: {
      watchFiles: ['src/**/*'],
      static: {
        watch: {
          ignored: 'node_modules/**/*',
        },
      },
    },
  };

  const compile = (_data, resolve, reject) => {
    webpackObj.output.path = path.resolve(__dirname, `build/${_data}/`);
    webpackObj.output.filename = `bundle.js`;
    if (process.env.NODE_ENV === 'production') sync(`${__dirname}/build/${_data}/`);

    webpackObj.entry = `./src/${_data}/index.tsx`;
    webpackObj.optimization = {
      minimize: process.env.NODE_ENV === 'production',
    };
    webpackObj.plugins = [
      new CopyWebpackPlugin({
        patterns: [
          // {
          //   from: `./src/${_data}/assets/`,
          //   to: `./${_data}/`,
          //   globOptions: {
          //     ignore: [
          //       '**/index.html',
          //       '**/translate.json',
          //       '**/config.json',
          //       '**/locale/**',
          //     ],
          //   },
          // },
          {
            from: `public/${_data}`,
            to: `./`,
            globOptions: {
              ignore: ['**/index.html', '**/translate.json', '**/config.json', '**/common/**', '**/locale/**'],
            },
          },
          {
            from: 'public/common',
            to: `./`,
            globOptions: {
              ignore: ['**/index.html', '**/translate.json', '**/config.json', '**/locale/**'],
            },
          },
        ],
      }),
      new MiniCssExtractPlugin(),
      new MergeJsonWebpackPlugin({
        // encoding: "ascii",
        // debug: true,
        output: {
          groupBy: [
            ...(() => {
              const _fs = fs.readdirSync('./public/common/assets/locale/', {
                withFileTypes: false,
              });

              return _fs.map((_f) => ({
                pattern: `{./public/common/assets/locale/${_f},./public/${_data}/locale/${_f}}`,
                fileName: `/locale/${_f}`,
              }));
            })(),
            {
              pattern: `{./public/config.json,./public/${_data}/config.json}`,
              fileName: `/config.json`,
            },
          ],
        },
      }),
      new HtmlWebpackPlugin({
        filename: `./index.html`,
        template: path.resolve(__dirname, 'public/index.html'),
      }),
      new DefinePlugin({
        process: {
          env: {
            getterSetterEnabled: process.env.GETTER_SETTER_ENABLED,
          },
        },
      }),
      // new ThreeWebpackPlugin(),
    ];

    resolve(webpackObj);
  };
  return new Promise((resolve, reject) => {
    let files = fs.readdirSync('./src/', { withFileTypes: false });
    files = files.filter((_file) => ['com'].indexOf(_file) === -1);
    if (env.simName == undefined) {
      const prompt = new AutoComplete({
        name: 'fileName',
        type: 'list',
        message: 'Which module to compile',
        choices: files,
      });
      prompt.run().then((data) => compile(data, resolve, reject));
    } else {
      compile(env.simName, resolve, reject);
    }
    // resolve(webpackObj);
  });
};

