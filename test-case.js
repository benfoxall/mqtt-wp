// load details from .env file
// (see .env.example for template)
require('dotenv-safe').config()

const WPAPI = require('WPAPI')

// CHANGE THIS
const SITE = 'https://example.com'

WPAPI.discover(SITE)
.then(wp =>
  wp.auth({
    username: process.env.WP_USER,
    password: process.env.WP_PASS
  })
)
.then(wp =>
  wp
  .pages()
    .slug('my-thing')
    .update({content: 'This is test content'})
    .then(
      () => console.log('Completed'),
      e  => console.error(e)
    )

)

/*
Result (for me):
{
  code: 'rest_no_route',
  message: 'No route was found matching the URL and request method',
  data: { status: 404 }
}
*/
