
import axios from 'axios'
const serverUrl = import.meta.env.VITE_API_URL
const baseUrl = `${serverUrl}/api/users`

async function postSignup(signupPost: UserSignupType) {
  const res = await axios.post(`${baseUrl}/signup`, signupPost)
  return res.data
}

async function postLogin(loginPost: LoginPost) {
  const res = await axios.post(`${baseUrl}/login`, loginPost)
  return res.data
}

const exports = {
  postSignup,
  postLogin
}

export default exports
