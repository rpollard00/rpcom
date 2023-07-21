import axios, { AxiosResponse } from 'axios'
const serverUrl = 'http://localhost:8080'
const baseUrl = `${serverUrl}/api/blog`

async function getBlogs() {
  const req = axios.get(`${baseUrl}/view/1`)
  return await req
}

const exports = {
  getBlogs
}

export default exports
