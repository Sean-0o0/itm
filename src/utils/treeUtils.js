/**
 * Object对象相关的自定义处理函数
 */
const TreeUtils = {
  toTreeData(datas, { keyName = 'id', pKeyName = 'pid', titleName = 'name', normalizeTitleName = 'title', normalizeKeyName = 'key', parentName = 'fid' }, normalize = true, persistPrimaryData = false) { // 将普通数据转成树状结构
    // persistPrimaryData：保留原来的数据
    const tree = [];
    const noParentTemp = []; // 临时存放所有父节点,一旦改父节点是另一个节点的子节点,那么就删掉,最后剩下的就是没有完整父节点的节点了
    const isChildTemp = []; // 存放所有曾为子节点的节点
    const relation = {}; // 存放节点数据及其之间的关系
    // 遍历数据
    datas.forEach((data) => {
      const key = data[keyName];
      const pKey = data[pKeyName];
      const title = data[titleName];
      // 记录所有的子节点信息
      isChildTemp.push(key);
      // 记录暂时还没有发现父节点的项
      if (!noParentTemp.includes(pKey)) {
        noParentTemp.push(pKey);
      }
      // 如果发现该项在"暂时没有完整父节点"数组中,那么就从数组中删除掉
      if (noParentTemp.includes(key)) {
        noParentTemp.splice(noParentTemp.indexOf(key), 1);
      }

      // 将当前项的数据存在relation中
      const itemTemp = normalize ? { [normalizeKeyName]: key, [normalizeTitleName]: title, [parentName]: pKey } : { ...data };
      if (persistPrimaryData) {
        Object.assign(itemTemp, { primaryData: data });
      }
      if (!relation[key]) {
        relation[key] = {};
      }
      Object.assign(relation[key], itemTemp);

      // 将当前项的父节点数据也存在relation中
      if (!relation[pKey]) {
        relation[pKey] = normalize ? { [normalizeKeyName]: pKey } : { [keyName]: pKey };
      }

      // 如果作为父节点,没有children.那么就加上
      if (!relation[pKey].children) {
        relation[pKey].children = [];
      }

      // 将父子节点通过children关联起来,形成父子关系
      relation[pKey].children.push(relation[key]);
    });

    // 将没有完整父节点的节点过滤一下,剩下的就是没有父节点的节点了(如果只有一个,那就是根节点根节点)
    noParentTemp.forEach((key) => {
      if (!isChildTemp.includes(key)) {
        tree.push(relation[key]);
      }
    });
    return tree;
  },
  toTreeDataForLBrOLE(datas, { keyName = 'ID', titleName = 'Name' }) { // 用于任务中心督办执行人整理数据
    const taskcenterclass = localStorage.getItem('taskcenterclass');
    let taskcenterObj = {};
    if (taskcenterclass) {
      taskcenterObj = JSON.parse(taskcenterclass);
    }
    const { flzdm: pKeyName, yyb = '', fgs = '', zb = '' } = taskcenterObj;
    // 按照 Category分类。 1为其他，2为营业部，3为分公司，4为总部
    const tree = [];
    const zbTemp = []; // 总部数据
    const yybTemp = []; // 营业部数据
    const fgsTemp = []; // 分公司数据
    const qtTemp = []; // 其他数据
    // 遍历数据
    datas.forEach((data) => {
      const key = data[keyName];
      const pKey = data[pKeyName];
      const title = data[titleName];
      // 记录所有的子节点信息
      if (pKey === yyb) {
        yybTemp.push({ key, value: key, title });
      } else if (pKey === fgs) {
        fgsTemp.push({ key, value: key, title });
      } else if (pKey === zb) {
        zbTemp.push({ key, value: key, title });
      } else {
        qtTemp.push({ key, value: key, title });
      }
    });
    // 完整的treeData
    // tree.push({
    //   title: '总部',
    //   value: '4',
    //   key: '4',
    //   children: zbTemp,
    // }, {
    //   title: '分公司',
    //   value: '3',
    //   key: '3',
    //   children: fgsTemp,
    // }, {
    //   title: '营业部',
    //   value: '2',
    //   key: '2',
    //   children: yybTemp,
    // }, {
    //   title: '其他',
    //   value: '1',
    //   key: '1',
    //   children: qtTemp,
    // });
    tree.push({ // 父节点需要disable，只回传子节点具体数据
      zbTemp,
      fgsTemp,
      yybTemp,
      qtTemp,
    });
    return tree;
  },
};

export default TreeUtils;

