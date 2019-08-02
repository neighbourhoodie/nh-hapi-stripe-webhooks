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
  }
}
*/
exports.plugin = {
  pkg: require('./package.json'),
  register: async function (server, options) {
    const stripe = stripeClient(options.stripeApiKey)
    const stripeWebhookSecret = options.stripeSecret

    const events = Object.keys(options.webhookHandlers)
    // TODO Add endpoints with the API
    // var stripe = require("stripe")("pk_test_YYRzw2aYYExcOmSFpoHvTwLU0045dwEqjb")
    // const endpoint = stripe.webhookEndpoints.create({
    //   url: options.endpoint,
    //   enabled_events: events
    // }, function(err, webhookEndpoint) {
    //   // asynchronously called
    // })

    server.route({
      method: 'POST',
      path: options.endpoint,
      config: {
        auth: false
      },
      handler: function (request, h) {
        // const signature = request.headers['stripe-signature']
        const payloadString = JSON.stringify(request.payload, null, 2)

        const header = stripe.webhooks.generateTestHeaderString({
          payload: payloadString,
          secret: stripeWebhookSecret
        })

        let incomingEvent
        try {
          incomingEvent = stripe.webhooks.constructEvent(payloadString, header, stripeWebhookSecret)
          // incomingEvent = stripe.webhooks.constructEvent(request.payload, signature, stripeWebhookSecret)
        } catch (error) {
          return h.response(`Webhook Error: ${error.message}`).code(400)
        }

        if (events.includes(incomingEvent.type)) {
          return incomingEvent.type
        }
      }
    })
  }
}
