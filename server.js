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
    // TODO: Add MySQL password here
    password: '12345',
    database: 'employeetracker_db'
  },
  console.log(`Connected to the employeetracker_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
  // start the application
  init();
});

// Here is where the questions for the user to answer are created.
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

function viewAllEmployees() {
  console.log("The viewAllEmployees function is activated")
  const sqlQuery = 'SELECT a.id, a.first_name, a.last_name, b.title, a.manager_id  FROM employee AS a LEFT JOIN role AS b ON a.role_id = b.id'
  console.log(sqlQuery)

  db.query(sqlQuery, (err, res) => {
    if (err) throw err;
    console.table(res)
    questions()
  })
}

function addEmployee() {
  console.log("The addEmployee function is activated")

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
        console.log(answer.addEmployeeFirstName)
        console.log(answer.addEmployeeLastName)
        const newEmployeeData = [answer.addEmployeeFirstName, answer.addEmployeeLastName]
        const roleQuery = 'SELECT * FROM role'
        db.query(roleQuery, (err, res) => {
          if (err) throw err
          const roles = res.map(({id, title}) => ({name: title, value: id}))
          inquirer
            .prompt([{
              type: 'list',
              name: 'roleEmployee',
              message: 'Select a role for the new employee:',
              choices: roles
            }])
            .then((answer) => {
              console.log(answer.roleEmployee)
              newEmployeeData.push(answer.roleEmployee)
              console.log(newEmployeeData)

              const managerQuery = 'SELECT * FROM employee'
              db.query(managerQuery, (err, res) => {
                if (err) throw err
                const managers = res.map(({id, first_name, last_name}) => ({name: first_name + " "+ last_name, value: id}))
                console.log(managers)
                inquirer
                  .prompt([{
                    type: 'list',
                    name: 'managerEmployee',
                    message: 'Select a manager for the new employee:',
                    choices: managers
                  }])
                  .then((answer) => {
                    console.log(answer)
                    newEmployeeData.push(answer.managerEmployee)
                    const employeeAddSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`

                    db.query(employeeAddSql, newEmployeeData, (err, res) => {
                      if (err) throw err
                      console.log(`The new employee ${newEmployeeData[0]} ${newEmployeeData[1]} has been added to the database.`)
                      questions()
                    })
                  })
              })
            })
          }) 
      })  
}

function updateEmployeeRole() {
  console.log("The updateEmployeeRole function is activated")
  // Add a left join if time permits
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
        console.log(answer)
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
              console.log(answer)
              // I used unshift in order to make the role_id the first observation in the array because it needs to come before the employee id in the upcoming sql query. 
              updateRoleData.unshift(answer.assignEmployeeRole)
              console.log(updateRoleData)
              const updateRoleSql = `UPDATE employee SET role_id = ? Where id = ?`

              db.query(updateRoleSql, updateRoleData, (err, res) => {
                if (err) throw err
                console.log("Employee role has been updated.")
                questions()
              })
              
            })
        })
        
      
      })
  })
  
}

function viewAllRoles() {
  console.log("The viewAllRoles function is activated")
  const sqlQuery = 'SELECT a.id, a.title, a.salary, b.department_name FROM role AS a LEFT JOIN department AS b ON a.department_id = b.id'
  console.log(sqlQuery)

  db.query(sqlQuery, (err, res) => {
    if (err) throw err;
    console.table(res)
    questions()
  })
}

function addRole() {
  console.log("The addRole function is activated")
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
      console.log(answer.addRole)
      console.log(answer.roleSalary)
      console.log(answer.roleDepartment)
      const department = res.find(
        (department) => department.name === answer.department)
      console.log(department.id)
      const sqlQuery = `INSERT INTO role (title, salary, department_id) VALUES ("${answer.addRole}", "${answer.roleSalary}", "${department.id}")`
      console.log(sqlQuery)
      db.query(sqlQuery, (err, res) => {
        if (err) throw (err)
        console.log(`The role ${answer.addRole} has been added to the role database. It has a salary of $${answer.roleSalary} and is associated with the ${answer.roleDepartment} department`)
        questions()
      })
    })
      
})
}

function viewAllDepartments() {
  console.log("The viewAllDepartments function is activated")
  const sqlQuery = 'SELECT * from department'
  console.log(sqlQuery)

  db.query(sqlQuery, (err, res) => {
    if (err) throw err;
    console.table(res)
    questions()
  })
}

function addDepartment() {
  console.log("The addDepartment function is activated")
  inquirer
  .prompt({
      type: 'input',
      name: 'addDepartment',
      message: 'Enter a name for the new department:',
  })
  .then((answer) => {
    console.log(answer.addDepartment)
    // The following line write the sql statement to insert the value entered by the user into the database table 'department.' The template litoral answer.addDepartment is how to get the specific response from inquirer. 
    const sqlQuery = `INSERT INTO department (department_name) VALUES ("${answer.addDepartment}")`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, res) => {
      if (err) throw err;
      console.log(`The ${answer.addDepartment} department has been added to the department database.`)
      questions()
    })
  })

}

function init() {
  const longText = 'Welcome to the Employee Tracker System. It is a command-line application that allows business owners to easily view and manage the company departments, roles, and employees.'
  // console.log("Welcome to the Employee Tracker!");
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
        console.log(answer)
        console.log(answer.options)
        // answer.options is only the text of the response of the user; whereas the answers variable contains both the name of the answer (e.g. 'options') and the actual answer (e.g. 'View All Employees). Thus, you need answer.options to make this switch statement to work properly.  
        switch(answer.options){
          case 'View All Employees':
            console.log("Add function to query database for all employees")
            viewAllEmployees()
          break;

          case 'Add Employee':
            console.log("Add function to add an employee to the database")
            addEmployee()
          break;

          case 'Update Employee Role':
            console.log("Add function to update employee role in the database")
            updateEmployeeRole()
          break;

          case 'View All Roles':
            console.log("Add function to query database for all roles")
            viewAllRoles()
          break;

          case 'Add Role':
            console.log("Add function to add a role to the database")
            addRole()
          break;

          case 'View All Departments':
            console.log("Add function to query database for all departments")
            viewAllDepartments()
          break;

          case 'Add Department':
            console.log("Add function to add a department to the database")
            addDepartment()
          break;

          case 'Quit':
            console.log("Add function to exit application")
            db.end()
          break;
        }

      })
      .catch((error) => {
          console.log(error)
      })

}