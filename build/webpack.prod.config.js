const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const common = require('./webpack.base.config.js');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { getPageGenerate } = require('./utils.js');
// const pagesGenerate = getPageGenerate();
const portfinder = require('portfinder');
const config = require('./config/index.js');

const devWebpackConfig = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    publicPath: config.dev.publicPath,
  },
  devServer: {
    // contentBase: path.join(__dirname, '..', './dist/'),
    contentBase: false,
    historyApiFallback: false,
    hot: true,
    quiet: true,
    // 出现错误时，在浏览器中显示全屏覆盖层
    overlay: {
      warnings: false,
      errors: true,
    },
    host: config.dev.host,
    port: config.dev.port,
  },
  module: {
    rules: [
    //   {
    //     test: /\.js$/,
    //     loader: 'eslint-loader',
    //     enforce: 'pre',
    //     include: [path.join(__dirname, '..', 'src')], // 指定检查的目录
    //     options: {
    //       // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
    //       formatter: require('eslint-friendly-formatter'), // 指定错误报告的格式规范
    //     },
    //   },
      {
        test: /\.(c|sc)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    // ...pagesGenerate.htmlWebpackPlugin,
    new HtmlWebpackPlugin({
      inject: 'body',
      scriptLoading: 'blocking',
      filename: path.join(__dirname, `../dist/index.html`),
      template: path.join(__dirname, '../index.html'),
      // entry: name,
      //需要引入的js
      minify: {
        removeComments: false,
        collapseWhitespace: false,
        removeAttributeQuotes: false,
        //压缩html中的js
        minifyJS: false,
        //压缩html中的css
        minifyCSS: false,
      },
      // chunksSortMode: 'dependency',
    }),
    //启用热替换模块(Hot Module Replacement)，也被称为 HMR。
    new webpack.HotModuleReplacementPlugin(),
  ],
});

module.exports = new Promise((reslove, reject) => {
  portfinder.basePort = config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
    } else {
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `您的应用运行成功: http://${config.dev.host}:${config.dev.port}`,
            ],
          },
        })
      );
    }

    reslove(devWebpackConfig);
  });
});
