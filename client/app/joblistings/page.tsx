"use client";

import React, { useState } from 'react';

const ResumeUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobLimit, setJobLimit] = useState<number>(10); // State to limit the number of jobs displayed

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const res = await fetch('http://localhost:5000/api/process_resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle loading more jobs
  const loadMoreJobs = () => {
    setJobLimit((prevLimit) => prevLimit + 10); // Load 10 more jobs
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
      ) : response ? (
        <div>
          {/* Display jobs in cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {response.jobs.slice(0, jobLimit).map((job: any, index: number) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-blue-400">
                <h3 className="text-xl font-bold text-blue-400">{job.title}</h3>
                <p className="text-sm text-gray-400">Company: {job.company}</p>
                <p className="text-sm text-gray-400">Location: {job.location}</p>
                <p className="mt-2 text-gray-300">Experience: {job.experience}</p>
                <p className="mt-2 text-gray-300">Salary: {job.salary}</p>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-lg text-center w-full hover:bg-green-700"
                >
                  Apply
                </a>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {jobLimit < response.jobs.length && (
            <button
              onClick={loadMoreJobs}
              className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700"
            >
              Show More
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ResumeUploadPage;
