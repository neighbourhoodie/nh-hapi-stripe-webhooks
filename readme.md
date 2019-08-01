# The Neighbourhoodie Hapi Stripe webhooks
A [Hapi](https://hapi.dev/) plugin for receiving notifications from the [Stripe webhooks](https://stripe.com/docs/webhooks) API.

Stripe can send webhook events that notify your application any time an event happens on your account. The webhooks endpoint will need to authenticate webhooks as per stripe docs.

## Installation
```
npm install @neighbourhoodie/nh-hapi-stripe-webhooks
```

## Usage
```
server.register({
  register: plugin('@neighbourhoodie/nh-hapi-stripe-webhooks'),
  options: {
    stripeApiKey: 'i-like-broccoli',
    stripeWebhookSecret: 'and-i-don`t-lie',
    endpoint: '/webhook',
    webhookHandlers: {
      'stripe.event': callBack()
    }
  }
})
```

Where Do I find my [Stripe API key](https://support.stripe.com/questions/locate-api-keys)?

How do I [add the webhook endpoint](https://stripe.com/docs/webhooks/setup#configure-webhook-settings) to my stripe dashboard?

Which available [stripe events](https://stripe.com/docs/api/events/types) are there?
