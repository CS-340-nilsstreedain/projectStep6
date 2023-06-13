/**
 * @file server.js
 * @brief This file implements a server using Express.js framework to handle HTTP requests and interact with a database.
 * The server provides various routes for different website pages and performs CRUD operations on the database tables.
 * Author: Nils Streedain (https://github.com/nilsstreedain)
 */

// Import required libraries and dependencies
const express = require('express');
const exphbs = require('express-handlebars');

// Database connector module
var db = require('./db-connector')

// Define port number from environment variables, or use 6784 as default
const PORT = process.env.PORT || 6784;

// Define website pages and their routes
const pages = [
	{title: 'Home', url: '/'},
	{title: 'Customers', url: '/customers'},
	{title: 'Orders', url: '/orders'},
	{title: 'OrderBooks', url: '/orderbooks'},
	{title: 'Books', url: '/books'},
	{title: 'BookGenres', url: '/bookgenres'},
	{title: 'Genres', url: '/genres'}
];

// Define foreign key and key information for database tables
const IDs = {
    'Customers': {
        "keys": ['customerID'],
        "foriegnKeys": [{"name": "favoriteGenre", "key": "genreID", "refColumn": "name"}]
    },
    'Orders': {
        "keys": ['orderID'],
        "foriegnKeys": [{"key": "customerID", "name": "customerID", "refColumn": "name"}]
    },
    'OrderBooks': {
        "keys": [],
        "foriegnKeys": [
            {"key": "orderID", "name": "orderID", "refColumn": "orderID"},
            {"key": "bookID", "name": "bookID", "refColumn": "title"}
        ]
    },
    'Books': {
        "keys": ['bookID'],
        "foriegnKeys": []
    },
    'BookGenres': {
        "keys": [],
        "foriegnKeys": [
            {"key": "bookID", "name": "bookID", "refColumn": "title"},
            {"key": "genreID", "name": "genreID", "refColumn": "name"}
        ]
    },
    'Genres': {
        "keys": ['genreID'],
        "foriegnKeys": []
    }
};

// Initialize an Express application
const app = express();

// Initialize an instance of express-handlebars
const hbs = exphbs.create({});

// Register handlebars helper function for checking equality
hbs.handlebars.registerHelper('isEqual', function(a, b, options) {
    // Check if a is equal to b and return the appropriate template block
    return a === b ? options.fn(this) : options.inverse(this);
});

// Register handlebars helper function for retrieving entry keys
hbs.handlebars.registerHelper('entryKeys', function(a, b) {
    // Check if the number of keys for the specified entry is 1 and Return the value of the single key
    if (IDs[b].keys.length == 1)
        return a[IDs[b].keys[0]];
    else
        // Return a concatenated string of two foreign keys
        return a[IDs[b].foriegnKeys[0].key] + "_" + a[IDs[b].foriegnKeys[1].key];
});

// Register handlebars helper function for checking if a key is the primary key of an entity
hbs.handlebars.registerHelper('entityKey', function(a, b) {
    // Check if the entity has a single primary key and if it matches the provided key
    if (IDs[a].keys.length === 1 && IDs[a].keys[0] === b)
        // Return true if the key matches the primary key
        return true;
    // Return false if the key doesn't match the primary key or there are multiple primary keys
    return false;
});

// Register handlebars helper function for checking if a key is a multiple choice key
hbs.handlebars.registerHelper('multipleChoice', function(a, b) {
    // Loop through the foreign keys of the specified entity
    for (let i = 0; i < IDs[a].foriegnKeys.length; i++)
        // Check if the name of the foreign key matches the provided key
        if (IDs[a].foriegnKeys[i].name == b)
            // Return true if the key is a multiple choice key
            return true;
    // Return false if the key is not a multiple choice key
    return false;
});

// Register handlebars helper function for looking up and iterating over an array of items
hbs.handlebars.registerHelper('lookupAndEach', function(context, key, options) {
    // Retrieve the array of items from the context using the specified key
    const items = context[key];
    // Initialize an empty string to store the rendered output
    let out = "";

    // Check if the items is an array
    if(Array.isArray(items))
        // Loop through each item in the array and render the block of the template for each item
        for(let i = 0; i < items.length; i++)
            out += options.fn(items[i]);

    // Return the rendered output
    return out;
});


// Set 'hbs' as the templating engine for the Express app
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

// Middleware for parsing JSON bodies from HTTP requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Function to handle database modifying queries (Insert, Update, Delete)
function modQuery(sql, params, res, url) {
    console.log(sql);
    db.pool.query(sql, params, (error, results) => {
        if (error) res.status(500).json({error: error.sqlMessage});
        else res.redirect(url);
    });
}

// Function to render the page with data fetched from the database
function renderPage(res, title, tables, tableResults, error) {
    res.render('table', {
        title: title,
        data: tableResults,
        tables: tables ? tables : "",
        error: error ? error.sqlMessage : "",
        pages
    });
}

