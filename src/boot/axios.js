import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const api = axios.create({ baseURL: 'https://localhost:44350/api' })
// const api = axios.create({ baseURL: 'http://localhost/WebApiSILAMED/api/' })
// const api = axios.create({ baseURL: 'http://192.168.43.95/WebApiSILAMED/api/' })
Vue.prototype.$api = api
export { axios, api }