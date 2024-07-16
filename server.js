const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const Food = require('./model/food.js');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log((`connected to MongoDB`));
});

const app = express();

// middleware
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

// Landing page
app.get('/', (req, res) => {
    res.render('index.ejs');
})

// creat -> get food info
app.get('/foods/new', (req, res) => {
    res.render('foods/new.ejs');
});


app.get('/foods', async(req, res) => {
    const allFoods = await Food.find();
    res.render('foods/index.ejs', { foods: allFoods})});

 // post -> create food
app.post('/foods', async (req, res) => {
    if (req.body.isReadyToEat === 'on'){
        req.body.isReadyToEat = true;
    }else {
        req.body.isReadyToEat = false;
    }
    await Food.create(req.body);
    res.redirect('/foods');
});

app.get('/foods/:foodId', async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    res.render('foods/show.ejs', { 
        food: foundFood 
    });
});

// edit a food
app.get('/foods/:foodId/edit',async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    res.render('foods/edit.ejs', {
        food: foundFood
    });
});

app.delete('/foods/:foodId', async (req, res) => {
    await Food.findByIdAndDelete(req.params.foodId);
    res.redirect('/foods');
});

// updating of a food
app.put('/foods/:foodId', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true 
    } else {
        req.body.isReadyToEat = false
    };
    await Food.findByIdAndUpdate(req.params.foodId, req.body)
    res.redirect(`/foods/${req.params.foodId}`)
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});