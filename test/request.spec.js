import nock from 'nock'
import sinon from 'sinon'
import {expect} from 'chai'
import request from '../electron/request'

const url = 'http://simongfxu.github.io/'
let clock = null

describe('request', function() {
  beforeEach(function() {
    clock = sinon.useFakeTimers()
  })

  afterEach(function() {
    clock.restore()
  })

  it('should be rejected when method is not support', function() {
    return request({
      url,
      method: 'unknownMethod'
    }).catch(err => {
      expect(err).to.be.an('error')
    })
  })

  it('should be rejected when url is not supplied', function() {
    return request({
      method: 'get'
    }).catch(err => {
      expect(err).to.be.an('error')
    })
  })

  it('should return a 404 status code', function() {
    nock(url).get('/404').reply(404, 'Not Found')
    return request({
      url: `${url}404`,
      method: 'get'
    }).catch(err => {
      expect(err).to.be.an('error')
      expect(err.status).equal(404)
      expect(err.response.text).equal('Not Found')
    })
  })

  it('should return json content using post', function() {
    let json = JSON.parse('{"foo": "bar"}')
    nock(url).post('/post').reply(200, json)
    return request({
      url: `${url}post`,
      method: 'post',
      formData: json,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      expect(res.body).to.deep.equal(json)
    })
  })

  it('should be rejected when request timeout', function() {
    nock(url).get('/timeout').delay(5000).reply(200, 'OK')
    let req = request({
      url: `${url}timeout`,
      method: 'get',
      timeout: 2000
    })
    clock.tick(3000)
    return req.catch(err => {
      console.log(err)
      expect(err).to.be.an('error')
    })
  })
})
