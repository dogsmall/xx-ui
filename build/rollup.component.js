import resolve from 'rollup-plugin-node-resolve' // 告诉 Rollup 如何查找外部模块
import commonjs from 'rollup-plugin-commonjs' // 支持对commonj模块的加载
import vue from 'rollup-plugin-vue' // 处理vue文件
import json from 'rollup-plugin-json' // 处理package.json
import babel from 'rollup-plugin-babel'
// ugilfy不支持es转换 采用terser
import { terser } from 'rollup-plugin-terser'
const fs = require('fs')
const path = require('path')

// 读取components文件夹下的所有文件

const items = fs.readdirSync('./packages')
const dirs = items.filter(item => fs.statSync(path.resolve('./packages', item)).isDirectory())
const configArr = []
if (dirs.length > 0) {
  dirs.forEach(ele => {
    //   css不作处理
    if (ele !== 'theme-chalk') {
      configArr.push({
        input: `./packages/${ele}/index.js`,
        output: {
          file: `lib/${ele}.js`,
          format: 'cjs'
        },
        plugins: [
          resolve({ extensions: ['.vue'] }),
          commonjs(),
          vue(),
          json(),
          // 避免获取外部的.babelrc文件
          babel({
            babelrc: false,
            presets: [['env', { modules: false }]]
          }),
          process.env.minify && terser()
        ]
      })
    }
  })
}
export default configArr
