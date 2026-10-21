-- Demo data. Logins: admin@school.edu / Admin123!  |  juan@school.edu, maria@school.edu / Student123!
INSERT INTO users (name, student_id, email, password, role) VALUES
 ('Admin User',     'ADMIN-001', 'admin@school.edu', '$2a$10$P6Y/g68Bo8Z.DOglXu6ypeaukqBHuv.5pWoOxQXJ00JsNj22IzM8e', 'admin'),
 ('Juan Dela Cruz', '2023-0001', 'juan@school.edu',  '$2a$10$JSYgKHa/Bi.AEzqZgfHcC.TyuDdE4XPDuQrjs.KRkfeS4ZcMBCi7G',  'student'),
 ('Maria Santos',   '2023-0002', 'maria@school.edu', '$2a$10$JSYgKHa/Bi.AEzqZgfHcC.TyuDdE4XPDuQrjs.KRkfeS4ZcMBCi7G', 'student')
ON CONFLICT DO NOTHING;

INSERT INTO items (type, title, category, description, location, date_event, status, reported_by)
SELECT v.type, v.title, v.category, v.description, v.location, CURRENT_DATE - v.days, v.status, u.id
FROM (VALUES
 ('found','Black Backpack','Bags','Black backpack with a small logo. Contains notebooks and a laptop sleeve.','Library',3,'approved','maria@school.edu'),
 ('lost','Black Smartphone','Electronics','Black smartphone with a cracked screen protector and a blue case.','Cafeteria',2,'approved','juan@school.edu'),
 ('found','Student ID','ID / Documents','Student ID card found near the entrance.','Main Building',5,'approved','maria@school.edu'),
 ('found','Wireless Earbuds','Electronics','White earbuds in a charging case.','Library',4,'approved','juan@school.edu'),
 ('found','Brown Wallet','Accessories','Brown leather wallet with a few cards inside.','Parking Area',6,'approved','maria@school.edu'),
 ('lost','Gray Jacket','Clothing','Gray zip-up jacket, size M.','Gym',8,'approved','juan@school.edu'),
 ('lost','USB Flash Drive','Electronics','Red 32GB USB drive on a keychain.','Computer Lab',1,'pending','juan@school.edu'),
 ('found','Black Umbrella','Others','Black foldable umbrella.','Gym',1,'pending','maria@school.edu')
) AS v(type, title, category, description, location, days, status, email)
JOIN users u ON u.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM items);