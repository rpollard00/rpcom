import axios from 'axios'
const serverUrl = import.meta.env.VITE_API_URL
const baseUrl = `${serverUrl}/api/blog`

let token: string | null = null

function setToken(newToken: string) {
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

async function putBlog(blogPost: BlogPostType) {
  const config = {
    headers: { Authorization: token }
  }
  const { ID, ...postBody } = blogPost

  try {
    const res = await axios.put(`${baseUrl}/post/${ID}`, postBody, config)
    return res.data
  } catch (error) {
    console.error(error) 
  }
}

const exports = {
  getBlogs,
  getNextBlogId,
  getPrevBlogId,
  getLatestBlogId,
  postBlog,
  putBlog,
  setToken
}

export default exports
