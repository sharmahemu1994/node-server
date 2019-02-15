# Assignment 1
## To create local ssl cetificate for https server
	openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
## Hello World API
### The NodeJS Master Class - Homework Assignment #1
	Simple "Hello World" API - When posted to /hello, user will recieve JSON response "hello" on http port 3000 and https port 3001.
	If not posted to /hello then response will load a 404 template page

# AlterNLU - Open Source NLU Engine

AlterNLU is an open source tool for building chatbot and AI assistant. It gives the developer a minimal approach to build an assistant or bot in production environment.

It converts natural language to structured data. Eg:

Input:
```
{"text": "i want few covers for my mobile and pillows. and two bed sheet"}
```

Output:
```
{
  "intent": "search_product",
  "confidence": "0.9999974",
  "entities": [
    {
      "value": "bedsheet",
      "category": "product_type"
    },
    {
      "value": "Mobile cover",
      "category": "product_type"
    },
    {
      "value": "pillow covers",
      "category": "product_type"
    }
  ]
}
```

## Getting Started -

Once AlterNLU is set up [See Setting Up](#setting-Up--), you can try it out in 4 simple steps.

* Get Training Data. [Recommended : Use Kontiki Console](https://yarnpkg.com/lang/en/docs/install/#mac-stable)

* Run AlterNLU Engine.
    ```
    python3 server.py
    ```
* Rest API training.
    ```
    http://<ip_address>:5001/train
    Method : POST
    Accept / Content_type : application/json
    Data : training_data file from Kontiki Platform.
    ```
    ```
    curl -H "Content-Type: application/json" --data @<file path> http://localhost:5001/train
    ```
* Rest API parse query.
    ```
	http://<ip_address>:5001/parse
	Method : POST
	Accept / Content_type : application/json
	Data : {"text": "<your_query>"}
    ```

## Continuous Deployment - 

Latest Model will be deployed automatically once training get completed and ready for serving.


## Setting Up -

* Install Python3 & pip
    ```
    apt-get update

    apt-get install python3.6

    apt install python3-pip
    ```
* Setup Virtual Environment
    ```
    pip3 install virtualenv

    virtualenv nlu

    cd nlu

    source bin/activate
    ```
* Install AlterNLU
    ```
    git clone https://github.com/Kontikilabs/alter-nlu.git

    cd alter-nlu

    python3 setup.py install
    ```
* Run Server
    ```
    python3 server.py
    ```
