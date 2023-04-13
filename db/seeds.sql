INSERT INTO department (department_name)
VALUES ("Information Technology"),
       ("Research and Development"),
       ("Human Resources"),
       ("Finance and Accounting"),
       ("Software Products"),
       ("Legal"),
       ("Marketing"),
       ("Network Operations")
       ("Executive Management");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Software Developer", 150000, 5),
       ("Junior Software Developer", 75000, 5),
       ("Research Analyst", 65000, 2),
       ("Lead Researcher", 95000, 2),
       ("Marketing Director", 100000, 7),
       ("Brand Manager", 90000, 7),
       ("Accountant", 75000, 4),
       ("Accounting Director", 125000, 4),
       ("Financial Analyst", 85000, 4),
       ("Network Administrator", 90000, 8),
       ("Cloud Architect", 115000, 8),
       ("SQL Developer", 80000, 1),
       ("Computer Programmer", 70000, 1),
       ("Director of Human Resources", 145000, 3),
       ("Administrative Assistant", 50000, 3),
       ("Attorney", 285000, 6),
       ("Paralegal", 75000, 6)
       ("Chief Executive Officer", 575000, 9);  

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Stephanie","Portman",15, 2)
       ("Symphony","Keller",14,18)
       ("Renee","Baldwin",9,4)
       ("Jack","Miller",8,18)
       ("Simon","Lind",7,4)
       ("Doreen","Beryl",17,7)
       ("Colby","Sheen",16,)
       ("Cindy","Caden",13,1)
       ("Mason","Hunter",12,1)
       ("Ronan","Pierce",11,1)
       ("Edna","Hale",10,1)
       ("Luis","Reeves",6,5)
       ("Christopher","O'Ryan",5,18)
       ("Hope","Wilkerson",4,18)
       ("Charlie","Hogan",3,15)
       ("Elinor","Mueller",2,1)
       ("Yusuf","Lara",1,18)
       ("Isaac","Dalton",18,)
       ;    