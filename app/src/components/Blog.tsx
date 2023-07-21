import { useEffect, useState } from 'react'
import blogService from '../services/blogs'

const Blog = () => {
  const [blogEntry, setBlogEntry] = useState({
    loading: false,
    blog: { Title: "", Author: "", Content: ""},
  })

  useEffect(() => {
    setBlogEntry({ loading: true, blog: blogEntry.blog })
    blogService.getBlogs().then(r => {
      setBlogEntry({ loading: false, blog: r.data})
    })
  }, [setBlogEntry])
  return (
    <>
      { blogEntry.loading ? <div>Loading...</div> :  
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold p-3">{blogEntry.blog.Title} - {blogEntry.blog.Author}</h2>
        <div>
          {blogEntry.blog.Content}
        </div>
      </div> }
    </>
  )
}

export default Blog
