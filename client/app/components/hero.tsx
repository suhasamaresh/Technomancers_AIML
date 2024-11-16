"use client";
import React from "react";
import { FaRocket, FaRegFileAlt, FaRoad, FaHeartbeat } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react"; // Assuming you are using NextAuth for session management
import { useRouter } from "next/navigation";

const Hero: React.FC = () => {
  const { data: session } = useSession(); // Get session data
  const router = useRouter();

  const handleButtonClick = () => {
    if (session) {
      // If there is a session, redirect to the dashboard
      router.push("/dashboard");
    } else {
      // If there is no session, redirect to the registration page
      router.push("/registeruser");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between h-full md:h-screen bg-gradient-to-bl from-[#122f24] via-[#0a0a0a] to-[#0a0a0a] text-center md:text-left px-8 py-8 md:px-28 md:py-16">
      {/* Left Side Content */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 pt-14 md:pt-0">
          Find Your Dream Job
        </h1>
        <h2 className="text-xl md:text-2xl text-[#b1b1b1] mb-6">
          Match Your Skills to Top Job Opportunities with AI.
        </h2>
        <p className="text-base md:text-lg text-gray-300 mb-6">
          “Our platform helps job seekers by matching resumes with relevant job
          roles, offering real-time job alerts, personalized skill gap analysis,
          and connecting users with recruiters to boost career growth.”
        </p>
        <motion.button
          onClick={handleButtonClick} // Handle button click based on session state
          className="px-6 py-3 bg-gradient-to-r from-[#154abe] via-[#1a8ad3] to-[#48b1ea] rounded-full text-white font-semibold shadow-lg hover:bg-[#2bbf77] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-opacity-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {session ? "Go to Dashboard" : "Register"} {/* Button text based on session */}
        </motion.button>
      </div>

      {/* Right Side Content */}
      <div className="md:w-1/4 flex flex-col space-y-4">
        {/* Instant Approval */}
        <div className="bg-gradient-to-tr from-[#154abe] via-[#1a8ad3] to-[#48b1ea] p-6 rounded-lg shadow-lg text-white flex items-center space-x-4 cursor-pointer">
          <FaRocket className="text-2xl" />
          <div>
            <h3 className="text-lg font-semibold mb-1">Instant Approval</h3>
            <p>Quick and easy loan approvals.</p>
          </div>
        </div>

        {/* Resume Review */}
        <div className="bg-gradient-to-tr from-[#154abe] via-[#1a8ad3] to-[#48b1ea] p-6 rounded-lg shadow-lg text-white flex items-center space-x-4 cursor-pointer">
          <FaRegFileAlt className="text-2xl" />
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Upload & Review Resume
            </h3>
            <p>Upload your resume and get feedback to improve your chances.</p>
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-gradient-to-tr from-[#154abe] via-[#1a8ad3] to-[#48b1ea] p-6 rounded-lg shadow-lg text-white flex items-center space-x-4 cursor-pointer">
          <FaRoad className="text-2xl" />
          <div>
            <h3 className="text-lg font-semibold mb-1">Get Your Roadmap</h3>
            <p>Receive a personalized financial roadmap to guide you.</p>
          </div>
        </div>

        {/* Compatibility Score */}
        <div className="bg-gradient-to-tr from-[#154abe] via-[#1a8ad3] to-[#48b1ea] p-6 rounded-lg shadow-lg text-white flex items-center space-x-4 cursor-pointer">
          <FaHeartbeat className="text-2xl" />
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Check Compatibility Score
            </h3>
            <p>Evaluate your loan eligibility with our compatibility score.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
