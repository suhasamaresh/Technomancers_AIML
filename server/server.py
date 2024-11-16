from flask import Flask, request, render_template, jsonify
import PyPDF2
import google.generativeai as genai
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import csv
import os
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
        genai.configure(api_key="AIzaSyCyFokeirKYPxmcohRDVZXRDeSEDp5YTfA")
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
    service = Service(r"C:\Users\SharanReddy\Desktop\hackton\venv\Lib\site-packages\seleniumbase\drivers\chromedriver.exe")
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


if __name__ == '__main__':
    app.run(debug=True, port=5000)
