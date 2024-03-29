import axios from 'axios';
import config from './config';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

//常用方法

//将父节点设置为不可选
function setParentSelectableFalse(node) {
  if (node.children && node.children.length > 0) {
    // 如果节点有子节点
    node.selectable = false; // 将该节点设置为不可选
    node.children.forEach(child => {
      // 遍历子节点
      setParentSelectableFalse(child); // 递归处理子节点
    });
  }
}

//获取字典note
const getNote = (data = [], ibm) =>
  ibm !== undefined ? data.find(x => String(x.ibm) === String(ibm))?.note || '' : '';

//附件数据处理 - 操作接口入参时
function convertFilesToBase64(fileArray = [], fileType) {
  return Promise.all(
    fileArray.map(file => {
      if (file.url !== undefined || file.url === '')
        //查询到的已有旧文件的情况
        return new Promise((resolve, reject) => {
          resolve({ name: file.name, data: file.base64, fileType });
        });
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function() {
          const base64 = reader.result.split(',')[1];
          const fileName = file.name;
          resolve({ name: fileName, data: base64, fileType });
        };

        reader.onerror = function(error) {
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    }),
  );
}

//附件数据处理  - 查询接口回显时
const handleFileStrParse = async (fjStr = '{}', { objectName, id, columnName }) => {
  function convertBlobsToBase64(fileArray) {
    return Promise.all(
      fileArray.map((file, index) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function() {
            const base64 = reader.result.split(',')[1];
            const fileName = file.name;
            resolve({
              uid: Date.now() + '-' + index,
              name: fileName,
              status: 'done',
              base64,
              blob: file.blob,
              url: '',
            });
          };
          reader.onerror = function(error) {
            reject(error);
          };
          reader.readAsDataURL(file.blob);
        });
      }),
    );
  }
  const fjObj = JSON.parse(fjStr);
  const fjPromiseArr =
    fjObj.items?.map(x =>
      axios({
        method: 'POST',
        url: queryFileStream,
        responseType: 'blob',
        data: {
          objectName,
          columnName,
          id,
          title: x[1],
          extr: x[0],
          type: '',
        },
      }),
    ) || [];
  const resArr = await Promise.all(fjPromiseArr);
  return convertBlobsToBase64(
    resArr.map(x => ({ name: JSON.parse(x?.config?.data || '{}').title, blob: x.data })),
  );
};

export { setParentSelectableFalse, getNote, convertFilesToBase64, handleFileStrParse };
