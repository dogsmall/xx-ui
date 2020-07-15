import { version } from '../package.json'
const requireComponent = require.context('.', true, /\.vue/)
const install = Vue => {
  requireComponent.keys().forEach(fileName => {
    const config = requireComponent(fileName)
    Vue.component(config.default.name, config.default)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  version
}
