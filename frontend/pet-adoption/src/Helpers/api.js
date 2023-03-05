import AWS from 'aws-sdk';

export async function getUserDetails(userId, authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authApiKey}`
            }
        });

        let results;

        if (!repsonse.ok) {
            results = JSON.parse(await repsonse.text()).message;
        }

        results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }

}

export async function getUsersList(authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authApiKey}`
            }
        });

        let results;

        if (!repsonse.ok) {
            results = JSON.parse(await repsonse.text()).message;
        }

        results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}


export async function getPetsList(authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/pet`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authApiKey}`
            }
        });

        let results;

        if (!repsonse.ok) {
            results = JSON.parse(await repsonse.text()).message;
        }

        results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}


export async function getUsersPets(userId, authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/pet/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authApiKey}`
            }
        });

        let results;

        if (!repsonse.ok) {
            results = JSON.parse(await repsonse.text()).message;
        }

        results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}

export async function getPetById(petId, authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/pet/${petId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authApiKey}`
            }
        });

        let results;

        if (!repsonse.ok) {
            results = JSON.parse(await repsonse.text()).message;
        }

        results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}


export async function returnPet(petId, authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/pet/${petId}/return`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authApiKey}`
            }
        });

        if (!repsonse.ok) {
            return { success: false, data: JSON.parse(await repsonse.text()).message }
        }

        let results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}

export async function savePet(petId, authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/pet/${petId}/save`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authApiKey}`
            }
        });

        if (!repsonse.ok) {
            return { success: false, data: JSON.parse(await repsonse.text()).message }
        }

        let results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}


export async function deleteSavedPet(petId, authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/pet/${petId}/save`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authApiKey}`
            }
        });

        if (!repsonse.ok) {
            return { success: false, data: JSON.parse(await repsonse.text()).message }
        }

        let results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}


export async function setPetAdoption(petId, authApiKey, status) {

    try {
        const repsonse = await fetch(`http://localhost:3001/pet/${petId}/adopt`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                'Authorization': `Bearer ${authApiKey}`
            },
            body: JSON.stringify({ status: status })
        });

        if (!repsonse.ok) {
            return { success: false, data: JSON.parse(await repsonse.text()).message }
        }

        let results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}


export async function getUsersPetsById(userId, authApiKey) {

    try {
        const repsonse = await fetch(`http://localhost:3001/user/${userId}/full`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                'Authorization': `Bearer ${authApiKey}`
            },
        });

        if (!repsonse.ok) {
            return { success: false, data: JSON.parse(await repsonse.text()).message }
        }

        let results = await repsonse.json();
        return { success: true, data: results }

    } catch (error) {
        return { success: false, data: error }
    }
}


export function getAWSimage(imageKey) {

    AWS.config.update({
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        region: 'me-central-1'
    });
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.REACT_APP_BUCKET_NAME,
        Key: imageKey,
        Expires: 60 * 60
    };

    const image = s3.getSignedUrl('getObject', params);

    return image;
}


export function findFormErrors(form, buttonText) {
    const { email, password, passwordTwo, firstName, lastName, phone } = form;
    const newErrors = {}

    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const nameRegex = /^[a-zA-Z\s]*$/;
    const phoneRegex = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

    if (!email || email === '' || !emailRegex.test(email)) newErrors.email = 'Please provide a valid email.'

    if ((buttonText !== 'Save changes' && (!password || password === '' || !passwordRegex.test(password))) || (buttonText === 'save changes' && password !== '' && !passwordRegex.test(password))) newErrors.password = 'Password must contain at least 8 characters. One uppercase letter, one lowercase letter and one number.'

    if (buttonText === 'Signup' && (!passwordTwo || passwordTwo === '' || passwordTwo !== password)) newErrors.passwordTwo = 'Password and Confirm Password does not match.'

    if (buttonText === 'Signup' && (!firstName || firstName === '' || !nameRegex.test(firstName))) newErrors.firstName = 'First name must contain letters'

    if (buttonText === 'Signup' && (!lastName || lastName === '' || !nameRegex.test(lastName))) newErrors.lastName = 'Last name must contain letters'

    if (buttonText === 'Signup' && (!phone || phone === '' || !phoneRegex.test(phone))) newErrors.phone = 'Please provide a valid phone.'

    return newErrors
}


