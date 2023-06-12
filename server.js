const express = require('express');
const exphbs = require('express-handlebars');
var db = require('./db-connector')

const PORT = process.env.PORT || 6784;
const pages = [
	{title: 'Home', url: '/'},
	{title: 'Customers', url: '/customers', IDs: ['customerID']},
	{title: 'Orders', url: '/orders', IDs: ['orderID']},
	{title: 'OrderBooks', url: '/orderbooks', IDs: ['orderID', 'bookID']},
	{title: 'Books', url: '/books', IDs: ['bookID']},
	{title: 'BookGenres', url: '/bookgenres', IDs: ['bookID', 'genreID']},
	{title: 'Genres', url: '/genres', IDs: ['genreID']}
];

const IDs = {
    'Customers': {
        "keys": ['customerID'],
        "foriegnKeys": [{"name": "favoriteGenre", "key": "genreID"}]
    },
    'Orders': {
        "keys": ['orderID'],
        "foriegnKeys": [{"key": "customerID", "name": "customerID"}]
    },
    'OrderBooks': {
        "keys": [],
        "foriegnKeys": [
            {"key": "orderID", "name": "orderID"},
            {"key": "bookID", "name": "bookID"}
        ]
    },
    'Books': {
        "keys": ['bookID'],
        "foriegnKeys": []
    },
    'BookGenres': {
        "keys": [],
        "foriegnKeys": [
            {"key": "bookID", "name": "bookID"},
            {"key": "genreID", "name": "genreID"}
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

hbs.handlebars.registerHelper('isNotEqual', function(a, b, options) {
	return a !== b ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('entryKeys', function(a, b) {
	return IDs[b].keys.map(id => a[id]).join('_');
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


hbs.handlebars.registerHelper('fkID', function(a, b) {
    for (let i = 0; i < IDs[a].foriegnKeys.length; i++) {
        if (IDs[a].foriegnKeys[i].name == b)
            return IDs[a].foriegnKeys[i].key;
    }
    return false;
});

hbs.handlebars.registerHelper('lookupAndEach', function(context, key, options) {
    const items = context[key];
    let out = "";

    if(Array.isArray(items)) {
        for(let i = 0; i < items.length; i++) {
            out += options.fn(items[i]);
        }
    }

    return out;
});



// Configure express-handlebars
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.json());

app.use(express.static('public'));

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
			db.pool.query('SELECT * FROM ' + title, (error, tableResults) => {
				if (error)
					console.log(error.sqlMessage);
				
                db.pool.query(`SELECT
                COLUMN_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`, [title], (error, results) => {
                    
                    // If the table doesn't have foreign keys, render the page without foreign key data
                    if (results.length === 0) {
                        res.render('table', {
                            title: title,
                            data: tableResults,
                            error: error ? error.sqlMessage : "",
                            pages
                        });
                        return;
                    }
                    
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
                            console.log(tables);
                            res.render('table', {
                                title: title,
                                data: tableResults,
                                tables: tables,
                                error: error ? error.sqlMessage : "",
                                pages
                            });
                        })
                        .catch(error => console.log(error));
                });
			});
		});
	}
	
	// CREATE
	app.post(url + '/create', (req, res) => {
		// Construct keys and values arrays
		const keys = Object.keys(req.body);
		const values = Object.values(req.body);

		// Build SQL statement
		const sql = `INSERT INTO ${title} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`;

		// Execute the query
		db.pool.query(sql, values, (error, results) => {
			if (error)
				res.status(500).json({error: error.sqlMessage});
			else
				res.redirect(url);
		});
	});

	// UPDATE
	app.post(url + '/update', (req, res) => {
		const keys = Object.keys(req.body);
		const values = Object.values(req.body);
		
		var sql = '';
		var tableIDs = IDs[title];
		if (tableIDs.length == 1) {
			const sqlSet = keys.slice(1).map(key => `${key} = '${req.body[key]}'`).join(', ');
			const sql = `UPDATE ${title} SET ${sqlSet} WHERE ${tableIDs[0]} = ?`;
			
			db.pool.query(sql, values, (error, results) => {
				if (error)
					res.status(500).json({error: error.sqlMessage});
				else
					res.redirect(url);
			});
		} else {
			const sqlSet = keys.slice(2).map(key => `${key} = '${req.body[key]}'`).join(', ');
			const sql = `UPDATE ${title} SET ${sqlSet} WHERE ${tableIDs[0]} = ? AND ${tableIDs[1]} = ?`;

			db.pool.query(sql, values, (error, results) => {
				if (error)
					res.status(500).json({error: error.sqlMessage});
				else
					res.redirect(url);
			});
		}
	});

	// DELETE
	app.post(url + '/delete/:id', (req, res) => {
		var sql = '';
		var tableIDs = IDs[title];
		if (tableIDs.length == 1) {
			sql = `DELETE FROM ${title} WHERE ${tableIDs[0]} = ?`;
			
			db.pool.query(sql, req.params.id, (error, results) => {
				if (error)
					res.status(500).json({error: error.sqlMessage});
				else
					res.redirect(url);
			});
		} else {
			sql = `DELETE FROM ${title} WHERE ${tableIDs[0]} = ? AND ${tableIDs[1]} = ?`;
			
			db.pool.query(sql, req.params.id.split('_').map(Number), (error, results) => {
				if (error)
					res.status(500).json({error: error.sqlMessage});
				else
					res.redirect(url);
			});
		}
	});
});

app.listen(PORT, function (err) {
	if(err) throw err;
    console.log(`Server running on port ${PORT}`);
});
