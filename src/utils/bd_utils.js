/* eslint-disable guard-for-in */
import moment from 'moment';

const CryptoJS = require('crypto-js');
const xml2js = require('xml2js');

export function dataflowXml2Json(xml, nodeMap, macroMap) {
  let nodes;
  let edges = [];
  xml2js.parseString(xml, (err, result) => {
    if (err) {
      return;
    }
    const steps = result.dataflow.steps[0].step;
    edges = JSON.parse(result.dataflow.edges[0]);
    nodes = steps.map((record) => {
      const nodeParam = record.nodeParam && record.nodeParam[0] !== '' && JSON.parse(record.nodeParam[0]);
      const dynamicParam = [];
      const timeParam = {};

      if (macroMap) {
        // if (Array.isArray(nodeParam)) {
        //   nodeParam.forEach((item) => {
        //     const param = macroMap.param.find(pRecord => (pRecord.NODE_TYPE === (record.nodeType && record.nodeType[0])) && (pRecord.CODE === item || `${pRecord.CODE}-display` === item));
        //     if (param) {
        //       timeParam[item] = nodeParam[item];
        //     } else {
        //       dynamicParam.push({
        //         key: item,
        //         value: nodeParam[item],
        //       });
        //     }
        //   });
        // }
        for (const item in nodeParam) {
          // eslint-disable-next-line eqeqeq
          const param = macroMap.param.find(pRecord => (pRecord.NODE_TYPE == (record.nodeType && record.nodeType[0])) && (pRecord.CODE === item || `${pRecord.CODE}-display` === item));
          if (param) {
            timeParam[item] = nodeParam[item];
          } else {
            dynamicParam.push({
              key: item,
              value: nodeParam[item],
            });
          }
        }
      }
      return {
        shape: nodeMap.get(Number.parseInt(record.nodeType[0], 10)),
        x: Number.parseInt(record.xloc[0], 10),
        y: Number.parseInt(record.yloc[0], 10),
        id: record.$.id,
        name: record.$.name,
        nodeParam: timeParam,
        exception: record.exception && Number.parseInt(record.exception[0], 10),
        type: Number.parseInt(record.nodeType[0], 10),
        sourceId: record.sourceId && Number.parseInt(record.sourceId[0], 10),
        param: dynamicParam,
      };
    });
  });
  return { nodes, edges };
}

export function SecondToDate(msd) {
  let time = msd;
  if (time && time !== '') {
    if (time > 60 && time < 60 * 60) {
      time = `${parseInt(time / 60.0, 10)}分${parseInt((parseFloat(time / 60.0, 10) - parseInt(time / 60.0, 10)) * 60, 10)}秒`;
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time =
        `${parseInt(time / 3600.0, 10)
        }小时${
          parseInt((parseFloat(time / 3600.0, 10) - parseInt(time / 3600.0, 10)) * 60, 10)
        }分${
          parseInt((parseFloat((parseFloat(time / 3600.0, 10) - parseInt(time / 3600.0, 10), 10) * 60, 10) - parseInt((parseFloat(time / 3600.0, 10) - parseInt(time / 3600.0, 10), 10) * 60, 10), 10) * 60, 10)}秒`;
    } else if (time >= 60 * 60 * 24) {
      time =
        `${parseInt(time / 3600.0 / 24, 10)
        }天${
          parseInt((parseFloat(time / 3600.0 / 24, 10) - parseInt(time / 3600.0 / 24, 10), 10) * 24, 10)
        }小时${
          parseInt((parseFloat(time / 3600.0, 10) - parseInt(time / 3600.0, 10), 10) * 60, 10)
        }分${
          parseInt((parseFloat((parseFloat(time / 3600.0, 10) - parseInt(time / 3600.0, 10), 10) * 60, 10) - parseInt((parseFloat(time / 3600.0, 10) - parseInt(time / 3600.0, 10), 10) * 60, 10), 10) * 60, 10)}秒`;
    } else {
      time = `${parseInt(time, 10)}秒`;
    }
  }
  return time;
}

