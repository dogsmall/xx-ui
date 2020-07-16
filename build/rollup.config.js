import resolve from 'rollup-plugin-node-resolve' // 告诉 Rollup 如何查找外部模块
import commonjs from 'rollup-plugin-commonjs' // 支持对commonj模块的加载
import vue from 'rollup-plugin-vue' // 处理vue文件
import json from 'rollup-plugin-json' // 处理package.json
import babel from 'rollup-plugin-babel'
// ugilfy不支持es转换 采用terser
import { terser } from 'rollup-plugin-terser'

export default [{
  input: './packages/index2.js',
  output: {
    file: 'lib/xx-ui.es.js',
    format: 'es'
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
}, {
  input: './packages/index2.js',
  output: {
    file: 'lib/xx-ui.umd.js',
    format: 'umd',
    name: 'xx-ui'
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
}]
