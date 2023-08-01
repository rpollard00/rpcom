import Title from "./Title"
import { UnorderedList } from "./List"
import portraitImg from "../assets/portrait.png"
//import Notification from './Notification'
import { useEffect } from "react"

export const Home = () => {
  useEffect(() => {
    console.log("Blah")
  }, [])

  return (
    <div className="flex flex-col md:flex-row items-start">
      <div className="p-2 md:mb-0 md:mr-6">
        <div className="flex flex-col w-[150px] border-solid mb-2">
          <img
            className="flex-none object-cover object-[50%_40%] w-[100%] h-[100%] rounded-full"
            src={portraitImg}
            alt="Cool picture"
          />
          <a className="mt-3 pt-3 text-cyan-400 block self-center" href="mailto://reese@reesep.com">
            Contact
          </a>
        </div>
      </div>
      <div className="p-2 min-w-[70%]">
        <Title>Reese Pollard</Title>
        <div>Cloud⛅️| Network🌎 | Automation🤖 | Developer🔧 </div>
        <br />
        <UnorderedList
          heading="Skills"
          items={[
            "IaC: Terraform, Microsoft Bicep, Ansible",
            "Languages: Python, Javascript, Powershell, Golang",
            "Microsoft Azure",
            "Network Architecture & Engineering",
            "Many other things",
          ]}
        />

        <div>
          <p></p>
          <br />
          <p>
            My primary role has been as a Senior Network Engineer + Architect +
            I've been the primary architect and engineer in many areas, such as:
            Datacenter Networking (VXLAN BGP EVPN), SD-WAN Infrastructure,
            multi-homed BGP, public DNS. Plus, I've automated a lot of how we
            operate our network.
          </p>
          <br />
          <p>
            There's more... I'm also a Cloud Engineer. I've architected and
            contributed to the architecture and design of a number of solutions
            on various MS Azure Platforms. Such as: Function Apps, Azure
            Container Instances, Virtual Machine Scale Sets, Azure VirtualWAN.
            All built with IaC and deployed with CI/CD pipelines.
          </p>
          <br />
          <p>
            I can also automate things with code that != IaC templates. I've
            built quite a bit of automation with Python.
          </p>
        </div>
      </div>
    </div>
  )
}
