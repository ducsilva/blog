const express = require('express');
const app = new express();
const path = require('path');
const ejs = require('ejs');
app.set('view engine', 'ejs');
const expressSession = require('express-session');

// const fileUpload = require('express-fileupload');


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.raw());
app.use(expressSession({
    secret: 'keyboard cat'
}))
// app.use(fileUpload());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true })

const fileUpload = require('express-fileupload')
app.use(fileUpload());

//import controllers
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
//middleware validate
const validateMiddleware = require("./middleware/validationMiddleware");
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

//Đăng ký thư mục public.....
app.use(express.static('public'))

//Tao server
app.listen(4000, () => {
    console.log('OK. App listening on port 4000')
})


app.get('/', homeController);
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.get('/post', (req, res) => {
    res.render('post');
})

app.get('/post/:id', getPostController)

app.get('/posts/new', authMiddleware, newPostController);

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

app.post('/posts/store', storePostController);

app.use('/posts/store', authMiddleware, validateMiddleware)

