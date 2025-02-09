"use client";

import Image from "next/image";

interface TeamMemberProps {
  name: string;
  imageSrc: string;
  alt: string;
  description: string;
  linkedin: string;
  github: string;
}

function TeamMember({
  name,
  imageSrc,
  alt,
  description,
  linkedin,
  github,
}: TeamMemberProps) {
  return (
   
    <div className="border shadow-sm flex flex-col p-4 h-full">
    
      <div className="flex justify-center mb-4">
        <Image
          src={imageSrc}
          alt={alt}
          width={180} 
          height={180}
          className=""
        />
      </div>
      
      <div className="flex flex-col flex-grow text-center">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm mt-2">{description}</p>
      </div>
     
      <div className="mt-4 text-center">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          LinkedIn
        </a>{" "}
        |{" "}
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">About Us</h1>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch">
        <TeamMember
          name="Baljinder H"
          imageSrc="/images/baljinder.png"
          alt="Baljinder H"
          description="I am a CCNY Undergraduate student interested in Back-End development and Machine learning. I have previous experience as a SWE Intern at Lohman Lab, ICCAE, CTP, I was an ML intern at IDSL, and I am at Google as a Software Engineering Mentee!"
          linkedin="https://www.linkedin.com/in/baljinder-hothi/"
          github="https://github.com/BaljinderHothi"
        />
        <TeamMember
          name="Ishmam F."
          imageSrc="/images/ishmam.jpg"
          alt="Ishmam F."
          description="I am Computer Science student at City College of New York with a passion for full-stack development, AI/ML, and using technology to create meaningful impact. I actively hone my skills through hackathons, mentorship/fellowship, building projects, and various other programs striving to build software that reaches millions."
          linkedin="https://www.linkedin.com/in/ishmam-fardin/"
          github="https://github.com/IshmamF"
        />
        <TeamMember
          name="Jay P."
          imageSrc="/images/Jay.jpg"
          alt="Jay P."
          description="I'm a CCNY undergraduate student & backend developer interested in machine learning. I previously worked at ICCAE, and am currently working at Easy Meets and also an Open Source Developer Fellow at CTP!"
          linkedin="https://www.linkedin.com/in/jay-noppone-p/"
          github="https://github.com/jaynopponep"
        />
        <TeamMember
          name="Abrar H."
          imageSrc="/images/abrar.jpg"
          alt="Abrar H."
          description="I am an undergrad student at CCNY. My main focus is in backend, but I also love to just code random software. I have done some previous programs at Google, research internships at labs, and currently looking for my next role. If you got any connections, please hit me up!"
          linkedin="https://www.linkedin.com/in/abrarhabib/"
          github="https://github.com/dddictionary"
        />
      </div>
    </div>
  );
}
