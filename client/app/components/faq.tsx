"use client";
import { useState } from "react";

const faqs = [
  {
    question: "How can I create my profile?",
    answer: "You can create your profile by providing your name, email, resume, tech stack, and interests through the profile creation form.",
  },
  {
    question: "How does resume parsing work?",
    answer: "Our app uses advanced algorithms to extract and analyze text from your uploaded resume, identifying key skills, experiences, and qualifications.",
  },
  {
    question: "How are job roles matched to my expertise?",
    answer: "We use AI-powered language models to analyze your resume and match your skills and experiences to relevant job roles.",
  },
  {
    question: "Can the app search for jobs on platforms like LinkedIn and Indeed?",
    answer: "Yes, the app automatically searches for job postings on LinkedIn, Indeed, and other platforms, providing you with tailored job suggestions and application tips.",
  },
  {
    question: "What is the Relevance Score on the dashboard?",
    answer: "The Relevance Score shows how well your profile matches job requirements, highlighting skill gaps and in-demand roles to improve your compatibility.",
  },
  {
    question: "How does the Improvement Roadmap help me?",
    answer: "The Improvement Roadmap offers AI-driven skill gap analysis, project ideas, and learning resources to help you enhance your profile and achieve a 100% job compatibility score.",
  },
  {
    question: "Can I connect with recruiters through the app?",
    answer: "Yes, the app suggests 5 relevant recruiters from LinkedIn and provides tips on how to effectively reach out to them.",
  },
  {
    question: "Does the app provide notifications for job openings?",
    answer: "Yes, you’ll receive real-time notifications for new job openings, application deadlines, and opportunities aligned with your profile.",
  },
  {
    question: "How secure is my personal information?",
    answer: "We prioritize your privacy and security, using encryption and strict data handling practices to protect your information.",
  },
];


const FaqCard = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border hover:border-[#60a5fa] border-gray-600 bg-[#0f0f0f] rounded-xl shadow-sm ">
      <div
        className="flex justify-between items-center p-4 cursor-pointer transition-all duration-500 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-300">Q: {question}</h3>
        <span className="text-xl text-gray-300">{isOpen ? "-" : "+"}</span>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="p-4 text-blue-400">{answer}</p>
      </div>
    </div>
  );
};

export default function Faq() {
  return (
    <div className="bg-[#0a0a0a] lg:pl-28 lg:pr-28 border-b border-gray-600">
      <div className="container mx-auto px-4 py-8">
        <section>
          <h2 className="text-2xl font-bold text-center text-gray-300 mb-6">FAQs</h2>
          <div>
            {faqs.map((faq, index) => (
              <FaqCard key={index} {...faq} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
