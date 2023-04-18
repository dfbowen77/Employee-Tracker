// Imports the inquirer package in order to ask questions via the command line
const inquirer = require('inquirer');

// Imports the mysql2 package in order to connect to a MySQL database
const mysql = require('mysql2');

// Imports the console.table package in order to conveniently view data in the command line in table format
const cTable = require('console.table')

// Imports the asciiart-logo package in order to spice up the command line interface. 
const logo = require('asciiart-logo')

// Connects to the mysql database. 
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '12345',
    database: 'employeetracker_db'
  },
);

// This function tests whether there is an error in the connection to the database. If not, then the application starts. 
db.connect((err) => {
  if (err) throw err;
  // start the application
  init();
});

// Here is where the initial question for the user to answer was created.
const initialQuestion = [
    {
      type: 'list',
      message: 'Select from the following list of options: ',
      name: 'options',
      choices: ['View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'],
    },
]

// This function allows the user to view all the employees stored in the database
function viewAllEmployees() {
  // This sql query pulls employee and role data and joins it via a left join. The left join allows pertinent information from the role table (role.title) to be added into the employee table data. 
  const sqlQuery = 'SELECT a.id AS "Id", a.first_name AS "First Name", a.last_name AS "Last Name", b.title AS "Title", a.manager_id AS "Manager Id"  FROM employee AS a LEFT JOIN role AS b ON a.role_id = b.id'

  // The query method takes the above query statement (sqlQuery) and the returns either an error (err) if there is a problem, or it returns the results (res; or whatever I want to to call the results.)
  db.query(sqlQuery, (err, res) => {
    if (err) throw err;
    console.table(res)
    // after this function is run the questions function is called to restart the program. 
    questions()
  })
}

