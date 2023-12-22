import * as XLSX from 'xlsx';
import { message } from 'antd';

const handleExport = ({list = [], headList = [], sheetNames = ['sheetName.xlsx'], sheetName}) => {
  function deleteChildren(arr) {
    let childs = arr;
    for (let i = childs.length; i--; i > 0) {
      if (childs[i].children) {
        if (childs[i].children.length) {
          deleteChildren(childs[i].children);
        } else {
          delete childs[i].children;
        }
      }
    }
    return arr;
  }
  /**
   * 填充行合并占位符
   * */
  function pushRowSpanPlaceHolder(arr, count) {
    for (let i = 0; i < count; i++) {
      arr.push('!$ROW_SPAN_PLACEHOLDER');
    }
  }
  // 填充列合并占位符
  function pushColSpanPlaceHolder(arr, count) {
    for (let i = 0; i < count; i++) {
      arr.push('!$COL_SPAN_PLACEHOLDER');
    }
  }
  function flatData(list, eachDataCallBack) {
    let resultList = [];
    for (let i = 0; i < list.length; i++) {
      let data = list[i];
      let rawDataList = [];
      // 每个子元素都和父元素合并成一条数据
      if (data.children && data.children.length > 0) {
        for (let j = 0; j < data.children.length; j++) {
          delete data.children[j].bsm;
          let copy = Object.assign({}, data, data.children[j]);
          rawDataList.push(copy);
          copy['rowSpan'] = j > 0 ? 0 : data.children.length;
        }
      } else {
        data['rowSpan'] = 1;
        rawDataList.push(data);
      }
      resultList.push(...rawDataList);
      if (typeof eachDataCallBack === 'function') {
        eachDataCallBack(rawDataList);
      }
    }
    return resultList;
  }
  function flat(revealList) {
    let result = [];
    revealList.forEach(e => {
      if (e.hasOwnProperty('children')) {
        result.push(...flat(e.children));
      } else if (e.hasOwnProperty('exeFun')) {
        result.push(e);
      } else if (e.hasOwnProperty('dataIndex')) {
        result.push(e);
      }
    });
    return result;
  }
  function openDownloadXLSXDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) {
      event = new MouseEvent('click');
    } else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
      );
    }
    aLink.dispatchEvent(event);
  }
  function getHeader(headers, excelHeader, deep, perOffset) {
    let offset = 0;
    let cur = excelHeader[deep];
    if (!cur) {
      cur = excelHeader[deep] = [];
    }
    // 填充行合并占位符
    pushRowSpanPlaceHolder(cur, perOffset - cur.length);
    for (let i = 0; i < headers.length; i++) {
      let head = headers[i];
      cur.push(head.title);
      if (
        head.hasOwnProperty('children') &&
        Array.isArray(head.children) &&
        head.children.length > 0
      ) {
        let childOffset = getHeader(head.children, excelHeader, deep + 1, cur.length - 1);
        // 填充列合并占位符
        pushColSpanPlaceHolder(cur, childOffset - 1);
        offset += childOffset;
      } else {
        offset++;
      }
    }
    return offset;
  }
  function buildHeader(revealList) {
    let excelHeader = [];
    // 构建生成excel表头需要的数据结构
    getHeader(revealList, excelHeader, 0, 0);
    // 多行表头长短不一，短的向长的看齐，不够的补上行合并占位符
    let max = Math.max(...excelHeader.map(a => a.length));
    excelHeader.filter(e => e.length < max).forEach(e => pushRowSpanPlaceHolder(e, max - e.length));
    console.log('excelHeader', excelHeader);
    return excelHeader;
  }
  /**
   * 根据选中的数据和展示的列，生成结果
   * @param list
   * @param revealList
   */
  function extractData(list, revealList) {
    // 列
    let headerList = flat(revealList);
    // 导出的结果集
    let excelRows = [];
    // 如果有children集合的话会用到
    let dataKeys = new Set(Object.keys(list[0]));
    list.some(e => {
      if (e.children && e.children.length > 0) {
        let childKeys = Object.keys(e.children[0]);
        for (let i = 0; i < childKeys.length; i++) {
          dataKeys.delete(childKeys[i]);
        }
        return true;
      }
    });
    flatData(list, list => {
      excelRows.push(...buildExcelRow(dataKeys, headerList, list));
    });
    return excelRows;
  }
  /**
   * 合并头部单元格
   **/
  function doMerges(arr) {
    // 要么横向合并 要么纵向合并
    let deep = arr.length;
    let merges = [];
    for (let y = 0; y < deep; y++) {
      // 先处理横向合并
      let row = arr[y];
      let colSpan = 0;
      for (let x = 0; x < row.length; x++) {
        if (row[x] === '!$COL_SPAN_PLACEHOLDER') {
          row[x] = undefined;
          if (x + 1 === row.length) {
            merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x } });
          }
          colSpan++;
        } else if (colSpan > 0 && x > colSpan) {
          merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x - 1 } });
          colSpan = 0;
        } else {
          colSpan = 0;
        }
      }
    }
    // 再处理纵向合并
    let colLength = arr[0].length;
    for (let x = 0; x < colLength; x++) {
      let rowSpan = 0;
      for (let y = 0; y < deep; y++) {
        if (arr[y][x] === '!$ROW_SPAN_PLACEHOLDER') {
          arr[y][x] = undefined;
          if (y + 1 === deep) {
            merges.push({ s: { r: y - rowSpan, c: x }, e: { r: y, c: x } });
          }
          rowSpan++;
        } else if (rowSpan > 0 && y > rowSpan) {
          merges.push({ s: { r: y - rowSpan - 1, c: x }, e: { r: y - 1, c: x } });
          rowSpan = 0;
        } else {
          rowSpan = 0;
        }
      }
    }
    return merges;
  }
  function buildExcelRow(mainKeys, headers, rawDataList) {
    // 合计行
    let sumCols = [];
    // 数据行
    let rows = [];
    for (let i = 0; i < rawDataList.length; i++) {
      let cols = [];
      let rawData = rawDataList[i];
      // 提取数据
      for (let j = 0; j < headers.length; j++) {
        let header = headers[j];
        // 父元素键需要行合并
        if (rawData['rowSpan'] === 0 && mainKeys.has(header.dataIndex)) {
          cols.push('!$ROW_SPAN_PLACEHOLDER');
        } else {
          let value;
          if (typeof header.exeFun === 'function') {
            value = header.exeFun(rawData);
          } else {
            value = rawData[header.dataIndex];
          }
          cols.push(value);
          // 如果该列需要合计,并且是数字类型
          if (header['summable'] && typeof value === 'number') {
            sumCols[j] = (sumCols[j] ? sumCols[j] : 0) + value;
          }
        }
      }
      rows.push(cols);
    }
    // 如果有合计行
    if (sumCols.length > 0) {
      rows.push(...sumRowHandle(sumCols));
    }
    return rows;
  }
  function sumRowHandle(sumCols) {
    //TODO
    return [];
  }
  function aoa_to_sheet(data, headerRows) {
    const ws = {};
    const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (let R = 0; R !== data.length; ++R) {
      for (let C = 0; C !== data[R].length; ++C) {
        if (range.s.r > R) {
          range.s.r = R;
        }
        if (range.s.c > C) {
          range.s.c = C;
        }
        if (range.e.r < R) {
          range.e.r = R;
        }
        if (range.e.c < C) {
          range.e.c = C;
        }
        /// 这里生成cell的时候，使用上面定义的默认样式
        const cell = {
          v: data[R][C] || '',
          s: {
            font: {
              name: '宋体',
              sz: 10,
              color: {
                auto: 1,
              },
            },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
            alignment: {
              /// 自动换行
              wrapText: 1,
              // 居中
              horizontal: 'center',
              vertical: 'center',
              indent: 0,
            },
          },
        };
        // 头部列表加边框
        if (R < headerRows) {
          cell.s.border = {
            top: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          };
          cell.s.fill = {
            patternType: 'solid',
            fgColor: { theme: 3, tint: 0.3999755851924192, rgb: '5aa1bf' },
            bgColor: { theme: 7, tint: 0.3999755851924192, rgb: '5aa1bf' },
          };
          cell.s.font = {
            name: '宋体',
            sz: 10,
            bold: true,
            color: {
              rgb: 'ffffff',
            },
          };
        }
        const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
        if (typeof cell.v === 'number') {
          cell.t = 'n';
        } else if (typeof cell.v === 'boolean') {
          cell.t = 'b';
        } else {
          cell.t = 's';
        }
        ws[cell_ref] = cell;
      }
    }
    if (range.s.c < 10000000) {
      ws['!ref'] = XLSX.utils.encode_range(range);
    }
    return ws;
  }
  function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  if (!Array.isArray(list) || list.length < 1) {
    message.warn('导出数据为空');
    return;
  }
  const getSheets = (listArr = [], headList = [], sheetNames) => {
    const wsArr = listArr.map(list => {
      //删除Children为空，不然数据对不上
      headList = deleteChildren(headList);
      // excel表头
      let excelHeader = buildHeader(headList);
      // 头部行数，用来固定表头
      let headerRows = excelHeader.length;
      // 提取数据
      let dataList = extractData(list, headList);
      excelHeader.push(...dataList, []);
      // 计算合并
      let merges = doMerges(excelHeader);
      // 生成sheet
      let ws = aoa_to_sheet(excelHeader, headerRows);
      // 单元格合并
      ws['!merges'] = merges;
      // 头部冻结
      ws['!freeze'] = {
        xSplit: '1',
        ySplit: '' + headerRows,
        topLeftCell: 'B' + (headerRows + 1),
        activePane: 'bottomRight',
        state: 'frozen',
      };
      // 设置行宽
      let arr = [];
      const num = excelHeader[0].length;
      for (let i = 0; i < num; i++) {
        arr.push({
          wpx: 120,
        });
      }
      ws['!cols'] = arr;
      return ws;
    });
    return sheetNames.reduce((acc, key, index) => {
      acc[key] = wsArr[index];
      return acc;
    }, {});
  };
  let workbook = {
    SheetNames: sheetNames,
    Sheets: getSheets(list, headList, sheetNames),
  };

  // workbook.Sheets[sheetName] = ws;
  // excel样式
  let wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    cellStyles: true,
  };
  let wbout = XLSX.write(workbook, wopts);
  let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  openDownloadXLSXDialog(blob, sheetName + '.xlsx');
};
export default handleExport;
