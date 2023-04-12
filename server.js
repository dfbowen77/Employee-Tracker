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
const questions = [
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
    //   START HERE TOMORROW WITH MORE QUESTIONS
  ]