import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import blogService from '../services/blogs'

const Blog = () => {
  const [loading, setLoading] = useState(false)
  const [blogEntry, setBlogEntry] = useState<BlogEntry | undefined>({
    Title: "",
    Author: "",
    Content: "",
    ID: 0,
    Created: "",
  })

  useEffect(() => {
    setLoading(true)
    blogService.getBlogs().then(r => {
      setBlogEntry(r)
      setLoading(false)
    }).catch((e) => {
        setLoading(true)
        console.error(e)
      })
  }, [setBlogEntry])
  return (
    <>
      { loading || blogEntry === undefined ? <div>Loading...</div> :  
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold p-3">{blogEntry.Title} - {blogEntry.Author}</h2>
          <ReactMarkdown className="prose p-5 max-w-none dark:prose-invert prose-neutral">
          {blogEntry.Content}
        </ReactMarkdown>
      </div> }
    </>
  )
}

export default Blog
