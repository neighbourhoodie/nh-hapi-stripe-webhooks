'use strict'
const stripe = require('stripe')
const Hapi = require('@hapi/hapi')

beforeAll(async () => {
  // this.server = new Hapi.Server()
  this.server = await Hapi.server()
  // console.log('### this.server', this.server)
  await this.server.register({
    register: require('..'),
    options: {
      stripeApiKey: 'i-like-broccoli',
      stripeWebhookSecret: 'and-i-don`t-lie',
      endpoint: '/nh-stripe-webhook',
      webhookHandlers: {
        'event.1': () => {},
        'event.2': () => {}
      }
    }
  })
})

describe('index', () => {
  test('should handle incoming event', async () => {
    expect.assertions(2)

    const stripePayload = {
      id: 'evt_test_webhook',
      type: 'customer.created',
      object: 'event'
    }

    // mock signed stripe event
    const payloadString = JSON.stringify(stripePayload, null, 2)
    const secret = 'whsec_test_secret'
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret
    })
    const event = stripe.webhooks.constructEvent(payloadString, header, secret)

    expect(event.id).toEqual(stripePayload.id)
    expect(event.type).toEqual(stripePayload.type)

    // const result = await this.server.inject({
    //   method: 'POST',
    //   url: '/nh-stripe-webhook',
    //   payload: event
    // })
    // console.log('### result', result)
  })

  test.only('should handle incoming event', async () => {
    expect.assertions(2)

    const stripePayload = {
      id: 'evt_test_webhook',
      type: 'customer.created',
      object: 'event'
    }

    // mock signed stripe event
    const payloadString = JSON.stringify(stripePayload, null, 2)
    const secret = 'whsec_test_secret'
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret
    })
    const event = stripe.webhooks.constructEvent(payloadString, header, secret)

    expect(event.id).toEqual(stripePayload.id)
    expect(event.type).toEqual(stripePayload.type)

    const result = await this.server.inject({
      method: 'POST',
      url: '/nh-stripe-webhook',
      payload: event
    })
    console.log('### result', result.statusCode)
  })
})
