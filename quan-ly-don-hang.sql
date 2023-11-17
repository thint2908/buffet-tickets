-- DROP DATABASE QuanLyDonHang
CREATE DATABASE QuanLyDonHang
GO
USE QuanLyDonHang
GO
CREATE TABLE ServingTable (
    ServingTableID INT IDENTITY(1,1) PRIMARY KEY,
    ServingTableCode NVARCHAR(255) NOT NULL UNIQUE,
    Capacity INT NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Status INT NOT NULL DEFAULT 0,
    Active INT NOT NULL DEFAULT 1,
    CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE()
);

CREATE TABLE CategoryFood (
    CategoryFoodID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NULL,
	Active INT NOT NULL DEFAULT 1,
    CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE()
);

CREATE TABLE MenuItem (
    MenuItemID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryFoodID INT NOT NULL,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Price INT NOT NULL,
    Image VARCHAR(255) NULL,
    Description NVARCHAR(MAX) NULL,    
	Status INT DEFAULT 0 NOT NULL,
	Active INT DEFAULT 1 NOT NULL,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
    CONSTRAINT FK_MenuItem_CategoryFood FOREIGN KEY (CategoryFoodID) REFERENCES CategoryFood(CategoryFoodID)
);

CREATE TABLE BuffetTicket (
    BuffetTicketID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Price INT NOT NULL,
	Active INT DEFAULT 1 NOT NULL,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE()
);

CREATE TABLE BuffetTicketTimeSlot (
    BuffetTicketTimeSlotID INT IDENTITY(1,1) PRIMARY KEY,
    BuffetTicketID INT NOT NULL UNIQUE,
    DiscountPrice INT NOT NULL,
	StartTime TIME,
	EndTime TIME,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
	CONSTRAINT FK_BuffetTicketTimeSlot_BuffetTicket FOREIGN KEY (BuffetTicketID) REFERENCES BuffetTicket(BuffetTicketID)
);

CREATE TABLE BuffetTicketMenuItem (
    BuffetTicketMenuItemID INT IDENTITY(1,1) PRIMARY KEY,
    BuffetTicketID INT NOT NULL,
	MenuItemID INT NOT NULL,
	CONSTRAINT FK_BuffetTicketMenuItem_BuffetTicket FOREIGN KEY (BuffetTicketID) REFERENCES BuffetTicket(BuffetTicketID),
	CONSTRAINT FK_BuffetTicketMenuItem_MenuItem FOREIGN KEY (MenuItemID) REFERENCES MenuItem(MenuItemID)
);

CREATE TABLE Employee (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(255) NOT NULL,
	Birthday DATE DEFAULT GETDATE() NULL,
	Phone NVARCHAR(255) NOT NULL UNIQUE,
	Email NVARCHAR(255) NOT NULL UNIQUE,
	Password NVARCHAR(255) NOT NULL,
	Role INT DEFAULT 2 NOT NULL,
	Active INT DEFAULT 1 NOT NULL,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
);

CREATE TABLE Tax (
    TaxID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
	Type NVARCHAR(255) NOT NULL,
	Value INT NOT NULL,
	Active INT DEFAULT 1 NOT NULL,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
);

CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    ServingTableID INT NOT NULL,
	BuffetTicketID INT NOT NULL,
	EmployeeID INT NOT NULL,
	PriceBuffetTicket INT NOT NULL,
	DiscountPrice INT NOT NULL,
	Quantity INT NOT NULL,
	Status INT DEFAULT 0 NOT NULL,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
	CONSTRAINT FK_Orders_ServingTable FOREIGN KEY (ServingTableID) REFERENCES ServingTable(ServingTableID),
	CONSTRAINT FK_Orders_BuffetTicket FOREIGN KEY (BuffetTicketID) REFERENCES BuffetTicket(BuffetTicketID),
	CONSTRAINT FK_Orders_Employee FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

