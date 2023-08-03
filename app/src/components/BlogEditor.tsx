import { SyntheticEvent, useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import blogService from '../services/blogs'
import useToastContext from '../hooks/useToastContext'
import { useLocation } from 'react-router-dom'

type OptionalBlogEntry = {
  ID?: number 
  Title?: string,
  Author?: string,
  Content?: string,
  Tags?: string,
  Created?: string,
}

const BlogEditor = () => {
  const location = useLocation()
  const locationState = location.state as OptionalBlogEntry
  const [id,setId] = useState<number | undefined>(0)
  const [content, setContent] = useState<string | undefined>("")
  const [title, setTitle] = useState<string | undefined>("")
  const [tags, setTags] = useState<string | undefined>("")
  const addToast = useToastContext()

  useEffect(() => {
    console.log(locationState)
    if (locationState?.ID) {
      setId(locationState.ID) 
    }
    if (locationState?.Content) {
      setContent(locationState.Content)
    }
    if (locationState?.Title) {
      setTitle(locationState.Title)
    }
    if (locationState?.Tags) {
      setTags(locationState.Tags)
    }
  }, [locationState])

  const addBlog = async (blogObj: BlogPostType) => {
    try {
      await blogService.postBlog(blogObj)
      addToast(`Posted blog: ${blogObj.Title}`)
    } catch (error) {
      console.log("Failed to post blog")
    }
  }

  const updateBlog = async (blogObj: BlogPostType) => {
    try {
      await blogService.putBlog(blogObj)
      addToast(`Updated blog: ${blogObj.Title}`)
    } catch (error) {
      console.log("Failed to post blog")
    }
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    if (title && tags && content) {
      const blogPost: BlogPostType = {
        Title: title, 
        Tags: tags,
        Content: content,
        Author: "Reese" //temp
      }

      if (id && id != 0) {
        updateBlog({...blogPost, ID: id})
      } else {
        addBlog(blogPost)
      }
    } else {
      addToast(`Failed to post blog: missing fields`)
    }
  }
  return (
    <div className="flex flex-col items-center min-w-full pb-10">
      <form onSubmit={handleSubmit}>
        <div className="text-left items-end">
        <label className="p-0.5 inline-block">Title: 
          <input name="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Clever Title"/>
        </label>
        <br/>
        <label className="p-0.5 inline-block">Tags: 
          <input name="Tags" onChange={e => setTags(e.target.value)} value={tags}/>
        </label>
        </div>
      <MDEditor value={content} onChange={setContent} previewOptions={{
        rehypePlugins: [[rehypeSanitize]]
      }} />
      <MDEditor.Markdown source={content} style={{ whiteSpace: 'pre-wrap' }} />
      <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default BlogEditor
