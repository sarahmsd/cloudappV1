const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const flash = require('./middlewares/flash')
const session = require('express-session')
let Keycloak = require('keycloak-connect');
let memoryStore = new session.MemoryStore();
let keycloak = new Keycloak({ store: memoryStore });
const { validateEmail, validateFirstName, validateLastName, validatePhone, validateUsername, validatePassword, validateConfirmPassword } = require('./rules/validator')
const { validateAppName, validateAppType, validateAuthenticationMode, validateFacturationMode, validateProvider, validateUsersMode, validatePaymentMode, validateVendor } = require('./rules/appValidator')
const assocTab = require('./rules/helpers')
const user = require('./models/user')
const application = require('./models/application')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { response } = require('express')
const io = new Server(server);

//View engine
app.set('view engine', 'ejs')

//Middlewares
app.use('/assets', express.static('public'))
app.use('/css', express.static('node_modules/bootstrap/dist/css'))
app.use('/js', express.static('node_modules/bootstrap/dist/js'))
app.use('/js', express.static('node_modules/jquery/dist'))
app.use(session({
    secret: "cloudApp",
    saveUninitialized: true,
    resave: false,
    store: memoryStore
}))
app.use( keycloak.middleware({
    logout: '/logout'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash)

app.get('/', (request, response) =>{
    response.render('pages/index')
})

app.get('/logout', (request, response) =>{
    response.redirect('/')
})

app.get('/login', (request, response) =>{
    response.render('auth/login')
})

app.post('/login', (request, response) =>{
    if(request.body.username === undefined || request.body.username === '' || request.body.password === undefined || request.body.password === ''){
        request.flash('error', "Les champs username et password ne peuvent être vide")
        response.redirect('/login')
    }else{
        let User = require('./models/user')
        User.login(request.body.username, request.body.password, (user)=>{
            if(user.row == ''){
                request.flash('error', 'Identifiant ou mot de passe incorrect. Veuillez réessayer!')
                response.redirect('/login')
            }else{
                request.flash('success', 'Bienvenue ' + user.username + '!')
                response.redirect('/apps/show')
            }
        })        
    }
})

app.get('/signup', (request, response)=>{
    response.render('auth/signup')
})

app.post('/signup', 
    [
        validatePassword,
        validateConfirmPassword,
        validateEmail,
        validateFirstName,
        validateLastName,
        validatePhone,
        validateUsername,
    ],  
    async (request, response) => {
        const rs = validationResult(request)
        if(!rs.isEmpty()){
            let errors = rs.errors
            errors = assocTab(errors)
            return response.render('auth/signup', {errors})
        }
        const {firstName, lastName, phone, email, organization, username, password} = request.body
        await user.create({firstName, lastName, phone, email, organization, username, password}, () =>{
                request.flash('success', 'Signup Successfully')
                response.redirect('/login')
        })        
})

app.get('/admin', (request, response) => {
    response.render('pages/sidebar')
})



/**
 * Aplications
 */

app.get('/apps/create', keycloak.protect(), (request, response) =>{
    response.render('applications/create')
})

app.post('/apps/create', keycloak.protect(), 
    [
        validateAppName,
        validateAppType,
        validateAuthenticationMode,
        validateFacturationMode,
        validateProvider,
        validateUsersMode,
        validatePaymentMode,
        validateVendor
    ],

    async (request, response) =>{
    const rs = validationResult(request)
        if(!rs.isEmpty()){
            let errors = rs.errors
            errors = assocTab(errors)
            return response.render('applications/create', {errors, data: request.body})
        }
    const {appName, appType, description, technology, usersMode, provider, vendor, urlConnexion, userDN, bindDN, bindCredentials, kerberosRealm, serverPrincipal, keyTab, authenticationMode, facturationMode, paymentMode} = request.body
        application.create({appName, appType, description, technology, usersMode, provider, vendor, urlConnexion, userDN, bindDN, bindCredentials, kerberosRealm, serverPrincipal, keyTab, authenticationMode, facturationMode, paymentMode}, 
            (res) =>{
            if(res === null){
                request.flash('error', 'An error occurs! Retry!')
                response.redirect('/apps/create')
            }else{
                recap = request.body
                return response.render('applications/create', {recap})
            }
        }) 
})


app.get('/apps/show', keycloak.protect(), (request, response) => {
    response.render('applications/show')
})

app.get('/apps/single-app', keycloak.protect(), (request, response) => {
    response.render('applications/single-app')
})

app.get('/unsubscribe', keycloak.protect(), (request, response) => {
    response.render('auth/unsubscribe')
})


app.listen(8082, (err) =>{
    if(err) console.log(err)
    else console.log("Le serveur a bien démaré")
})