// Requerimentos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const podem_ajudar = require('./data/podem_ajudar.json');
const precisam_ajuda = require('./data/precisam_ajuda.json');
const contatos = require('./data/contatos.json')

let arrayPrecisaAjuda = [];
let arrayPodeAjudar = [];

// Inicializa app web
const app = express();

// Configuração Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middlewares
app.use(session({secret: 'mf_money'}));
app.use(express.static('assets'));
app.use(bodyParser.urlencoded());

// Rotas
app.get('/', (request, response) => {
    response.render('index', {home: true});
});

app.get('/quem_esta_aqui', (request, response) => {
    response.render('quem_esta_aqui', {quem_esta_aqui: true, podem_ajudar: podem_ajudar, precisam_ajuda: precisam_ajuda});
});

app.get('/faca_parte', (request, response) => {
    response.render('faca_parte', {faca_parte: true});
});
app.post('/faca_parte', (request, response) => {

    if (request.body.tipoUsuario === "credor"){
        response.render('email_enviado', {faca_parte: true});
        arrayPodeAjudar.push(request.body.nomeUsuario);
    } else if (request.body.tipoUsuario === "tomador") {
        arrayPrecisaAjuda.push(request.body.nomeUsuario);
        response.render('email_enviado', {faca_parte: true});
    } else {
        response.render('faca_parte', {faca_parte: true});
    }

    console.log("Credor: " + arrayPodeAjudar);
    console.log("Tomador: " + arrayPrecisaAjuda);
});

app.get('/contato', (request, response) => {
    response.render('contato', {contato: true, contatos: contatos});
});

// Gera servidor
app.listen(3000, () => {
    console.log('Servidor inicializado na porta 3000');
});
