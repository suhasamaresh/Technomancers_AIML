from flask import Flask, request, jsonify
import PyPDF2
import google.generativeai as genai
import os
import csv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Function to extract text from a PDF resume
def extract_resume_text(pdf_file_path):
    """Extract text from a PDF resume."""
    try:
        with open(pdf_file_path, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            resume_text = ""
            for page in reader.pages:
                resume_text += page.extract_text()
        return resume_text
    except Exception as e:
        print(f"Error extracting resume text: {e}")
        return None

# Function to generate target role using Gemini API
def generate_target_role(resume_text):
    """Generate the target role using Gemini's API."""
    prompt = (
        f"Based on the following resume, generate a concise target role in one or two words.\n\n"
        f"Resume text:\n{resume_text}"
    )
    try:
        # Make sure to use your own API key
        genai.configure(api_key="AIzaSyCyFokeirKYPxmcohRDVZXRDeSEDp5YTfA")  # Replace with your API key
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating target role: {str(e)}")
        return None

# Function to scrape jobs from Naukri
def scrape_jobs_from_naukri(target_role, output_file, job_urls):
    """Scrape jobs from Naukri and save to a CSV file."""
    base_url = f"https://www.naukri.com/{target_role}-jobs"
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    service = Service(r"C:\Users\SharanReddy\Desktop\hackton\venv\Lib\site-packages\seleniumbase\drivers\chromedriver.exe")  # Adjust path to your chromedriver
    driver = webdriver.Chrome(service=service, options=chrome_options)

    driver.get(base_url)
    job_data_list = []

    try:
        job_list_container = driver.find_element(By.CSS_SELECTOR, "#listContainer > div.styles_job-listing-container__OCfZC")
        job_elements = job_list_container.find_elements(By.CSS_SELECTOR, "div.srp-jobtuple-wrapper")

        for job_element in job_elements:
            title = job_element.find_element(By.CSS_SELECTOR, "a.title").text
            job_url = job_element.find_element(By.CSS_SELECTOR, "a.title").get_attribute("href")
            company = job_element.find_element(By.CSS_SELECTOR, "a.comp-name").text
            experience = job_element.find_element(By.CSS_SELECTOR, "span.expwdth").text
            salary = job_element.find_element(By.CSS_SELECTOR, "span.sal-wrap span").text if job_element.find_elements(By.CSS_SELECTOR, "span.sal-wrap span") else "Not disclosed"
            location = job_element.find_element(By.CSS_SELECTOR, "span.locWdth").text

            job_data_list.append({
                "title": title,
                "url": job_url,
                "company": company,
                "experience": experience,
                "salary": salary,
                "location": location
            })

            job_urls.append(job_url)

    except Exception as e:
        print(f"Error scraping Naukri: {e}")
    finally:
        driver.quit()

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'a', encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["title", "company", "experience", "salary", "location", "url"])
        if file.tell() == 0:
            writer.writeheader()
        for job in job_data_list:
            writer.writerow(job)

