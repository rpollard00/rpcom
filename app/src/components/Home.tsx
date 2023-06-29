export const Home = () => {
  return (
    <div className="grid grid-cols-[20%_80%]">
      <div className="p-2 col-start-1">
        <div className="bg-cyan-400 w-[100%] h-[150px] border-solid">
          Hello?
        </div>
      </div>
      <div className="p-2 col-start-2">
        <h2>Reese Pollard</h2>
        <a className="text-cyan-400" href="mailto://reese@reesep.com">
          Contact
        </a>
        <div>Cloud | Network | Automation | Developer | Unicorn</div>
        <br />
        <div>
          <p>Wow that's a lot of different hats to wear, huh?</p>
          <p>
            Lets just say that I have quite a few interests, which has left me
            with what I think is a somewhat unique skillset.
          </p>
          <br />
          <p>
            My primary role has been as a Senior Network Engineer + Architect +
            Administrator. Architecture is not a separate function at my
            organization. Neither is operations. So really I've been able to do
            it all. I've been the primary architect and engineer in many areas,
            such as: Datacenter (VXLAN BGP EVPN), SD-WAN(Palo Alto), multi-homed
            BGP, public DNS infrastructure. Oh yeah, and I've automated a lot of
            how we operate our network.
          </p>
          <br />
          <p>
            But wait, there's more. I'm also a Cloud Engineer. I've architected
            and contributed to the architecture and design of a number of
            solutions on various MS Azure Platforms. Such as: Function Apps,
            Azure Container Instances, Virtual Machine Scale Sets, Azure
            VirtualWAN. How did I build those things, you ask? Well, I used IaC.
            I built them with:
          </p>
          <br />
          <ul className="ml-4">
            <li>- Terraform</li>
            <li>- Azure Bicep</li>
            <li>- Ansible</li>
          </ul>
          <br />
          <p>How did you deploy them?</p>
          <p>
            I used Azure DevOps Pipelines, so - at this point they deploy
            themselves. Where do you store the source code? In git, silly. We
            use Azure DevOps git repos at my company.
          </p>
          <p>
            I can also automate things with code that != IaC templates. I've
            built bunches of automation with Python.
          </p>
        </div>
      </div>
    </div>
  )
}
