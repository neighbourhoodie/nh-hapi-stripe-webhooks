'use strict'

const stripeClient = require('stripe')
const Joi = require('@hapi/joi')

const { optionsSchema } = require('./lib/validation')
/*
options: {
  stripeApiKey: 'i-like-broccoli',
  stripeWebhookSecret: 'and-i-don`t-lie',
  endpoint: 'webhook-endpoint-to-listen-on',
  webhookHandlers: {
    'event1': callBack,
    'event2': callBack
  },
  auth: { strategy: 'session', scope: ['ADMIN'] } // optional
}
*/

const createStripeEvent = ({ payload, stripeApiKey, stripeWebhookSecret, headers }) => {
  const stripe = stripeClient(stripeApiKey)
  const signature = headers['stripe-signature']
  return stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret)
}

exports.plugin = {
  pkg: require('./package.json'),
  register: async function (server, options) {
    const { error } = Joi.validate(options, optionsSchema, { abortEarly: true })
    if (error) {
      throw new Error(`Options validation error: ${error}`)
    }

    const stripeWebhookSecret = options.stripeWebhookSecret
    const stripeApiKey = options.stripeApiKey
    const webhookHandlers = options.webhookHandlers
    const events = Object.keys(webhookHandlers)

    server.route({
      method: 'POST',
      path: options.endpoint,
      config: {
        auth: options.auth || false
      },
      handler: function (request, h) {
        let incomingEvent
        try {
          incomingEvent = createStripeEvent({
            payload: request.payload,
            stripeApiKey,
            stripeWebhookSecret,
            headers: request.headers
          })
        } catch (error) {
          return h.response(`Webhook Error: ${error.message}`).code(400)
        }

        if (!events.includes(incomingEvent.type)) {
          return h.response(`Unrecognized Event: ${incomingEvent.type}`).code(400)
        } else {
          const result = webhookHandlers[incomingEvent.type](incomingEvent)
          return h.response(result).code(200)
        }
      }
    })
  }
}
