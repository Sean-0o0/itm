import Lodash from 'lodash'
import moment from 'moment'

/**
 * 顶点框架相关工具
 */

/**
   * 字典搜索
   * @param {*Array} dicName  字典arr
   * @param {*Number} uniqueId  ID (通常后端返回number)
   * @returns 
   */
const dictionaryMatchHandle = (dicName, uniqueId) => {
  const findItem = dicName.find(item => item.ibm === String(uniqueId))
  return findItem?.note
}

/**
   * 浙商要求的文件转化  把upload的fileArr转换成 base64Arr
   * @param {*} fileArray 文件数组
   * @param {*} fileTypeName 表单标签名称
   * @returns
   */
function convertFilesToBase64(fileArray, fileTypeName) {
  if (fileArray.length === 0) return [];
  return Promise.all(
    fileArray.map(file => {
      if (file.url !== undefined)
        //查询到的已有旧文件的情况
        return new Promise((resolve, reject) => {
          resolve({
            content: file.base64,
            nrtitle: file.name,
            nrtype: '1',
            filetype: fileTypeName,
          });
        });
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
          const base64 = reader.result.split(',')[1];
          const fileName = file.name;
          resolve({
            content: base64,
            nrtitle: fileName,
            nrtype: '1',
            filetype: fileTypeName,
          });
        };

        reader.onerror = function (error) {
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    }),
  );
}

/**
 * 浙商 Upload组件的onDownload 的下载文件，下载指定文件到本地
 * @param {*} file
 */
const downloadFileHandle = (file) => {
  if (!file.url) {
    let reader = new FileReader();
    reader.readAsDataURL(file.originFileObj || file.blob);
    reader.onload = e => {
      var link = document.createElement('a');
      link.href = e.target.result;
      link.download = file.name;
      link.click();
      window.URL.revokeObjectURL(link.href);
    };
  } else {
    var link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

export {
  dictionaryMatchHandle, //字典搜索
  convertFilesToBase64,  //浙商要求的文件转化  把upload的fileArr转换成 base64Arr
  downloadFileHandle,    //浙商 Upload组件的onDownload 的下载文件，下载指定文件到本地
}
