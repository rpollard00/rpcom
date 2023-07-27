import { SyntheticEvent, useState } from 'react'
import userService from '../services/users'
import useToastContext from '../hooks/useToastContext'
import { AxiosError } from 'axios'

const SignupPage = () => {
  const [username, setUsername] = useState<string | undefined>("") 
  const [email, setEmail] = useState<string | undefined>("")
  const [password, setPassword] = useState<string | undefined>("")
  const addToast = useToastContext()

  const postSignup = async (signupObj: UserSignupType) => {
    let r: any 
    try {
      r = await userService.postSignup(signupObj)
      addToast(`Successfully registered user: ${username}`)
      console.log(r)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          if (error.response.data.data) {
          addToast(`Unable to add user: ${error.response.data.data.error}`)
          }
        }
      }
    }

    return r
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    if (username && email && password) {
      const signupPost: UserSignupType = {
        Username: username, 
        Email: email,
        Password: password
      }
      try {
        postSignup(signupPost)
      } catch (error) {
        console.error("Unable to post signup...") 
      }
    }
     
    console.log(`${username} ${email}`) 
  }

  return (
    <div className="flex flex-col flex-wrap items-center max-w-full min-w-fit">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center">
          <div className="w-[350px] h-[80px] content-center flex-grow-0 flex-shrink-0">
            <label className="p-0.5">Username: 
              <input className="w-[150px]"name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
            </label>
          </div>
          <div className="w-[350px] h-[80px] content-center flex-grow-0 flex-shrink-0">
            <label className="p-0.5">Email: 
              <input className="w-[150px]"name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
            </label>
          </div>
          <div className="w-[350px] flex-grow-0 flex-shrink-0">
            <label className="p-0.5 inline-block">Password: 
              <input type="password" name="Tags" onChange={e => setPassword(e.target.value)} value={password}/>
            </label>
          </div>
          <button className="align-right" type="submit">Signup</button>
        </div>
      </form>
    </div>
  )
}

export default SignupPage
