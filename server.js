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

function generateSQL(tableName) {
    let fks = IDs[tableName].foriegnKeys;
    let sql = `SELECT a.*`;
    
    // Check if there are any foreign keys
    if (fks && fks.length > 0) {
        // Loop through each foreign key
        
        let foreignTableNames = [];
        for (let i = 0; i < fks.length; i++) {
            // The foreign table's name is determined by looking up the 'key' in the IDs object
            for(let potentialTable in IDs) {
                if(IDs[potentialTable].keys.includes(fks[i].key)){
                    foreignTableNames[i] = potentialTable;
                    break;
                }
            }
        }
        
            // Now the alias will be bi where i is the index of the foreign key
        for (let i = 0; i < fks.length; i++)
            sql += `, b${i}.${fks[i].refColumn} AS ${fks[i].name}`;
        sql += ` FROM ${tableName} a`;
        
            // Add the JOIN clause for this foreign key
        for (let i = 0; i < fks.length; i++)
            sql += ` INNER JOIN ${foreignTableNames[i]} b${i} ON a.${fks[i].name} = b${i}.${fks[i].key}`;
    // If there are no foreign keys, just add the FROM clause
    } else
        sql += ` FROM ${tableName} a`;
    
    return sql;
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
            db.pool.query(generateSQL(title), (error, tableResults) => {
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
                            console.log(allForeignKeys);
                            let tables = Object.assign({}, ...allForeignKeys); // Combine all key-value pairs into one object
                            console.log(tables);
                            // Format date column if it exists
                            if (tableResults[0].date)
                                tableResults.forEach(element => element.date = element.date.toISOString().split('T')[0]);
                            
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
