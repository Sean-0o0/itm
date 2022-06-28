import * as CryptoJS from 'crypto-js';

export function DESEncrypt(password, key) {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.DES.encrypt(password, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const resultValue = decrypted.ciphertext.toString(CryptoJS.enc.Hex);
  return resultValue;
}

export function DESDecrypt(ciphertext, key) {
  // 把私钥转换成16进制的字符串
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.DES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(ciphertext) }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const resultValue = decrypted.toString(CryptoJS.enc.Utf8);
  return resultValue;
}
