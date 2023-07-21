import axios from 'axios'
const serverUrl = 'http://localhost:8080'
const baseUrl = `${serverUrl}/api/blog`

async function getBlogs(): Promise<BlogEntry | undefined> {
  try {
    const req = await axios.get(`${baseUrl}/view/1`)
    return await req.data
  } catch (error) {
    console.error(error)  
  }
  return undefined
}

const exports = {
  getBlogs
}

export default exports
