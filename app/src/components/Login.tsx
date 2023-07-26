import { SyntheticEvent, useState } from 'react'

const LoginPage = () => {
  const [email, setEmail] = useState<string | undefined>("")
  const [password, setPassword] = useState<string | undefined>("")

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
     
    console.log("Submit login")
  }
  return (
    <div className="flex flex-col flex-wrap items-center max-w-full min-w-fit pb-10 border-solid border-2 border-white">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center border-solid border-2 border-red-500">
          <div className="w-[350px] h-[80px] content-center flex-grow-0 flex-shrink-0 border-solid border-2 border-green-500">
            <label className="p-0.5">Email: 
              <input className="w-[150px]"name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
            </label>
          </div>
          <div className="w-[350px] flex-grow-0 flex-shrink-0">
            <label className="p-0.5 inline-block">Password: 
              <input type="password" name="Tags" onChange={e => setPassword(e.target.value)} value={password}/>
            </label>
          </div>
          <button className="align-right" type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
