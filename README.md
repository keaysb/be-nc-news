# [NC News API 📰](https://nc-news-1ldz.onrender.com)
A RESTful API used as the back-end for [NC News](https://github.com/keaysb/nc-news). By using SQL queries and various frameworks, this API returns specific data requests through the use of endpoints.

**[Hosted Version](https://nc-news-1ldz.onrender.com)**

> * May take a while to load initially
> * [All API endpoints](#api-endpoints)
> * Use this [extension](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en&pli=1) to improve API data readability

## Tech Stack
Main: JavaScript, Node.js, Express.js, PostgreSQL, ElephantSQL, Render

Dev Dependencies: Supertest, Jest, jest-extended, jest-sorted and Pg-Format

## [API Endpoints](https://nc-news-1ldz.onrender.com/api)
**[All API endpoints](https://nc-news-1ldz.onrender.com/api)**

## Running Repository Locally
### Minimum Requirements
Node.js Version 20.9.0

Check your node version by running the following command in your terminal:
```
node --version
```
PostgreSQL - version 14.10

### Step 1: Clone Repository
```
git clone https://github.com/keaysb/nc-news.git
```
### Step 2: Navigate to newly created project directory
```
cd nc-news
```
### Step 3: Install Dependencies
```
npm install
```
### Step 4: Create .env files
In the root folder of the repository you will need to create 2 .env files.

Create a <code>.env.test</code> file in your root directory with the following content:
```
PGDATABASE=nc_news_test
```

Create a <code>.env.development</code> file in your root directory with the following content:
```
PGDATABASE=nc_news
```

### Step 5: Seeding database
Run the following commands to seed database:
```
// Setup Database
npm run setup-dbs

// Seed Database
npm run seed
```

## Testing
To run tests, enter the following command:
```
npm test
```
This command will seed/re-seed <code>nc_news_test</code> database with test data

## Contact Me
keays.b@yahoo.com

[Linkedin](https://www.linkedin.com/in/bill-keays/)