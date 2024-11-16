"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "./ui/lamp";
import { WobbleCard } from "./ui/wobblecard";
import { useRouter } from "next/navigation";

export function LampDemo() {
  return (
    <div className="bg-[#0a0a0a]">
      {/* Lamp Section with adjusted height */}
      <LampContainer>
        {/* Company Name */}
        <motion.h1
          initial={{ opacity: 0.5, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-2 bg-clip-text text-center text-3xl font-semibold tracking-tight text-transparent md:text-5xl"
        >
          CareerConnect
        </motion.h1>
        {/* Tagline */}
        <motion.h2
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-4 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Empowering Your Career <br /> with AI-Driven Insights
        </motion.h2>
      </LampContainer>
      {/* Cards Section */}
      <WobbleCardDemo />
    </div>
  );
}

export function WobbleCardDemo() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full ">
      {/* Resume Review Card */}
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full cursor-pointer bg-gradient-to-br from-gray-800 to-gray-600 min-h-[400px] lg:min-h-[300px] rounded-lg shadow-lg"
        className=""
        redirect="/joblistings"
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Upload and Review Resumes
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            Upload your resume to get AI-powered feedback and insights to make it stand out.
          </p>
        </div>
        <Image
          src="/resume-review.svg" // Replace with an appropriate image
          width={500}
          height={500}
          alt="Resume review demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>

      {/* Roadmap Generation Card */}
      <WobbleCard
        containerClassName="col-span-1 min-h-[300px] cursor-pointer bg-gradient-to-br from-gray-700 to-gray-500 rounded-lg shadow-lg"
        className=""
        redirect="/jobanalysis"
      >
        <div className="max-w-80">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Personalized Career Roadmaps
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            Get tailored roadmaps to achieve your career goals, step by step.
          </p>
        </div>
        <Image
          src="/roadmap.svg" // Replace with an appropriate image
          width={500}
          height={500}
          alt="Roadmap generation demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>

      {/* Compatibility Score Card */}
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-3 cursor-pointer bg-gradient-to-br from-gray-900 to-gray-700 min-h-[400px] lg:min-h-[400px] xl:min-h-[300px] rounded-lg shadow-lg"
        className=""
        redirect="/compatibility-score"
      >
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Assess Job Compatibility
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Discover how well you match with potential roles based on your skills and interests.
          </p>
        </div>
        <Image
          src="/compatibility-score.svg" // Replace with an appropriate image
          width={500}
          height={500}
          alt="Compatibility score demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
