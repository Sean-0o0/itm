// 去除html标签
const html2Text = (html) => {
  let string = html.replace(/<[^<>]+?>/g, '');
  string = string.trim().replace(/\s+/g, ' ').trim();
  return string;
};

// 去除转义符
const escape2Html = (str) => {
  const arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"', ldquo: '“', rdquo: '”', mdash: '——', permil: '‰' };
  return str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo|mdash|permil);/ig, (all, t) => arrEntities[t]);
};

// 简单截取
const pureSubText = (text, textLength) => {
  return text.length > textLength ? `${text.substring(0, textLength)}...` : text;
};

// 带关键字截取
const complexSubText = (text, textLength, keywordIndex) => {
  if (text.length <= textLength) {
    return text;
  }
  if (keywordIndex + 1 < textLength) {
    return `${text.substring(0, textLength)}...`;
  } else if (text.length - keywordIndex - 1 < textLength) {
    const offset = textLength - (text.length - keywordIndex);
    return `...${text.substring(keywordIndex - offset, text.length)}`;
  }
  return `...${text.substring(keywordIndex, keywordIndex + textLength)}...`;
};

// 获取关键字索引
const getKeywordIndex = (text, keyword, handleCase) => {
  const hText = handleCase ? text : text.toLowerCase();
  const hKeyword = handleCase ? keyword : keyword.toLowerCase();
  return hText.indexOf(hKeyword);
};

// 简单高亮
const pureHighLight = (text, keyword, color) => {
  const reg = RegExp(keyword, 'g');
  return text.replace(reg, `<span style="color: ${color}">${keyword}</span>`);
};

// 获取子串所有索引
const getStrIndexs = (text, str) => {
  const indexs = [];
  let pos = text.indexOf(str);
  while (pos > -1) {
    indexs.push(pos);
    pos = text.indexOf(str, pos + 1);
  }
  return indexs;
};

const complexHighLightReplaceStr = (text, keyword, index, prefix, suffix) => {
  const perStr = text.substring(index, index + keyword.length);
  const strs = [text.substring(0, index), text.substring(index + keyword.length, text.length)];
  return `${strs[0]}${prefix}${perStr}${suffix}${strs[1]}`;
};

// 复杂高亮，处理大小写
const complexHighLight = (text, keyword, color) => {
  let res = text;
  const prefix = `<span style="color: ${color}">`;
  const suffix = '</span>';
  const hText = text.toLowerCase();
  const hKeyword = keyword.toLowerCase();
  const indexs = getStrIndexs(hText, hKeyword);
  if (indexs.length === 0) {
    return text;
  }
  indexs.forEach((item, index) => {
    res = complexHighLightReplaceStr(res, keyword, item + (index * (prefix.length + suffix.length)), prefix, suffix);
  });
  return res;
};

// 去除html标签和转义符
export function HtmlToText(html) {
  if (!html || html === '' || html === '--') {
    return '--';
  }
  let rhtml = html2Text(html);
  rhtml = escape2Html(rhtml);
  return rhtml;
}

// 截取字符串
export function SubText(text = '', textLength = 0, handleKeyword = false, keyword = '', handleCase = false) {
  if (!text || text === '' || text === '--') {
    return '--';
  }
  if (!handleKeyword) {
    return pureSubText(text, textLength);
  }
  if (keyword === '') {
    return pureSubText(text, textLength);
  }
  const keywordIndex = getKeywordIndex(text, keyword, handleCase);
  if (keywordIndex < 0) {
    return pureSubText(text, textLength);
  }
  return complexSubText(text, textLength, keywordIndex);
}

// 高亮关键字
export function HighLightKeyword(text = '', keyword = '', handleCase = false, color = '#ff3300') {
  if (!text || text === '' || text === '--') {
    return '--';
  }
  if (keyword === '') {
    return text;
  }
  if (handleCase) {
    return pureHighLight(text, keyword, color);
  }
  return complexHighLight(text, keyword, color);
}
