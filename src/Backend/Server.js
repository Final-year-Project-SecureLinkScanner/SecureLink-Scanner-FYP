const express = require('express');
const appRoutes = require('./app');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Import routes from app.js
app.use('/api', appRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});