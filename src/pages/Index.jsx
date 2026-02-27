import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";

export default function Index() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-center items-center text-white">

      {/* Animated Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-indigo-700 to-cyan-700 animate-gradientBackground"></div>

      {/* Subtle Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute top-0 left-0 w-full h-full"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
            color: { value: "#22d3ee" },
            shape: { type: "circle" },
            opacity: { value: 0.3 },
            size: { value: { min: 2, max: 5 } },
            move: { enable: true, speed: 0.8, direction: "none", outModes: "bounce" },
          },
          detectRetina: true,
        }}
      />

      {/* Overlay for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/25"></div>

      {/* Landing Page Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold mb-4"
        >
          Modern Bank Management System
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="mb-8 text-lg md:text-xl"
        >
          Manage accounts, transactions, budgets, and insights securely.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="space-x-4"
        >
          <Link
            to="/login"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold shadow-lg transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-white rounded-lg hover:bg-white/10 transition font-semibold"
          >
            Get Started
          </Link>
        </motion.div>
      </div>

      {/* Gradient Animation CSS */}
      <style>
        {`
          @keyframes gradientBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradientBackground {
            background-size: 400% 400%;
            animation: gradientBackground 30s ease infinite;
          }
        `}
      </style>
    </div>
  );
}