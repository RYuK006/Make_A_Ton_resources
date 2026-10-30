"use client";

import { ArrowLeft, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Trypage from "./try";

const features = [
  {
    title: "Seamless Integration",
    description:
      "Effortlessly integrate with your existing tools and systems, making data management and automation a breeze.",
    icon: "⚡",
  },
  {
    title: "AI-Powered Insights",
    description:
      "Leverage advanced AI to get real-time insights that help drive decision-making and optimize your operations.",
    icon: "🤖",
  },
  {
    title: "Scalable Infrastructure",
    description:
      "Easily scale your business with robust and reliable infrastructure that grows with your needs.",
    icon: "📈",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center">
      <header className="p-4 flex justify-between items-center w-full">
        <ArrowLeft className="w-6 h-6" />
        <nav className="flex items-center space-x-6">
          <a
            href="#"
            className="text-base font-light hover:text-gray-300 transition-colors"
          >
            Join Us
          </a>
          <a
            href="#"
            className="text-base font-light hover:text-gray-300 transition-colors"
          >
            API
          </a>
          <button
            className="bg-white text-black px-5 py-2 rounded-full text-base font-semibold hover:bg-opacity-90 transition-colors"
            onClick={handleOnClick}
          >
            Try Now
          </button>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl font-extrabold tracking-tight mb-10"
        >
          MarketWala
          <br />
          <span className="font-light text-5xl">by deadAI</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center p-8 rounded-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <span className="text-5xl mb-6">{feature.icon}</span>
              <h2 className="text-2xl font-semibold mb-4 tracking-tight">
                {feature.title}
              </h2>
              <p className="text-base font-light text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="pb-4 mt-16 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </footer>

      <Trypage />
    </div>
  );
}
