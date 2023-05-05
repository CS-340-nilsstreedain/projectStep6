-- DDL.SQL

-- Disabling foreign key checks and autocommit
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Genres table
DROP TABLE IF EXISTS Genres;
CREATE TABLE Genres (
    genreID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Customers table
DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    address VARCHAR(255),
    favoriteGenre INT,
    FOREIGN KEY (favoriteGenre)
        REFERENCES Genres(genreID)
);

-- Books table
DROP TABLE IF EXISTS Books;
CREATE TABLE Books (
    bookID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price DECIMAL(10 , 2 ) UNSIGNED NOT NULL,
    stock INT UNSIGNED DEFAULT 0 NOT NULL
);

-- BookGenres table
DROP TABLE IF EXISTS BookGenres;
CREATE TABLE BookGenres (
    bookID INT NOT NULL,
    genreID INT NOT NULL,
    PRIMARY KEY (bookID , genreID),
    FOREIGN KEY (bookID)
        REFERENCES Books(bookID),
    FOREIGN KEY (genreID)
        REFERENCES Genres(genreID)
);

-- Orders table
DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT,
    date DATETIME NOT NULL,
    total DECIMAL(10 , 2 ) UNSIGNED NOT NULL,
    FOREIGN KEY (customerID)
        REFERENCES Customers(customerID)
        ON DELETE CASCADE
);

-- OrderBooks table
DROP TABLE IF EXISTS OrderBooks;
CREATE TABLE OrderBooks (
    orderID INT NOT NULL,
    bookID INT NOT NULL,
    quantity INT UNSIGNED DEFAULT 1 NOT NULL,
    price DECIMAL(10 , 2 ) UNSIGNED NOT NULL,
    PRIMARY KEY (orderID , bookID),
    FOREIGN KEY (orderID)
        REFERENCES Orders(orderID)
        ON DELETE CASCADE,
    FOREIGN KEY (bookID)
        REFERENCES Books(bookID)
        ON DELETE CASCADE
);

-- Insert example data
-- Add example data for Genres, Customers, Books, BookGenres, Orders, and OrderBooks tables here
-- Example:
-- INSERT INTO Genres (name, description) VALUES ('Fiction', 'Fictional stories and narratives');
-- INSERT INTO Customers (name, phone, email, address, favoriteGenre) VALUES ('John Doe', '555-1234', 'john.doe@email.com', '123 Main St', 1);
-- Insert example data for Genres table
INSERT INTO Genres (name, description) VALUES ('Fiction', 'Fictional stories and narratives');
INSERT INTO Genres (name, description) VALUES ('Mystery', 'Mystery novels and crime fiction');
INSERT INTO Genres (name, description) VALUES ('Romance', 'Romance novels and love stories');
INSERT INTO Genres (name, description) VALUES ('Sci-Fi', 'Science fiction and futuristic stories');
INSERT INTO Genres (name, description) VALUES ('Biograph', 'Biographical accounts of real people');

-- Insert example data for Customers table
INSERT INTO Customers (name, phone, email, address, favoriteGenre) VALUES ('John Doe', '555-1234', 'john.doe@email.com', '123 Main St.', 1);
INSERT INTO Customers (name, phone, email, address, favoriteGenre) VALUES ('Jane Smith', '555-5678', 'jame.smith@email.com', '456 Oak St.', 3);
INSERT INTO Customers (name, phone, email, address, favoriteGenre) VALUES ('Jim Brown', '555-9012', 'jim.brown@email.com', '789 Elm St.', 2);
INSERT INTO Customers (name, phone, email, address, favoriteGenre) VALUES ('Mary Lee', '555-3456', 'mary.lee@email.com', '321 Birch St.', 4);

-- Insert example data for Books table
INSERT INTO Books (title, author, price, stock) VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 10.99, 15);
INSERT INTO Books (title, author, price, stock) VALUES ('Pride and Prejudice', 'Jane Austen', 9.99, 12);
INSERT INTO Books (title, author, price, stock) VALUES ('1984', 'George Orwell', 12.99, 10);
INSERT INTO Books (title, author, price, stock) VALUES ('To Kill a Mockingbird', 'Harper Lee', 11.99, 8);

-- Insert example data for BookGenres table
INSERT INTO BookGenres (bookID, genreID) VALUES (1, 1);
INSERT INTO BookGenres (bookID, genreID) VALUES (2, 1);
INSERT INTO BookGenres (bookID, genreID) VALUES (3, 4);
INSERT INTO BookGenres (bookID, genreID) VALUES (4, 1);

-- Insert example data for Orders table
INSERT INTO Orders (customerID, date, total) VALUES (1, '2023-05-01 10:30:00', 20.98);
INSERT INTO Orders (customerID, date, total) VALUES (2, '2023-05-02 14:45:00', 12.99);
INSERT INTO Orders (customerID, date, total) VALUES (3, '2023-05-03 11:15:00', 11.99);
INSERT INTO Orders (customerID, date, total) VALUES (4, '2023-05-04 16:00:00', 19.98);

-- Insert example data for OrderBooks table
INSERT INTO OrderBooks (orderID, bookID, quantity, price) VALUES (1, 1, 1, 10.99);
INSERT INTO OrderBooks (orderID, bookID, quantity, price) VALUES (1, 2, 1, 9.99);
INSERT INTO OrderBooks (orderID, bookID, quantity, price) VALUES (2, 3, 1, 12.99);
INSERT INTO OrderBooks (orderID, bookID, quantity, price) VALUES (3, 4, 1, 11.99);
INSERT INTO OrderBooks (orderID, bookID, quantity, price) VALUES (4, 2, 2, 19.98);

-- Enabling foreign key checks and committing
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
