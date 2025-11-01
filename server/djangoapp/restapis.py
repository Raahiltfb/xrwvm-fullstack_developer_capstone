# ✅ Imports
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Backend and sentiment analyzer URLs from environment variables
backend_url = os.getenv('backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv('sentiment_analyzer_url', default="http://localhost:5050/")

# ✅ Function to make GET requests to backend
def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"
    request_url = backend_url + endpoint + "?" + params
    print("GET from {} ".format(request_url))
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as e:
        print("Network exception occurred:", e)


# ✅ Function to analyze review sentiments (as per the given instructions)
def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    print(f"GET {request_url}")
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")


# ✅ Function to post a review to backend
def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    print(f"POST to {request_url}")
    try:
        response = requests.post(request_url, json=data_dict)
        print(response.json())  # print output for debugging
        return response.json()
    except Exception as e:
        print("Network exception occurred:", e)
