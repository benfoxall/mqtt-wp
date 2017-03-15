// load details from .env file
// (see .env.example for template)
require('dotenv-safe').config()


const WPAPI = require('WPAPI')

const wp = new WPAPI({
  endpoint: process.env.WP_ENDPOINT,
  username: process.env.WP_USER,
  password: process.env.WP_PASS
})

wp.pages()
  .slug('my-thing')
  .update({content: 'This is test content'})

  .then(
    () => console.log('Completed'),
    e  => console.error(e)
  )

/*
Result (for me):
{
  code: 'rest_no_route',
  message: 'No route was found matching the URL and request method',
  data: { status: 404 }
}
*/
