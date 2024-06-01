import requests
from bs4 import BeautifulSoup
import json

try:
    x = requests.get("https://www.azcentral.com/story/sports/tv-listings/2017/11/14/sports-tv-listings-phoenix-sports-on-tonight-sports-on-right-now/864859001/", headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0'})

    soup = BeautifulSoup(x.content, 'html.parser')

    mydivs = soup.find_all(True, {"class": ["gnt_ar_b_p", "gnt_ar_b_mt"]})


    html_string = []
    for element in mydivs:
        html_string.append(element.text)

    with open('../html_list.txt', 'w') as myfile:
        json.dump(html_string[3:-2], myfile)
        myfile.close()
    
    print("TV listings updated successfully")

except Exception as e:
    print(f"There was an error gathering TV listings: {e}")