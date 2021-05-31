const inquirer = require('inquirer');
const conn = require('./connection');
const consoleTable = require('console.table');

function startPrompt() {
    inquirer.prompt([{
            type: 'list',
            message: "What would you like to do?",
            name: "start",
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role'
            ]
        }])
        .then(answers => {
            switch (answers.start) {
                case 'view departments': {
                    return viewDepartments();
                }
                case 'view roles': {
                    return viewAllRoles();
                }
                case 'view employees': {
                    return viewAllEmployees();
                }
                case 'add department': {
                    return addDepartment();
                }
                case 'add role': {
                    return addRole();
                }
                case 'add employee': {
                    return addEmployee();
                }
                case 'update employee role': {
                    return updateRole();
                }
            }
        }).catch(error => {
            if (error) throw error;
        });

}

startPrompt();

function viewDepartments() {
    conn.query(
        `SELECT * FROM departments`,
        function(err, rows, fields) {
            console.log(`\n`);
            console.table(rows);
        }
    )
    startPrompt();
}

function viewAllRoles() {
    conn.query(
        `SELECT * FROM roles`,
        function(err, rows, fields) {
            console.log(`\n`);
            console.table(rows);
        }
    )
    startPrompt();
}

function viewAllEmployees() {
    conn.query(
        `SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
        roles.salary, departments.department_name, employees.manager_id
        FROM employees
        JOIN roles 
        ON employees.role_id = roles.id
        JOIN departments 
        ON roles.department_id = departments.id
        ORDER BY employees.last_name
        `,
        function(err, rows, fields) {
            console.log(`\n`);
            console.table(rows);
        }
    )
    startPrompt();
}

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        message: "Enter name of new Department",
        name: "department"
    }]).then(answers => {
        conn.query(`INSERT INTO departments (department_name) VALUES (?)`, answers.department, function() {
            console.log(`${answers.department} Department has been added to the database`);
        })
        startPrompt();
    });

}

function addRole() {
    let departmentInfo;
    conn.query('SELECT * FROM departments', function(err, rows, fields) {
        departmentInfo = rows.map(departmentName => departmentName.id + " " + departmentName.department_name)
        inquirer.prompt([{
                    type: 'input',
                    message: "name of new Role",
                    name: "title"
                },
                {
                    type: 'input',
                    message: "starting salary?",
                    name: "salary"
                },
                {
                    type: 'list',
                    message: "Choose department to add Role to",
                    name: "department",
                    choices: departmentInfo
                }
            ])
            .then(answers => {
                let departmentId = answers.department.split(" ", 1);

                conn.query(`INSERT INTO roles(title,salary,department_id) VALUES (?,?,?)`, [answers.title, answers.salary, departmentId], function(err, res) {
                    if (err) console.log(err);
                })
                startPrompt();
            })
    })

}

function addEmployee() {
    let roleChoices;
    conn.query('SELECT * FROM roles', function(err, rows, fields) {
        roleChoices = rows.map(employeeRoles => employeeRoles.id + " " + employeeRoles.title)
        inquirer.prompt([{
                    type: 'input',
                    message: "First Name",
                    name: "firstName"
                },
                {
                    type: 'input',
                    message: "Last Name",
                    name: "lastName"
                },
                {
                    type: 'list',
                    message: "Job title",
                    name: "title",
                    choices: roleChoices

                }
            ])
            .then(answers => {
                let employeeTitle = answers.title.split(" ", 1);
                conn.query(`INSERT INTO employees(first_name, last_name, role_id) VALUES(?,?,?)`, [answers.firstName, answers.lastName, employeeTitle], function(err, res) {
                    if (err) console.log(err);
                });
                startPrompt();
            })

    })
}

function updateRole() {
    let selectEmployee;    
    conn.query(`SELECT id, first_name, last_name FROM employees ORDER BY last_name`, function(err, rows, fields) {
        selectEmployee = rows.map(employeeEL => employeeEL.id + " " + employeeEL.first_name + " " + employeeEL.last_name)

        inquirer.prompt([{
            type: 'list',
            message: "Choose employee to update",
            name: "selectEmployee",
            choices: selectEmployee
        }]).then(answers => {
            employeeData = answers.selectEmployee.split(" ", 1);
            currentEmployeeID = employeeData;
            console.log(currentEmployeeID);
            
            assignNewRole(currentEmployeeID);

            }

        )
    })



}

function assignNewRole(data) {
    let dataEl = data;
    conn.query(`SELECT id, title FROM roles ORDER BY title`, function(err, rows, fields) {
        rolesList = rows.map( rowsEL => rowsEL.id + " " + rowsEL.title)
        inquirer.prompt([{
            type: 'list',
            message: 'Select new Role',
            name: 'newRole',
            choices: rolesList
        }])
        .then(answers => {
            let roleId = answers.newRole.split(" ", 1)
            console.log(data);
            conn.query(`UPDATE employees SET role_id=${roleId} WHERE id=${dataEl}`)
            startPrompt();
        })
    })
}