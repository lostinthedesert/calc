import requests
from bs4 import BeautifulSoup
import json
import logging
from time import sleep


logging.basicConfig(filename='/home/cnickm/app/listings.log', level=logging.DEBUG, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

def grab_listings(retries=2, delay=1800):

    for attempt in range(retries):
        try:
            source = requests.get("https://www.azcentral.com/story/sports/tv-listings/2017/11/14/sports-tv-listings-phoenix-sports-on-tonight-sports-on-right-now/864859001/", headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0'})

            source.raise_for_status()
        
            parse_html(source)
            break

        except requests.exceptions.RequestException as e:
            if attempt < retries - 1:
                logging.info(f"Retrying in {delay/60} minutes...")
                sleep(delay)
            logging.error(f"RequestException: {e}")

        except Exception as e:
            logging.error(f"Error: {e}")

def parse_html(source):
    
    soup = BeautifulSoup(source.content, 'html.parser')
    mydivs = soup.find_all(True, {"class": ["gnt_ar_b_p", "gnt_ar_b_mt"]})

    html_string = []
    for element in mydivs:
        html_string.append(element.text)

    with open('../html_list.txt', 'w') as myfile:
        json.dump(html_string[3:-2], myfile)
        myfile.close()

grab_listings()