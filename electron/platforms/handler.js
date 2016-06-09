export default class PlatformHandler {
  constructor(params) {
    for (let key in params) {
      this[key] = params[key]
    }
  }

  whoAmI() {
    if (this.username) {
      return Promise.resolve(this.username)
    }

    return Promise.reject(new Error('Unimplement interface'))
  }

  isLoggedIn() {
    return Promise.resolve(false)
  }

  publish() {
    return Promise.reject(null)
  }
}
