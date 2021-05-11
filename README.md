This is a new version of the blog I've made sometime ago. Now, it uses EJS instead of Handlebars.
To use this repository, follow these steps:

1 - Clone this repository
2 - Install Node.js and MySQL in your computer
3 - Install the npm modules with "npm install"
4 - Create a new schema in MySQL
5 - Open "/db/connect-ion.js" and edit these names:
    a. Change "dbName" to the name of the schema you created;
    b. Change "username" to your username of MySQL;
    c. Change "password" to the password of your user
6 - Save the file and rename him to "connection.js"
7 - Run the application with "node index.js"
8 - Access "localhost" in your browser.