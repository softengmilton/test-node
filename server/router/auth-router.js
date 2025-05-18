const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth-controller')


router.get('/', (req, res) => {
    res.send('Hello World')
})
router.get('/signup', (req, res) => {
    res.status(200).send('Signup Page')
})

router.route('/login').get((req, res) => {
    res.status(200).send('Login Page')
});


router.get('/home',authController.home); 


module.exports = router;