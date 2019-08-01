'use strict'

// const {
//   createSubscription,
//   updateSubscription,
//   removeSubscription
// } = require('lib/subscriptions')

// const {
//   createCustomer,
//   updateCustomer,
//   removeCustomer
// } = require('lib/customers')

// const webhookHandlers = {
//   'payments.subscription.create': createSubscription,
//   'payments.subscription.update': updateSubscription,
//   'payments.subscription.remove': removeSubscription,
//   'payments.customer.create': createCustomer,
//   'payments.customer.update': updateCustomer,
//   'payments.customer.remove': removeCustomer
// }

/*
options: {
  stripeSecret: 'i like broccoli',
  observe: ['event1', 'event2']
}
*/
exports.plugin = {
  pkg: require('./package.json'),
  register: async function (server, options) {
    console.log('### hello ###')
    // await webhookHandlers

    // var stripe = createStripeClient(options.stripeSecretKey)
    server.route({
      config: {
        id: 'stripe-webhooks',
        handler: function (request, h) {
          console.log('### options', options)
          return options.name
        }
      },
      method: 'POST',
      path: options.path
    })
    // return next()
  }
}
