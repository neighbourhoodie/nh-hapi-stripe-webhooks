'use strict'

describe('index', () => {
  beforeAll(async () => {
    console.log('### hello')
  })

  test('should work', async () => async () => {
    expect.assertions(2)

    const { statusCode, payload } = await this.app.inject({
      method: 'POST',
      url: '/nh-stripe-webhook'
    })
    expect(statusCode).toBe(200)
    console.log('### payload', payload)
  })
})
