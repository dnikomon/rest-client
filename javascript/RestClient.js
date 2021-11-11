const crypto = require('crypto')
const md5 = require('md5')
const axios = require('axios')

class RestClient {
    _user_id
    _api_secret
    _api_url
    _api_realm
    _api_version
    _content_type
    _json_string
    _timestamp
    _method
    _full_path

    constructor(user_id, api_secret, api_url, _api_realm, _api_version) {
      this._user_id = user_id
      this._api_secret = api_secret
      this._api_url = api_url
      this._api_realm = _api_realm
      this._api_version = _api_version
      this._content_type = 'application/json'
      this._json_string = ''
      this._timestamp = ''
      this._method = 'POST'
      this._full_path = ''
    }
    call(path, data) {
      axios.interceptors.request.use(request => {
        console.log('Starting Request', JSON.stringify(request, null, 2))
        return request
      })
      const timestamp = new Date().toISOString()
      const fullPath = `/api/v${this._api_version}/${path}`
      const jsonString = JSON.stringify(data)
      axios.post(`${this._api_url}${fullPath}`, jsonString, {
          headers: {
            'Content-Type': this._content_type,
            'Content-MD5': md5(jsonString, { encoding: 'utf-8' }),
            'X-Date': timestamp,
            Authorization: this._api_realm + ' ' + this._user_id + ':' + this._get_signature(timestamp, jsonString, fullPath),
          }
      }).then(res => {
        console.log(res.data)
      })
    }
    _get_message(timestamp, data, path) {
      // Return the message in the format which is used to create signature of the request """
      const message = [
        this._method,
        md5(data, { encoding: 'utf-8' }),
        this._content_type,
        timestamp,
        data,
        path
      ]
      return message.join('\n')
    }
    _get_signature(...rest) {
      // Get signature for the API request
      return crypto
        .createHmac('SHA256', this._api_secret)
        .update(this._get_message(...rest))
        .digest('hex')
    }
  }

  module.exports = {
    RestClient
  }