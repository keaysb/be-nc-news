To connect the 2 databases locally:

1. Create 2 .env files (one for the database which will hold test data and another for the database which will hold realistic development data) in the highest level of the repository.

2. For the .env file assigned for development data, add the text 'PGDATABASE=nc_news;'. This will be used to connect to one of the databases and will be seeded with the development data.

3. For the .env file assigned for test data, add the text 'PGDATABASE=nc_news_test;'. This will be used to connect to one of the databases and will be seeded with the test data.
