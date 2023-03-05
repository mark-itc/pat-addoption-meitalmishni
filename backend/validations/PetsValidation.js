const Ajv = require('ajv');
const ajv = new Ajv();


module.exports.AddNewPetValidation = ajv.compile({
    type: 'object',
    properties: {
        type: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        name: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        adoptionStatus: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        height: { type: 'string', pattern: '^[0-9\s]*$' },
        weight: { type: 'string', pattern: '^[0-9\s]*$' },
        color: { type: 'string', pattern: '^[a-zA-Z0-9#\s]*$' },
        bio: { type: 'string', pattern: '[a-zA-Z0-9 ]*$' },
        dietaryRestrictions: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        breed: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        hypoallergenic: { type: 'string', pattern: '^[a-zA-Z\s]*$' },
        pictureName: { type: 'string' },
        pictureType: { type: 'string' },
        pictureBase64: { type: 'string' },
    },
    required: ['type', 'name', 'adoptionStatus', 'height', 'weight', 'color', 'bio', 'dietaryRestrictions', 'breed', 'hypoallergenic', 'pictureName', 'pictureType', 'pictureBase64'],
    additionalProperties: false
})

module.exports.EditPetValidation = ajv.compile({
    type: 'object',
    properties: {
        type: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        name: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        adoptionStatus: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        height: { pattern: '^[0-9\s]*$' },
        weight: { pattern: '^[0-9\s]*$' },
        color: { type: 'string', pattern: '^[a-zA-Z0-9#\s]*$' },
        bio: { type: 'string', pattern: '[a-zA-Z0-9 ]*$' },
        dietaryRestrictions: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        breed: { type: 'string', pattern: '^[a-zA-Z \s]*$' },
        hypoallergenic: { type: 'string', pattern: '^[a-zA-Z\s]*$' },
        picture: { type: 'string' }
    },
    required: ['type', 'name', 'adoptionStatus', 'height', 'weight', 'color', 'bio', 'dietaryRestrictions', 'breed', 'hypoallergenic'],
})