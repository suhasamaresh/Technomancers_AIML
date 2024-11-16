# import os
# import logging
# import csv
# import json
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC

# # Configure logging
# logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
# logger = logging.getLogger()

# # Scraper class
# class JobScraper:
#     def __init__(self, target_role, max_pages):
#         self.target_role = target_role
#         self.max_pages = max_pages
#         self.job_data_list = []
#         self.job_urls = []

#     def setup_driver(self):
#         """Initialize a Selenium WebDriver."""
#         options = Options()
#         options.add_argument("--headless")
#         options.add_argument("--disable-gpu")
#         options.add_argument("--no-sandbox")
#         service = Service(r"C:\Users\SharanReddy\Desktop\hackton\venv\Lib\site-packages\seleniumbase\drivers\chromedriver.exe")
#         driver = webdriver.Chrome(service=service)
#         return driver

#     def scrape_naukri(self):
#         """Scrape Naukri for jobs."""
#         driver = self.setup_driver()
#         try:
#             url = f"https://www.naukri.com/{self.target_role}-jobs"
#             driver.get(url)
#             wait = WebDriverWait(driver, 10)
            
#             for page in range(1, self.max_pages + 1):
#                 logger.info(f"Scraping Naukri page {page} for '{self.target_role}' jobs...")
#                 jobs = wait.until(
#                     EC.presence_of_all_elements_located((By.CLASS_NAME, "jobTuple"))
#                 )

#                 for job in jobs:
#                     try:
#                         title = job.find_element(By.CLASS_NAME, "title").text
#                         company = job.find_element(By.CLASS_NAME, "companyName").text
#                         location = job.find_element(By.CLASS_NAME, "location").text
#                         url = job.find_element(By.CLASS_NAME, "title").get_attribute("href")
                        
#                         self.job_data_list.append({
#                             "title": title,
#                             "company": company,
#                             "location": location,
#                             "url": url,
#                         })
#                         self.job_urls.append(url)
#                     except Exception as e:
#                         logger.warning(f"Error parsing job: {e}")
                
#                 # Go to next page
#                 next_button = driver.find_element(By.CLASS_NAME, "pagination-next")
#                 if next_button.is_enabled():
#                     next_button.click()
#                 else:
#                     break
#         finally:
#             driver.quit()

#     def save_job_data(self, csv_file, json_file):
#         """Save job data to CSV and JSON formats."""
#         # Save to CSV
#         with open(csv_file, "w", encoding="utf-8", newline="") as file:
#             writer = csv.DictWriter(file, fieldnames=self.job_data_list[0].keys())
#             writer.writeheader()
#             writer.writerows(self.job_data_list)
#         logger.info(f"Job data saved to CSV: {csv_file}")

#         # Save to JSON
#         with open(json_file, "w", encoding="utf-8") as file:
#             json.dump(self.job_data_list, file, ensure_ascii=False, indent=4)
#         logger.info(f"Job data saved to JSON: {json_file}")

#     def save_job_urls(self, job_urls_file):
#         """Save job URLs to a file."""
#         with open(job_urls_file, "w") as file:
#             for url in set(self.job_urls):
#                 file.write(url + "\n")
#         logger.info(f"Job URLs saved to: {job_urls_file}")

#     def scrape_jobs(self):
#         """Scrape jobs from all platforms."""
#         self.scrape_naukri()
#         # Add other platform scrapers here (e.g., Indeed, Monster, etc.)

