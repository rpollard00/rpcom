import { AxiosError, AxiosResponse } from 'axios'
import { SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from '../services/users'
import blogService from '../services/blogs'
import useToastContext from '../hooks/useToastContext'
import { useCoolStore } from '../services/store'


const LoginPage = () => {
  const [email, setEmail] = useState<string | undefined>("")
  const [password, setPassword] = useState<string | undefined>("")
  const user: UserData | undefined = useCoolStore((state) => state.loggedInUser)
  const setUser = useCoolStore((state) => state.setLoggedInUser)
  const navigate = useNavigate()

  const addToast = useToastContext()

  const postLogin = async (loginObj: LoginPost) => {
    let r: AxiosResponse
    try {
      r = await userService.postLogin(loginObj)
      setEmail('')
      setPassword('')

      const userData = r.data
      setUser(userData)
      window.localStorage.setItem('rpcomAuthUser', JSON.stringify(userData))
      blogService.setToken(userData.token)
      addToast(`Welcome ${userData.email}. You have successfully logged in.`)
      navigate('/')
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error.response.data)
        const msgs = error.response.data.data.Messages
        msgs.map((m: string) => addToast(`ERROR: ${m}`))
        return error.response
      }
    }
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    if (email && password) {
      const loginPost: LoginPost = {
        Email: email,
        Password: password
      }
      try {
        postLogin(loginPost)
      } catch (error) {
        console.error("Unable to post signup...")
      }
    }
  }
  return (
    <div className="flex flex-col flex-wrap max-w-full min-w-fit pb-10 bg-slate-700 rounded-md">
      { user 
        ? <div className="self-center pt-4 pb-2 text-cyan-50 font-semibold">Hello, {user.email}</div> 
        : <div className="self-center pt-4 pb-2 text-cyan-50 font-semibold">Please enter credentials below</div>
      }
      <form onSubmit={handleSubmit}>
        <div className="self-stretch flex-1">
          <div className="flex justify-end p-3">
            <label className="pl-1 pr-2 py-1.5">Email:</label>
            <input className="flex-1 bg-zinc-900 px-2 text-end" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@address.com" />
          </div>
          <div className="flex justify-end p-3">
            <label className="pl-1 pr-2 py-1.5">Password:</label>
            <input className="flex-1 bg-zinc-900 px-2 text-end" type="password" name="Tags" onChange={e => setPassword(e.target.value)} value={password} placeholder="password123"/>
          </div>
          <div className="flex justify-end p-3">
            <button className="" type="submit">Login</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
