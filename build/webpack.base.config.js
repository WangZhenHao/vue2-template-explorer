const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resove(dir) {
  return path.join(__dirname, '..', dir);
}
function assetsPath(dir) {
  // return path.posix.join('static', dir);
  return path.posix.join('static', dir);
}

module.exports = {
  resolve: {
    alias: {
      '@': resove('./src'),
    },
  },
  entry: resove('./src/main.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [resove('src')],
        loader: 'babel-loader',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          //字体文件小于1000字节的时候处理方式
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
};
