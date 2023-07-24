import { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
  const [currentBlogId, setCurrentBlogId] = useState<number>(0)

  useEffect(() => {
    setLoading(true)
    if (currentBlogId === 0) {
      blogService.getLatestBlogId().then(n => {
        setCurrentBlogId(n)
      })
      return
    }

    blogService.getBlogs(currentBlogId).then(r => {
      setBlogEntry(r)
      setLoading(false)
    }).catch((e) => {
        setLoading(true)
        console.error(e)
      })
  }, [currentBlogId, setBlogEntry])
  return (
    <>
      { loading || blogEntry === undefined ? <div>Loading...</div> :  
      <div className="flex flex-col items-center pb-10">
      <BlogNav setCurrentBlogId={setCurrentBlogId} currentBlogId={currentBlogId}/>
        <h2 className="text-2xl font-bold p-3 text-center">{blogEntry.Title}</h2>
        <h2 className="italic self-end pr-10">by {blogEntry.Author} on {blogEntry.Created}</h2>
          <ReactMarkdown className="prose p-5 max-w-none dark:prose-invert prose-neutral">
          {blogEntry.Content}
        </ReactMarkdown>
      <BlogNav setCurrentBlogId={setCurrentBlogId} currentBlogId={currentBlogId}/>
      </div> }
    </>
  )
}
interface BlogNavProps {
  currentBlogId: number
  setCurrentBlogId: Dispatch<SetStateAction<number>> 
}

const BlogNav = ({ currentBlogId, setCurrentBlogId }: BlogNavProps ) => { 
  const [prevBlogId, setPrevBlogId] = useState<number>(0) 
  const [nextBlogId, setNextBlogId] = useState<number>(0)

  const updateBlogId = (id: number) => {
    setCurrentBlogId(id) 
  }
  

  useEffect(() => {
    if (currentBlogId === 0) {
      return
    }

    blogService.getPrevBlogId(currentBlogId).then(n => {
      setPrevBlogId(n)
    })
    blogService.getNextBlogId(currentBlogId).then(n => {
      setNextBlogId(n)
    })
  }, [currentBlogId])
  return (
  <div>
      <button className="disabled:opacity-10" disabled={prevBlogId === currentBlogId} onClick={() => { updateBlogId(prevBlogId) }}>Previous</button>
      {" "}|{" "}
      <button className="disabled:opacity-10" disabled={nextBlogId === currentBlogId} onClick={() => { updateBlogId(nextBlogId) }}>Next</button>
  </div>
  )
}
export default Blog
