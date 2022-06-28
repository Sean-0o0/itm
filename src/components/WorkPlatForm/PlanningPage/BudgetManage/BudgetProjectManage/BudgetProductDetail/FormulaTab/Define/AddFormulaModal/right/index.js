
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tree, Form, Row, Col, Tag, Input } from 'antd';
import { connect } from 'dva';
import { fetchObject } from '../../../../../../../../../../services/sysCommon';

const { TreeNode } = Tree;
const { Search } = Input;
class RightContent extends React.Component {
  state = {
    sysInfo: [],
    funList: [],
    salaryProject: [],
    operatorData: [],
    keyword: '',
  }


  componentWillMount = () => {
    const operatorData = [
      { title: '+', key: '+', value: '+', regStr: '\\+' },
      { title: '-', key: '-', value: '-', regStr: '\\-' },
      { title: '*', key: '*', value: '*', regStr: '\\*' },
      { title: '/', key: '/', value: '÷', regStr: '\\÷' },
      { title: '最大', key: ' max ', value: 'max', regStr: '\\s{1}[m][a][x]\\s{1}' },
      { title: '最小', key: ' min ', value: 'min', regStr: '\\s{1}[m][i][n]\\s{1}' },
      { title: '并且', key: ' and ', value: '且', regStr: '\\s{1}[a][n][d]\\s{1}' },
      { title: '或者', key: ' or ', value: '或', regStr: '\\s{1}[o][r]\\s{1}' },
      { title: '＞', key: '>', value: '>', regStr: '\\>' },
      { title: '≥', key: '>=', value: '>=', regStr: '\\>\\=' },
      { title: '＜', key: '<', value: '<', regStr: '\\<' },
      { title: '≤', key: '=<', value: '=<', regStr: '\\=\\<' },
      { title: '等于', key: '=', value: '=', regStr: '\\=' },
      { title: '不等于', key: '!=', value: '!=', regStr: '\\!\\=' },
      { title: '当', key: ' when ', value: '当', regStr: '\\s{1}[w][h][e][n]\\s{1}' },
      { title: '类似', key: ' like ', value: '类似', regStr: '\\s{1}[l][i][k][e]\\s{1}' },
    ];

    this.setState({
      operatorData,
    });
  }