export const handleFormValidation = (form, buttonText) => {
    const newErrors = findFormErrors(form, buttonText);

    return newErrors;
};

function findAddPetFormErrors(form) {
    const { type, name, adoptionStatus, height, weight, color, bio, dietaryRestrictions, breed, hypoallergenic, pictureType } = form;
    const newErrors = {}

    const textRegex = /^[a-zA-Z \s]*$/;
    const textAreaRegex = /[a-zA-Z0-9 ]*$/;
    const numberRegex = /^[0-9\s]*$/;
    const pictureValidExtensions = ['png', 'jpeg', 'jpg'];

    if (!type || type === '' || !textRegex.test(type)) newErrors.type = 'Please provide a valid type.'
    if (!name || name === '' || !textRegex.test(name)) newErrors.name = 'Please provide a valid name.'
    if (!adoptionStatus || adoptionStatus === '' || !textRegex.test(adoptionStatus)) newErrors.adoptionStatus = 'Please provide a valid adoption status.'
    if (!height || height === '' || !numberRegex.test(height)) newErrors.height = 'Please provide a valid height.'
    if (!weight || weight === '' || !numberRegex.test(weight)) newErrors.weight = 'Please provide a valid weight.'
    if (!color || color === '' || !textRegex.test(color)) newErrors.color = 'Please provide a valid color.'
    if (!bio || bio === '' || !textAreaRegex.test(bio)) newErrors.bio = 'Please provide a valid bio.'
    if (!dietaryRestrictions || dietaryRestrictions === '' || !textRegex.test(dietaryRestrictions)) newErrors.dietaryRestrictions = 'Please provide a valid dietary restrictions.'
    if (!breed || breed === '' || !textRegex.test(breed)) newErrors.breed = 'Please provide a valid breed.'
    if (!hypoallergenic || hypoallergenic === '' || !textRegex.test(hypoallergenic)) newErrors.hypoallergenic = 'Please provide a valid hypoallergenic.'
    if (!pictureType || !pictureValidExtensions.includes(pictureType.split('/')[1])) newErrors.picture = 'Please provide a valid file.'

    return newErrors;
}

export const handleAddPetFormFormValidation = (form) => {
    const newErrors = findAddPetFormErrors(form);

    return newErrors;
};


function findUpdatePetFormErrors(form) {
    const { type, name, adoptionStatus, height, weight, color, bio, dietaryRestrictions, breed, hypoallergenic } = form;
    const newErrors = {}

    const textRegex = /^[a-zA-Z \s]*$/;
    const textAreaRegex = /[a-zA-Z0-9 ]*$/;
    const numberRegex = /^[0-9\s]*$/;

    if (!type || type === '' || !textRegex.test(type)) newErrors.type = 'Please provide a valid type.'
    if (!name || name === '' || !textRegex.test(name)) newErrors.name = 'Please provide a valid name.'
    if (!adoptionStatus || adoptionStatus === '' || !textRegex.test(adoptionStatus)) newErrors.adoptionStatus = 'Please provide a valid adoption status.'
    if (!height || height === '' || !numberRegex.test(height)) newErrors.height = 'Please provide a valid height.'
    if (!weight || weight === '' || !numberRegex.test(weight)) newErrors.weight = 'Please provide a valid weight.'
    if (!color || color === '' || !textRegex.test(color)) newErrors.color = 'Please provide a valid color.'
    if (!bio || bio === '' || !textAreaRegex.test(bio)) newErrors.bio = 'Please provide a valid bio.'
    if (!dietaryRestrictions || dietaryRestrictions === '' || !textRegex.test(dietaryRestrictions)) newErrors.dietaryRestrictions = 'Please provide a valid dietary restrictions.'
    if (!breed || breed === '' || !textRegex.test(breed)) newErrors.breed = 'Please provide a valid breed.'
    if (!hypoallergenic || hypoallergenic === '' || !textRegex.test(hypoallergenic)) newErrors.hypoallergenic = 'Please provide a valid hypoallergenic.'

    return newErrors;
}

export const handleUpdatePetFormFormValidation = (form) => {
    const newErrors = findUpdatePetFormErrors(form);

    return newErrors;
}

