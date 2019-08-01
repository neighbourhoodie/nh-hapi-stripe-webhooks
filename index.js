'use strict'

const {
  createSubscription,
  updateSubscription,
  removeSubscription
} = require('lib/subscriptions')

const {
  createCustomer,
  updateCustomer,
  removeCustomer
} = require('lib/customers')

const webhookHandlers = {
  'payments.subscription.create': createSubscription,
  'payments.subscription.update': updateSubscription,
  'payments.subscription.remove': removeSubscription,
  'payments.customer.create': createCustomer,
  'payments.customer.update': updateCustomer,
  'payments.customer.remove': removeCustomer
}

exports.plugin = {
  pkg: require('./package.json'),
  register: async function (server, options) {
    return webhookHandlers
  }
}
