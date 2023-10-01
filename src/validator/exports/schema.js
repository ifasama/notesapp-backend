const Joi = require('joi');

const ExportNotePayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
  // tlds means it should be email with domains listed on IANA
});

module.exports = ExportNotePayloadSchema;
