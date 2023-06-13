-- DML.SQL

-- SELECT Queries
-- 1. Get all genres
SELECT * FROM Genres;

-- 2. Get all customers
SELECT * FROM Customers;

-- 3. Get all books
SELECT * FROM Books;

-- 4. Get all orders
SELECT * FROM Orders;

-- 5. Get all books of a similar genre
-- Dynamic inputs: (:genreID)
SELECT Books.* FROM Books
JOIN BookGenres ON Books.bookID = BookGenres.bookID
JOIN Genres ON BookGenres.genreID = Genres.genreID
WHERE Genres.name LIKE ?

-- 5. Get all customers of a similar name
-- Dynamic inputs: (:name)
SELECT * FROM Customers
WHERE Customers.name LIKE :name

-- 6. Get customer details by ID
-- Dynamic inputs: (:customerID)
SELECT * FROM Customers
WHERE customerID = :customerID;

-- 7. Get order details by order ID
-- Dynamic inputs: (:orderID)
SELECT Orders.*, Customers.* FROM Orders
JOIN Customers ON Orders.customerID = Customers.customerID
WHERE Orders.orderID = :orderID;

-- 8. Get all books in an order
-- Dynamic inputs: (:orderID)
SELECT Books.*, OrderBooks.quantity, OrderBooks.price FROM OrderBooks
JOIN Books ON OrderBooks.bookID = Books.bookID
WHERE OrderBooks.orderID = :orderID;

-- INSERT Queries
-- 1. Add a new genre
-- Dynamic inputs: (:name, :description)
INSERT INTO Genres (name, description)
VALUES (:name, :description);

-- 2. Add a new customer
-- Dynamic inputs: (:name, :phone, :email, :address, :favoriteGenre)
INSERT INTO Customers (name, phone, email, address, favoriteGenre)
VALUES (:name, :phone, :email, :address, :favoriteGenre);

-- 3. Add a new book
-- Dynamic inputs: (:title, :author, :price, :stock)
INSERT INTO Books (title, author, price, stock)
VALUES (:title, :author, :price, :stock);

-- 4. Add a genre to a book
-- Dynamic inputs: (:bookID, :genreID)
INSERT INTO BookGenres (bookID, genreID)
VALUES (:bookID, :genreID);

-- 5. Add a new order
-- Dynamic inputs: (:customerID, :date, :total)
INSERT INTO Orders (customerID, date, total)
VALUES (:customerID, :date, :total);

-- 6. Add a book to an order
-- Dynamic inputs: (:orderID, :bookID, :quantity, :price)
INSERT INTO OrderBooks (orderID, bookID, quantity, price)
VALUES (:orderID, :bookID, :quantity, :price);

-- UPDATE Queries
-- 1. Update a genre
-- Dynamic inputs: (:name, :description, :genreID)
UPDATE Genres
SET name = :name, description = :description
WHERE genreID = :genreID;

-- 2. Update a customer
-- Dynamic inputs: (:name, :phone, :email, :address, :favoriteGenre, :customerID)
UPDATE Customers
SET name = :name, phone = :phone, email = :email, address = :address, favoriteGenre = :favoriteGenre
WHERE customerID = :customerID;

-- 3. Update a book
-- Dynamic inputs: (:title, :author, :price, :stock, :bookID)
UPDATE Books
SET title = :title, author = :author, price = :price, stock = :stock
WHERE bookID = :bookID;

-- 4. Update an order
-- Dynamic inputs: (:customerID, :date, :total, :orderID)
UPDATE Orders
SET customerID = :customerID, date = :date, total = :total
WHERE orderID = :orderID;

-- Update the quantity and price of a book in an order
-- Dynamic inputs: (:orderID, :bookID, :quantity, :price)
UPDATE OrderBooks
SET quantity = :quantity, price = :price
WHERE orderID = :orderID AND bookID = :bookID;

-- DELETE Queries
-- 1. Delete a genre
-- Dynamic inputs: (:genreID)
DELETE FROM Genres
WHERE genreID = :genreID;

-- 2. Delete a customer
-- Dynamic inputs: (:customerID)
DELETE FROM Customers
WHERE customerID = :customerID;

-- 3. Delete a book
-- Dynamic inputs: (:bookID)
DELETE FROM Books
WHERE bookID = :bookID;

-- 4. Remove a genre from a book
-- Dynamic inputs: (:bookID, :genreID)
DELETE FROM BookGenres
WHERE bookID = :bookID AND genreID = :genreID;

-- 5. Delete an order
-- Dynamic inputs: (:orderID)
DELETE FROM Orders
WHERE orderID = :orderID;

-- 6. Remove a book from an order
-- Dynamic inputs: (:orderID, :bookID)
DELETE FROM OrderBooks
WHERE orderID = :orderID AND bookID = :bookID;
