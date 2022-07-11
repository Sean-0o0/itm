/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable react/jsx-indent */
import React from 'react';
import { Form, Row, Col, Select, Button, Input, message, Radio, Modal } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { FetchObjectQuery } from '../../../../../../services/sysCommon';
import { FetchMotFactorCheck, FetchMotFactorMaintenance, FetchCheckFactor } from '../../../../../../services/motProduction';
import { getDictKey } from '../../../../../../utils/dictUtils';
import ReferenceTable from './ReferenceTable';
import VariableTable from './VariableTable';
import IndexTable from './IndexTable';
import InputTreeModal from './InputTreeModal';

const { Option } = Select;
/**
 * 右侧配置主要内容
 */

class RightMainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yzflData: [],
      yybData: [],
      blData: [],
      zbData: [],
      inputTreeData: '',
      visibleType: '',
      visible: false,
      modalTips: '',
      inputTreeType: false,
      inputTreeLength: 0,
      position: {},
      modalVisible: false,
      mblx: '',
      jyVisible: false,
    };
  }
  componentDidMount() {
    this.fetchYzflrData();
    this.fetchTableData(this.props.factorInfoData[0]);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.factorInfoData !== this.props.factorInfoData) {
      this.fetchTableData(nextProps.factorInfoData[0]);
    }
  }
  fetchYzflrData = async (mblx) => {
    let tgtTp = '';
    if (mblx !== undefined && mblx !== '') {
      tgtTp = mblx;
    } else {
      tgtTp = this.props.tgtTp;
    }
    //const condition = `DIC_CL = 'MOT_FCTR_CL' AND TGT_TP = ${tgtTp} `;
    // const condition = {
    //   dic_cl: 'MOT_FCTR_CL',
    //   tgt_tp: tgtTp,
    // };
    // const { records: yzfl } = await fetchObject('yzfl', { condition });
    // if (Array.isArray(yzfl) && yzfl.length > 0) {
    //   this.setState({ yzflData: yzfl });
    // }
    const condition = {
      cols: "DIC_CL,DIC_CODE,DIC_NM,DIC_NOTE,ID,TGT_TP",
      current: 1,
      cxtj: "DIC_CL==MOT_FCTR_CL&&TGT_TP==2",
      pageSize: 100,
      paging: 1,
      serviceid: "motDic",
      sort: "",
      total: -1
    }
    FetchObjectQuery(condition).then(res => {
      let { code = 0, data: yzfl = [] } = res
      if (code === 1) {
        if (Array.isArray(yzfl) && yzfl.length > 0) {
          this.setState({ yzflData: yzfl });
        }
      }
    })

  }
  fetchTableData = (data) => {
    if (data !== undefined) {
      const yybData = data.fctrTable !== '' && data.fctrTable !== undefined ? JSON.parse(data.fctrTable) : [];
      const blData = data.fctrVar !== '' && data.fctrVar !== undefined ? JSON.parse(data.fctrVar) : [];
      const zbData = data.fctrIdx !== '' && data.fctrIdx !== undefined ? JSON.parse(data.fctrIdx) : [];
      let inputTreeData = '';
      if(data.fctrDef !== '' && data.fctrDef){
        data.fctrDef = data.fctrDef.replace(/%27/g,'\'');
        inputTreeData = data.fctrDef;
      }
      const mblx = data.tgtTp !== '' ? data.tgtTp : '';
      this.setState({ yybData, blData, zbData, inputTreeData, mblx });
    }
  }
  setType = (value) => {
    this.props.setType(value);
  }
  clickEdit = () => {
    this.props.setType(false);
  }
  clickPreserve = (value) => {
    this.setState({
      visibleType: value,
      visible: true,
      modalTips: '是否保存页面上的修改？',
    });
  }
  clickCancel = (value) => {
    this.setState({
      visibleType: value,
      visible: true,
      modalTips: '是否取消页面上的修改？',
    });
  }
  onChange = (value) => {
    this.setState({
      mblx: value,
    });
    this.fetchYzflrData(value);
  }
  handleOk = () => {
    const { factorInfoData } = this.props;
    const { visibleType, yybData, blData, zbData, inputTreeData, mblx } = this.state;
    const { yzID } = this.props;
    this.setState({
      visible: false,
    });
    if (visibleType === '1') {
      this.setState({
        modalVisible: true,
      });
      this.props.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-template-curly-in-string
          let fctrDef = inputTreeData.replace(/\${统计日期}/g, '${TJRQ}');
          for (let i = 0; i < blData.length; i++) {
            const bl = blData[i];
            const re = new RegExp(`\\\${${bl.VAR_DESC}}`, 'g');
            fctrDef = fctrDef.replace(re, `\${${bl.VAR_CODE}}`);
          }
          const checkPrams = {
            tgtTp: values.MBLX,
            fctrDef,
            tbl: JSON.stringify(yybData),
            var: JSON.stringify(blData),
            idx: JSON.stringify(zbData),
          };
          // 因子检验
          FetchMotFactorCheck(checkPrams).then((checkRet = {}) => {
            const { code, ckId, note = '' } = checkRet;
            if (code > 0) {
              const prams = {
                oprTp: yzID !== '' ? 2 : 1,
                fctrId: yzID !== '' ? yzID : '',
                fctrCl: values.YZFL,
                fctrNm: values.YZMC,
                fctrDesc: values.YZMS,
                cmptMode: values.JSFS,
                ...checkPrams,
              };
              // if (mblx === '1' || mblx === '2') {
              //   // sparkMot引擎校验
              //   FetchCheckFactor({ checkId: ckId }).then((ret = {}) => {
              //     const { code, note = '' } = ret;
              //     if (code > 0) {
              //       // 因子维护
              //       FetchMotFactorMaintenance(prams).then((ret = {}) => {
              //         const { code, note } = ret;
              //         if (code > 0) {
              //           this.setState({
              //             modalVisible: false,
              //           });
              //           message.success(code === 2 ? note : '保存成功');
              //           this.props.setType(true);
              //           this.props.fetchCompanyName(prams.oprTp === 1 ? note : yzID);
              //           // this.props.setCompany(yzID);
              //         }
              //       }).catch(((error) => {
              //         this.setState({
              //           modalVisible: false,
              //         });
              //         message.error(!error.success ? error.message : error.note);
              //       }));
              //     } else if (code < 0) {
              //       this.setState({
              //         modalVisible: false,
              //         jyVisible: true,
              //         modalTips: note || '因子校验失败'
              //       })
              //     }
              //   }).catch(((error) => {
              //     const note = error.note.replace(/\\n/g, '<br />');
              //     this.setState({
              //       modalVisible: false,
              //       jyVisible: true,
              //       modalTips: note,
              //     });
              //   }));
              // } else {
                FetchMotFactorMaintenance(prams).then((ret = {}) => {
                  const { code, note } = ret;
                  if (code > 0) {
                    this.setState({
                      modalVisible: false,
                    });
                    message.success(code === 2 ? note : '保存成功');
                    this.props.setType(true);
                    this.props.fetchCompanyName(prams.oprTp === 1 ? note : yzID);
                  }
                }).catch(((error) => {
                  this.setState({
                    modalVisible: false,
                  });
                  message.error(!error.success ? error.message : error.note);
                }));
              // }
            } else if (code < 0) {
              this.setState({
                modalVisible: false,
                jyVisible: true,
                modalTips: note || '因子校验失败'
              })
            }
          }).catch(((error) => {
            this.setState({
              modalVisible: false,
            });
            message.error(!error.success ? error.message : error.note);
          }));
        }
      });
    } else {
      if (this.props.addType === 'add') {
        this.props.fetchCompanyName();
      }
      this.fetchTableData(factorInfoData[0]);
      this.props.setType(true);
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  setData = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  setInputTreeData = (value, position) => {
    const { inputTreeData } = this.state;
    let newData = inputTreeData;
    if (position.start === position.end) {
      newData = newData.slice(0, position.start) + value + newData.slice(position.start);
    } else {
      newData = newData.slice(0, position.start) + value + newData.slice(position.end);
    }
    // const newData = inputTreeData.concat(value);
    this.setState({
      inputTreeData: newData,
      inputTreeType: true,
      inputTreeLength: value.length,
      position,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let { yzflData, yybData, blData, zbData, inputTreeData, mblx, visible, modalTips, inputTreeType, inputTreeLength, position } = this.state;
    const { dictionary = {}, type, factorInfoData } = this.props;
    const { [getDictKey('tgtTp')]: tgtTpDicts = [], [getDictKey('jsms')]: jsfsDicts = [], [getDictKey('blx')]: blxDicts = [] } = dictionary; // MOT字典
    let tpMc = '';
    let flMc = '';
    let jsms = '';
    let Data = '';
    mblx = mblx === '' ? '3' : mblx

    if (factorInfoData.length > 0) {
      Data = factorInfoData[0];
      tgtTpDicts.forEach((item) => {
        if (item.ibm === Data.tgtTp) {
          tpMc = item.note;
        }
      });
      yzflData.forEach((item) => {
        if (item.DIC_CODE === Data.fctrCl) {
          flMc = item.DIC_NOTE;
        }
      });
      jsfsDicts.forEach((item) => {
        if (item.ibm === Data.cmptMode) {
          jsms = item.note;
        }
      });
    }
    const bqData = [{ bqmc: '统计日期', bqdm: 'TJRQ', index: 0 }];
    if (blData.length > 0) {
      blData.forEach((item, index) => {
        const Item = { bqmc: item.VAR_DESC, bqdm: item.VAR_CODE, index: index + 1 };
        bqData.push(Item);
      });
    }
    const treeData = [];
    if (yybData.length > 0) {
      yybData.forEach((item) => {
        let Item = {};
        if (treeData.length === 0) {
          Item = { title: item.SBRD_USR, key: treeData.length, children: [{ title: `${item.TBL_NM}(${item.TBL_DESC})`, key: 0 }] };
          treeData.push(Item);
        } else {
          const newTreeList = treeData.filter((treeItem) => {
            if (treeItem.title.indexOf(item.SBRD_USR) !== -1) {
              return true;
            }
            return false;
          });
          if (newTreeList.length === 0) {
            Item = { title: item.SBRD_USR, key: treeData.length, children: [{ title: `${item.TBL_NM}(${item.TBL_DESC})`, key: 0 }] };
            treeData.push(Item);
          } else {
            const index = newTreeList[0].key;
            const childrenItem = { title: `${item.TBL_NM}(${item.TBL_DESC})`, key: treeData[index].children.length };
            treeData[index].children.push(childrenItem);
          }
        }
      });
    }
    return (
      <Form className="factor-form" onSubmit={this.handleSubmit} style={{height: '100%'}}>
        <Scrollbars autoHide style={{ width: '100%', height: '100%' }} >
          <Row style={{ borderBottom: '1px solid #e8e8e8', display: 'flex' }}>
            {type ? <span className="factor-title" style={{ position: 'relative', top: 8, width: '90%' }}>{Data.fctrNm}</span>
              : (
                <Form.Item style={{ marginBottom: '0.833rem', marginLeft: '2rem', width: '80%' }}>
                  {getFieldDecorator('YZMC', { initialValue: Data.fctrNm !== undefined ? Data.fctrNm : '' })(<Input maxLength={25} style={{ width: '240px', color: '#333333', fontWeight: 'bold', fontSize: 16, border: type ? 0 : '' }} />)}
                </Form.Item>
              )}
            <span style={{ display: 'inline-flex', float: 'right' }}>
              <Button className={Data.fctrCl === '0' ? '' : 'factor-bottom m-btn-border-headColor'} style={{ margin: '0.4rem 3rem 0.833rem' }} disabled={Data.fctrCl === '0'} >
                {type ? <a onClick={() => this.clickEdit()}>编辑</a> : <a onClick={() => this.clickPreserve('1')}>保存</a>}
              </Button>
              {type ? '' : (<Button className="mot-cancel-btn" style={{ marginTop: '0.4rem', marginRight: '3rem' }} onClick={() => this.clickCancel('2')} >取消</Button>)}
            </span>
          </Row>
          <Row style={{ paddingBottom: 20 }}>
            <div className="factor-content-title">基本信息</div>
            <Col xs={24} sm={8} md={8} lg={8}>
              <div className="factor-item">
                {type ? <span>目标类型：{tpMc}</span>
                  : (
                    <Form.Item label={(<span>目标类型</span>)}>
                      {getFieldDecorator('MBLX', { initialValue: Data.tgtTp !== undefined ? Data.tgtTp : '' })(<Select
                        style={{ width: '100%' }}
                        onChange={this.onChange}
                        disabled={this.props.addType !== 'add'}
                      >
                        {tgtTpDicts.map(item => <Option value={item.ibm}>{item.note}</Option>)}
                      </Select>)}
                    </Form.Item>
                  )}
              </div>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8}>
              <div className="factor-item">
                {type ? <span>因子分类：{flMc}</span>
                  : (
                    <Form.Item label={(<span>因子分类</span>)}>
                      {getFieldDecorator('YZFL', { initialValue: Data.fctrCl !== undefined ? Data.fctrCl : '' })(<Select
                        style={{ width: '100%' }}
                      >
                        {yzflData.map(item => <Option value={item.DIC_CODE}>{item.DIC_NOTE}</Option>)}
                      </Select>)}
                    </Form.Item>
                  )}
              </div>
            </Col>
            {mblx === '3' ? '' : (
              <Col xs={24} sm={8} md={8} lg={8}>
                <div className="factor-item">
                  {type ? <span>计算方式：{jsms}</span>
                    : (
                      <Form.Item label={(<span>计算方式</span>)}>
                        {getFieldDecorator('JSFS', { initialValue: mblx === '3' ? '1' : Data.cmptMode !== undefined ? Data.cmptMode : '' })(<Radio.Group disabled={mblx === '3'} >{jsfsDicts.map(item => (item.ibm !== '3' ? <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio> : ''))}</Radio.Group>)}
                      </Form.Item>
                    )}
                </div>
              </Col>
            )}
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className="factor-item">
                {type ? <span style={{ whiteSpace: 'pre-line' }}>因子描述：{Data.fctrDesc}</span>
                  : (
                    <Form.Item label={(<span>因子描述</span>)} style={{ marginRight: '2.6rem' }}>
                      {getFieldDecorator('YZMS', { initialValue: Data.fctrDesc !== undefined ? Data.fctrDesc : '' })(<Input.TextArea maxLength={100} className="mot-input" autosize={{ minRows: 4, maxRows: 6 }} />)}
                    </Form.Item>
                  )}
              </div>
            </Col>
          </Row>
          {mblx === '3' ? '' : <ReferenceTable blxDicts={blxDicts} type={type} yybData={yybData} setData={this.setData} />}
          <VariableTable type={type} blData={blData} setData={this.setData} dictionary={this.props.dictionary} xskz={mblx === '3'} />
          <Row style={{ paddingBottom: 20 }}>
            <div className="factor-content-title">SQL定义</div>
            <InputTreeModal type={type} inputTreeType={inputTreeType} inputTreeLength={inputTreeLength} position={position} data={inputTreeData} bqData={bqData} treeData={treeData} setData={this.setData} setInputTreeData={this.setInputTreeData} xskz={mblx === '3'} />
          </Row>
          <IndexTable type={type} zbData={zbData} setData={this.setData} />
          <Modal
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="500px"
            getContainer={false}
          >
            <p>{modalTips}</p>
          </Modal>
          <Modal
            centered
            destroyOnClose
            closable={false}
            maskClosable={false}
            visible={this.state.modalVisible}
            footer={null}
          >
            <p>因子校验中，请耐心等候！</p>
          </Modal>
          <Modal
            centered
            destroyOnClose
            closable={false}
            maskClosable={false}
            visible={this.state.jyVisible}
            footer={[
              <Button key="submit" type="primary" style={{ marginLeft: '2rem' }} onClick={() => { this.setState({ jyVisible: false }); }}>确定</Button>,
            ]}
          >
            <Scrollbars autoHide={false} style={{ minHeight: '150px', maxHeight: '300px' }}>
              <div dangerouslySetInnerHTML={{ __html: modalTips }} style={{ padding: '1rem' }} />
            </Scrollbars>
          </Modal>
        </Scrollbars>
      </Form>
    );
  }
}

export default Form.create()(RightMainContent);
