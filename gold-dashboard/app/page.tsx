import Image from "next/image"
import goldImage from "@/images/goldImage.jpg"


export default function LandingPage(){
  return (
    <section className="flex flex-col-reverse items-center gap-8 px-6 py-
        mx-auto md:flex-row max-w-7xl">
      <div>
          <p className="hidden text-sm text-gray-600 uppercase md:block">Your go-to platform for gold price tracking</p>
          <h1 className="text-4xl font-bold md:text-5xl">Discover what's possible with gold tracking</h1>
          <p className="text-lg text-gray-600">Join our community of creators and explore a vast library of user-submitted models.</p>
          <button className="px-6 py-3 text-black transition duration-100 bg-white border-2 border-black hover:bg-black hover: text-white">Browse models</button>
      </div>
      <Image className = "flex flex-col" src={goldImage} alt="Gold image" width="350" height="350"/>
    </section>
  )
}