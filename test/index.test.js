'use strict'

// mock signed stripe event
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      webhooks: {
        constructEvent: jest.fn().mockReturnValue({
          id: 'evt_test_webhook',
          type: 'customer.created',
          object: 'event'
        }),
        DEFAULT_TOLERANCE: 300,
        generateTestHeaderString: jest.fn(),
        signature: {}
      }
    }
  })
})
const Hapi = require('@hapi/hapi')

const nhHapiStripe = require('..')

beforeEach(async () => {
  this.server = await Hapi.server()
})
afterEach(async () => {
  this.server.stop()
})

describe('index', () => {
  describe('options validation', () => {
    test('should fail without stripe secret', async () => {
      await expect(this.server.register({
        plugin: nhHapiStripe,
        options: {
          endpoint: '/nh-stripe-webhook',
          webhookHandlers: {
            'customer.created': () => { console.log('customer created') },
            'customer.deleted': () => { console.log('customer deleted') }
          }
        }
      })).rejects.toThrow('ValidationError')
    })

    test('should fail with invalid stripe secret', async () => {
      await expect(this.server.register({
        plugin: nhHapiStripe,
        options: {
          stripeApiKey: 'not-a-token',
          stripeWebhookSecret: 'me-neither',
          endpoint: '/nh-stripe-webhook',
          webhookHandlers: {
            'customer.created': () => { console.log('customer created') },
            'customer.deleted': () => { console.log('customer deleted') }
          }
        }
      })).rejects.toThrow('ValidationError')
    })

    test('should fail without endpoint', async () => {
      await expect(this.server.register({
        plugin: nhHapiStripe,
        options: {
          stripeApiKey: 'i_like_broccoli',
          stripeWebhookSecret: 'and_i_dont_lie',
          webhookHandlers: {
            'customer.created': () => { console.log('customer created') },
            'customer.deleted': () => { console.log('customer deleted') }
          }
        }
      })).rejects.toThrow('ValidationError')
    })

    test('should fail without webhookHandlers', async () => {
      await expect(this.server.register({
        plugin: nhHapiStripe,
        options: {
          stripeApiKey: 'i_like_broccoli',
          stripeWebhookSecret: 'and_i_dont_lie',
          endpoint: '/nh-stripe-webhook'
        }
      })).rejects.toThrow('ValidationError')
    })

    test('should fail without callbacks in webhookHandlers', async () => {
      await expect(this.server.register({
        plugin: nhHapiStripe,
        options: {
          stripeApiKey: 'i_like_broccoli',
          stripeWebhookSecret: 'and_i_dont_lie',
          endpoint: '/nh-stripe-webhook',
          webhookHandlers: {
            'customer.created': 'this is not a callback'
          }
        }
      })).rejects.toThrow('ValidationError')
    })
  })

  test('should handle incoming event', async () => {
    await this.server.register({
      plugin: nhHapiStripe,
      options: {
        stripeApiKey: 'i_like_broccoli',
        stripeWebhookSecret: 'and_i_dont_lie',
        endpoint: '/nh-stripe-webhook',
        webhookHandlers: {
          'customer.created': () => { console.log('customer created') },
          'customer.updated': () => { console.log('customer updated') },
          'customer.deleted': () => { console.log('customer deleted') }
        }
      }
    })

    const stripePayload = {
      id: 'evt_test_webhook',
      type: 'customer.created',
      object: 'event'
    }

    const { statusCode } = await this.server.inject({
      method: 'POST',
      url: '/nh-stripe-webhook',
      payload: stripePayload
    })
    expect(statusCode).toBe(200)
  })
})
