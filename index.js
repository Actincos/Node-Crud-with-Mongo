var mongoose = require('mongoose');
var express = require('express');
const cors = require("cors");

var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var methodOverride = require('method-override');
 
var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
 
var Employee = require('./models/employee');

var corsOptions = {
	origin: "http://localhost:3000"
  };
  app.use(cors(corsOptions));
  // parse requests of content-type - application/json
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
 
mongoose.connect(database.url);
 
// connect to database
const db = mongoose.connection
// if error
db.on("error", (err) => {
  console.error(`err: ${err}`);
}); // if connected
db.on('connected', (err, res) => {
  console.log('Connected to database!');
});

app.listen(port);
console.log("App listening on port : " + port);


//get all employee data from db
app.get('/api/employees', function(req, res) {
	// use mongoose to get all todos in the database
	Employee.find(function(err, employees) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(employees); // return all employees in JSON format
	});
});


// get a employee with ID of 1
app.get('/api/employees/:employee_id', function(req, res) {
	let id = req.params.employee_id;
	Employee.findById(id, function(err, employee) {
		if (err)
			res.send(err)
 
		res.json(employee);
	});
 
});


// create employee and send back all employees after creation
app.post('/api/employees', function(req, res) {
	  //check if req.body is empty
	  if (!Object.keys(req.body).length) {
		res.status(400).json({
		message: 'Request body cannot be empty'
	  })
	  }
	// create mongoose method to create a new record into collection
	Employee.create({
		name : req.body.name,
		salary : req.body.salary,
		age : req.body.age
	}, function(err, employee) {
		if (err)
			res.send(err);
 
		// get and return all the employees after newly created employe record
		Employee.find(function(err, employees) {
			if (err)
				res.send(err)
			res.json(employees);
		});
	});
 
});


// update employee and send back all employees after creation
app.put('/api/employees/:employee_id', function(req, res) {
	// create mongose method to update a existing record into collection
	let id = req.params.employee_id;
	var data = {
		name : req.body.name,
		salary : req.body.salary,
		age : req.body.age
	}
 
	// save the user
	Employee.findByIdAndUpdate(id, data, function(err, employee) {
	if (err) throw err;
 
	res.send('Successfully! Employee updated - '+employee.name);
	});
});


// delete a employee by id
app.delete('/api/employees/:employee_id', function(req, res) {
	console.log(req.params.employee_id);
	let id = req.params.employee_id;
	Employee.deleteOne({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Employee has been Deleted.');	
	});
});