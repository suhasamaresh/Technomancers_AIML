from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
chrome_options = Options()
chrome_options.add_argument("--headless")  
chrome_options.add_argument("--start-maximized")
service = Service(r"C:\Users\SharanReddy\Desktop\hackton\venv\Lib\site-packages\seleniumbase\drivers\chromedriver.exe")
driver = webdriver.Chrome(service=service)

base_url = "https://www.naukri.com/cloud-engineer-jobs"
driver.get(base_url)
driver.implicitly_wait(10)

job_data_list = []
page_count = 0 
max_pages = 3 

try:
    while page_count < max_pages:
      
        try:
            job_list_container = driver.find_element(By.CSS_SELECTOR, "#listContainer > div.styles_job-listing-container__OCfZC")
            job_elements = job_list_container.find_elements(By.CSS_SELECTOR, "div.srp-jobtuple-wrapper")

            for job_element in job_elements:
                try:
                    title = job_element.find_element(By.CSS_SELECTOR, "a.title").text
                    job_url = job_element.find_element(By.CSS_SELECTOR, "a.title").get_attribute("href")
                    company = job_element.find_element(By.CSS_SELECTOR, "a.comp-name").text
                    experience = job_element.find_element(By.CSS_SELECTOR, "span.expwdth").text
                    salary = (
                        job_element.find_element(By.CSS_SELECTOR, "span.sal-wrap span").text
                        if job_element.find_elements(By.CSS_SELECTOR, "span.sal-wrap span")
                        else "Not disclosed"
                    )
                    location = job_element.find_element(By.CSS_SELECTOR, "span.locWdth").text

                    job_data_list.append({
                        "title": title,
                        "url": job_url,
                        "company": company,
                        "experience": experience,
                        "salary": salary,
                        "location": location
                    })
                except Exception as e:
                    print(f"Error extracting job card details: {e}")

        except Exception as e:
            print(f"Error locating job container: {e}")

        try:
            pagination_container = driver.find_element(By.CSS_SELECTOR, "#lastCompMark > div.styles_pages__v1rAK")
            next_page_link = pagination_container.find_element(By.CSS_SELECTOR, "a.styles_selected__j3uvq + a")
            next_page_url = next_page_link.get_attribute("href")
            driver.get(next_page_url)
            time.sleep(3) 
            page_count += 1  
        except Exception as e:
            print("No more pages to navigate or error navigating to the next page.")
            break 

except Exception as e:
    print(f"Unexpected error: {e}")

driver.quit()


print(f"Collected {len(job_data_list)} job postings:")
for job in job_data_list:
    print(job)