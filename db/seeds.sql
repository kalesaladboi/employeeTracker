INSERT INTO departments (department_name)
VALUES 
    ('Sales'),
    ('Engineering'),
    ('Legal'),
    ('Finance'),
    ('Brand & Digital');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Sales Agent', 5000, 1),
    ('Sales Manager', 6000, 1),
    ('Engineering Team Director', 12000, 2),
    ('Senior Developer', 10000, 2),
    ('Jr Developer', 7000, 2),
    ('Legal Team Lead', 9500, 3),
    ('Lawyer', 9000, 3),
    ('Senior Accountant', 6500, 4),
    ('Jr Accountant', 5500, 4),
    ('Digital Design Manager', 8000, 5),
    ('Digital Designer', 7000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Skippy', 'Windy', 9, 4),
('Crichton', 'Peteri', 5, 2),
('Aurea', 'Rawstron', 4, 2),
('Nona', 'Tander', 1, 1),
('Anabelle', 'Taffe', 4, 2),
('Odney', 'Cochet', 5, 2),
('Geoff', 'Durrad', 11, 5),
