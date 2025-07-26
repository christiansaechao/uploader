import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-light flex items-center justify-center flex-1">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary to-accent blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 20, -20, 0],
          opacity: [0.2, 0.4, 0.2],
          x: [-10, 10, -10],
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-primary p-8">
        <div className="flex justify-center items-center">
          <div className="w-[75px] h-[75px]">
            <img
              className=""
              src="https://mymultaibucket.s3.us-west-1.amazonaws.com/multai-logo-v2.png"
              alt="logo"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold py-6">
            MultAi-Channel Selling Made Simple
          </h1>
        </div>
        <h2 className="text-lg md:text-xl max-w-4xl text-muted font-sans">
          Launch and manage your products on Amazon, eBay, and Shopify — from a
          single dashboard. Built for sellers who want power without the
          complexity. Just connect your store and start selling.
        </h2>
        <div className="flex flex-row gap-10 p-4">
          <button className="solid">
            <NavLink to="/login">Login</NavLink>
          </button>
          <button className="bordered">
            <NavLink to="/signup">Signup</NavLink>
          </button>
        </div>
      </div>
    </section>
  );
};
