import { SyntheticEvent, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import blogService from '../services/blogs'
import useToastContext from '../hooks/useToastContext'

const BlogEditor = () => {
  const [content, setContent] = useState<string | undefined>("**Hello world!**")
  const [title, setTitle] = useState<string | undefined>("")
  const [tags, setTags] = useState<string | undefined>("")
  const addToast = useToastContext()

  const addBlog = async (blogObj: BlogPostType) => {
    try {
      await blogService.postBlog(blogObj)
      addToast(`Posted blog: ${blogObj.Title}`)
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
      addBlog(blogPost)
    } else {
      addToast(`Failed to post blog: missing fields`)
    }
     
    console.log(`${title} ${tags} ${content}`) 
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
