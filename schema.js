const Joi = require("joi");


module.exports.personSchema = Joi.object({
    person:Joi.object({
        name:Joi.string().required(),
        phone:Joi.number().required(),
        email:Joi.string().required(),
        password:Joi.string().required(),
        city:Joi.string().required(),
        state:Joi.string().required(),
    }).required()
})