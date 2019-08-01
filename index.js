'use strict'
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
    const stripe = require('stripe')(options.stripeApiKey)
    // console.log('### stripe', stripe)

    const events = Object.keys(options.webhookHandlers)
    console.log('### events', events)

    server.route({
      method: 'POST',
      path: options.endpoint,
      handler: function (request, h) {
        const signature = request.headers['stripe-signature']
        console.log('### options', request.payload)
        const incomingEvent = stripe.webhooks.constructEvent(request.payload, signature, options.stripeWebhookSecret)
        console.log('### incomingEvent', incomingEvent)
        if (events.includes(incomingEvent.type)) {
          console.log('### events[incomingEvent]', events[incomingEvent.type])
          return events[incomingEvent.type]
        }
      }
    })
  }
}
