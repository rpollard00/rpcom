import Title from "./Title"
import { UnorderedList } from "./List"
import portraitImg from "../assets/portrait.png"

export const Home = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[20%_80%]">
      <div className="p-2 col-start-2 md:col-start-1">
        <div className="bg-cyan-400 w-[150px] h-[200px] border-solid rounded mb-2">
          <img
            className="object-cover object-[50%_40%] w-[100%] h-[100%] rounded"
            src={portraitImg}
            alt="Cool picture"
          />
        </div>
        <a className="text-cyan-400" href="mailto://reese@reesep.com">
          Contact
        </a>
      </div>
      <div className="p-2 col-start-2">
        <Title>Reese Pollard</Title>
        <div>Cloud⛅️| Network🌎 | Automation🤖 | Developer🔧 | Unicorn🦄</div>
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
