// Register.js
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi2I0I5rEcOZS9nF9llGYc_WIuS7ToU4o",
  authDomain: "idgaf-6a449.firebaseapp.com",
  projectId: "idgaf-6a449",
  storageBucket: "idgaf-6a449.appspot.com",
  messagingSenderId: "804788460561",
  appId: "1:804788460561:web:c9cbceaf17e8d9875325b0",
  measurementId: "G-0RRNER3YV5"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: any) => {
    
    if (resumeUrl === "") {
      alert("Please upload a resume.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          resumeUrl,
        }),
      });
      const result = await response.json();
      if (result) {
        alert("User registered successfully!");
        router.push("/login");
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const storageRef = ref(storage, `resumes/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("Upload progress:", snapshot.bytesTransferred, "/", snapshot.totalBytes);
        },
        (error) => {
          console.error("Upload error:", error); // Inspect errors in the console
          alert("Error uploading resume: " + error.message); // Provide clear feedback
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setResumeUrl(downloadURL); // Confirm successful upload
              console.log("Resume uploaded successfully:", downloadURL); // Log for debugging
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
      
  };

  return (
    <div className="flex justify-center items-center h-full bg-[#0f0f0f] pt-28 pb-10">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0f0f0f] border border-blue-400 p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl text-center mb-6 text-[#60a5fa]">Register</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium mb-2 text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60a5fa] bg-[#2d2d2d] text-white"
          />
          {errors.name && <span className="text-red-500 text-sm">{String(errors.name.message)}</span>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium mb-2 text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60a5fa] bg-[#2d2d2d] text-white"
          />
          {errors.email && <span className="text-red-500 text-sm">{String(errors.email.message)}</span>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-lg font-medium mb-2 text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60a5fa] bg-[#2d2d2d] text-white"
          />
          {errors.password && <span className="text-red-500 text-sm">{String(errors.password.message)}</span>}
        </div>

        {/* Resume Upload Field */}
        <div className="mb-4">
          <label htmlFor="resume" className="block text-lg font-medium mb-2 text-gray-300">Resume (PDF or TXT)</label>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleResumeUpload}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60a5fa] bg-[#2d2d2d] text-white"
          />
          {resumeUrl && <span className="text-green-500">Resume uploaded successfully!</span>}
        </div>

        {/* Tech Stack Field */}
        <div className="mb-4">
          <label htmlFor="techStack" className="block text-lg font-medium mb-2 text-gray-300">Tech Stack</label>
          <input
            type="text"
            id="techStack"
            {...register("techStack", { required: "Tech Stack is required" })}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60a5fa] bg-[#2d2d2d] text-white"
          />
          {errors.techStack && <span className="text-red-500 text-sm">{String(errors.techStack.message)}</span>}
        </div>

        {/* Interests Field */}
        <div className="mb-6">
          <label htmlFor="interests" className="block text-lg font-medium mb-2 text-gray-300">Interests</label>
          <input
            type="text"
            id="interests"
            {...register("interests", { required: "Interests are required" })}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60a5fa] bg-[#2d2d2d] text-white"
          />
          {errors.interests && <span className="text-red-500 text-sm">{String(errors.interests.message)}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-300 onhover:bg-gradient-to-l from-blue-600 to-blue-300 text-gray-300 py-2 px-4 rounded-md font-semibold hover:bg-[#2f343b] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
