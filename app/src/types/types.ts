type BlogEntry = {
  ID: number 
  Title: string,
  Author: string,
  Content: string,
  Tags: string,
  Created?: string,
}

type BlogPostType = {
  Title: string,
  Author: string,
  Content: string,
  Tags: string,
}

type UserSignupType = {
  Username: string,
  Email: string,
  Password: string,
}
 
type UserData = {
  email: string,
  token: string,
}

type LoginPost = {
  Email: string,
  Password: string,
}

