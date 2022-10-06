let connection = require('../config/db')
let moment = require('moment')

class User {

    constructor(row){
        this.row = row
    }

    get username (){
        return this.row.username
    }

    get created_at (){
        return moment(this.row.created_at).format("lll")
    }

    get password() {
        return this.row.password
    }

    get id() {
        return this.row.id
    }

    static login(useranme, password, cb){
        connection.query('SELECT * FROM users WHERE username=? AND password=? LIMIT 1', [useranme, password], (err, rows) =>{
            if(err) throw err
            if(rows.length > 0){
                cb(new User(rows[0]))
            }else{
                cb(new User(""))
            }
        })

    }

    static create(user, cb){
        connection.query('INSERT INTO users SET first_name = ?, last_name = ?, username = ?, email = ?, organization = ?, phone = ?, password=?, created_at = ?', [user.firstName, user.lastName, user.username, user.email, user.organization, user.phone, user.password, new Date()], (err, res) =>{
            if(err) throw err
            cb(res)
        })
    }

    static all (cb){
        connection.query('SELECT * FROM users', (err, rows) =>{
            if(err) throw err
            cb(rows.map((row) => new User(row)))
        })
    }
}

module.exports = User