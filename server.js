const express = require('express');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 6784;
const pages = [
	{ title: 'Home', url: '/',},
	{ title: 'Customers', url: '/customers' },
	{ title: 'Orders', url: '/orders' },
        { title: 'OrderBooks', url: '/orderbooks' },
	{ title: 'Books', url: '/books' },
        { title: 'BookGenres', url: '/bookgenres' },
	{ title: 'Genres', url: '/genres' }
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
pages.forEach(({ title, url }) => {
    app.get(url, (req, res) => {
        res.render(title.toLowerCase(), {
            curr: title,
            pages
        });
    });
});

app.listen(PORT, function (err) {
	if(err) throw err;
    console.log(`Server running on port ${PORT}`);
});
