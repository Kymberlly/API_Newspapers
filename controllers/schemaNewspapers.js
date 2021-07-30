const Joi = require('joi');

const schemaNewspapers = Joi.object({
    "Newspaper": Joi.string().required(),
    "Daily Circulation, 2004": Joi.number().required(),
    "Daily Circulation, 2013": Joi.number().required(),
    "Change in Daily Circulation, 2004-2013": Joi.number().required(),
    "Pulitzer Prize Winners and Finalists, 1990-2003": Joi.number().required(),
    "Pulitzer Prize Winners and Finalists, 2004-2014": Joi.number().required(),
    "Pulitzer Prize Winners and Finalists, 1990-2014": Joi.number().required()
});

module.exports = schemaNewspapers;