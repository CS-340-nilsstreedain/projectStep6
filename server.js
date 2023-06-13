const express = require('express');
const exphbs = require('express-handlebars');
var db = require('./db-connector')

const PORT = process.env.PORT || 6784;
const pages = [
	{title: 'Home', url: '/'},
	{title: 'Customers', url: '/customers'},
	{title: 'Orders', url: '/orders'},
	{title: 'OrderBooks', url: '/orderbooks'},
	{title: 'Books', url: '/books'},
	{title: 'BookGenres', url: '/bookgenres'},
	{title: 'Genres', url: '/genres'}
];

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

// Create an Express app
const app = express();

// Register custom helper for equality comparison
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('isEqual', function(a, b, options) {
	return a === b ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('entryKeys', function(a, b) {
    if (IDs[b].keys.length == 1)
        return a[IDs[b].keys[0]];
    else
        return a[IDs[b].foriegnKeys[0].key] + "_" + a[IDs[b].foriegnKeys[1].key];
});

hbs.handlebars.registerHelper('entityKey', function(a, b) {
	if (IDs[a].keys.length === 1 && IDs[a].keys[0] === b)
		return true;
	return false;
});

hbs.handlebars.registerHelper('multipleChoice', function(a, b) {
    for (let i = 0; i < IDs[a].foriegnKeys.length; i++)
        if (IDs[a].foriegnKeys[i].name == b)
            return true;
    return false;
});

hbs.handlebars.registerHelper('lookupAndEach', function(context, key, options) {
    const items = context[key];
    let out = "";

    if(Array.isArray(items))
        for(let i = 0; i < items.length; i++)
            out += options.fn(items[i]);

    return out;
});

// Configure express-handlebars
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.static('public'));

// Function to handle database modifying queries
function modQuery(sql, params, res, url) {
    db.pool.query(sql, params, (error, results) => {
        if (error) res.status(500).json({error: error.sqlMessage});
        else res.redirect(url);
    });
}

function renderPage(res, title, tables, tableResults, error) {
    res.render('table', {
        title: title,
        data: tableResults,
        tables: tables ? tables : "",
        error: error ? error.sqlMessage : "",
        pages
    });
}

// Function to handle SQL statements for Update and Delete
const handleSQLStatement = (action, req, res, url, title) => {
    const keys = Object.keys(req.body);
    const sqlSet = keys.slice(IDs[title].keys.length).map(key => `${key} = '${req.body[key]}'`).join(', ');
    
    let sqlConditions = "";
    if (IDs[title].keys.length == 1)
        sqlConditions = tableIDs[0] + " = ?";
    else
        sqlConditions = IDs[title].foriegnKeys[0].key + " = ? AND " + IDs[title].foriegnKeys[1].key + " = ?";
    
    const sql = `${action} ${title} ${action === 'UPDATE' ? 'SET ' + sqlSet : ''} WHERE ${sqlConditions}`;
    
    modQuery(sql, Object.values(req.body).toString().split("_").map(Number), res, url);
}

// Create routes for each page
pages.forEach(({title, url}) => {
	if (title == 'Home') {
		app.get(url, (req, res) => {
			res.render('home', {
				title: title,
				pages
			});
		});
	} else {
		app.get(url, (req, res) => {
            db.pool.query(`SELECT * FROM ${title}`, (error, tableResults) => {
				if (error)
					console.log(error.sqlMessage);
				
                db.pool.query(`SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                    WHERE TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`, [title], (error, results) => {
                    
                    // If the table doesn't have foreign keys, render the page without foreign key data
                    if (results.length === 0)
                        return renderPage(res, title, null, tableResults, error);
                    
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

                    Promise.all(foreignKeyPromises)
                        .then(allForeignKeys => {
                            let tables = Object.assign({}, ...allForeignKeys); // Combine all key-value pairs into one object
                            
                            // Format date column if it exists
                            if (tableResults[0].date)
                                for (let i = 0; i < tableResults.length; i++)
                                    if (tableResults[i].date instanceof Date)
                                        tableResults[i].date = tableResults[i].date.toISOString();
  
                            renderPage(res, title, tables, tableResults, error);
                        })
                        .catch(error => console.log(error));
                });
			});
		});
	}
	
    // CREATE
    app.post(url + '/create', (req, res) => {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const sql = `INSERT INTO ${title} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;

        modQuery(sql, values, res, url);
    });

    // UPDATE
    app.post(url + '/update', (req, res) => {
        handleSQLStatement('UPDATE', req, res, url, title);
    });

    // DELETE
    app.post(url + '/delete/:id', (req, res) => {
        req.body.id = req.params.id;
        handleSQLStatement('DELETE FROM', req, res, url, title);
    });
});

// SEARCH Books By Genre
app.post('/books/search', (req, res) => {
    let genreID = req.body.genreID;
    let sql = '';
    let params = [];

    if (genreID) {
        genreID = '%' + genreID + '%';  // Wrap the genre name with '%' for SQL's LIKE
        sql = `SELECT * FROM Books
            JOIN BookGenres ON Books.bookID = BookGenres.bookID
            JOIN Genres ON BookGenres.genreID = Genres.genreID
            WHERE Genres.name LIKE ?`;
        params = [genreID];
    } else
        sql = `SELECT * FROM Books`;
    
    db.pool.query(sql, [genreID], (error, results) => {
        if (error) res.status(500).json({error: error.sqlMessage});
        else res.json(results);
    });
});

// SEARCH Customers By Name
app.post('/customers/search', (req, res) => {
    let name = req.body.name;
    let sql = '';
    let params = [];

    if (name) {
        name = '%' + name + '%';  // Wrap the genre name with '%' for SQL's LIKE
        sql = `SELECT * FROM Customers
            WHERE Customers.name LIKE ?`;
        params = [name];
    } else
        sql = `SELECT * FROM Customers`;
    
    db.pool.query(sql, [name], (error, results) => {
        if (error) res.status(500).json({error: error.sqlMessage});
        else res.json(results);
    });
});

app.listen(PORT, function (err) {
	if(err) throw err;
    console.log(`Server running on port ${PORT}`);
});
