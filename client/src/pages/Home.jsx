import Hero from "../assets/Hero.png";
import About from "./About";
import FeatureBoard from "../components/FeatureBoard";
import Banner from "../components/Banner";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <>
      <section
        className="relative w-full min-h-[90vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(${Hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

        {/* Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto w-full px-6 py-20"
        >
          <div className="max-w-2xl">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold text-white leading-tight"
            >
              Luxury isn’t loud. <br />
              <span className="text-red-600 bg-clip-text">It’s confident.</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="mt-6 text-xl text-gray-300 leading-relaxed max-w-lg"
            >
              Experience precision engineering and effortless performance,
              designed for those who demand more from every drive.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex gap-4"
            >
              <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95">
                Book Your Ride
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all active:scale-95">
                View Fleet
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <About />
      </motion.div>

      <FeatureBoard />
      <Banner />
    </>
  );
}
