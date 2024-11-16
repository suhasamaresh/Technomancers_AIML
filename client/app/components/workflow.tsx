"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll } from "framer-motion";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const Workflow = () => {
  const data: TimelineEntry[] = [
    {
      title: "Step 1: User Profile Creation",
      content: (
        <p>
          Users create a profile by providing their professional details, skills, and career preferences.
        </p>
      ),
    },
    {
      title: "Step 2: Job Data Analysis",
      content: (
        <p>
          The platform analyzes available job postings and matches them with the user's profile using advanced algorithms.
        </p>
      ),
    },
    {
      title: "Step 3: Skill Assessment",
      content: (
        <p>
          Users receive a skill gap analysis report with suggestions to improve their qualifications for better job matches.
        </p>
      ),
    },
    {
      title: "Step 4: Personalized Job Recommendations",
      content: (
        <p>
          The platform generates personalized job recommendations based on the user's skills, experience, and preferences.
        </p>
      ),
    },
    {
      title: "Step 5: Application Tracking",
      content: (
        <p>
          Users can apply directly to recommended jobs and track the status of their applications in real-time.
        </p>
      ),
    },
    {
      title: "Step 6: Career Insights",
      content: (
        <p>
          The app provides career insights, including industry trends, demand for skills, and potential career paths.
        </p>
      ),
    },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height * 1.2]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-[#0a0a0a] font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-white max-w-4xl">
          Workflow of Our Job Analyzer App
        </h2>
        <p className="text-neutral-400 text-sm md:text-base max-w-sm">
          Here's a step-by-step guide to how our job analyzer app helps you find the perfect career opportunities.
        </p>
      </div>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col py-6 md:py-12 gap-6"
          >
            <div className="relative flex flex-col md:flex-row items-start">
              <div className="absolute left-3 w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center mt-1"></div>
              <div className="ml-10 bg-[#0f0f0f] border cursor-pointer border-[#60a5fa] hover:border-blue-400 p-6 rounded-lg shadow-md text-gray-300">
                <h3 className="text-2xl mb-4 font-bold text-white">
                  {item.title}
                </h3>
                {item.content}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent via-gray-500 to-transparent"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-400 via-blue-600 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Workflow;
