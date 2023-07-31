//import { useState } from "react"
import Blog from "./components/Blog"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Home } from "./components/Home"
import BlogEditor from "./components/BlogEditor"
import LoginPage from "./components/Login"
import SignupPage from "./components/Signup"
import { ToastContextProvider } from "./contexts/ToastContext"
import { useCoolStore } from "./services/store"
import { useEffect } from "react"
import blogService from './services/blogs'


function App() {
  const user: UserData | undefined = useCoolStore((state) => state.loggedInUser)
  const setUser = useCoolStore((state) => state.setLoggedInUser)
  const clearUser = useCoolStore((state) => state.clearLoggedInUser)
  // write use effect hook to get logged in user
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('rpcomAuthUser')
    if (loggedInUserJSON) {
      const userData = JSON.parse(loggedInUserJSON)
      setUser(userData)
      if (user) {
        blogService.setToken(user.token)
      }
    }
  },[])

  const handleLogout = () => {
    clearUser()
  }

  return (
    <ToastContextProvider>
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
              { !user ? 
              <li className="px-2">
                <Link to="/login">Login</Link>
              </li>
              :
              <>
              <li className="px-2">
                <Link to="/post">Post</Link>
              </li>
              <li className="px-2">
                  <a onClick={handleLogout}>Logout</a>
              </li>
              </>
              }
            </ul>
          </nav>
          <div className="row-start-3 col-start-2 overflow-auto h-screen py-5 min-w-[100%]">
            <Routes>
              <Route path="/blog" element={<Blog />} />
              <Route path="/" element={<Home />} />
              <Route path="/post" element={<BlogEditor />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ToastContextProvider>
  )
}

export default App
