const Ajv = require('ajv');
const ajv = new Ajv();


module.exports.RegisterValidation = ajv.compile({
    type: 'object',
    properties: {
        email: { type: 'string', pattern: '^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$' },
        password: { type: 'string', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$' },
        passwordTwo: { type: 'string', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$' },
        firstName: { type: 'string', pattern: '^[a-zA-Z\s]*$' },
        lastName: { type: 'string', pattern: '^[a-zA-Z\s]*$' },
        phone: { type: 'string', pattern: '^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,5})|(\\(?\\d{2,6}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$' }
    },
    required: ['email', 'password', 'passwordTwo', 'firstName', 'lastName', 'phone'],
    additionalProperties: false
})


module.exports.LoginValidation = ajv.compile({
    type: 'object',
    properties: {
        email: { type: 'string' },
        password: { type: 'string' }
    },
    required: ['email', 'password'],
    additionalProperties: false
})

module.exports.UpdateUserWithPasswordValidation = ajv.compile({
    type: 'object',
    properties: {
        email: { type: 'string', pattern: '^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$' },
        password: { type: 'string', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$' },
        firstName: { type: 'string', pattern: '^[a-zA-Z\s]*$' },
        lastName: { type: 'string', pattern: '^[a-zA-Z\s]*$' },
        phone: { type: 'string', pattern: '^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,5})|(\\(?\\d{2,6}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$' },
        bio: { type: 'string', pattern: '^[a-zA-Z\s]*$' }
    },
    //required: ['email', 'password', 'firstName', 'lastName', 'phone'],
    additionalProperties: false
})

module.exports.UpdateUserWithoutPasswordValidation = ajv.compile({
    type: 'object',
    properties: {
        email: { type: 'string', pattern: '^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$' },
        firstName: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        lastName: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        phone: { type: 'string', pattern: '^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,5})|(\\(?\\d{2,6}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$' },
        bio: { type: 'string', pattern: '^[a-zA-Z0-9 ]*$' }
    },
})