// This function allows the users to add an employee to the database by answering a series of questions. 
function addEmployee() {
  // The inquirer package is used to ask the user various types of questions via the command line prompt.  
  inquirer
     .prompt([
       {
         type: 'input',
         name: 'addEmployeeFirstName',
         message: 'Enter a first name for the new employee:',
       },
       {
         type: 'input',
         name: 'addEmployeeLastName',
         message: 'Enter a last name for the new employee:',
       }])
      .then((answer) => {
        // The user's answers to the two previous questions are added to a new const variable called newEmployeeData. 
        const newEmployeeData = [answer.addEmployeeFirstName, answer.addEmployeeLastName]
        const roleQuery = 'SELECT * FROM role'
        db.query(roleQuery, (err, res) => {
          if (err) throw err
          // the .map method is used to create a new array of roles that can be used later in the program to populate the choices for the 'Select a role for the new employee' question. 
          const roles = res.map(({id, title}) => ({name: title, value: id}))
          inquirer
            .prompt([{
              type: 'list',
              name: 'roleEmployee',
              message: 'Select a role for the new employee:',
              choices: roles
            }])
            .then((answer) => {
              // The push method adds the user's answer to the previous question to the newEmployeeData array. 
              newEmployeeData.push(answer.roleEmployee)

              const managerQuery = 'SELECT * FROM employee'
              db.query(managerQuery, (err, res) => {
                if (err) throw err
                // Here the .map mathod is used to create a new array called managers where the first name and last name have been concatenated into a single variable.
                const managers = res.map(({id, first_name, last_name}) => ({name: first_name + " "+ last_name, value: id}))
                inquirer
                  .prompt([{
                    type: 'list',
                    name: 'managerEmployee',
                    message: 'Select a manager for the new employee:',
                    choices: managers
                  }])
                  .then((answer) => {
                    newEmployeeData.push(answer.managerEmployee)
                    // The following query inserts a new value into the employee database. The (?, ?, ?, ? ) tells the query to assign the next 4 values into the first_name, last_name, role_id, and manager_id variables. Those values are passed in the .query method and contained in the newEmployeeData const variable. 
                    const employeeAddSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`

                    db.query(employeeAddSql, newEmployeeData, (err, res) => {
                      if (err) throw err
                      console.log(`\n\nSuccess!!!\nThe new employee ${newEmployeeData[0]} ${newEmployeeData[1]} has been added to the database.\n\n`)
                      questions()
                    })
                  })
              })
            })
          }) 
      })  
}

function updateEmployeeRole() {
  // The employee and role tables are joined via a left join on the role id variable. 
  const employeeQuery = 'SELECT a.*, b.title FROM employee as a LEFT JOIN role as b ON a.role_id = b.id'
  db.query(employeeQuery, (err, res) => {
    if (err) throw err
    const employees = res.map(({id, first_name, last_name, title}) => ({name: first_name + " "+ last_name + ":  " + title, value: id}))
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'updateEmployeeRole',
          message: 'Select an employee whose role needs updating:',
          choices: employees
        }
      ])
      .then((answer) => {
        const updateRoleData = [answer.updateEmployeeRole]

        const roleSql = 'SELECT * FROM role'
        db.query(roleSql, (err, res) => {
          if (err) throw err
          const roles = res.map(({id, title}) => ({name: title, value: id}))
          inquirer
            .prompt([
              {
                type: 'list',
                name: 'assignEmployeeRole',
                message: 'Select a new role for the employee:',
                choices: roles
              }
            ])
            .then((answer) => {
              // I used unshift in order to make the role_id the first observation in the array because it needs to come before the employee id in the upcoming sql query. 
              updateRoleData.unshift(answer.assignEmployeeRole)
              const updateRoleSql = `UPDATE employee SET role_id = ? Where id = ?`

              db.query(updateRoleSql, updateRoleData, (err, res) => {
                if (err) throw err
                console.log("\n\nSuccess!!!\nThe employee role has been updated.\n\n")
                questions()
              })
              
            })
        })
        
      
      })
  })
  
}

function viewAllRoles() {
  // The variables in this sql query were renamed via AS to enhance the readability of the table for the user. 
  const sqlQuery = 'SELECT a.id AS "Id", a.title AS "Title", a.salary AS "Salary", b.department_name AS "Department Name" FROM role AS a LEFT JOIN department AS b ON a.department_id = b.id'

  db.query(sqlQuery, (err, res) => {
    if (err) throw err;
    console.table(res)
    questions()
  })
}

function addRole() {
  const sqlQuery = 'SELECT * FROM department'
  db.query(sqlQuery, (err, res) => {
    if (err) throw err
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'addRole',
        message: 'Enter a name for the new role:',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter a salary for the new role:',
      },
      {
      type: 'list',
      name: 'roleDepartment',
      message: 'Select a department for the role to belong to:',
      choices: res.map((department) => department.department_name)
      }
    ])
    .then((answer) => {
      // The find method is used to find the name of the department in the database that matches the answer that the user gave to the 'Select a department for the role to belong to' question. 
      const department = res.find(
        (department) => department.name === answer.department)
      const sqlQuery = `INSERT INTO role (title, salary, department_id) VALUES ("${answer.addRole}", "${answer.roleSalary}", "${department.id}")`
      db.query(sqlQuery, (err, res) => {
        if (err) throw (err)
        // The \n is used to add some space to the console.log print out to make it easier for the user to read the output. 
        console.log(`\n\nSuccess!!!\nThe role ${answer.addRole} has been added to the role database.\nIt has a salary of $${answer.roleSalary} and is associated with the ${answer.roleDepartment} department.\n\n`)
        questions()
      })
    })
      
})
}

function viewAllDepartments() {
  const sqlQuery = 'SELECT id AS "Id", department_name AS "Department Name" FROM department'

  db.query(sqlQuery, (err, res) => {
    if (err) throw err;
    // The .table method write a table to the console that the user can then view. 
    console.table(res)
    questions()
  })
}

function addDepartment() {
  inquirer
  .prompt({
      type: 'input',
      name: 'addDepartment',
      message: 'Enter a name for the new department:',
  })
  .then((answer) => {
    // The following line write the sql statement to insert the value entered by the user into the database table 'department.' The template litoral answer.addDepartment is how to get the specific response from inquirer. 
    const sqlQuery = `INSERT INTO department (department_name) VALUES ("${answer.addDepartment}")`
    db.query(sqlQuery, (err, res) => {
      if (err) throw err;
      console.log(`\n\nSuccess!!!\nThe ${answer.addDepartment} department has been added to the department database.\n\n`)
      questions()
    })
  })

}

function init() {
    // The asciiart-logo package is used create a logo for the application that can be viewed in the command line when the program initializes. 
  const longText = 'Welcome to the Employee Tracker System. It is a command-line application that allows business owners to easily view and manage the company departments, roles, and employees.'
  console.log(logo({
    name: 'Employee Tracker System',
    font: 'Standard',
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: 'red',
    logoColor: 'yellow',
    textColor: 'magenta',
  })
    .center(longText)
    .render())

    questions()
}

function questions(){
  inquirer
      .prompt(initialQuestion)
      .then((answer) => {
        console.clear()
        // answer.options is only the text of the response of the user; whereas the answers variable contains both the name of the answer (e.g. 'options') and the actual answer (e.g. 'View All Employees). Thus, you need answer.options to make this switch statement to work properly.  
        switch(answer.options){
          case 'View All Employees':
            viewAllEmployees()
          break;

          case 'Add Employee':
            addEmployee()
          break;

          case 'Update Employee Role':
            updateEmployeeRole()
          break;

          case 'View All Roles':
            viewAllRoles()
          break;

          case 'Add Role':
            addRole()
          break;

          case 'View All Departments':
            viewAllDepartments()
          break;

          case 'Add Department':
            addDepartment()
          break;

          case 'Quit':
            db.end()
          break;
        }

      })
      .catch((error) => {
          console.log(error)
      })

}