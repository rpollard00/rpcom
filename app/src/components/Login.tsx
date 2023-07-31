import { AxiosError, AxiosResponse } from 'axios'
import { SyntheticEvent, useState } from 'react'
import userService from '../services/users'
import blogService from '../services/blogs'
import useToastContext from '../hooks/useToastContext'


const LoginPage = () => {
  const [email, setEmail] = useState<string | undefined>("")
  const [password, setPassword] = useState<string | undefined>("")
  const [user, setUser] = useState<UserData | undefined>(undefined)
  const addToast = useToastContext()

  const postLogin = async (loginObj: LoginPost) => {
    let r: AxiosResponse
    try {
      r = await userService.postLogin(loginObj)
      setEmail('')
      setPassword('')
      const userData = r.data
      setUser(userData)
      blogService.setToken(userData.token)
      addToast(`Welcome ${userData.email}. You have successfully logged in.`)
      return r
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
    console.log("Submit login")
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
