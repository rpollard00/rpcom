import { useEffect, useState } from 'react'
import blogService from '../services/blogs'

const Blog = () => {
  const [loading, setLoading] = useState(false)
  const [blogEntry, setBlogEntry] = useState({ Title: "", Author: "", Content: ""})

  useEffect(() => {
    setLoading(true)
    blogService.getBlogs().then(r => {
      setBlogEntry({ ...r.data})
      setLoading(false)
    })
  }, [setBlogEntry])
  return (
    <>
      { loading ? <div>Loading...</div> :  
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold p-3">{blogEntry.Title} - {blogEntry.Author}</h2>
        <div>
          {blogEntry.Content}
        </div>
      </div> }
    </>
  )
}

export default Blog
