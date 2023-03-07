const Employee = require('../models/Employee')

//Show the list of Employees
const index = async (req, res, next) => {
    try {
        if (req.query.page && req.query.limit) {
            const data = await Employee.paginate({}, {page: req.query.page, limit: req.query.limit})
            res.status(200).json({data})
        } else {
            const employees = await Employee.find({})
            res.send(employees)
        }
    } catch (err) {
        res.json({ message: err})
    }
}

//Show single employee
const show = async (req, res, next) => {
    const employeeID = req.params.id
    try {
        const employee = await Employee.findById(employeeID)
        res.send(employee)
    } catch (err) {
        res.json({message: err})
    } 
}

//Store the employee details
const store = async (req, res, next) => {
    try {
        const employee = {
            name: req.body.name,
            designation: req.body.designation,
            email: req.body.email,
            phone: req.body.phone,
            age: req.body.age
        }
        if (req.files) {
            let path = ''
            req.files.forEach(function(files, index, arr) {
                path = path + files.path + ','
            })
            path = path.substring(0, path.lastIndexOf(','))
            employee.avatar = path
        }
        await Employee.create(employee) 
        res.json({message: 'Employee Added Successfully'})
    } catch (err) {
        res.json({message: err})
    }
}

//Update an employee
const update = async (req, res, next) => {
    let employeeID = req.params.id
    let updateData = {
        name: req.body.name,
        designation: req.body.designation,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age
    }
    try {
        await Employee.findOneAndUpdate(employeeID, {$set: updateData})
        res.json({message: 'Employee updated successfully'})
    } catch (err) {
        res.json({message: err})
    }
}

//Delete an employee
const destroy = async (req, res, next) => {
    let employeeID = req.params.id
    try {
        await Employee.findByIdAndRemove(employeeID)
        res.json({message: 'Employee deleted successfully'})
    } catch (err) {
        res.json({message: err.message})
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
}