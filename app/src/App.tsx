//import { useState } from "react"
import Blog from "./components/Blog"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Home } from "./components/Home"
import BlogEditor from "./components/BlogEditor"
import LoginPage from "./components/Login"

function App() {
  //const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="grid grid-cols-1 md:grid-cols-[15%_70%_15%] grid-rows-auto auto-rows-max justify-items-center bg-slate-800 text-slate-300 font-mono">
        <nav className="no-underline col-start-2">
          <ul className="flex">
            <li className="px-2">
              <Link to="/">Home</Link>
            </li>
            <li className="px-2">
              <Link to="/blog">Blog</Link>
            </li>
            <li className="px-2">
              <Link to="/post">Post</Link>
            </li>
            <li className="px-2">
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <div className="row-start-2 col-start-2 overflow-auto h-screen py-5 min-w-[100%]">
          <Routes>
            <Route path="/blog" element={<Blog />} />
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<BlogEditor />} />
            <Route path="/login" element={<LoginPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
