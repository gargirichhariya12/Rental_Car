import Hero from "../assets/Hero.png";
import About from "./About";
import FeatureBoard from "../components/FeatureBoard";
import Banner from "../components/Banner";
import SearchBar from "../components/Select";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  void motion;
  const navigate = useNavigate();

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
              <Button
                onClick={() => navigate("/cars")}
                variant="primary"
                size="lg"
                className="bg-red-600 shadow-xl shadow-red-600/20 hover:bg-red-700"
              >
                Book Your Ride
              </Button>
              <Button
                onClick={() => navigate("/cars")}
                variant="secondary"
                size="lg"
                className="backdrop-blur-md"
              >
                View Fleet
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 max-w-4xl"
            >
              <SearchBar />
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
