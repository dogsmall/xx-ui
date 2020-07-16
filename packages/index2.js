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
