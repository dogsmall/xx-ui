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
