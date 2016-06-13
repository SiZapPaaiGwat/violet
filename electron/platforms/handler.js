let subClassLinkMap = {}

function notImplementMethod(name, klassName) {
  return new Error(`Not implement method ${name} for ${klassName}`)
}

export default class PlatformHandler {
  static link(name, klass) {
    if (!name) return

    if (!klass instanceof PlatformHandler) return

    subClassLinkMap[name] = klass
  }

  static map(items = Object.keys(subClassLinkMap)) {
    return items.map(name => {
      return subClassLinkMap[name] || PlatformHandler
    })
  }

  constructor(params) {
    for (let key in params) {
      this[key] = params[key]
    }
  }

  whoAmI() {
    if (this.username) {
      return Promise.resolve(this.username)
    }

    return Promise.reject(notImplementMethod('whoAmI', this.constructor.name))
  }

  publish() {
    return Promise.reject(notImplementMethod('publish', this.constructor.name))
  }
}
