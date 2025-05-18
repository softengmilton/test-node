const express = require('express');
const app = express();
const router = require('./router/auth-router');

app.use('/api/auth', router);



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});