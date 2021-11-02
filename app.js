const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const projectController = require('./controllers/projectController');
const app = express();

// Conenct DB
mongoose.connect('mongodb://localhost/agency-project-db',{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB Connected Successfully!')
}).catch((error) => {
    console.log(error);
});

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
    methodOverride('_method', {
        methods: ['GET', 'POST'],
    })
);

// ROUTES
app.get('/', projectController.getAllProjects);
app.post('/add-project', projectController.createProject );
app.put('/projects/:id', projectController.updateProject );
app.delete('/projects/:id', projectController.deleteProject );

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});