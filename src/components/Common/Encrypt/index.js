import CryptoJS from 'crypto-js';

// base64加密
export function EncryptBase64(str) {
  let eStr = '';
  if (!str) {
    return eStr;
  }
  try {
    const words = CryptoJS.enc.Utf8.parse(str);
    eStr = CryptoJS.enc.Base64.stringify(words);
    if (eStr.indexOf('/')) { // base64加密后可能会出现 / ,用ascII编码替换，否则用于url会无法解密
      eStr = eStr.replace(/\/+/g, '%2F');
    }
    /* eStr = window.btoa(str); */
  } catch (error) {
    window.location.href = '/#/404';
    console.error('加密参数出错！'); // eslint-disable-line
  }
  return eStr;
}

// base64解密
export function DecryptBase64(str) {
  let dStr = '';
  if (!str) {
    return dStr;
  }
  try {
    let stTemp = str;
    if (stTemp.indexOf('%2F')) {
      stTemp = stTemp.replace(/(%2F)+/g, '/');
    }
    const words = CryptoJS.enc.Base64.parse(stTemp);
    dStr = words.toString(CryptoJS.enc.Utf8);
    /* dStr = window.atob(str); */
  } catch (error) {
    window.location.href = '/#/404';
    console.error('解析参数出错！'); // eslint-disable-line
  }
  return dStr;
}
