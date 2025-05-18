const express = require('express')
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hello World')
})
router.get('/signup', (req, res) => {
    res.status(200).send('Signup Page')
})


module.exports = router;