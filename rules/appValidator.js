const {check} = require('express-validator')
module.exports = {

    validateAppName : check('appName', 'Must be 2+ chars long')
    .not().isEmpty()
    .isLength({ min: 2, max: 20 }),

    validateAppType : check('appType', 'Must be 2+ chars long')
    .not().isEmpty()
    .isLength({ min: 2, max: 20 }),

    validateUsersMode : check('usersMode')
    .not().isEmpty()
    .withMessage('Choose a providing mode'),

    validateProvider : check('provider')
    .custom(async (provider, {req}) => {
        const usersMode = req.body.usersMode
   
        // If usersMode is UF
        // don't allow the field provider to be empty and throw error
        if(usersMode === 'UF' && provider === ''){
          throw new Error('Add a user provider')
        }
    }),

    validateVendor : check('vendor')
    .custom(async (vendor, {req}) => {
        const provider = req.body.provider
        const urlConnexion = req.urlConnexion
        const userDN = req.userDN
        const bindDN = req.bindDN
        const bindCredentials = req.bindCredentials 
        const kerberosRealm = req.kerberosRealm
        const serverPrincipal = req.serverPrincipal
        const keyTab = req.keyTab
   
        // If provider is Ldap
        // don't allow the field vendor to be empty and throw error
        if(provider === 'ldap'){
          if(vendor === ''){ throw new Error('Select a vendor for ldap') }
          if(urlConnexion === ''){ throw new Error('Add a urlConnexion') }
          if(userDN === ''){ throw new Error('Add user DN') }
          if(bindDN === ''){ throw new Error('Add bind DN') }
          if(bindCredentials === ''){ throw new Error('Add bind credentials') }
        }else if(provider === 'kerberos'){
          if(kerberosRealm === ''){ throw new Error('Add kerberos realm') }
          if(serverPrincipal === ''){ throw new Error('Add server principal') }
          if(keyTab === ''){ throw new Error('Add key tab') }
        }
    }),

    validateAuthenticationMode : check('authenticationMode')
    .not().isEmpty()
    .withMessage('Choose an authentication mode'),

    validateFacturationMode : check('facturationMode')
    .not().isEmpty()
    .withMessage('Choose a facturation mode'),

    validatePaymentMode : check('paymentMode')
    .not().isEmpty()
    .withMessage('Choose a payment mode'),

    /* validateFileUsers : check('fileusers')
    .custom(async (fileusers, {req}) => {
        const usersMode = req.body.usersMode
   
        // If usersMode is file
        // don't allow the field fileusers to be empty and throw error
        if(usersMode === 'file' && fileusers === ''){
          throw new Error('Add a file data for users')
        }
    }), */

}