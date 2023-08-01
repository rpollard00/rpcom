import { Heading } from "./Heading"

interface ListInterface {
  heading: string 
  items: Array<string>
}

export const UnorderedList = (list: ListInterface) => {
  return (
    <>
      <Heading>{list.heading}</Heading>
      <ul>
        {list.items.map(item => (
          <li>- {item}</li>
        ))}
      </ul>
    </>
  )
}
