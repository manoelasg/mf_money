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

    //Consistência de e-mail válido
    let email = request.body.emailUsuario;
    let emailValido = (email) => {
        if (email.search("@") < 0 || email.search(" ") > 0 || email.length < 10)
            return false;
        else
            return true;
    }
    console.log(`E-mail ${email} valido: ${emailValido(email)}`);

    //Consistência de nome preenchido
    let nome = request.body.nomeUsuario;
    let nomeValido = nome.length > 0;
    console.log(`Nome: ${nome} valido: ${nomeValido}`);

    //Consistência de tipo de usuário;
    let tipoUsuario = request.body.tipoUsuario;
    let usuarioValido = tipoUsuario.length > 0;
    console.log(`Tipo: ${tipoUsuario} valido: ${usuarioValido}`);

    //Roteia para a tela de acordo com a consistência do input
    if (emailValido(email) && nomeValido && usuarioValido) {
        //Lógica para enviar e-mail - implementar
        response.render('email_enviado', {faca_parte: true});
    } else
        response.render('faca_parte', {faca_parte: true});

    //Salva usuário no "banco de dados" adequado
    if (usuarioValido && tipoUsuario === "credor")
        arrayPodeAjudar.push(nome);
    else if (usuarioValido && tipoUsuario === "tomador")
        arrayPrecisaAjuda.push(nome);

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
