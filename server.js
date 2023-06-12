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
	'Customers': ['customerID'],
	'Orders': ['orderID'],
	'OrderBooks': ['orderID', 'bookID'],
	'Books': ['bookID'],
	'BookGenres': ['bookID', 'genreID'],
	'Genres': ['genreID']
};


// Create an Express app
const app = express();

// Register custom helper for equality comparison
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('isEqual', function(a, b, options) {
//	console.log(options);
	return a === b ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('isNotEqual', function(a, b, options) {
	return a !== b ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('entryKeys', function(a, b) {
	return IDs[b].map(id => a[id]).join('_');
});

hbs.handlebars.registerHelper('entityKey', function(a, b) {
	if (IDs[a].length === 1 && IDs[a][0] === b)
		return true;
	return false;
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
			db.pool.query('SELECT * FROM ' + title, (error, results) => {
				if (error)
					console.log(error.sqlMessage);
				
                // Format date column if it exists
                if (results[0].date)
                    results.forEach(element => element.date = element.date.toISOString().split('T')[0]);
                
				res.render('table', {
					title: title,
					data: results,
					error: error ? error.sqlMessage : "",
					pages
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
