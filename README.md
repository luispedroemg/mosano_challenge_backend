# Mosano Challenge Backend
---
## Requirements
Node.js
###
## Install
    $ git clone https://github.com/luispedroemg/mosano_challenge_backend.git
    $ cd mosano_challenge_backend
    $ npm install
## Configure app
Create .env file with following contents in the root dir of the app:

    DB_URI=<URI for a mongoDB connection>
    API_USERNAME=<api_username>
    API_PASSWORD=<api_password>
    
Replace the params between '<>' with the desired values.
 
You need a valid MongoDb URI such as:

    mongodb+srv://<mongo_db_user>:<mongo_db_password>@mosanochallengecluster.mfr5t.mongodb.net/<mongo_db_database>?retryWrites=true&w=majority```

## Running the server
    $ npm start
    
## Tests
    $ npm test