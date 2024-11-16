"use client";
import React, { useState } from "react";

const ResumeUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null); // To store job data
  const [resumeText, setResumeText] = useState<string | null>(null); // To store extracted resume text
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobLimit, setJobLimit] = useState<number>(10); // Limit number of jobs displayed
  const [selectedJobUrl, setSelectedJobUrl] = useState<string | null>(null); // Track selected job for summarization
  const [summaryData, setSummaryData] = useState<any>(null); // Store summary response
  const [error, setError] = useState<string | null>(null); // Error state
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false); // Track summarizing status
  const [activeTab, setActiveTab] = useState<string>("jobs"); // Switch between 'jobs' and 'summary'

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setIsLoading(true);
    setError(null); // Reset error before starting upload
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/api/process_resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.jobs); // Store job data
        setResumeText(data.resume_text); // Store resume text extracted from the file
      } else {
        setError("Error uploading file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load more jobs when the user clicks 'Show More'
  const loadMoreJobs = () => {
    if (jobLimit < response.length) {
      setJobLimit((prevLimit) => prevLimit + 10); // Load 10 more jobs
    }
  };

  // Handle job summarization
  const handleSummarize = async (jobUrl: string) => {
    console.log("Summarizing job:", jobUrl);

    if (!selectedFile) {
      setError("Resume file is not available. Please upload a resume first.");
      return;
    }

    setSelectedJobUrl(jobUrl); // Store the selected job URL
    setSummaryData(null); // Reset summary data
    setIsSummarizing(true); // Indicate summarizing state

    const formData = new FormData();
    console.log("Selected file:", selectedFile);
    console.log("Job URL:", jobUrl);
    formData.append("resume", selectedFile); // Attach the resume file
    formData.append("jobUrl", jobUrl); // Attach the job URL

    try {
      const response = await fetch("http://localhost:5000/api/analyze_job", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSummaryData(data); // Store the response data
        setActiveTab("summary"); // Switch to summary tab
      } else {
        console.error("Error response:", await response.text());
        setError("Error summarizing job. Please try again.");
      }
    } catch (error) {
      console.error("Error summarizing job:", error);
      setError("Error summarizing job. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // Function to switch tabs between jobs and summary
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
  };

  // Render the roadmap as a tree
  const renderRoadmapTree = (roadmap: string) => {
    return roadmap
      .split("\n")
      .map((line, index) => (
        <div key={index} className="pl-4">
          {line}
        </div>
      ));
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col items-center py-12 pt-28 pl-10 pr-10">
      <h1 className="text-3xl font-semibold mb-8">Upload Your Resume</h1>

      <div className="flex flex-col items-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="bg-gray-800 text-white py-2 px-4 rounded-md mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 mb-8"
        >
          Upload Resume
        </button>
      </div>

      {isLoading ? (
        <div className="text-lg">Processing your data, please wait...</div>
      ) : error ? (
        <div className="text-red-500 text-lg">{error}</div>
      ) : response ? (
        <div>
          {/* Tabs for job listing and summarization */}
          <div className="flex mb-6">
            <button
              onClick={() => handleTabSwitch("jobs")}
              className={`py-2 px-6 rounded-md mr-4 ${activeTab === "jobs" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              Job Listings
            </button>
            <button
              onClick={() => handleTabSwitch("summary")}
              className={`py-2 px-6 rounded-md ${activeTab === "summary" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              Summary
            </button>
          </div>

          {/* Job Listings Tab */}
          {activeTab === "jobs" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {response.slice(0, jobLimit).map((job: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-blue-400"
                  >
                    <h3 className="text-xl font-bold text-blue-400">{job.title}</h3>
                    <p className="text-sm text-gray-400">Company: {job.company}</p>
                    <p className="text-sm text-gray-400">Location: {job.location}</p>
                    <p className="mt-2 text-gray-300">Experience: {job.experience}</p>
                    <p className="mt-2 text-gray-300">Salary: {job.salary}</p>
                    <div className="mt-4">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white py-2 px-4 rounded-lg text-center w-full hover:bg-green-700 mb-2"
                      >
                        Apply
                      </a>
                      <button
                        onClick={() => handleSummarize(job.url)}
                        className="bg-yellow-500 text-white py-2 mt-4 px-4 rounded-lg text-center w-full hover:bg-yellow-600"
                      >
                        Summarize
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {jobLimit < response.length && (
                <button
                  onClick={loadMoreJobs}
                  className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700"
                >
                  Show More
                </button>
              )}
            </div>
          )}

          {/* Job Summary Tab */}
          {activeTab === "summary" && summaryData && selectedJobUrl && (
            <div className="mt-12 p-6 bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-yellow-500">
                Job Summary for {selectedJobUrl}
              </h2>
              <p className="mt-4 text-gray-300">Compatibility Score:{summaryData.compatibility_score}</p>
              <h3 className="mt-4 text-xl font-semibold text-yellow-500">Steps to take / RoadMap:</h3>
              <div className="mt-4 text-gray-300">{renderRoadmapTree(summaryData.roadmap)}</div>
            </div>
          )}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ResumeUploadPage;
