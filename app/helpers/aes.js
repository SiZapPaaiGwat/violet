import AES from 'gibberish-aes/src/gibberish-aes'

const KEY = 'Ikw76BqhvqOnnDHLer1e93eV7vqGsn3V'

export function encrypt(txt, pwd = KEY) {
  return AES.enc(txt, pwd)
}

export function decrypt(txt, pwd = KEY) {
  return AES.dec(txt, pwd)
}
