//import { useState } from "react"
import Blog from "./components/Blog"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Home } from "./components/Home"
import BlogEditor from "./components/BlogEditor"
import LoginPage from "./components/Login"
import SignupPage from "./components/Signup"
import { ToastContextProvider } from "./contexts/ToastContext"
import { useCoolStore } from "./services/store"
import { useEffect, useState } from "react"
import blogService from './services/blogs'

function App() {
  const user: UserData | undefined = useCoolStore((state) => state.loggedInUser)
  const setUser = useCoolStore((state) => state.setLoggedInUser)
  const clearUser = useCoolStore((state) => state.clearLoggedInUser)
  const [adminNav, setAdminNav] = useState<boolean>(false)
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
  }, [])

  const handleLogout = () => {
    clearUser()
  }

  const handleAdminNav = () => {
    setAdminNav(!adminNav)
  }

  return (
    <ToastContextProvider>
      <Router>
        <div className="grid grid-cols-1 md:grid-cols-[15%_70%_15%] min-h-screen grid-rows-auto auto-rows-max justify-items-center bg-slate-800 text-slate-300 font-mono">
          <nav className="no-underline mt-3 md:mt-2 col-start-1 md:col-start-2">
            <ul className="flex">
              <li className="px-2">
                <Link to="/">Home</Link>
              </li>
              <li className="px-2">
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </nav>
          <div className="row-start-3 md:col-start-2 overflow-auto h-fit py-5 min-w-[100%]">
            <Routes>
              <Route path="/blog" element={<Blog />} />
              <Route path="/" element={<Home />} />
              <Route path="/post" element={<BlogEditor />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </div>
          <div className="col-span-full row-start-4 px-3 h-fit w-full flex flex-col justify-center">
            <div className="self-center">
              Reese Pollard, 2023 <button onClick={handleAdminNav}>[X]</button>
            </div>
            {adminNav ?
              <div className="self-center m-2 bg-slate-700 px-3">
                {!user ?
                  <Link className="px-1" to="/login">Login</Link>
                  :
                  <>
                    <Link className="px-1" to="/post">Post</Link>
                    <a className="px-1" href="#" onClick={handleLogout}>Logout</a>
                  </>
                }
              </div>
              :
              <></>
            }
          </div>
        </div>
      </Router>
    </ToastContextProvider>
  )
}

export default App
