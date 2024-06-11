import requests
import json
import logging
from time import sleep

logging.basicConfig(filename='/home/cnickm/app/annex_log.log', level=logging.DEBUG, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

def send_request(zip_code, retries=3, delay=10):
    for attempt in range(retries):
        try:
            zip_code = str(zip_code)
            api_request = requests.get("https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode="+zip_code+"&distance=5&API_KEY=D8C5EFCD-6CD6-454A-A622-829877E67B9B")
            
            api_request.raise_for_status()
            content = api_request.content.decode('utf-8')
            
            logging.debug(f"Raw response content: {content}")  # Debugging statement
            if not content.strip():  # Check if the response is empty or whitespace-only
                raise ValueError("Received empty or whitespace-only response.")

            json_response = json.loads(api_request.content)
                
            date = json_response[0]['DateObserved']
            time = json_response[0]['HourObserved']
            city = json_response[0]['ReportingArea']
            state = json_response[0]['StateCode']
            aqi = json_response[1]['AQI']
            category = json_response[1]['Category']['Name']
            ozone = json_response[0]['AQI']
            ozone_category = json_response[0]['Category']['Name']

            break
        except requests.exceptions.RequestException as e:
            logging.error(f"RequestException: {e}")
            if attempt < retries - 1:
                logging.info(f"Retrying in {delay} seconds...")
                sleep(delay)
        except json.JSONDecodeError as e:
            logging.error(f"JSONDecodeError: {e}")
            logging.error(f"Failed content: {content}")
            break
        except Exception as e:
            logging.error(f"Error: {e}")
    
    with open("../aqi2.csv", "a") as f:
        f.write(f"\n{date},{time},{city},{state},{aqi},{category},{ozone},{ozone_category}")
        f.close()

send_request(85013)
