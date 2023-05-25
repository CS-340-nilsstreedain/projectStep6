const express = require('express');
const exphbs = require('express-handlebars');
var db = require('./db-connector')

const PORT = process.env.PORT || 6784;
const pages = [
	{
		title: 'Home',
		url: '/'
	},
	{
		title: 'Customers',
		url: '/customers',
		columns: [
			{name: 'name', description: 'Full Name', type: 'input'},
			{name: 'phone', description: 'Phone Number', type: 'input'},
			{name: 'email', description: 'Email Address', type: 'input'},
			{name: 'address', description: 'Home Address', type: 'input'},
			{name: 'genre', description: 'Favorite Genre', type: 'select'}
		]
	},
	{
		title: 'Orders',
		url: '/orders',
		columns: [
			{name: 'customer', description: 'Customer', type: 'select'},
			{name: 'date', description: 'Date', type: 'input'},
			{name: 'total', description: 'Total', type: 'input'}
		]
	},
	{
		title: 'OrderBooks',
		url: '/orderbooks',
		columns: [
			{name: 'order', description: 'Order ID', type: 'input'},
			{name: 'book', description: 'Book', type: 'select'},
			{name: 'quantity', description: 'Quantity', type: 'input'},
			{name: 'price', description: 'Price', type: 'input'}
		]
	},
	{
		title: 'Books',
		url: '/books',
		columns: [
			{name: 'title', description: 'Title', type: 'input'},
			{name: 'author', description: 'Author', type: 'input'},
			{name: 'price', description: 'Price', type: 'input'},
			{name: 'stock', description: 'Stock', type: 'input'}
		]
	},
	{
		title: 'BookGenres',
		url: '/bookgenres',
		columns: [
			{name: 'book', description: 'Book', type: 'select'},
			{name: 'genre', description: 'Genre', type: 'select'}
		]
		
	},
	{
		title: 'Genres',
		url: '/genres',
		columns: [
		   {name: 'name', description: 'Name', type: 'input'},
		   {name: 'Description', description: 'Description', type: 'input'}
		]
	}
];

// Create an Express app
const app = express();

// Register custom helper for equality comparison
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('isEqual', function (a, b, options) {
	return a === b ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('isNotEqual', function (a, b, options) {
	return a !== b ? options.fn(this) : options.inverse(this);
});

// Configure express-handlebars
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.json());

app.use(express.static('public'));

// Create routes for each page
pages.forEach(({title, url, columns}) => {
    app.get(url, (req, res) => {
        res.render(title.toLowerCase(), {
            title: title,
			columns: columns,
            pages
        });
    });
});

app.listen(PORT, function (err) {
	if(err) throw err;
    console.log(`Server running on port ${PORT}`);
});
