// 过滤特殊字符，防止xss攻击
const SafeEncode = (html) => {
  let safeHtml = '';
  if (html.length !== 0) {
    safeHtml = html.replace(/&/g, '&amp;');
    safeHtml = html.replace(/</g, '&lt;');
    safeHtml = html.replace(/>/g, '&gt;');
    safeHtml = html.replace(/ /g, '&nbsp;');
    safeHtml = html.replace(/'/g, '&#39;');
    safeHtml = html.replace(/"/g, '&quot;');
  }
  return safeHtml;
};
export default SafeEncode;
