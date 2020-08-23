import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('../views', true, /\.vue$/)

// you do not need `import app from './views/app'`
// it will auto require all vue module from modules file
export const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.vue' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const moduleRoutes = Object.keys(modules).map(key => {
  return {
    path: `/${key}`,
    name: key,
    component: modules[key]
  }
})
const routes = [{
  path: '/',
  name: 'Start',
  redirect: '/start'
}].concat(moduleRoutes)

const router = new VueRouter({
  routes
})

export default router
