import Hero from "../assets/Hero.png";
import About from "./About";
import FeatureBoard from "../components/FeatureBoard";
import Banner from "../components/Banner";
export default function Home() {
  return (
    <>
      <section
      className="relative w-full min-h-[90vh]  flex items-center"
      style={{
        backgroundImage: `url(${Hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
      }}
    >
      

      {/* Content */}
      <div className="absolute top-20 z-1 max-w-7xl mx-4 px-6 pt-2  flex flex-col md:flex-row  gap-6">
        <div className="">
          <h1 className="text-4xl md:text-5xl font-semibold text-red-600 leading-tight">
            Luxury isn’t loud. It’s confident.
          </h1>

          <p className="mt-4 text-gray-300 leading-relaxed">
            Experience precision engineering and effortless performance,
            designed for those who demand more from every drive.
          </p>
          <button className="mt-6 bg-[#372323] text-white px-6 py-3 border-2 border-dashed border-[#7A010D] rounded-full hover:bg-red-700 transition">
            Book Now
          </button>
        </div>
      </div>
    </section>
    <About />
    <FeatureBoard />
    <Banner />
    
      </>
    
  );
}
