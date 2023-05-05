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

-- Enabling foreign key checks and committing
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
