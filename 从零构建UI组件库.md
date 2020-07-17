<center>从零开始搭建UI组件库</center>
## 组件库的价值
1. 保证产品体验的一致性：对于一个含有多业务系统的大型复杂产品，每个独立的业务系统虽然在功能上有一定区别，但整体的用户体验需要满足基本的一致性。比如，当我使用同一个产品中的业务系统 A 和业务系统 B 时，我能通过类似的页面结构、组件及样式的一致性、操作反馈乃至提示文案结构的一致性，来感知到我使用的A、B业务系统隶属于同一个产品。
2. 提升设计师的效率：在需求量巨大且需求来自不同的业务线时，需要逐一绘制页面及组件，造成大量重复劳动，并且在评审及需求沟通环节还可能存在不断地细节调优。所以对于设计师而言，组件的高频复用能大大提升设计效率，使设计师更多的将精力聚焦于理解和解决用户的实际问题。
3. 提升产研团队的效率：通用场景及普通需求直接按规范进行设计和研发，减少上下游对同一页面及组件使用方式的不同理解而产生的多余沟通成本。
4. 利于沉淀设计规范：组件本身的设计和使用方式就可以直接作为交互和视觉规范的一部分，按照统一的设计规范来确定需要使用的主题色、组件样式、组合方式及页面结构，可以快速搭建出一个或多个产品的交互框架。



### 为什么我们非要自己做一个UI组件库

1. **独立**,不跟大家雷同,具有独特性或者说差异性
2. **自由**,交互逻辑更加定制化,多样化
3. **安全**,内部创建,内部维护,安全稳定,能提供更多定制化的开发
4. **深入**,对组件库的内在更深入的了解


### Tasking

1. 组件
   2. 文件目录结构
   2. **样式分离**
4. 打包
   1. **打包工具选择**
   2. **按需加载**
   3. 打包输出目录结构  --> 配合babel 插件
   4. 打包结果
5. 发布
   1. npm 发布
   2. npm 升级
   3. npm 注销
4. 验证组件库是否成功
   1. 全局安装是否成功
   2. 按需加载是否成功
5. 测试
   1. TDD
6. 组件库文档
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



### 调整文件结构

```
|- build/  # webpack打包配置
	|- gulp.css.js 打包css样式
	|- rollup.config.js 打包组件库js
	|- webpack.component.js 单独打包组件js
|- docs/  # 存放文档
	|- .vuepress/  # vuepress配置目录
	|- component/ # 组件相关的文档放这里
	|- README.md # 静态首页
|- packages/
	|-index.js #全部组件库入口
	|-button/
		|-src/
			|- button.vue
		|-index.js # 单个组件库入口
	|- theme-chalk # css样式文件夹
|- src/ # 在这里写展示demo代码
|- test/  # 测试文件夹
	|- unit/  # 存放所有的测试用例
|- .npmignore
|- .gitignore
|- .babelrc
|- README.md
|- package.json
```



### 组件

现在在packages文件夹里写个button组件

##### 注意点:

1. 样式分离,css部分单独放到theme-chalk/button.less
   1. css不嵌套在vue文件里,方便对组件样式的单独打包,方便按需加载
   2. 单独分离出样式组件进行管理,方便后续对组件进行换肤
   3. 单独分离出样式文件,方便统一管理
2. 组件内定义name属性
   1. 组件内的name决定了之后组件的标签名,方便之后引入
3. 组件内index.js文件单独引入
   1. 方便对组件单独打包,实现按需加载
4. 组件外index.js全部引入
   1. 统一打包

```js
//index2.js
import Button from './button/index'
import { version } from '../package.json'
const components = {
  Button
}

const install = function (Vue) {
  if (install.installed) return
  Object.keys(components).forEach(key => {
    Vue.component(components[key].name, components[key])
  })
  install.installed = true
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  Button
}

export default {
  version,
  install
}

```

```js
// index.js webpack可以识别requireComponent获取的组件
import { version } from '../package.json'
const requireComponent = require.context('.', true, /\.vue/)

const install = Vue => {
  requireComponent.keys().forEach(fileName => {
    console.log(fileName)
    const config = requireComponent(fileName)
    console.log(config.default.name)
    Vue.component(config.default.name, config.default)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
// console.log(obj)
export default {
  install,
  version
}

```



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

**Rollup** vs **Webpack** vs **Gulp**

##### 都是打包工具这三个有什么区别吗?

1. Rollup:下一代 ES6 模块化工具,体积小<span style="color:red">可以打包成ES模块</span>,缺点不支持多入口打包
2. Webpack:功能强大,<span style="color:red">支持多入口打包</span>,配置项多,侧重于依赖管理,比Rollup配置复杂,且不支持ES模块打包(webpack4.0开始支持了)
3. Gulp:是基于“流”的自动化构建工具,<span style="color:red">支持css文件为入口</span>



##### 结论

Rollup用来整库js

webpack 用来单个组件打包,实现按需加载

Gulp 打包css



##### js 打包

1. 最简单的webpack打包

```js
// package.json 新增命令
"lib": "vue-cli-service build --dest ./lib --target lib --name xx-ui  ./packages/index.js"
```

2. Rollup 打包