export function dataflowJson2Xml(json, dataflow) {
  const steps = [];
  let final;
  let edges;
  for (const node of json.nodes) {
    const source = [];
    const target = [];
    edges = json.edges.filter((edge) => {
      if (edge.target !== edge.source) {
        if (edge.target === node.id) {
          source.push(edge.source);
        } else if (edge.source === node.id) {
          target.push(edge.target);
        }
        return true;
      }
      return false;
    });
    const obj = {
      $: {
        id: node.id,
        name: node.name,
      },
      nodeType: node.type,
      exception: node.exception,
      xloc: node.x,
      yloc: node.y,
    };
    if (source.length > 0) {
      obj.$.sourceRef = source.join(',');
    }
    if (target.length > 0) {
      obj.$.targetRef = target.join(',');
    }
    if (node.sourceId) {
      obj.sourceId = node.sourceId;
    }
    const dynamicParam = {};
    if (node.param) {
      node.param.map((item) => {
        if (item.key) {
          dynamicParam[item.key] = item.value;
        }
        return true;
      });
    }
    if (node.nodeParam) {
      obj.nodeParam = JSON.stringify({ ...node.nodeParam, ...dynamicParam });
    }
    if (node.type === 0) {
      steps.splice(0, 0, obj);
    } else if (node.type === 99) {
      final = obj;
    } else {
      steps.push(obj);
    }
  }

  steps.push(final);

  const obj = {
    dataflow: {
      $: {
        id: dataflow.id,
        name: dataflow.name,
        def: moment(dataflow.createTime).format('YYYY.MM.DD hh:mm'),
        modify: moment().format('YYYY.MM.DD hh:mm'),
        creator: dataflow.creator,
      },
      steps: {
        step: steps,
      },
      edges: JSON.stringify(edges),
    },
  };
  const builder = new xml2js.Builder({
    explicitRoot: false,
    xmldec: { version: '1.0', encoding: 'UTF-8' },
  });
  const tem = builder.buildObject(obj);
  return tem;
}

const defaultXML =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<dataflow>\n' +
  '    <steps>\n' +
  '        <step id="0000" name="开始">\n' +
  '            <nodeType>0</nodeType>\n' +
  '            <xloc>100</xloc>\n' +
  '            <yloc>100</yloc>\n' +
  '        </step>\n' +
  '        <step id="9999" name="结束">\n' +
  '            <nodeType>99</nodeType>\n' +
  '            <xloc>300</xloc>\n' +
  '            <yloc>200</yloc>\n' +
  '        </step>\n' +
  '    </steps>\n' +
  '    <edges>[]</edges>\n' +
  '</dataflow>';

export { defaultXML };

export function checkCircle({ nodes, edges }) {
  if (nodes.length === 0) {
    return true;
  }
  // for (const i in nodes) {
  for (let i = 0; i < nodes.length; i++) {
    let flag = true;
    const edgeList = [];
    // for (const j in nodes) {
    for (let j = 0; j < nodes.length; j++) {
      for (const edge in edges) {
        if (edges[edge].source === nodes[j].id && edges[edge].target === nodes[i].id) {
          flag = false;
        }
        if (edges[edge].target === nodes[i].id && edgeList.indexOf(edges[edge]) < 0) {
          edgeList.push(edges[edge]);
        }
      }
    }
    if (flag) {
      nodes.splice(i, 1);
      for (const edge of edgeList) {
        edges.splice(edges.indexOf(edge), 1);
      }
      return checkCircle({ nodes, edges });
    }
  }
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath => routePath === path);
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes); // eslint-disable-line
  // Conversion and stitching parameters
  const renderRoutes = routes.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes[0];
}

export const Crypt = 'test_pwd';

// 加密
export function encryptByDES(message, key) {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// 解密
export function decryptByDES(ciphertext, key) {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}

