var empId = 1;

let id = Symbol("id");

//Emp Id Getter
function getEmpId() {
  empId += 1;
  return empId - 1;
}

//Object with Constructor
let employeeDetails = function (name, email) {
  this.name = name;
  this.email = email;
  this[id] = getEmpId();
};

// adding some methods
employeeDetails.prototype.toString = function temp() {
  return this.name + " :: " + this.email;
};

// details
let emp1 = new employeeDetails("sumanth", "sumanth@gmail.com");
let emp2 = new employeeDetails("sumanth1", "sumanth1@gmail.com");

// Iterator
Object.keys(emp1).forEach((k) => {
  console.log(k + " :: " + emp1[k]);
});

// Accessing Symbols
console.log("Emp Id :: " + emp1[id]);

// Reference
let tempEmp1 = emp1;
tempEmp1.name = "tempEmp1";
console.log(emp1);

// Copying
let temp2 = Object.assign({}, emp2);
temp2.name = "tempEmp2";
console.log(emp2);

// Optional chaning
let street = emp1.address ? emp1.address.street : "No Street";
console.log(street);
console.log(emp1?.address);

