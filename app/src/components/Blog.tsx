import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
          <ReactMarkdown className="prose dark:prose-invert prose-neutral">
          {blogEntry.Content}
        </ReactMarkdown>
      </div> }
    </>
  )
}

export default Blog
