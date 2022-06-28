/* eslint-disable no-useless-escape */
const util = {
  // 公式定义格式验证
  fmlaCheck(value) {
    // 剔除空白符
    const string = value.replace(/\s/g, '');
    // 错误情况，空字符串
    // if (string === '') {
    //   return false;
    // }
    // 含有非法字符
    if (/[~!@#%^&]+/.test(string)) {
      return false;
    }
    // 错误情况，运算符连续
    if (/[\+\-\*\/]{2,}/.test(string)) {
      return false;
    }
    // 开头结尾
    if (!/^[\d\$S\(-]/.test(string)) {
      return false;
    }
    if (!/[\)\}\d]$/.test(string)) {
      return false;
    }
    // 空括号
    if (/\(\)/.test(string)) {
      return false;
    }
    if (/\{\}/.test(string)) {
      return false;
    }
    // 错误情况，括号不配对
    const stack = [];
    for (let i = 0, item; i < string.length; i++) {
      item = string.charAt(i);
      if (item === '(') {
        stack.push('(');
      } else if (item === ')') {
        if (stack.length > 0) {
          stack.pop();
        } else {
          return false;
        }
      }
    }
    if (stack.length !== 0) {
      return false;
    }
    // 错误情况，{}不配对
    const stack2 = [];
    for (let j = 0, elem; j < string.length; j++) {
      elem = string.charAt(j);
      if (elem === '{') {
        stack2.push('{');
      } else if (elem === '}') {
        if (stack2.length > 0) {
          stack2.pop();
        } else {
          return false;
        }
      }
    }
    if (stack2.length !== 0) {
      return false;
    }

    // 错误情况，(后面是运算符
    if (/\([\+\-\*\/]/.test(string)) {
      return false;
    }

    // 错误情况，)前面是运算符
    if (/[\+\-\*\/]\)/.test(string)) {
      return false;
    }

    // 错误情况，(前面不是运算符
    if (/[^\+\-\*\/]\(/.test(string)) {
      return false;
    }
    // 错误情况，)后面不是运算符
    if (/\)[^\+\-\*\/]/.test(string)) {
      return false;
    }
    return true;
  },
};
export default util;
