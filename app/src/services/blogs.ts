import axios from 'axios'
const serverUrl = import.meta.env.VITE_API_URL
const baseUrl = `${serverUrl}/api/blog`

let token: string | null = null

function setToken(newToken: string) {
  console.log("TOKEN SET")
  token = `Bearer ${newToken}`
  return
}

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

async function postBlog(blogPost: BlogPostType) {
  const config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(`${baseUrl}/post`, blogPost, config)
  return res.data
}

const exports = {
  getBlogs,
  getNextBlogId,
  getPrevBlogId,
  getLatestBlogId,
  postBlog,
  setToken
}

export default exports
