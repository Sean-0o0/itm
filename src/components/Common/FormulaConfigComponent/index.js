import React from 'react';
import { Tree, Form, Button, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { FetchQuerySalaryFormulaConf } from '../../../services/commonbase';
import { getDictKey } from '../../../utils/dictUtils';

const { TreeNode } = Tree;

const operatorData = [
  { expsDescr: '+', calExpsRsol: '+', calExps: '+', regStr: '\\+' },
  { expsDescr: '-', calExpsRsol: '-', calExps: '-', regStr: '\\-' },
  { expsDescr: '×', calExpsRsol: '*', calExps: '*', regStr: '\\*' },
  { expsDescr: '÷', calExpsRsol: '/', calExps: '/', regStr: '\\÷' },
  { expsDescr: '最大', calExpsRsol: 'max', calExps: 'GREATEST', regStr: '\\GREATEST' },
  { expsDescr: '最小', calExpsRsol: 'min', calExps: 'LEAST', regStr: '\\LEAST' },
  { expsDescr: '并且', calExpsRsol: ' and ', calExps: 'AND', regStr: '\\AND' },
  { expsDescr: '或者', calExpsRsol: ' or ', calExps: 'OR', regStr: '\\OR' },
  { expsDescr: '>', calExpsRsol: '>', calExps: '>', regStr: '\\>' },
  { expsDescr: '≥', calExpsRsol: '>=', calExps: '>=', regStr: '\\>\\=' },
  { expsDescr: '<', calExpsRsol: '<', calExps: '<', regStr: '\\<' },
  { expsDescr: '≤', calExpsRsol: '<=', calExps: '<=', regStr: '\\=\\<' },
  { expsDescr: '不等于', calExpsRsol: '!=', calExps: '!=', regStr: '\\!\\=' },
  { expsDescr: '当', calExpsRsol: ' when ', calExps: 'CASE WHEN THEN ELSE THEN END', regStr: '\\CASE\\sWHEN\\sTHEN\\sELSE\\sTHEN\\sEND' },
  { expsDescr: '类似', calExpsRsol: ' like ', calExps: 'LIKE \'%\'||||\'%\'', regStr: '\\LIKE\\s\\\'%\\\'\\|\\|\\|\\|\\\'%\\\'' },
  { expsDescr: '属于', calExpsRsol: ' in () ', calExps: 'IN()', regStr: '\\IN\\(\\)' },
];

class RightContent extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    indiGrpObj: {},
    Variable: this.props.Variable ? this.props.Variable : [],
    // 3个固定入参
    salaryItems: [],
    sysFunction: [],
    monthCount: [],
  }

  componentDidMount = () => {
    const { dataTier = 1, calMode = [], dictionary: { [getDictKey('TINDI_DEF_INDI_GRP')]: grpList = [] } } = this.props;
    this.FetchQuerySalaryFormulaConf(dataTier, calMode, grpList);
  }


  componentWillReceiveProps(nextProps) {
    const { [getDictKey('TINDI_DEF_INDI_GRP')]: grpList = [] } = nextProps.dictionary;
    if (nextProps.inputIndex !== this.props.inputIndex) {
      const allData = this.getAllValue();
      this.props.inputChang(allData);
    }
    if (nextProps.Variable !== this.state.Variable) {
      this.setState({
        Variable: nextProps.Variable ? nextProps.Variable : [],
      });
    }
    if (nextProps.dataTier !== this.props.dataTier) {
      const { calMode = [] } = nextProps;
      this.FetchQuerySalaryFormulaConf(nextProps.dataTier, calMode, grpList);
    } else if (nextProps.calMode !== this.props.calMode) {
      const { dataTier = 1 } = nextProps;
      this.FetchQuerySalaryFormulaConf(dataTier, nextProps.calMode, grpList);
    } else if (nextProps.dictionary !== this.props.dictionary) {
      const { dataTier = 1, calMode = [] } = nextProps;
      this.FetchQuerySalaryFormulaConf(dataTier, calMode, grpList);
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 点击树
  onSelect = (selectedKeys, info) => {
    const obj = {};
    const data = this.getAllValue();
    const { value } = info.node.props;
    obj.expsDescr = '';
    data.forEach((item) => {
      if (item.valStr === value) {
        obj.desc = item.expsDescr;
      }
    });
    const { Variable = [] } = this.props;
    Variable.forEach((item) => {
      if (item.seq === value) {
        obj.desc = item.name;
      }
    });
    obj.value = value;
    obj.data = data;
    this.props.exportValue(obj, 'tree');
  }

  // 用于获取{}中的内容，构造正则表达式
  getStr = (str) => {
    const start = str.indexOf('{');
    const end = str.indexOf('}');
    return str.substring(start + 1, end);
  }

  // 构造正则表达式,转义特殊字符$ () {}
  getRgeStr = (str) => {
    let regStr = '';
    regStr = str.replace(new RegExp('\\$', 'g'), '\\$')
      .replace(new RegExp('\\(', 'g'), '\\(')
      .replace(new RegExp('\\)', 'g'), '\\)')
      .replace(new RegExp('\\{', 'g'), '\\{')
      .replace(new RegExp('\\}', 'g'), '\\}');
    if (regStr.startsWith('\\')) {
      return regStr;
    }
    return `\\${regStr}`;
  }

  // 所有值,构造正则表达式
  getAllValue = () => {
    const { salaryItems, sysFunction, Variable, monthCount, indiGrpObj } = this.state;
    let arrayData = [...salaryItems, ...sysFunction, ...Variable, ...monthCount];
    for (const key in indiGrpObj) {
      const element = indiGrpObj[key];
      arrayData = [...arrayData, ...element];
    }
    const allData = [];
    operatorData.forEach((ele) => {
      allData.push(ele);
    });
    let ad; // 遍历生成正则表达式
    arrayData.forEach((ele) => {
      ad = {
        valStr: `${ele.calExps}`,
        regStr: `${this.getRgeStr(ele.calExps)}`,
        expsDescr: ele.expsDescr,
      };
      allData.push(ad);
    });

    // allData.push({
    //   valStr: '$S{SPREAD_CUST}',
    //   regStr: '\\$S\\{SPREAD_CUST\\}',
    //   expsDescr: '利差收入_客户',
    // });
    return allData;
  }

  // 按钮点击
  handClick = (item) => {
    const data = this.getAllValue();
    const obj = {
      value: item.calExps,
      desc: item.expsDescr,
    };
    obj.data = data;
    this.props.exportValue(obj, 'button');
  }

  // 搜索框
  handChange = (event) => {
    const { salaryItems, sysFunction, Variable, monthCount, indiGrpObj } = this.state;
    let arrayData = [...salaryItems, ...sysFunction, ...Variable, ...monthCount];
    for (const key in indiGrpObj) {
      const element = indiGrpObj[key];
      arrayData = [...arrayData, ...element];
    }
    const { value } = event.target;
    const expandedKeys = arrayData
      .map((item) => {
        if (item.expsDescr.indexOf(value) > -1) {
          return item.calExpsRsol;
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  // 标红搜索关键字
  loop = (data, searchValue) => {
    const TreeData = [];
    if (data.length > 0) {
      data.forEach((item) => {
        const index = item.expsDescr.indexOf(searchValue);
        const beforeStr = item.expsDescr.substr(0, index);
        const afterStr = item.expsDescr.substr(index + searchValue.length);
        const title = index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#F34141' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (<span>{item.expsDescr}</span>);
        TreeData.push({ expsDescr: title, calExpsRsol: item.calExpsRsol, calExps: item.calExps });
      });
    }
    return TreeData;
  }

  FetchQuerySalaryFormulaConf = async (dataTier = 1, calMode = [], grpList = []) => {
    const { versionId } = this.props;
    if (grpList.length > 0) {

      let indiGrpObj = {};
      let res;
      // 3个固定入参
      let salaryItemsRes;
      let sysFunctionRes;
      let monthCountRes;
      for (const item of calMode) {
        for (const grpItem of grpList) {
          if (item === Number(grpItem.ibm)) {
            res = await FetchQuerySalaryFormulaConf({ // 客户月度统计
              confPrjType: grpItem.ibm,
              dataTier,
              version: versionId,
            });
            const tmp = res ? res.records : [];
            Reflect.set(indiGrpObj, Number(grpItem.ibm), tmp);
          }
        }
        if (item === 0) {
          monthCountRes = await FetchQuerySalaryFormulaConf({ // 客户月度统计
            confPrjType: 0,
            dataTier,
            version: versionId,
          });
        }
        if (item === -1) {
          salaryItemsRes = await FetchQuerySalaryFormulaConf({ // 薪酬项目
            confPrjType: -1,
            dataTier,
            version: versionId,
          });
        }
        if (item === -2) {
          sysFunctionRes = await FetchQuerySalaryFormulaConf({ // 系统函数
            confPrjType: -2,
            dataTier,
            version: versionId,
          });
        }
      }
      const salaryItems = salaryItemsRes ? salaryItemsRes.records : [];
      const sysFunction = sysFunctionRes ? sysFunctionRes.records : [];
      const monthCount = monthCountRes ? monthCountRes.records : [];
      this.setState({ salaryItems, sysFunction, monthCount, indiGrpObj });
    }
  }

  render() {
    const { [getDictKey('TINDI_DEF_INDI_GRP')]: grpList = [] } = this.props.dictionary;
    const { searchValue, expandedKeys, autoExpandParent, salaryItems = [],
      sysFunction = [], Variable = [], monthCount = [], indiGrpObj } = this.state;
    const { variableName = '请选择', calMode = [] } = this.props;
    return (
      <div className="m-hsts-box">
        <div>
          {operatorData.map((item, index) => (
            <Button
              key={`${index}`}
              value={item.calExps}
              style={{ margin: '5px 5px', height: '3rem', width: '6.1rem' }}
              className="m-btn-radius m-btn-headColor"
              onClick={() => this.handClick(item)}
            >
              {item.expsDescr}
            </Button>
          ))}
        </div>
        <div className="m-form ant-form">
          <Input placeholder="输入关键字检索" style={{ width: '300px', height: '30px', margin: 5 }} onChange={this.handChange} />
        </div>
        <Scrollbars
          autoHide
          style={{ width: '100%', height: '30rem' }}
        >
          <Tree
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            className="m-tree-info"
            onSelect={this.onSelect}
          >
            <TreeNode iconHide title={variableName} key="key-1" selectable={false}>
              {/* {Variable.map(exe => (exe.name ? <TreeNode title={exe.name} key={exe.seq} value={exe.seq} selectable={false} /> : null
            ))} */}
              {this.loop(Variable, searchValue).map((item, index) => (
                <TreeNode title={item.expsDescr} key={item.calExpsRsol} value={item.calExps} index={index} />
              ))}
            </TreeNode>
            {
              grpList.length > 0 && calMode.indexOf(0) !== -1 ?
                (
                  <TreeNode title="客户月度统计" key="key-2" selectable={false}>
                    {this.loop(monthCount, searchValue).map((item, index) => (
                      <TreeNode title={item.expsDescr} key={item.calExpsRsol} value={item.calExps} index={index} />
                    ))}
                  </TreeNode>
                )
                :
                ''
            }
            {
              grpList.map(item => {
                if (grpList.length > 0 && calMode.indexOf(Number(item.ibm)) !== -1 && indiGrpObj[Number(item.ibm)]) {
                  return (<TreeNode title={item.note} key={`key-${5 + item.ibm}`} selectable={false}>
                    {this.loop(indiGrpObj[Number(item.ibm)], searchValue).map((item, index) => (
                      <TreeNode title={item.expsDescr} key={item.calExpsRsol} value={item.calExps} index={index} />
                    ))}
                  </TreeNode>)
                }
                return '';
              })
            }
            {
              grpList.length > 0 && calMode.indexOf(-1) !== -1 ?
                (
                  <TreeNode title="薪酬项目" key="key-3" selectable={false}>
                    {this.loop(salaryItems, searchValue).map((item, index) => (
                      <TreeNode title={item.expsDescr} key={item.calExpsRsol} value={item.calExps} index={index} />
                    ))}
                  </TreeNode>
                )
                :
                ''
            }
            {
              grpList.length > 0 && calMode.indexOf(-2) !== -1 ?
                (
                  <TreeNode title="系统函数" key="key-4" selectable={false}>
                    {this.loop(sysFunction, searchValue).map((item, index) => (
                      <TreeNode title={item.expsDescr} key={item.calExpsRsol} value={`${item.calExps}`} index={index} />
                    ))}
                  </TreeNode>
                )
                :
                ''
            }
          </Tree>
        </Scrollbars>
      </div>
    );
  }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(RightContent));
