import requests
import json



def send_request(zip_code):
    zip_code = str(zip_code)
    api_request = requests.get("https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode="+zip_code+"&distance=5&API_KEY=D8C5EFCD-6CD6-454A-A622-829877E67B9B")
    json_response = json.loads(api_request.content)
    print(json_response)
    date = json_response[0]['DateObserved']
    time = json_response[0]['HourObserved']
    city = json_response[0]['ReportingArea']
    state = json_response[0]['StateCode']
    aqi = json_response[1]['AQI']
    category = json_response[1]['Category']['Name']

    with open("../aqi2.csv", "a") as f:
        f.write(f"\n{date},{time},{city},{state},{aqi},{category}")
        f.close()

send_request(85013)
