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
    <div className="flex flex-col flex-wrap items-center max-w-full min-w-fit pb-10 border-solid border-2 border-white">
      {user ? <div>Hello, {user.email}</div> : <div>Please enter credentials below</div>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center border-solid border-2 border-red-500">
          <div className="w-[350px] h-[80px] content-center flex-grow-0 flex-shrink-0 border-solid border-2 border-green-500">
            <label className="p-0.5">Email:
              <input className="w-[150px]" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            </label>
          </div>
          <div className="w-[350px] flex-grow-0 flex-shrink-0">
            <label className="p-0.5 inline-block">Password:
              <input type="password" name="Tags" onChange={e => setPassword(e.target.value)} value={password} />
            </label>
          </div>
          <button className="align-right" type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
