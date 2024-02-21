const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes/index');
var fs = require('fs');

require('dotenv').config();
require('./database/connection')();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.static('public'));

const dir = 'public/uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Routes
app.use('/api',routes);

app.get('/', (req, res)=> res.send('Working'))

const PORT  = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Node App Running at http://localhost:${PORT}`));