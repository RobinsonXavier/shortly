import joi from 'joi';

const signupSchema = joi.object({
    username: joi.string().required().min(3).max(25),
    email: joi.string().email({minDomainSegments: 2, tlds: { allow: ['com', 'net']}}).required(),
    password: joi.string().min(8).required()
});

const singinSchema = joi.object({
    username: joi.string().required().min(3).max(25),
    password: joi.string().required().min(8)
})

export {signupSchema, singinSchema};