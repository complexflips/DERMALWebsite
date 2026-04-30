README

PROJECT TITLE:
DERMAL Website

PROBLEM STATEMENT:
Proper dermatological care is often difficult and expensive to acquire. To assist with this, over the final year of my master’s degree I made a classification neural network called Dermatology Enhanced by Recognition and Machine Aided Learning (DERMAL). This project is a website to host that neural network and allow people to access preliminary dermatological screening free of charge.
FEATURE LIST:
Form to take user image and symptoms
Able to send user data to the backend, where a saved instance of the DERMAL model can make a prediction based on the user input data
LIBRARIES USED:
See requirements.txt
GUIDE TO RUN:
Prerequisites: python 3.11 installed, tensorflow is not supported on the latest versions of python
Unpack zip file
Open command line window
In the command line navigate to the folder where you unpacked your zip file: “cd “[filepath]””
Create a python virtual environment: “python3.11 -m venv [your venv name here]”
Activate virtual environment: “[your venv]\Scripts\activate”
Install packages in requirements.txt: “pip install -r requirements.txt”
While still in active virtual environment navigate to dermalwebsitedjango folder: “cd dermalwebsitedjango”
Run the Django server: “python manage.py runserver”
Open another command line window
Navigate to dermalwebsitereact folder: “cd “[filepath]\ dermalwebsitedjango””
Run “npm start”
The DERMAL website is now up and running, navigate to http://localhost:3000/ in a browser of your choice and you should see the main website application