CREATE TABLE OrderItem (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
	Cart Text NOT NULL,
	Status INT DEFAULT 0 NOT NULL,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
	CONSTRAINT FK_OrderItem_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

CREATE TABLE Shift (
    ShiftID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
	StartTime Time,
    EndTime Time,
	Active INT DEFAULT 1 NOT NULL
);

CREATE TABLE OrderTax (
    OrderTaxID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
	Tax Text NOT NULL,
	TotalValueTax INT NOT NULL,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
	CONSTRAINT FK_OrderTax_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

CREATE TABLE Payment (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
	EmployeeID INT NOT NULL,
	OrderID INT NOT NULL,
	OrderTaxID INT NOT NULL,
	ShiftID INT NOT NULL,
	TotalPriceBuffetTicket INT NOT NULL,
	TotalDiscountPrice INT NOT NULL,
	TotalValueTax INT NOT NULL,
	TotalAmount INT NOT NULL,
	Status INT NOT NULL,
	CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
	CONSTRAINT FK_Payment_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
	CONSTRAINT FK_Payment_Employee FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	CONSTRAINT FK_Payment_OrderTax FOREIGN KEY (OrderTaxID) REFERENCES OrderTax(OrderTaxID),
	CONSTRAINT FK_Payment_Shift FOREIGN KEY (ShiftID) REFERENCES Shift(ShiftID)
);

INSERT INTO ServingTable (ServingTableCode, Capacity, Description, Status, Active) VALUES
(N'Bàn 01', 4, N'Bàn 4 người', 1, 1),
(N'Bàn 02', 2, N'Bàn 2 người', 1, 1),
(N'Bàn 03', 6, N'Bàn 6 người', 1, 1),
(N'Bàn 04', 8, N'Bàn 8 người', 0, 1),
(N'Bàn 05', 4, N'Bàn 4 người', 0, 1),
(N'Bàn 06', 2, N'Bàn 2 người', 0, 1),
(N'Bàn 07', 6, N'Bàn 6 người', 0, 1),
(N'Bàn 08', 8, N'Bàn 8 người', 0, 1),
(N'Bàn 09', 4, N'Bàn 4 người', 0, 1),
(N'Bàn 10', 2, N'Bàn 2 người', 0, 1);

INSERT INTO CategoryFood (Name, Description) VALUES 
(N'Món chính', N'Đây là các món ăn chính như cơm, phở, mì, bún...'),
(N'Món phụ', N'Đây là các món ăn phụ như món ăn kèm, xào, chiên, kho...'),
(N'Trà sữa', N'Đây là các loại trà sữa và thức uống khác'),
(N'Thức ăn vặt', N'Đây là các loại thức ăn nhẹ như bánh, kẹo, snack...'),
(N'Món nước', N'Đây là các loại nước uống như nước suối, nước ngọt, sinh tố...'),
(N'Thực phẩm khô', N'Đây là các loại thực phẩm khô và gia vị như hạt, trái cây sấy...'); 

INSERT INTO MenuItem (CategoryFoodID, Name, Price, Image, Description) VALUES 
(1, N'Cơm gà chiên nước mắm', 50000, 'image- (1).jpg', N'Cơm gà chiên nước mắm ngon tuyệt vời.'),
(1, N'Phở bò', 45000, 'image- (2).jpg', N'Phở bò thơm ngon với nước dùng đậm đà.'),
(2, N'Đậu hủ chiên xả ớt', 35000, 'image- (3).jpg', N'Đậu hủ chiên xả ớt giòn tan, thơm ngon.'),
(3, N'Trà sữa trân châu đường đen', 35000, 'image- (4).jpg', N'Trà sữa thơm ngon với trân châu và đường đen.'),
(4, N'Bánh quy socola', 15000, 'image- (5).jpg', N'Bánh quy socola thơm ngon, giòn tan.'),
(5, N'Nước ép cam', 20000, 'image- (6).jpg', N'Nước ép cam tươi ngon.'),
(6, N'Hạt điều rang muối', 45000, 'image- (7).jpg', N'Hạt điều rang muối thơm ngon.'),
(1, N'Cơm tấm sườn', 55000, 'image- (8).jpg', N'Cơm tấm với sườn heo chiên giòn.'),
(2, N'Rau muống xào tỏi', 35000, 'image- (9).jpg', N'Rau muống xào tỏi thơm ngon.'),
(3, N'Chanh muối', 15000, 'image- (10).jpg', N'Chanh muối thơm ngon.'),
(4, N'Bánh tráng trộn', 25000, 'image- (11).jpg', N'Bánh tráng trộn với tôm, thịt, rau sống và gia vị.'),
(5, N'Cà phê đen', 20000, 'image- (12).jpg', N'Cà phê đen thơm ngon, đậm đà.'),
(6, N'Tôm chiên giòn', 65000, 'image- (13).jpg', N'Tôm chiên giòn với bột chiên giòn, thơm ngon.'),
(1, N'Cơm tấm sườn nướng', 65000, 'image- (14).jpg', N'Cơm tấm với sườn heo nướng và trứng chiên.'),
(1, N'Cơm tấm chả trứng', 45000, 'image- (15).jpg', N'Cơm tấm với chả trứng chiên và đồ chua.'),
(2, N'Tôm rang muối', 95000, 'image- (16).jpg', N'Tôm rang muối với hành tây, ớt và dầu hào.'),
(2, N'Mì xào hải sản', 85000, 'image- (17).jpg', N'Mì xào hải sản với tôm, mực và cá hồi.'),
(3, N'Sinh tố dâu tây', 45000, 'image- (18).jpg', N'Sinh tố dâu tây tươi ngon.'),
(3, N'Soda chanh', 25000, 'image- (19).jpg', N'Soda chanh mát lạnh và thơm ngon.'),
(4, N'Bánh tráng nướng', 35000, 'image- (20).jpg', N'Bánh tráng nướng với thịt nướng, tôm, rau sống và gia vị.'),
(4, N'Bánh tráng cuốn thịt heo', 45000, 'image- (21).jpg', N'Bánh tráng cuốn thịt heo, tôm, bún tàu và rau sống.'),
(5, N'Cà phê sữa đá', 25000, 'image- (22).jpg', N'Cà phê sữa đá thơm ngon và mát lạnh.'),
(5, N'Trà xanh', 20000, 'image- (23).jpg', N'Trà xanh tươi mát và thơm ngon.'),
(6, N'Tôm hấp bia', 75000, 'image- (24).jpg', N'Tôm hấp bia với tỏi, ớt, dầu hào và rau thơm.');


INSERT INTO BuffetTicket (Name, Price) VALUES 
(N'Buffet 100k', 100000),
(N'Buffet 200k', 200000),
(N'Buffet 150k', 150000),
(N'Buffet 250k', 250000);

INSERT INTO BuffetTicketTimeSlot(BuffetTicketID, DiscountPrice, StartTime, EndTime) VALUES 
(1, 80000, '07:00:00', '09:00:00'),
(2, 90000, '12:00:00', '14:00:00'),
(3, 100000, '18:00:00', '20:00:00');

INSERT INTO BuffetTicketMenuItem (BuffetTicketID, MenuItemID) VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(4, 8),
(4, 9),
(4, 10),
(4, 11),
(4, 12),
(4, 13),
(4, 14),
(4, 15),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(3, 21),
(3, 22),
(3, 23),
(3, 24);

INSERT INTO Employee (FullName, Birthday, Phone, Email, Password, Role, Active)
VALUES 
('Admin', '1990-01-01', '0123456711', 'admin@gmail.com', '$2y$10$3noDklV7Kb98SEeYV7icce24ADhXVbi.Ck8fjKZt/vhTkLeiClp7W', 0, 1),
('Manager', '1990-01-01', '0123456712', 'manager@gmail.com', '$2y$10$3noDklV7Kb98SEeYV7icce24ADhXVbi.Ck8fjKZt/vhTkLeiClp7W', 1, 1),
('Waiter', '1990-01-01', '0123456713', 'waiter@gmail.com', '$2y$10$3noDklV7Kb98SEeYV7icce24ADhXVbi.Ck8fjKZt/vhTkLeiClp7W', 2, 1),
('Cook', '1990-01-01', '0123456714', 'cook@gmail.com', '$2y$10$3noDklV7Kb98SEeYV7icce24ADhXVbi.Ck8fjKZt/vhTkLeiClp7W', 3, 1);

INSERT INTO Tax (Name, Type, Value)
VALUES 
(N'VAT', N'Phần trăm', 10),
(N'Thuế bán hàng', N'Phần trăm', 5),
(N'Thuế thu nhập', N'Phần trăm', 20);

INSERT INTO Shift (Name, StartTime, EndTime)
VALUES 
(N'Ca sáng', '10:00:00', '14:00:00'),
(N'Ca chiều', '14:00:00', '18:00:00'),
(N'Ca tối', '18:00:00', '22:00:00');

INSERT INTO Orders (ServingTableID, BuffetTicketID, EmployeeID, PriceBuffetTicket, DiscountPrice, Quantity, Status)
VALUES
(1, 1, 2, 100000, 0, 2, 0),
(2, 2, 2, 200000, 0, 3, 0),
(3, 1, 2, 100000, 0, 4, 0);

INSERT INTO OrderTax (OrderID, Tax, TotalValueTax)
VALUES
(1, '[]', 0),
(2, '[]', 0),
(3, '[]', 0);

INSERT INTO OrderItem(OrderID, Cart, Status)
VALUES
(1, '[{"MenuItemID":1,"Quantity":3,"Note": ""}]', 1),
(1, '[{"MenuItemID":2,"Quantity":3,"Note": ""}]', 1),
(1, '[{"MenuItemID":3,"Quantity":3,"Note": ""}]', 1),
(1, '[{"MenuItemID":2,"Quantity":5,"Note": ""},{"MenuItemID":1,"Quantity":2,"Note": ""}]', 0);