import axios from 'axios'
const serverUrl = 'http://localhost:8080'
const baseUrl = `${serverUrl}/api/blog`

async function getBlogs(id: number): Promise<BlogEntry | undefined> {
  try {
    const req = await axios.get(`${baseUrl}/view/id/${id}`)
    return await req.data
  } catch (error) {
    console.error(error)  
  }
  return undefined
}

async function getLatestBlogId(): Promise<number> {
  try {
    const req = await axios.get(`${baseUrl}/view/latest`)
    return await req.data
  } catch (error) {
    console.error(error)  
  }
  return 0 
}

async function getNextBlogId(currentId: number): Promise<number> {
  try {
    const req = await axios.get(`${baseUrl}/view/next?id=${currentId}`)
    return await req.data
  } catch (error) {
    console.error(error)  
  }
  return 0 
}

async function getPrevBlogId(currentId: number): Promise<number> {
  try {
    const req = await axios.get(`${baseUrl}/view/prev?id=${currentId}`)
    return await req.data
  } catch (error) {
    console.error(error)  
  }
  return 0 
}

const exports = {
  getBlogs,
  getNextBlogId,
  getPrevBlogId,
  getLatestBlogId
}

export default exports