// Function to handle SQL statements for Update and Delete operations
const handleSQLStatement = (action, req, res, url, title) => {
    // Retrieve the keys of the request body object
    const keys = Object.keys(req.body);
    // Generate the SQL SET clause by mapping the keys and values of the request body
    const sqlSet = keys.slice(IDs[title].keys.length).map(key => `${key} = '${req.body[key]}'`).join(', ');

    let sqlConditions = "";
    // Check if the entity has a single primary key
    if (IDs[title].keys.length == 1) {
        // Handle SQL conditions for single primary key
        if (action === 'UPDATE')
            sqlConditions = IDs[title].keys[0] + " = " + req.body[IDs[title].keys[0]];
        else if (action === 'DELETE FROM')
            sqlConditions = IDs[title].keys[0] + " = " + req.body.id;
    } else {
        // Handle SQL conditions for multiple primary keys
        if (action === 'UPDATE')
            sqlConditions = IDs[title].foriegnKeys[0].key + " = " + req.body[IDs[title].foriegnKeys[0].key] + " AND " + IDs[title].foriegnKeys[1].key + " = " + req.body[IDs[title].foriegnKeys[1].key];
        else if (action === 'DELETE FROM')
            sqlConditions = IDs[title].foriegnKeys[0].key + " = " + req.body.id.split("_")[0] + " AND " + IDs[title].foriegnKeys[1].key + " = " + req.body.id.split("_")[1];
    }

    // Generate the complete SQL statement
    const sql = `${action} ${title} ${action === 'UPDATE' ? 'SET ' + sqlSet : ''} WHERE ${sqlConditions}`;

    // Call the modQuery function with the SQL statement, transformed values, and response object
    modQuery(sql, Object.values(req.body).toString().split("_").map(Number), res, url);
}

// Create routes for each page
pages.forEach(({title, url}) => {
    if (title == 'Home') {
        // Route for the home page
        app.get(url, (req, res) => {
            // Render the home template with the title and pages data
            res.render('home', {
                title: title,
                pages
            });
        });
    } else {
        // Route for other pages
        app.get(url, (req, res) => {
            // Execute a SQL query to select all data from the specified table
            db.pool.query(`SELECT * FROM ${title}`, (error, tableResults) => {
                if (error)
                    console.log(error.sqlMessage);

                // Query the INFORMATION_SCHEMA to retrieve foreign key information
                db.pool.query(`SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                    WHERE TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`, [title], (error, results) => {

                    // If the table doesn't have foreign keys, render the page without foreign key data
                    if (results.length === 0)
                        return renderPage(res, title, null, tableResults, error);

                    // Retrieve foreign key data for each foreign key reference
                    let foreignKeyPromises = results.map(result => {
                        let foreignTableName = result.REFERENCED_TABLE_NAME;
                        let columnName = result.COLUMN_NAME;

                        // Query the foreign table
                        return new Promise((resolve, reject) => {
                            db.pool.query(`SELECT * FROM ${foreignTableName}`, function(error, foreignTableResults) {
                                if (error) {
                                    reject(error);
                                } else {
                                    // Transform the results into a 2D array
                                    let fks = foreignTableResults.map(row => Object.values(row));
                                    let foreignKeyData = { [columnName]: fks };
                                    resolve(foreignKeyData);
                                }
                            });
                        });
                    });

                    // Retrieve all foreign key data asynchronously
                    Promise.all(foreignKeyPromises)
                        .then(allForeignKeys => {
                            let tables = Object.assign({}, ...allForeignKeys); // Combine all key-value pairs into one object

                            // Format date column if it exists
                            if (tableResults[0].date)
                                for (let i = 0; i < tableResults.length; i++)
                                    if (tableResults[i].date instanceof Date)
                                        tableResults[i].date = tableResults[i].date.toISOString();

                            // Render the page with foreign key data
                            renderPage(res, title, tables, tableResults, error);
                        })
                        .catch(error => console.log(error));
                });
            });
        });
    }
    
    // CREATE
    app.post(url + '/create', (req, res) => {
        // Retrieve the keys and values from the request body
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const sql = `INSERT INTO ${title} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;

        // Execute the modQuery function to perform the SQL insert operation
        modQuery(sql, values, res, url);
    });

    // UPDATE
    app.post(url + '/update', (req, res) => {
        // Handle the SQL update statement for the specified table
        handleSQLStatement('UPDATE', req, res, url, title);
    });

    // DELETE
    app.post(url + '/delete/:id', (req, res) => {
        // Set the id parameter in the request body
        req.body.id = req.params.id;
        // Handle the SQL delete statement for the specified table
        handleSQLStatement('DELETE FROM', req, res, url, title);
    });
});


// SEARCH Books By Genre
app.post('/books/search', (req, res) => {
    // Retrieve the genreID from the request body
    let genreID = req.body.genreID;
    let sql = '';
    let params = [];

    // Check if genreID is provided
    if (genreID) {
        // Wrap the genre name with '%' for SQL's LIKE
        genreID = '%' + genreID + '%';
        sql = `SELECT * FROM Books
            JOIN BookGenres ON Books.bookID = BookGenres.bookID
            JOIN Genres ON BookGenres.genreID = Genres.genreID
            WHERE Genres.name LIKE ?`;
        params = [genreID];
    } else {
        sql = `SELECT * FROM Books`;
    }

    // Execute the SQL query with the provided parameters
    db.pool.query(sql, [genreID], (error, results) => {
        if (error)
            res.status(500).json({ error: error.sqlMessage });
        else
            res.json(results);
    });
});

// SEARCH Customers By Name
app.post('/customers/search', (req, res) => {
    // Retrieve the name from the request body
    let name = req.body.name;
    let sql = '';
    let params = [];

    // Check if name is provided
    if (name) {
        // Wrap the name with '%' for SQL's LIKE
        name = '%' + name + '%';
        sql = `SELECT * FROM Customers
            WHERE Customers.name LIKE ?`;
        params = [name];
    } else {
        sql = `SELECT * FROM Customers`;
    }

    // Execute the SQL query with the provided parameters
    db.pool.query(sql, [name], (error, results) => {
        if (error)
            res.status(500).json({ error: error.sqlMessage });
        else
            res.json(results);
    });
});

// Start the server and listen on the specified port
app.listen(PORT, function (err) {
    if (err) throw err;
    console.log(`Server running on port ${PORT}`);
});
