'use strict'
const stripeClient = require('stripe')
/*
options: {
  stripeApiKey: 'i-like-broccoli',
  stripeWebhookSecret: 'and-i-don`t-lie',
  endpoint: 'webhook-endpoint-to-listen-on,
  webhookHandlers: {
    'event1': callBack,
    'event2': callBack
  },
  auth: { strategy: 'session', scope: ['ADMIN'] } // optional
}
*/
exports.plugin = {
  pkg: require('./package.json'),
  register: async function (server, options) {
    const stripe = stripeClient(options.stripeApiKey)
    const stripeWebhookSecret = options.stripeSecret
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
          // if (process.NODE_ENV === 'develop' || process.NODE_ENV === 'test') {
          const payloadString = JSON.stringify(request.payload, null, 2)
          const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret: stripeWebhookSecret
          })
          incomingEvent = stripe.webhooks.constructEvent(payloadString, header, stripeWebhookSecret)
          // } else {
          //   const signature = request.headers['stripe-signature']
          //   incomingEvent = stripe.webhooks.constructEvent(request.payload, signature, stripeWebhookSecret)
          // }
        } catch (error) {
          return h.response(`Webhook Error: ${error.message}`).code(400)
        }

        if (!events.includes(incomingEvent.type)) {
          return h.response(`Unrecognized Event: ${incomingEvent.type}`).code(400)
        } else {
          console.log('###  webhookHandlers[incomingEvent.type]', webhookHandlers[incomingEvent.type])
          return webhookHandlers[incomingEvent.type]
        }
      }
    })
  }
}
