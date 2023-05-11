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

-- 5. Get all books of a specific genre
SELECT Books.*
FROM Books
JOIN BookGenres ON Books.bookID = BookGenres.bookID
WHERE BookGenres.genreID = :genreID;

-- 6. Get customer details by ID
SELECT * FROM Customers WHERE customerID = :customerID;

-- 7. Get order details by order ID
SELECT Orders.*, Customers.*
FROM Orders
JOIN Customers ON Orders.customerID = Customers.customerID
WHERE Orders.orderID = :orderID;

-- 8. Get all books in an order
SELECT Books.*, OrderBooks.quantity, OrderBooks.price
FROM OrderBooks
JOIN Books ON OrderBooks.bookID = Books.bookID
WHERE OrderBooks.orderID = :orderID;

-- INSERT Queries
-- 1. Add a new genre
INSERT INTO Genres (name, description)
VALUES (:name, :description);

-- 2. Add a new customer
INSERT INTO Customers (name, phone, email, address, favoriteGenre)
VALUES (:name, :phone, :email, :address, :favoriteGenre);

-- 3. Add a new book
INSERT INTO Books (title, author, price, stock)
VALUES (:title, :author, :price, :stock);

-- 4. Add a genre to a book
INSERT INTO BookGenres (bookID, genreID)
VALUES (:bookID, :genreID);

-- 5. Add a new order
INSERT INTO Orders (customerID, date, total)
VALUES (:customerID, :date, :total);

-- 6. Add a book to an order
INSERT INTO OrderBooks (orderID, bookID, quantity, price)
VALUES (:orderID, :bookID, :quantity, :price);

-- UPDATE Queries
-- 1. Update a genre
UPDATE Genres
SET name = :name, description = :description
WHERE genreID = :genreID;

-- 2. Update a customer
UPDATE Customers
SET name = :name, phone = :phone, email = :email, address = :address, favoriteGenre = :favoriteGenre
WHERE customerID = :customerID;

-- 3. Update a book
UPDATE Books
SET title = :title, author = :author, price = :price, stock = :stock
WHERE bookID = :bookID;

-- 4. Update an order
UPDATE Orders
SET customerID = :customerID, date = :date, total = :total
WHERE orderID = :orderID;

-- DELETE Queries
-- 1. Delete a genre
DELETE FROM Genres WHERE genreID = :genreID;

-- 2. Delete a customer
DELETE FROM Customers WHERE customerID = :customerID;

-- 3. Delete a book
DELETE FROM Books WHERE bookID = :bookID;

-- 4. Delete a book's genre
DELETE FROM BookGenres
WHERE bookID = :bookID AND genreID = :genreID;

-- 5. Delete an order
DELETE FROM Orders WHERE orderID = :orderID;

-- 6. Delete a book from an order
DELETE FROM OrderBooks
WHERE orderID = :orderID AND bookID = :bookID;
