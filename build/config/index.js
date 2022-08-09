const path = require('path');

module.exports = {
  dev: {
    port: 8080,
    autoOpenBrower: false,
    host: '127.0.0.1',
    overlay: { warnings: false, errors: true },
    publicPath: '/',
  },
  build: {
    //表示输出到dist目录
    path: path.resolve(__dirname, '../../example'),
    //如果是目录大于二级,必须设置'/'
    publicPath: './',
  },
};
