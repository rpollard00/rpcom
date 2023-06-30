import { Heading } from "./Heading"

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
