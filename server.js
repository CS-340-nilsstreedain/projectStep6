const express = require('express');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 3000;
const navItems = [
	{ title: 'Home', url: '/', active: true },
	{ title: 'Customers', url: '/customers' },
	{ title: 'Orders', url: '/orders' },
	{ title: 'Books', url: '/books' },
	{ title: 'Genres', url: '/genres' }
];

// Create an Express app
const app = express();

// Register custom helper for equality comparison
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('isEqual', function (a, b, options) {
	return a === b ? options.fn(this) : options.inverse(this);
});

// Configure express-handlebars
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {
        curr: 'Home',
        navItems
    });
});

// Add other routes for Customers, Orders, Books, and Genres

app.listen(PORT, function (err) {
	if(err) throw err;
    console.log(`Server running on port ${PORT}`);
});
