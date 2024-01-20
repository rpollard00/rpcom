import Title from "./Title"
import { UnorderedList } from "./List"
import portraitImg from "../assets/portrait.png"

export const Home = () => {
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
            "Languages: Golang, Python, Javascript, Powershell",
            "Microsoft Azure",
            "Network Architecture & Engineering",
          ]}
        />

        <div>
          <p></p>
          <br />
          <p>
            I'm a Senior Network, Cloud, and Automation Engineer
            I build technology solutions across many domains.
            Datacenter Networking (VXLAN BGP EVPN), SD-WAN Infrastructure,
            multi-homed BGP,and DNS. 
          </p>
          <br />
          <p>
            I've architected and developed a number of solutions
            on various MS Azure Platforms. Such as: Function Apps, Azure
            Container Instances, Virtual Machine Scale Sets, Azure VirtualWAN.
            All built with IaC and deployed with CI/CD pipelines.
          </p>
          <br />
          <p>
            If you think I can help you or your business, please contact me at reese@reesep.com.
          </p>
        </div>
      </div>
    </div>
  )
}
