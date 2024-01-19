Summary:
This repository uses various endpoints to access different parts of the linked database and displays them in a particular ways by mainly using SQL queries. Please read through the README.md to understand how to properly use this repository.

Hosted Version: https://nc-news-1ldz.onrender.com

*** The website used to host this API automatically spins down with inactivity so loading the site and it's various pages may take a while. Please be patient.
*** The homepage will show a 404 error. Use the endpoints to access the desired data (use the endpoint /api to see all current endpoints)
*** Currently no front-end so use this extension to format the website in a readable way: https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en&pli=1 


-Using Repository:


Minimum Versions:
This repository was created using Node.js v20.10.0 and PostgreSQL 14.10

--To connect the 2 databases locally:
1. Create 2 .env files (one for the database which will hold test data and another for the database which will hold realistic development data) in the highest level of the repository. One called '.env.development' and another called '.env.test'.

2. For the .env file assigned for development data, add the text 'PGDATABASE=nc_news'. This will be used to connect to one of the databases and will be seeded with the development data.

3. For the .env file assigned for test data, add the text 'PGDATABASE=nc_news_test'. This will be used to connect to one of the databases and will be seeded with the test data.

These are the database names used when creating the databases when running setup.sql


--How to clone:
Clone this repository to your local machine to use it.
1. You should see a green button with '<> Code' on it. Select it and copy the 'HTTPS' Web URL or alternatively, copy this link: https://github.com/keaysb/be-nc-news.git

2. Open your terminal and clone this repository preferably in a new folder by doing 'git clone <url>' where <url> is the repository you have copied

3. Open this repository in your desired code editor (VSCode is my editor of choice)


--Installing Dependencies
1. To install dependencies, in your terminal run 'npm install'


--Seeding Local Database
1. Run 'npm run setup-dbs' to setup the databases that will be used in this repository

2. Run 'npm run seed' to seed the database nc_news with development data


--Run tests
1. Run 'npm test' or 'npm t' to run the tests used in this repository

2. Running this will automatically seed nc_news_test with test data which was used for testing

If you are having any issues running this repository, email me at keays.b@yahoo.com


