let connection = require('../config/db')
let moment = require('moment')

class Applicaion {

    constructor(row){
        this.row = row
    }

    get created_at (){
        return moment(this.row.created_at).format("lll")
    }

    static create(app, cb){  
        if(app.usersMode === 'UF' && app.provider === ''){
            cb(null)
        }else{
            connection.query('INSERT INTO apps SET app_name = ?, app_type = ?, description = ?, technology = ?, users_mode = ?, provider = ?, vendor = ?, connexion_url = ?, users_dn = ?, bind_dn = ?, bind_credentials = ?, kerberos_realm = ?, server_principal = ?, key_tab = ?, authentication_mode = ?, facturation_mode=?, payment_mode = ?, created_at = ?', 
            [app.appName, app.appType, app.description, app.technology, app.usersMode, app.provider, app.vendor, app.urlConnexion, app.userDN, app.bindDN, app.bindCredentials, app.kerberosRealm, app.serverPrincipal, app.keyTab, app.authenticationMode, app.facturationMode, app.paymentMode, new Date()], (err, res) =>{
                if(err) throw err
                cb(res)
            })
        }        

    }
}

module.exports = Applicaion