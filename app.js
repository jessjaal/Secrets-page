//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
//const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');

const saltRounds = 10;      //rondas de "salazón" para bcrypt
const port = 3000;
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


//CONEXIÓN Y CONFIGURACIÓN DE BASE DE DATOS
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true})
  .then(() => {
    console.log('DB connected');;           //SOLO SE VISUALIZA SI HAY UN REGISTRO O UN LOGIN
  })
  .catch(function(err){
    console.log(err);
  }) ;


const userSchema = {
  email: String,
  password: String
};

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

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if (err){

      console.log("Error en salazón");

    } else {

      const newUser = new User({
        email: req.body.username,
        password: hash
      });

      newUser.save()
        .then(() => {
          res.render("secrets");           //SOLO SE VISUALIZA SI HAY UN REGISTRO O UN LOGIN
        })
        .catch(function(err){
          console.log(err);
        }) ;

    }  // Store hash in your password DB.
  });

})

app.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username})
    .then (foundUser => {

      bcrypt.compare(password, foundUser.password, function(err, result) {
        if (result == true) {
          res.render("secrets");
        } else {
          console.log("usuario y contraseña no coinciden");
        }
      });

    })
    .catch(err => {
      console.log(err);
    });

})


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
