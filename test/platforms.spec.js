import PlatformHandler from '../electron/platforms/handler'
import ZhihuHandler from '../electron/platforms/zhihu'
import GitHubHandler from '../electron/platforms/github'
import {expect} from 'chai'
import sinon from 'sinon'

class MediumHandler extends PlatformHandler {}

PlatformHandler.link('medium', MediumHandler)

let clock = null

describe('PlatformHandler', function() {
  beforeEach(function() {
    clock = sinon.useFakeTimers()
  })

  afterEach(function() {
    clock.restore()
  })

  it('should support set property to instance', function() {
    let instance = new PlatformHandler({foo: 'bar'})
    expect(instance.foo).to.equal('bar')
  })

  it('should support set username to instance', function() {
    let instance = new PlatformHandler({username: 'bar'})
    return instance.whoAmI().then(username => {
      expect(username).to.equal('bar')
    })
  })

  it('should be rejected when whoAmI unimplemented', function() {
    let instance = new PlatformHandler()
    return instance.whoAmI().catch(err => {
      expect(err).to.be.an('error')
    })
  })

  it('should be rejected when publish unimplemented', function() {
    let instance = new PlatformHandler()
    return instance.publish().catch(err => {
      expect(err).to.be.an('error')
    })
  })

  it('should link a symbol to a sub class', function() {
    expect(PlatformHandler.map(['medium'])[0]).to.equal(MediumHandler)
  })

  it('should throw an error when alias is not registered', function() {
    expect(function() {
      PlatformHandler.map(['jianshu'])
    }).to.throw(Error)
  })
})
