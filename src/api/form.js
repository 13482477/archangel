import axios from 'axios'

// const request = axios.create({
//   baseURL: process.env.VUE_APP_API_BASE_URL2, // api base_url
//   timeout: 6000 // 请求超时时间
// })

export function createForm ({ formName, formData }) {
  console.log(formData)
  return axios.post('http://localhost:9800/form', { formName, formData })
}