# Function to calculate compatibility and skill gap
def calculate_compatibility_and_skill_gap(resume_text, job_description):
    try:
        # Prompt for compatibility score
        compatibility_prompt = (
            f"Calculate a compatibility score between the following resume and job description "
            f"on a scale of 0 to 100. Provide only the numerical score.\n\n"
            f"Resume:\n{resume_text}\n\n"
            f"Job Description:\n{job_description}"
        )
        compatibility_response = genai.GenerativeModel("gemini-1.5-flash").generate_content(compatibility_prompt)
        compatibility_score = compatibility_response.text.strip()

        # Prompt for skill gap analysis
        skill_gap_prompt = (
            f"Analyze the following resume against the job description and identify:\n"
            f"- Key strengths of the candidate.\n"
            f"- Gaps in skills or qualifications.\n\n"
            f"Resume:\n{resume_text}\n\n"
            f"Job Description:\n{job_description}"
        )
        skill_gap_response = genai.GenerativeModel("gemini-1.5-flash").generate_content(skill_gap_prompt)
        skill_gap_analysis = skill_gap_response.text.strip()

        # Roadmap to 100% compatibility
        roadmap_prompt = (
            f"Given the compatibility score of {compatibility_score} between the following resume and job description, "
            f"please provide a detailed roadmap on how the candidate can improve their skills to reach 100% compatibility . There should be around 5 points.\n"
            f"The roadmap should include:\n"
            f"- Steps to improve technical and soft skills.\n"
            f"- Resources like courses, books, and websites to follow.\n"
            f"- Estimated time to spend on each area.\n\n"
            f"Resume:\n{resume_text}\n\n"
            f"Job Description:\n{job_description}\n\n"
            f"Current Compatibility Score: {compatibility_score}"
        )
        roadmap_response = genai.GenerativeModel("gemini-1.5-flash").generate_content(roadmap_prompt)
        roadmap_response = roadmap_response.text.strip()

        return compatibility_score, skill_gap_analysis, roadmap_response
    except Exception as e:
        return f"Error in analysis: {e}", "", ""

# Route to handle resume upload and job scraping
@app.route('/api/process_resume', methods=['POST'])
def process_resume():
    """Handle the uploaded resume and process it."""
    file = request.files['resume']
    file_path = os.path.join('uploads', file.filename)
    os.makedirs('uploads', exist_ok=True)
    file.save(file_path)

    resume_text = extract_resume_text(file_path)

    if resume_text:
        target_role = generate_target_role(resume_text)
        if target_role:
            job_postings_file = "static/job_postings.csv"
            job_urls = []
            scrape_jobs_from_naukri(target_role, job_postings_file, job_urls)

            job_listings = []
            with open(job_postings_file, 'r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    job_listings.append(row)

            return jsonify({"success": True, "target_role": target_role, "jobs": job_listings})
        else:
            return jsonify({"success": False, "message": "Failed to generate target role."})
    else:
        return jsonify({"success": False, "message": "Failed to extract resume text."})

# Route to analyze job description and generate a compatibility analysis
@app.route('/api/analyze_job', methods=['POST'])
def analyze_job():
    """Analyze job description with the uploaded resume."""
    try:
        # Check the content type of the request
        if request.content_type == "application/json;odata=verbose":
            # Handle JSON input
            data = request.get_json()
            job_url = data.get("jobUrl")
            resume_text = data.get("resumeText")

            if not job_url or not resume_text:
                return jsonify({"success": False, "message": "Missing job URL or resume text."}), 400
        elif 'resume' in request.files and 'jobUrl' in request.form:
            # Handle FormData input
            resume_file = request.files['resume']
            job_url = request.form['jobUrl']

            # Save the file temporarily
            upload_dir = "uploads"
            os.makedirs(upload_dir, exist_ok=True)
            file_path = os.path.join(upload_dir, resume_file.filename)
            resume_file.save(file_path)

            # Extract text from the uploaded resume
            resume_text = extract_resume_text(file_path)
            if not resume_text:
                return jsonify({"success": False, "message": "Failed to extract text from resume."}), 500

            # Clean up temporary file
            os.remove(file_path)
        else:
            return jsonify({"success": False, "message": "Invalid content type or missing data."}), 400

        # Simulate job description fetching (replace with dynamic fetching)
        job_description = "Example job description fetched from the job URL"

        # Perform compatibility analysis (replace with your actual implementation)
        compatibility_score = 85  # Example value
        skill_gap_analysis = "The candidate lacks experience in React.js."
        roadmap = "1. Learn React.js basics.\n2. Build a React.js project.\n3. Gain experience."

        return jsonify({
            "success": True,
            "compatibility_score": compatibility_score,
            "skill_gap_analysis": skill_gap_analysis,
            "roadmap": roadmap,
        })

    except Exception as e:
        print(f"Error analyzing job: {e}")
        return jsonify({"success": False, "message": "Error analyzing the job.", "error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
