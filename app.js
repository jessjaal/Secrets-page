//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
//const encrypt = require('mongoose-encryption');      se sustituye esta funcion con el hash (md5), el cual es mas seguro.
const md5 = require('md5');

const port = 3000;
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


//CONEXIÓN Y CONFIGURACIÓN DE BASE DE DATOS
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//const secret = 'thisismylittlesecret.';             es una practica insegura colocar el secreto en el codigo de la app
//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });         es un nivel de seguridad mayor, pero puede ser decodificado

const User = new mongoose.model("User", userSchema);


//VISUALIZAR PAGINAS
app.get("/", (req,res) => {
  res.render("home");
})

app.get("/login", (req,res) => {
  res.render("login");
})

app.get("/register", (req,res) => {
  res.render("register");
})


//ENVIAR INFORMACIÓN A LAS PÁGINAS
app.post("/register", (req,res) => {

  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser.save()
    .then(() => {
      res.render("secrets");           //SOLO SE VISUALIZA SI HAY UN REGISTRO O UN LOGIN
    })
    .catch(function(err){
      console.log(err);
    }) ;

})

app.post("/login", (req,res) => {

  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email: username})
    .then (foundUser => {
      if (md5(foundUser.password) === password) {
        res.render("secrets");
      } else {
        console.log("usuario y contraseña no coinciden");
      }
    })
    .catch(err => {
      console.log(err);
    });

})


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
