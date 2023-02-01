const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const PORT = process.env.PORT || 5000; 
const app = express();

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => console.log('Server start'));
    } catch (error) {
        console.log(error);
    }
};

start();
