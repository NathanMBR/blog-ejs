This is a new version of the blog I've made sometime ago. Now, it uses EJS instead of Handlebars, and MySQL instead of MongoDB.
To use this repository, follow these steps:

1 - Clone this repository <br>
2 - Install Node.js and MySQL in your computer <br>
3 - Install the npm modules with "npm install" <br>
4 - Create a new schema in MySQL <br>
5 - Open "/db/connect-ion.js" and edit these names: <br>
    a. Change "dbName" to the name of the schema you created; <br>
    b. Change "username" to your username of MySQL; <br>
    c. Change "password" to the password of your user <br>
6 - Save the file and rename him to "connection.js" <br>
7 - Download Bootstrap 4.1.3 or equivalent and put the "css" and "js" folders inside "public" folder <br>
8 - Run the application with "node index.js" <br>
9 - Access "localhost" in your browser.