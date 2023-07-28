
import axios from 'axios'
const serverUrl = 'http://localhost:8080'
const baseUrl = `${serverUrl}/api/users`

async function postSignup(signupPost: UserSignupType) {
  // const config = {
  //   headers: { Authorization: "FAKECODE"}
  // }
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
