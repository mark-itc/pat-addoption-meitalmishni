require('dotenv').config();
const cors = require("cors");
const express = require('express');
const { initDB, closeConneciton } = require('./models/init')
const UsersController = require('./controllers/UsersController');
const PetsController = require('./controllers/PetsController');
const UsersPetsController = require('./controllers/UsersPetsController');
const SavedPetsController = require('./controllers/SavedPetsController');
const { AuthMiddleware } = require('./middlewares/AuthMiddleware');
const { AdminMiddleware } = require('./middlewares/AdminMiddleware');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const AWS = require('aws-sdk');
const base64 = require('base64-js');


const app = express();
const port = 3001;

app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: 52428800 }));
app.use(express.urlencoded({ limit: 52428800 }));


app.post('/signup', UsersController.Signup);
app.post('/login', UsersController.Login);

app.get('/pet/user/:id', AdminMiddleware, UsersPetsController.GetUserPets);
app.post('/pet', AdminMiddleware, PetsController.AddNewPet);
app.get('/pet/:id', AuthMiddleware, PetsController.GetPet);
app.post('/pet/:id/return', AuthMiddleware, PetsController.ReturnPet);
app.post('/pet/:id/save', AuthMiddleware, SavedPetsController.SavePet);
app.delete('/pet/:id/save', AuthMiddleware, SavedPetsController.DeleteSavePet);
app.post('/pet/:id/adopt', AuthMiddleware, PetsController.AdoptPet);
app.put('/pet/:id', AdminMiddleware, PetsController.EditPet);
app.get('/pet/:type?/:adoption_status?/:height?/:weight?/:name?', AuthMiddleware, PetsController.SearchPets);

app.get('/user/:id/full', AuthMiddleware, UsersController.GetFullUser)
app.get('/user/:id', AuthMiddleware, UsersController.GetUser);
app.put('/user/:id', AuthMiddleware, UsersController.UpdateUser);
app.get('/user', AdminMiddleware, UsersController.GetUsersList);


initDB().then(() => {
    try {
        app.listen(port, () => {
            console.log('Express running');
        })
    } catch (e) {
        closeConneciton();
    }
})



