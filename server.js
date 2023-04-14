// Imports the inquirer package in order to ask questions via the command line
const inquirer = require('inquirer');

// Imports the mysql2 package in order to connect to a MySQL database
const mysql = require('mysql2');

// Imports the console.table package in order to conveniently view data in the command line in table format
const cTable = require('console.table')

// Imports the asciiart-logo package in order to spice up the command line interface. 
const logo = require('asciiart-logo')

// Here is where the questions for the user to answer are created.

// TODO: Research whether I need to break these questions up into different arrays (e.g. one array for adding a role and a different array for the main prompt of questions).  
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

console.log(initialQuestion)

const questions = [
    {
        type: 'input',
        name: 'addDepartment',
        message: 'Enter a name for the new department:',
      },
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
        // Not sure how to handle the choices yet. 
        choices: []
      },
      {
        type: 'input',
        name: 'addEmployeeFirstName',
        message: 'Enter a first name for the new employee:',
      },
      {
        type: 'input',
        name: 'addEmployeeLastName',
        message: 'Enter a last name for the new employee:',
      },
      {
        type: 'list',
        name: 'roleEmployee',
        message: 'Select a role for the new employee:',
        // Not sure how to handle the choices yet. 
        choices: []
      },
      {
        type: 'list',
        name: 'managerEmployee',
        message: 'Select a manager for the new employee:',
        // Not sure how to handle the choices yet. 
        choices: []
      },
      {
        type: 'list',
        name: 'updateEmployeeRole',
        message: 'Select an employee whose role needs updating:',
        // Not sure how to handle the choices yet. 
        choices: []
      },
      {
        type: 'list',
        name: 'assignEmployeeRole',
        message: 'Select a new role for the employee:',
        // Not sure how to handle the choices yet. 
        choices: []
      },
    
  ]
function viewAllEmployees() {
  console.log("The viewAllEmployees function is activated")
  init()
}

function addEmployee() {
  console.log("The addEmployee function is activated")
  init()
}

function updateEmployeeRole() {
  console.log("The updateEmployeeRole function is activated")
  init()
}

function viewAllRoles() {
  console.log("The viewAllRoles function is activated")
  init()
}

function addRole() {
  console.log("The addRole function is activated")
  init()
}

function viewAllDepartments() {
  console.log("The viewAllDepartments function is activated")
  init()
}

function addDepartment() {
  console.log("The addDepartment function is activated")
  init()
}

function init() {
  console.log("Welcome to the Employee Tracker!");
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
          break;
        }

      })
      .catch((error) => {
          console.log(error)
      })

}
  
init();