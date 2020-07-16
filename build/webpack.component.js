const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

// 读取components文件夹下的所有文件
const fs = require('fs')

const items = fs.readdirSync('./packages')
const dirs = items.filter(item => fs.statSync(path.resolve('./packages', item)).isDirectory())
const entryHash = {}
if (dirs.length > 0) {
  dirs.forEach(ele => {
    //   css不作处理
    if (ele !== 'theme-chalk') {
      entryHash[ele] = `./packages/${ele}/index.js`
    }
  })
}

// 不打包第三方模块内容
const externals = [{ vue: 'vue' }, nodeExternals()]

module.exports = {
  mode: 'production',
  entry: entryHash,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },
  externals,
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader'
          }
        ]
      },
      {
        test: /\.m?jsx?$/,
        use: [
          {
            loader: 'cache-loader'
          },
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.ProgressPlugin()
  ],
  optimization: {
    minimize: false
  }
}
