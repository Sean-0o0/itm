import CryptoJS from 'crypto-js';

const mode = CryptoJS.mode.CBC;
const padding = CryptoJS.pad.Pkcs7;
let key = '';
let APP_SECRET = '';
const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const generateMixed = (n) => {
  let res = '';
  for (let i = 0; i < n; i++) {
    const id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
};
const getRandomKey = () => {
  // 生成随机秘钥
  return generateMixed(16);
};
const AES = {
  encryptBase64: (text) => {
    const randomKey = getRandomKey();
    const randomKeyMd5 = CryptoJS.MD5(randomKey);
    // 随机秘钥密文
    const signaturePart1 = CryptoJS.AES.encrypt(randomKey, key, {
      iv: key,
      mode,
      padding,
    });
    // 密文
    const signaturePart2 = CryptoJS.AES.encrypt(text, randomKeyMd5, {
      iv: randomKeyMd5,
      mode,
      padding,
    });

    // 合并动态秘钥(32位)+密文
    const waText = CryptoJS.lib.WordArray.create([...signaturePart1.ciphertext.words, ...signaturePart2.ciphertext.words]);
    return CryptoJS.enc.Base64.stringify(waText);
  },
  setSecret: (secret) => {
    APP_SECRET = secret;
    key = CryptoJS.MD5(APP_SECRET);
  },
};
export default AES;
export { AES };
