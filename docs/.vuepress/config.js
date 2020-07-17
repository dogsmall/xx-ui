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