require('dotenv').config();
const express = require('express');

const connectDB = require('./utils/db');
const authRoutes = require('./router/auth');
const resumeRoutes = require('./router/resume');
const templateRoutes = require('./router/template');


const app = express();
app.use(express.json());
// 3. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/resumes', resumeRoutes);

// 4. Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});



connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port 3000');
    });
});

