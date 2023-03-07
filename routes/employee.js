const express = require('express')
const router = express.Router()

const authenticate = require('../middleware/authenticate')
const upload = require('../middleware/upload')
const { index, show, store, update, destroy } = require('../controllers/EmployeeController')

router.get('/', authenticate, index)
router.get('/show/:id', show)
router.post('/store', upload.array('avatar[]'), store)
router.put('/update/:id', update)
router.delete('/delete/:id', destroy)

module.exports = router