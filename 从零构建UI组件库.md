<center>从零开始搭建UI组件库</center>



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



### 开始搭架子

```sh
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

```sh
vue create my-ui
```



### 组件



### 测试

[vue-test-utils](https://vue-test-utils.vuejs.org/zh/)

### 打包

​	

### 发布

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

```





