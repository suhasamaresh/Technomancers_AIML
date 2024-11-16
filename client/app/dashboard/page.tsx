"use client"; // Ensure this is a client-side component

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Assuming ConvertDate is a functional component
const ConvertDate = ({ date }: { date: string }) => {
  const formattedDate = new Date(date).toLocaleString();
  return <span>{formattedDate}</span>;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data only once the session and email are available
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        const response = await fetch(`/api/getparticularuser?email=${session.user.email}`, {
          method: "GET",
        });

        const data = await response.json();
        if (data.user) {
          setUserData(data.user); // Set user data in state
        } else {
          // Handle case where no user is found or an error occurred
          console.error("User not found or error fetching data.");
        }
      };

      fetchUserData();
    }
  }, [session?.user?.email]); // Trigger this effect only when the session's email changes

  // Handle change in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/getparticularuser?email=${session?.user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user.email,
          name: userData.name,
          resumeUrl: userData.resumeUrl,
          techStack: userData.techStack,
          interests: userData.interests,
        }),
      });

      const result = await response.json();
      if (result.user) {
        alert("User data updated successfully!");
        setIsEditing(false); // Stop editing mode after success
      } else {
        alert("Failed to update data.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("An error occurred while updating data.");
    }
  };

  // Check if the session is still loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f0f] text-white">
        <div className="text-center">
          <p className="mb-4">Fetching your data might take some time...</p>
          <div className="animate-pulse bg-white h-2 w-16 mx-auto rounded-full"></div>
        </div>
      </div>
    );
  }

  // If no session, user might not be logged in
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f0f] text-white">
        <p>You need to log in to access this page.</p>
      </div>
    );
  }

  // If no user data is found yet, show loading state
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f0f] text-white">
        <div className="text-center">
          <p className="mb-4">Fetching your data might take some time...</p>
          <div className="animate-pulse bg-white h-2 w-16 mx-auto rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8 overflow pt-24">
      <h1 className="text-3xl font-semibold mb-6 text-center text-[#60a5fa]">Dashboard</h1>
      <p className="text-lg mb-4 text-center">Welcome, {session.user?.name}</p>
      <p className="text-lg mb-8 text-center">Your email: {session.user?.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 border border-[#60a5fa]">
          <p className="font-semibold text-xl mb-2 text-[#60a5fa]">Name</p>
          <p className="text-lg">{userData.name}</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg transition-all duration-300 border border-[#60a5fa] hover:scale-105 overflow-hidden">
          <p className="font-semibold text-xl mb-2 text-[#60a5fa]">Resume URL</p>
          <p className="text-lg">{userData.resumeUrl}</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg transition-all duration-300 border border-[#60a5fa] hover:scale-105">
          <p className="font-semibold text-xl mb-2 text-[#60a5fa]">Tech Stack</p>
          <p className="text-lg">{userData.techStack}</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg transition-all duration-300 border border-[#60a5fa] hover:scale-105">
          <p className="font-semibold text-xl mb-2 text-[#60a5fa]">Interests</p>
          <p className="text-lg">{userData.interests}</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg transition-all duration-300 border border-[#60a5fa] hover:scale-105 col-span-2">
          <p className="font-semibold text-xl mb-2 text-[#60a5fa]">Posted on</p>
          <p className="text-lg">
            <b><ConvertDate date={userData.dateTime} /></b>
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-6">
            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
              <label className="block text-sm font-semibold mb-2 text-[#00bcd4]">Name:</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full p-3 bg-[#2a2a2a] rounded text-white focus:outline-none border-2 border-[#00bcd4] focus:border-[#00bcd4]"
              />
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
              <label className="block text-sm font-semibold mb-2 text-[#00bcd4]">Resume URL:</label>
              <input
                type="text"
                name="resumeUrl"
                value={userData.resumeUrl}
                onChange={handleChange}
                className="w-full p-3 bg-[#2a2a2a] rounded text-white focus:outline-none border-2 border-[#00bcd4] focus:border-[#00bcd4]"
              />
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
              <label className="block text-sm font-semibold mb-2 text-[#00bcd4]">Tech Stack:</label>
              <input
                type="text"
                name="techStack"
                value={userData.techStack}
                onChange={handleChange}
                className="w-full p-3 bg-[#2a2a2a] rounded text-white focus:outline-none border-2 border-[#00bcd4] focus:border-[#00bcd4]"
              />
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
              <label className="block text-sm font-semibold mb-2 text-[#00bcd4]">Interests:</label>
              <input
                type="text"
                name="interests"
                value={userData.interests}
                onChange={handleChange}
                className="w-full p-3 bg-[#2a2a2a] rounded text-white focus:outline-none border-2 border-[#00bcd4] focus:border-[#00bcd4]"
              />
            </div>

            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all mr-3"
          >
            Edit Profile
          </button>
          <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 "
        >
          Logout
        </button>
        </div>
        )}
      </div>
    </div>
  );
}
