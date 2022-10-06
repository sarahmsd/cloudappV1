const {check} = require('express-validator')
module.exports = {

  validatePassword : check('password')
    // To delete leading and trailing space
    .trim()

    // Validate minimum length of password
    .isStrongPassword({
        minLength: 4,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
    .withMessage('Lower password. It must be 2+ chars long and contain an uppercase, a lowercase and a special character'),


  validateConfirmPassword : check('confirmPassword')    
    // Custom validation
    // Validate confirmPassword
    .custom(async (confirmPassword, {req}) => {
      const password = req.body.password
 
      // If password and confirm password not same
      // don't allow to sign up and throw error
      if(password !== confirmPassword){
        throw new Error('Passwords must be same')
      }
    }),


    validateEmail : check('email')
    .isEmail().normalizeEmail()
    .withMessage('Not a valid email')
    /* .custom(value => {      
        return User.findByEmail(value).then(user => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        })
    }) */,

    validateFirstName : check('firstName', 'Must be 2+ chars long')
    .isLength({ min: 2, max: 20 }),


    validateLastName : check('lastName', 'Must be 2+ chars long')
    .isLength({ min: 2, max: 20 }),

    validatePhone : check('phone', 'Only numbers')
    .isNumeric()
    .isLength({ min: 9, max: 20 }),


    validateUsername : check("username")
    .isLength({ min: 2, max: 10 })
    .withMessage('Must be 2+ chars long')
    /* .custom(value => {
      return User.find({
          username: value
      }).then(user => {
          if (user.length > 0) {
              // Custom error message and reject
              // the promise
              return Promise.reject('Username already in use');
          }
        })
    })*/
    
}