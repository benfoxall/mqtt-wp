require('dotenv-safe').config()

const WPAPI = require('wpapi')
const mqtt = require('mqtt')
const escape = require('html-escape')


// This requires the basic-auth plugin to be installed
const wp_client = new WPAPI({
  endpoint: process.env.WP_ENDPOINT,
  username: process.env.WP_USER,
  password: process.env.WP_PASS
})


const update = (message) =>
  wp_client.pages().slug(process.env.WP_SLUG)
    .then(result => result[0] || Promise.reject('not found') )
    .then(page =>
      wp_client.pages().id(page.id)
        .update({content: `Content from MQTT: ${message}`})
    )

/*
TODO: This could be cleaner, though I hit problems:
  1. pages().path is not a function
  2. pages().slug().update isn't a function
*/



// Connect to MQTT
const mqtt_client = mqtt.connect(process.env.MQTT_HOST)

mqtt_client.subscribe(process.env.MQTT_TOPIC)

mqtt_client.on('connect', () => {
  console.log('⚡️  Connected')
  console.log(`⚡️  ${process.env.MQTT_HOST} (${process.env.MQTT_TOPIC}) ➡︎ ${process.env.WP_ENDPOINT} (${process.env.WP_SLUG})`)
})


// Hook up message
mqtt_client.on('message', (topic, unsafe_message) => {

  const message = escape(unsafe_message.toString().substr(0, 160))

  console.log(`➡️  Updating: ${message}`)

  update(message)
    .catch(e => console.error('Error updating: ', e))
})
