USE pd_pablo_jimenez_gosling

CREATE TABLE customers (
customerName VARCHAR(100) NOT NULL,
id_customers INT PRIMARY KEY NOT NULL,
address VARCHAR(255) NOT NULL,
phone VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE plataform (
id_plataform INT PRIMARY KEY AUTO_INCREMENT,
plataformName VARCHAR(100) NOT NULL
);

CREATE TABLE transactions (
id_transactions VARCHAR(100) PRIMARY KEY NOT NULL,
dateTime DATETIME NOT NULL,
transactionAmount INT NOT NULL, 
transactionStatus VARCHAR(100) NOT NULL,
transactionType VARCHAR(100) NOT NULL,
id_customers INT,
id_plataform INT,
FOREIGN KEY (id_customers) REFERENCES customers(id_customers),
FOREIGN KEY (id_plataform) REFERENCES plataform(id_plataform)
);

CREATE TABLE invoices (
id_invoices VARCHAR(100) PRIMARY KEY NOT NULL,
billingPeriod VARCHAR(100) NOT NULL,
invoicedAmount INT NOT NULL,
amountPaid INT,
id_transactions VARCHAR(100),
FOREIGN KEY (id_transactions) REFERENCES transactions(id_transactions)
);