import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios
const api = axios.create({ baseURL: 'https://localhost:44350/api' })  
// const api = axios.create({ baseURL: 'http://192.168.1.103/WebApiSILAMED/api/' })
// const api = axios.create({ baseURL: 'http://192.168.0.109/WebApiSILAMED/api/' })
// const api = axios.create({ baseURL: 'http://170.0.0.19/WebApiSILAMED/api/' })
// const api = axios.create({ baseURL: 'http://170.0.0.16/WebApiSILAMED/api/' })
//const api = axios.create({ baseURL: 'http://170.0.1.106/WebApiSILAMED/api/' })
// const api = axios.create({ baseURL: 'http://192.168.1.103/WebApiSILAMED/api/' })
// const api = axios.create({ baseURL: 'http://192.168.133.2/WebApiSILAMED/api/' })
// const api = axios.create({ baseURL: 'http://192.168.1.103/WebApiSILAMED/api/' })
// const api = axios.create({ baseURL: 'http://192.168.133.2/WebApiSILAMED/api/' })
Vue.prototype.$api = api
export { axios, api }