//import { useState } from "react"
import Blog from "./components/Blog"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Home } from "./components/Home"

function App() {
  //const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="grid grid-cols-1 md:grid-cols-[20%_60%_20%] grid-rows-auto auto-rows-max justify-items-center bg-slate-800 text-slate-300 font-mono">
        <nav className="no-underline col-start-2">
          <ul className="flex">
            <li className="px-2">
              <Link to="/">Home</Link>
            </li>
            <li className="px-2">
              <Link to="/blog">Blog</Link>
            </li>
          </ul>
        </nav>
        <div className="row-start-2 col-start-2 overflow-auto h-screen py-5">
          <Routes>
            <Route path="/blog" element={<Blog blog="HELLO THIS IS BLOG" />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