  componentDidMount = () => {
    // this.fetchObject();
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.inputIndex !== this.props.inputIndex) {
      const arr = this.setArr();
      this.props.inputChang(arr);
    }
  }

  onSelect = (selectedKeys, info) => {
    const arr = [];
    const obj = {};
    const arrData = this.setArr();
    obj.name = info.node.props.title;
    obj.value = info.node.props.value;
    obj.keyword = info.node.props.keyword;
    obj.data = arrData;
    arr.push(obj);
    if (JSON.stringify(obj) === '{}' || !obj.value || !obj.name) {
      return;
    }
    this.props.sendInfo(arr);
  }

  setArr = () => {
    const { Variable = [] } = this.props;
    const { sysInfo = [], funList = [], salaryProject = [], operatorData = [] } = this.state;
    const arr = [];
    let tt; let dd; let dt; let td; let st;
    Variable.forEach((e, i) => {
      tt = {
        valStr: `$C{${i + 1}}`,
        regStr: `\\$\\C\\{${i + 1}\\}`,
        description: e.ms,
        keyword: '',
      };
      arr.push(tt);
    });
    sysInfo.forEach((item) => {
      item.data.forEach((ment) => {
        dd = {
          valStr: `$S{${ment.ZBDM}}`,
          regStr: `\\$\\S\\{${ment.ZBDM}\\}`,
          description: ment.ZBMC,
        };
        arr.push(dd);
      });
    });
    funList.forEach((element) => {
      dt = {
        valStr: `${element.FUNC}`,
        regStr: `\\${element.FUNC}`,
        description: element.NAME,
      };
      arr.push(dt);
    });
    operatorData.forEach((ele) => {
      st = {
        valStr: ele.key,
        regStr: ele.regStr,
        description: ele.value,
      };
      arr.push(st);
    });
    salaryProject.forEach((element) => {
      td = {
        valStr: `$X{${element.XCDM}}`,
        regStr: `\\$\\X\\{${element.XCDM}\\}`,
        description: element.XCMC,
      };
      arr.push(td);
    });
    return arr;
  }


  getValue = (key) => {
    let x;
    switch (key) {
      case '1':
        x = '基本信息';
        break;
      case '2':
        x = '成本指标';
        break;
      case '3':
        x = '价值指标';
        break;
      case '4':
        x = '投资效果指标';
        break;
      default:
        x = '行为指标';
        break;
    }
    return x;
  }

  fetchObject = async () => {
    const response = await fetchObject('tXTZBDM', {
      queryOption: {
        "batchNo": 1,
        "batchSize": 9999
      }
    });
    const respon = await fetchObject('tXTFUNC', {
      queryOption: {
        "batchNo": 1,
        "batchSize": 9999
      }
    });
    const project = await fetchObject('tXCDM', {
      queryOption: {
        "batchNo": 1,
        "batchSize": 9999
      }
    });
    const arr = response ? response.records : [];
    const funList = respon ? respon.records : [];
    const salaryProject = project ? project.records : [];
    const map = {};
    const dest = [];
    for (let i = 0; i < arr.length; i++) {
      const tep = arr[i];
      if (!map[tep.ZBLB]) {
        dest.push({
          ZBLB: tep.ZBLB,
          name: this.getValue(tep.ZBLB),
          data: [tep],
        });
        map[tep.ZBLB] = tep;
      } else {
        for (let j = 0; j < dest.length; j++) {
          const dj = dest[j];
          if (dj.ZBLB === tep.ZBLB) {
            dj.data.push(tep);
            break;
          }
        }
      }
    }
    this.setState({ sysInfo: dest, funList, salaryProject });
  }
  // 关键字搜索
  handleOnkeyWord = (e) => {
    const { value } = e.target;
    const temp = this.fetchOperatorData().filter((item) => {
      if (item.title.indexOf(value) > -1) {
        return true;
      }
      return false;
    });

    this.setState({
      keyword: value,
      operatorData: temp,
    });
  }

  // 点击操作符
  HandleOnClick = (item) => {
    // const arr = [];
    // const obj = {};
    // const arrData = this.setArr();
    // obj.name = item.title;
    // obj.value = item.value;
    // obj.keyword = item.key;
    // obj.data = arrData;
    // arr.push(obj);
    // if (JSON.stringify(obj) === '{}' || !obj.value || !obj.name) {
    //   return;
    // }
    // this.props.sendInfo(item);

    this.props.getOperatorData(item);
  }

  // 操作符
  fetchOperatorData = () => {
    const myoperatorData = [
      { title: '+', key: '+', value: '+', regStr: '\\+' },
      { title: '-', key: '-', value: '-', regStr: '\\-' },
      { title: '*', key: '*', value: '*', regStr: '\\*' },
      { title: '/', key: '/', value: '÷', regStr: '\\÷' },
      { title: '最大', key: ' max ', value: 'max', regStr: '\\s{1}[m][a][x]\\s{1}' },
      { title: '最小', key: ' min ', value: 'min', regStr: '\\s{1}[m][i][n]\\s{1}' },
      { title: '并且', key: ' and ', value: '且', regStr: '\\s{1}[a][n][d]\\s{1}' },
      { title: '或者', key: ' or ', value: '或', regStr: '\\s{1}[o][r]\\s{1}' },
      { title: '＞', key: '>', value: '>', regStr: '\\>' },
      { title: '≥', key: '>=', value: '>=', regStr: '\\>\\=' },
      { title: '＜', key: '<', value: '<', regStr: '\\<' },
      { title: '≤', key: '=<', value: '=<', regStr: '\\=\\<' },
      { title: '等于', key: '=', value: '=', regStr: '\\=' },
      { title: '不等于', key: '!=', value: '!=', regStr: '\\!\\=' },
      { title: '当', key: ' when ', value: '当', regStr: '\\s{1}[w][h][e][n]\\s{1}' },
      { title: '类似', key: ' like ', value: '类似', regStr: '\\s{1}[l][i][k][e]\\s{1}' },
    ];


    return myoperatorData;
  }

  render() {
    // const { sysInfo = [], funList = [], salaryProject = [], operatorData = [], keyword = '' } = this.state;
    const { operatorData = [], keyword = '' } = this.state;

    // const { Variable = [] } = this.props;
    return (
      <Scrollbars
        autoHide
        style={{ width: '100%', height: '42rem' }}
      >
        <div className="m-hsts-box">
          <Row >
            {this.fetchOperatorData().map((item) => {
              return (

                <Col xs={6} sm={6} lg={6} xl={6} style={{ padding: '0.3rem 0' }}>
                  <Tag className="m-tag m-header" style={{ padding: '0', width: '80%', height: '30px', textAlign: 'center' }} key={item.key} onClick={() => this.HandleOnClick(item)} >{item.title}</Tag>
                </Col>
              );
            })}
          </Row>
          <Row style={{ padding: '1rem 0' }}>


            <Search style={{ marginBottom: 8 }} placeholder="请输入关键字检索" onChange={e => this.handleOnkeyWord(e)} />
            <div style={{ padding: '0 0 0 2rem' }}>请选择</div>
            <Tree
              showLine
              className="m-tree-info"
              onSelect={this.onSelect}
              defaultExpandAll={!!keyword}
            >
              {/* <TreeNode iconHide title="变量" key="key-1">
              {Variable.map((exe, index) => (
                <TreeNode title={exe.ms || `变量${index + 1}`} key={`$C{${index + 1}}`} value={`$C{${index + 1}}`} />
              ))}
            </TreeNode> */}
              {/* {sysInfo.map(item => (
                <TreeNode iconHide title={item.name} key={`key-2${item.ZBLB}`}>$S{1}
                  {
                  item.data && item.data.length ? item.data.map(ext => (
                    <TreeNode title={ext.ZBMC} key={ext.ID} value={`$S{${ext.ZBDM}}`} />
                  )) : nulls
                }
                </TreeNode>
            ))}
              <TreeNode title="薪酬项目" key="key-3" >
                {salaryProject.map(item => (
                  <TreeNode title={item.XCMC} key={`index${item.ID}`} value={`$X{${item.XCDM}}`} />
            ))}
              </TreeNode>
              <TreeNode title="系统函数" key="key-4" >
                {funList.map(item => (
                  <TreeNode title={item.NAME} key={`index${item.ID}`} value={`${item.FUNC}(${item.CS})`} />
            ))}
              </TreeNode> */}
              {

                <TreeNode title="系统参数" key="sys-params" >
                  {operatorData.map((item, index) => (
                    <TreeNode title={item.title} key={`item${index}`} value={item.key} />
                  ))}
                </TreeNode>

              }

            </Tree>
          </Row>
        </div>
      </Scrollbars>
    );
  }
}


export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(RightContent));
