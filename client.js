const { RestClient } = require('./javascript/RestClient')
const user_id = ''
const secret_key = ''
const api_url = ''
const api_realm = ''
const api_version = ''
const client = new RestClient(user_id, secret_key, api_url, api_realm, api_version)
client.call('echoMessage', ['Hello World!'])
