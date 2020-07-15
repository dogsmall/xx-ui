<center>从零开始搭建UI组件库</center>
### 组件库的价值
1. 保证产品体验的一致性：对于一个含有多业务系统的大型复杂产品，每个独立的业务系统虽然在功能上有一定区别，但整体的用户体验需要满足基本的一致性。比如，当我使用同一个产品中的业务系统 A 和业务系统 B 时，我能通过类似的页面结构、组件及样式的一致性、操作反馈乃至提示文案结构的一致性，来感知到我使用的A、B业务系统隶属于同一个产品。

2. 提升设计师的效率：在需求量巨大且需求来自不同的业务线时，需要逐一绘制页面及组件，造成大量重复劳动，并且在评审及需求沟通环节还可能存在不断地细节调优。所以对于设计师而言，组件的高频复用能大大提升设计效率，使设计师更多的将精力聚焦于理解和解决用户的实际问题。

3. 提升产研团队的效率：通用场景及普通需求直接按规范进行设计和研发，减少上下游对同一页面及组件使用方式的不同理解而产生的多余沟通成本。

4. 利于沉淀设计规范：组件本身的设计和使用方式就可以直接作为交互和视觉规范的一部分，按照统一的设计规范来确定需要使用的主题色、组件样式、组合方式及页面结构，可以快速搭建出一个或多个产品的交互框架。


### Tasking

1. 组件
   1. js/css
   2. 文件目录结构
2. 测试
   1. TDD
   2. BDD
3. 打包
   1. 打包工具选择
   2. 按需加载
   3. 打包输出目录结构  --> 影响引入使用的babel包
   4. 打包结果
4. 发布
   1. npm 发布
   2. npm 升级
   3. npm 注销
5. 组件库文档
   1. vuepress



### 新建项目

```sh
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

```sh
vue create xx-ui
```



### 组件





### 测试

[vue-test-utils](https://vue-test-utils.vuejs.org/zh/)

[jest](https://jestjs.io/zh-Hans/)

```js
import { mount } from '@vue/test-utils'
import Button from '../../packages/button/index'

describe('Button', () => {
  test('Button/slots', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '按钮'
      }
    })
    expect(wrapper.text()).toContain('按钮')
    expect(wrapper.html()).toBe('<button class="btn-default">按钮</button>')
  })
})

```



### 打包

##### css 打包



```js
// gulp.css.js
const gulp = require('gulp');
const { src, dest } = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
// const rename = require('gulp-rename');
const concat = require('gulp-concat');

function compileCss() {
  return src('./packages/theme-chalk/*.less')
    .pipe(less())
    .pipe(cssmin())
    .pipe(dest('./lib/theme-chalk'));
}

function compileAll() {
  return src('./packages/theme-chalk/index.less')
    .pipe(less())
    .pipe(concat('index.css'))
    .pipe(cssmin())
    .pipe(dest('./lib/theme-chalk'));
}
```

##### js 打包



```js
import resolve from 'rollup-plugin-node-resolve'; // 告诉 Rollup 如何查找外部模块
import commonjs from 'rollup-plugin-commonjs'; // 支持对commonj模块的加载
import vue from 'rollup-plugin-vue'; // 处理vue文件
import json from 'rollup-plugin-json'; // 处理package.json
import babel from 'rollup-plugin-babel';
// ugilfy不支持es转换 采用terser
import { terser } from 'rollup-plugin-terser';

const outputFormat = process.env.format || 'es';
const minify = process.env.minify || false;
const fileSuffix = minify ? '.min' : '';

export default {
  input: './packages/index.js',
  output: {
    file: `lib/izk-ui.${outputFormat}${fileSuffix}.js`,
    format: outputFormat.trim(),
    name: 'izk-ui'
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
};

```



```js
// webpack.component.js
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const pkg = require('../package.json');

const fs = require('fs');
const name = pkg.name;
// 读取packages文件夹下的所有文件
const items = fs.readdirSync('./packages');
const dirs = items.filter(item => fs.statSync(path.resolve('./packages', item)).isDirectory());
const entryHash = {};
const externalsComponent = {};
if (dirs.length > 0) {
  dirs.forEach(ele => {
    //   css不作处理
    if (ele !== 'theme-chalk') {
      externalsComponent[`${name}/packages/${ele}`] = `${name}/lib/${ele}`;
      entryHash[`${ele}/index`] = `./packages/${ele}/index.js`;
    }
  });
}
// 不打包第三方模块内容
const externals = [Object.assign({
  vue: 'vue'
}, externalsComponent), nodeExternals()];

module.exports = {
  mode: 'production',
  entry: entryHash,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias: {
      packages: path.resolve(__dirname, '../packages'),
      'izk-ui': path.resolve(__dirname, '../')
    }
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
};

```



### 版本控制



### 发布

```shell
npm login
npm publish
```



### 组件库文档

<b>[vuepress](https://vuepress.vuejs.org/zh/)</b>

安装vuepress

```js
mkdir docs
cd docs
yarn add -D vuepress // 推荐用yarn
```

添加script命令

```js
{
  "scripts": {
    "docs:dev": "vuepress dev docs", //默认是docs文件夹,你也可以自行更改
    "docs:build": "vuepress build docs"
  }
}
```

vuepress的配置

```js
// config.js
module.exports = {
    base:"/",
    title:"guo-ui",
    description:"一个vue h5框架",
    themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' },
          { text: 'External', link: 'https://google.com' },
        ],
        sidebarDepth: 1,
        sidebar: {
          '/components/': [
            {
              title:"组件",
              collapsable: false,
              children:[
                "/components/button"
              ]
            }
          ]
        }
    }
}
```