```js
// rollup.config.js rollup 模块打包
import resolve from 'rollup-plugin-node-resolve' // 告诉 Rollup 如何查找外部模块
import commonjs from 'rollup-plugin-commonjs' // 支持对commonj模块的加载
import vue from 'rollup-plugin-vue' // 处理vue文件
import json from 'rollup-plugin-json' // 处理package.json
import babel from 'rollup-plugin-babel'
// ugilfy不支持es转换 采用terser
import { terser } from 'rollup-plugin-terser'

const outputFormat = process.env.format || 'es'
const minify = process.env.minify || false
const fileSuffix = minify ? '.min' : ''

export default {
  input: './packages/index2.js',
  output: {
    file: `lib/xx-rollup-ui.${outputFormat}${fileSuffix}.js`,
    format: outputFormat,
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
}

```

3. webpack分包加载

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

##### css 打包

```js
// gulp.css.js

const gulp = require('gulp')
const { src, dest } = require('gulp')
const less = require('gulp-less')
const cssmin = require('gulp-cssmin')
const concat = require('gulp-concat')

const path = require('path')
const fs = require('fs')
// 读取theme-chalk文件里的所有less文件
const items = fs.readdirSync('./packages/theme-chalk')

const files = items.filter(item => !fs.statSync(path.resolve('./packages/theme-chalk', item)).isDirectory())
const entryHash = {}
if (files.length > 0) {
  files.forEach(ele => {
    if (ele !== 'index.less') {
      entryHash[ele] = `./packages/theme-chalk/${ele}`
    }
  })
}
// 全部打包组件样式
function compileAll () {
  return src('./packages/theme-chalk/index.less')
    .pipe(less())
    .pipe(concat('xx-ui.css'))
    .pipe(cssmin())
    .pipe(dest('./lib/styles'))
}
// 单独打包组件样式
function compileCss (cb) {
  for (const key in entryHash) {
    src(entryHash[key])
      .pipe(less())
      .pipe(cssmin())
      .pipe(dest('./lib/styles'))
  }
  cb()
}
gulp.task('css', compileCss)
gulp.task('all', compileAll)
```

最外层添加gulp的配置入口文件

```js
//gulpfile.js
require('./build/gulp.css.js')
```

##### 结论

1. 只用webpack来实现打包 优点是不需要维护组件库的引入,自动引入所有组件,缺点是打包出来的体积大

2. 用rollup来打包,优点是体积小,但是需要维护组件引入需要额外的维护(写脚本读取文件夹目录),后续还需要用webpack单独组件打包


### 发布

1. 首先在npm官网注册一个账号

2. package.json里面配置上传信息

   **必须带有的字段**

   - `name` :包名(全部小写，没有空格，可以使用下划线或者横线)
   - `version`: 版本

   **其他内容**

   - `author`:作者信息
   - `main`:程序入口文件，一般都是 `index.js`
   - `description`:描述信息，有助于搜索
   - `keywords`:[] 关键字，有助于在人们使用 `npm search` 搜索时发现你的项目
   - `scripts`:支持的脚本，默认是一个空的 test
   - `license`:默认是 MIT
   - `bugs`:当前项目的一些错误信息，如果有的话
   - `dependencies`:在生产环境中需要用到的依赖
   - `devDependencies`:在开发、测试环境中用到的依赖
   - `repository`:代码仓库

3. 新建`.npmignore`文件,防止上传敏感信息

4. ```sh
   npm login #注意如果是淘宝源或者不是npm官方源要切回官方源
   npm publish
   ```



### 验证我们组件库

#### 全部加载

```js
import xxUI from '@dogsmall/xx-ui'
import '@dogsmall/xx-ui/lib/styles/xx-ui.css'
Vue.use(xxUI)
```



#### 按需加载

按需加载需要通过`babel-plugin-component`这个包来替我们做一些代码转化

安装并且配置

```js
// babel.config.js 
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['component', {
      libraryName: '@dogsmall/xx-ui',
      libDir: 'lib',
      styleLibrary: {
        name: 'styles',
        base: false,
        path: '[module].css'
      }
    }]
  ]
}
```



```js
import {Button} from '@dogsmall/xx-ui'
Vue.use(xxUI)
// 实际等于
import Button from '@dogsmall/xx-ui/lib/button.js'
import '@dogsmall/xx-ui/lib/styles/button.css'
Vue.use(xxUI)
```





### 组件库文档

##### 组件文档要有什么功能

1. 使用说明
2. 展示demo
3. demo的code
4. 使用参数和方法



#### 组件库文档选型

1. vue实现,优点是交互灵活,样式自由,确定是工作量大,自己维护的地方比较多
2. 静态模板编译
   1. gitbook
   2. vuepress

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
    title:"xx-ui",
    description:"一个vue h5框架",
    themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' },
          { text: '组件', link: '/components/' },
          { text: 'External', link: 'https://google.com' },
        ],
        sidebarDepth: 1,
        sidebar: {
          '/components/': [
            {
              title:"向导",
              collapsable: false,
              children:[
               "/components/install"
              ]
            },
            {
              title:"组件",
              collapsable: false,
              children:[
                "/components/button",
                "/components/input"
              ]
            }
          ],
        }
    }
}
```

Vuepress 默认支持vue文件组件,方便我们写组件文档

##### 自动化生成文档





### 还有哪些方面

1. 版本控制

2. 版本记录
3. 国际化
4. 类型定义





