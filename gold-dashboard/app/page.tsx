import Image from "next/image"
import goldImage from "@/images/goldImage.jpg"
import Link from "next/link";


export default function LandingPage() {
  return (
    <section className="relative bg-gradient-to-r from-yellow-100 via-yellow-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Text content */}
        <div className="flex-1 space-y-6">
          <p className="hidden md:block text-sm font-medium text-gray-600 uppercase tracking-wide">
            Your go-to platform for gold price tracking
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Discover what's possible with gold tracking
          </h1>
          <p className="text-lg text-gray-700">
            Stay Ahead with Live Gold Charts and Market Insights.
          </p>
          <div>
            <Link href="/GoldCharts">
  <button className="mt-2 px-6 py-3 text-black bg-white border-2 border-black font-semibold rounded-lg transition duration-300 hover:bg-black hover:text-white">
    Explore Gold Charts
  </button>
</Link>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Image
            className="rounded-xl shadow-2xl"
            src={goldImage}
            alt="Gold tracking"
            width={400}
            height={400}
            priority
          />
        </div>

      </div>
      
      {/* Optional: subtle decorative shapes or background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full opacity-20 -z-10"></div>
    </section>
  );
}