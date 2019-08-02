const Joi = require('@hapi/joi')

const handlerSchema = Joi.object({
  arg: Joi.string(),
  value: Joi.func()
}).pattern(Joi.string(), Joi.func())

const optionsSchema = Joi.object().keys({
  stripeApiKey: Joi.string().token().required(),
  stripeWebhookSecret: Joi.string().token().required(),
  endpoint: Joi.string().required(),
  webhookHandlers: handlerSchema,
  auth: Joi.object()
})

module.exports = { optionsSchema }
