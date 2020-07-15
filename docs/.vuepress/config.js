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