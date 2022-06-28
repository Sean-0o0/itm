/* eslint-disable jsx-a11y/anchor-is-valid */
import { Popover, Card, Modal, Form, Row, Col, Input, Select, Button, message, Upload, Table, Tooltip } from 'antd';
import React, { Fragment } from 'react';
import { cloneDeep } from 'lodash';
import { fetchObject } from '../../../../../services/sysCommon';
import BasicModal from '../../../../Common/BasicModal';
import { EncryptBase64 } from '../../../../../components/Common/Encrypt';
import { FetchoperateSalaryVersion, FetchquerySalaryVersion } from '../../../../../services/EsaServices/esaVersion'
import config from '../../../../../utils/config';
const { api } = config;
const { esa: { docsUpload } } = api;
/**
 * 版本配置表
 */
const { Search } = Input;
const { TextArea } = Input;
const { confirm, prompt } = Modal;
class VersionConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailTableData: [],
      esaVersionData: [],//薪酬版本数据
      row: "",
      content: "",
      visible: false, upvisible: false, downvisible: false,
      fileList: [],
      vNa: "",
      doc: "",
      quv: "",
      remk: "",
      vid: "",
      pvid: "",
      ask: "",
      user: JSON.parse(sessionStorage.getItem('user')),
      newversionname: "",
      rowversionData: [],
    };
  }
  componentDidMount() {
    const params = {
      current: 1,
      pageSize: "",
      paging: 0,
      sort: "",
      total: -1,
      versionName: ""
    };
    this.querySalaryVersion(params);
    this.fetchEsaVersionData();
  }
  componentWillReceiveProps(nextProps) {
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  upshowModal = (params) => {
    this.setState({
      upvisible: true,
      row: params
    });
  };
  fetchEsaVersionData = async () => {
    fetchObject('XCBBXX').then((res) => {
      const { note, code, records } = res;
      if (code > 0) {
        this.setState({ esaVersionData: records });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  handleChange = (params) => {
    const { theme = 'default-dark-theme' } = this.props;
    var newversionname = params.versionName;
    const { getFieldDecorator } = this.props.form;
    // eslint-disable-next-line no-restricted-globals
    // if(params.st === "1" ){
    confirm({
      title: params.st === "0" ? '确认进行上架' : '确认进行下架',
      cancelText: '取消',
      okText: '确定',

      content: (
        params.st === "0" ?

          <>

            <Form className="">
              <Row>
                <Col sm={12} md={12} xxl={12} >
                  <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="版本名称" required>
                    <textarea
                      onMouseOver={(e) => {

                        e.target.style.borderColor = '#54A9DF'

                      }}
                      onMouseOut={(e) => {

                        e.target.style.borderColor = 'gray'

                      }}
                      placeholder={params.versionName}
                      // +params.crtrDt.substring(4,6)+"调整"}
                      required="required"
                      type="text"
                      id="input-box"
                      defaultValue={params.versionName}
                      // +params.crtrDt.substring(4,6)+"调整"}
                      style={{ borderRadius: "18px", border: "1px solid gray", }}
                      onKeyUp={(e) => {

                        newversionname = e.target.value

                      }}
                    ></textarea>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

          </> : <></>
      ),
      className: theme,
      okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
      cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
      onOk: () => {

        this.setState({
          row: params
        });
        if (params.st === "0") {
          if (newversionname === "") { message.error("名称不能为空") }
          else {
            const { rowversionData = [] } = this.state;

            var i = 0;
            var flag = true;
            while (i < rowversionData.length) {

              if (rowversionData[i].versionName === newversionname) {
                flag = false;
                break;
              }
              i++;
            }

            if (flag === true) {
              params.versionName = newversionname;

              this.uphandleOk(params)
            }
            else {
              message.error("版本命名重复")
            }

          }
        }
        else { this.downhandleOk(params) }
      },
      onCancel() {
      },
    });
  }
  // }else{
  //   confirm({
  //     title: params.st === "0" ? '确认进行上架' : '确认进行下架',
  //     cancelText: '取消',
  //     okText: '确定',
  //     className: theme,

  //     okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
  //     cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
  //     onOk: () => {


  //       this.setState({
  //         row: params
  //       });
  //       if (params.st === "0") { this.uphandleOk(params) }
  //       else { this.downhandleOk(params) }
  //     },
  //     onCancel() {
  //     },
  //   });
  // }
  // }
  downshowModal = (params) => {
    this.setState({
      downvisible: true,
      row: params
    });
  };
  searchdata = (params) => {
    const searchparams = {
      current: 1,
      pageSize: "",
      paging: 0,
      sort: "",
      total: -1,
      versionName: params
    };
    this.querySalaryVersion(searchparams);
  };
  uphandleOk = (params) => {
    this.setState({
      upvisible: false,
    });
    const upparams = {
      oprType: 3,
      versionName: params.versionName,
      ruleDoc: params.ruleDoc,
      quoVersion: params.quoVersion,
      remk: params.remk,
      versionId: params.VersionId,
      parentVersionId: params.parentVersionId
    };

    this.operateSalaryVersion(upparams)
  };
  downhandleOk = (params) => {
    this.setState({
      downvisible: false,
    });

    const upparams = {
      oprType: 4,
      versionName: params.versionName,
      ruleDoc: params.ruleDoc,
      quoVersion: params.quoVersion,
      remk: params.remk,
      versionId: params.VersionId,
      parentVersionId: params.parentVersionId
    };

    this.operateSalaryVersion(upparams)
  };
  uphandleCancel = e => {
    this.setState({
      upvisible: false,
    });
  };
  downhandleCancel = e => {
    this.setState({
      downvisible: false,
    });
  };
  handleDataSource = (dataSource = []) => {
    dataSource.forEach()
  };
  handleOk = e => {



    const upparams = {
      oprType: 1,
      versionName: this.state.vNa,
      ruleDoc: this.state.doc,
      quoVersion: this.state.quv,
      remk: this.state.remk,
      parentVersionId: "",
      versionId: "",
    };
    const { detailTableData = [] } = this.state;

    var i = 0;
    var flag = true;
    while (i < detailTableData.length) {
      if (detailTableData[i].versionName === this.state.vNa) {
        flag = false;
        break;
      }
      i++;
    }

    if (flag === true) { this.operateSalaryVersion(upparams) }
    else {
      message.error("版本命名重复")
    }
    this.setState({
      visible: false,
      // fileList : []
    });
  };
  handleCancel = e => {
    this.setState({

      visible: false,

    });
  };
  querySalaryVersion = (params) => {
    FetchquerySalaryVersion({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        detailTableData: records,
        rowversionData: records
      });

      this.createtreedata(records);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  operateSalaryVersion = (params) => {
    FetchoperateSalaryVersion({ ...params }).then((res) => {
      const { note = [] } = res;
      message.success(note);
      const reparams = {
        current: 1,
        pageSize: "",
        paging: 0,
        sort: "",
        total: -1,
        versionName: ""
      };
      this.querySalaryVersion(reparams);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  handleFileChange = ({ file: info, fileList }) => { //处理文件change，保证用户选择的文件只有一个
    this.setState({
      'fileList': fileList.length ? [fileList[fileList.length - 1]] : []
    })
    if (info.status === 'done') {
      message.success(`${info.response.data.name} file uploaded successfully`);
      this.setState({
        doc: info.response.data.md5,
      });
    } else if (info.status === 'error') {
      message.error(`${info.response.data.name} file upload failed.`);
    }
  }
  createtreedata = (params) => {
    var res = [];
    if (params.length != 0) {
      res.push(params[0]);
      params[0].key = "0"
      res[res.length - 1].children = [];
      for (var i = 1; i < params.length; i++) {
        params[i].key = i;
        if (params[i].parentVersionId === res[res.length - 1].parentVersionId) {
          res[res.length - 1].children.push(params[i]);
        } else {
          if (res[res.length - 1].children.length === 0) {
            delete res[res.length - 1].children;
          }
          res.push(params[i])
          res[res.length - 1].children = [];
        }
      }
      if (res[res.length - 1].children.length === 0) {
        delete res[res.length - 1].children;
      }
    }

    this.setState({
      detailTableData: res,
    });

  };
  openLink = (row) => {
    const record = cloneDeep(row);
    Reflect.deleteProperty(record, 'children')
    const url = `/#/esa/salaryVersionDetail/basicInfo/${EncryptBase64(JSON.stringify(record))}`;
    window.open(url, '_blank');
  }
  render() {
    const { detailTableData = [], esaVersionData = [] } = this.state;
    const pagination = {
      className: 'm-paging',
      showTotal: total => `共${total}条`,
      showLessItems: true,
      showSizeChanger: true,
      showQuickJumper: true,
      showSinglePager: false,
    };
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '薪酬版本',
        width: 250,

        render: (_value, row) => (

          <Tooltip placement='bottom' title={row.versionName} overlayClassName="tooltipColor">
            <span style={{
              maxWidth: '150px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
              display: 'inline-block',
            }}>
              {row.versionName}
            </span>
          </Tooltip>


        ),
        fixed: 'left',
      },
      {
        title: '状态',
        width: 150,

        render: (_value, row) => (
          row.st === "0" ?
            <div>未上架</div> :
            row.st === "1" ?
              <div>已上架</div> :
              <div>历史版本</div>
        )
      },
      {
        title: '创建人',

        dataIndex: 'crtrName',
        width: 150,
      },
      {
        title: '发布日期',
        dataIndex: 'crtrDt',

        width: 150,
      },
      {
        title: '上架日期',
        dataIndex: 'upDt',
        width: 150,
      },
      {
        title: '下架日期',
        dataIndex: 'DownDt',
        width: 150,
      },
      {
        title: '制度文档',
        dataIndex: 'ruleDoc',
        width: 150,
        render: text => <a href={localStorage.getItem('livebos') + text.split('|')[0]} download={text.split('|')[1]}><span>{text.split('|')[1] || ''}</span></a>
      },
      {
        title: '特别说明',
        dataIndex: 'remk',

        render: (_value, row) => (

          <Tooltip placement='bottom' title={row.remk} overlayClassName="tooltipColor">
            <span style={{
              maxWidth: '150px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
              display: 'inline-block',
            }}>
              {row.remk}
            </span>
          </Tooltip>


        )
      },
      {
        title: '操作',
        fixed: 'right',
        width: 250,
        render: (_value, row) => (
          <>
            <Button type="link" className="m-color" onClick={() => { this.openLink(row) }}>{row.st === "0" || row.st === "1" ? "版本微调" : "详情"}</Button>
            <Button type="link" style={{ display: row.st === "0" || row.st === "1" ? "" : "none" }} className={row.st === "1" || row.st === "2" ? "" : "m-color"} disabled={row.st === "1" || row.st === "2"} onClick={() => { this.handleChange(row) }} >上架</Button>
            <Button type="link" style={{ display: row.st === "0" || row.st === "1" ? "" : "none" }} className={row.st === "0" || row.st === "2" ? "" : "m-color"} disabled={row.st === "0" || row.st === "2"} onClick={() => { this.handleChange(row) }} >下架</Button></>
        )
      },
    ];

    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        st: `${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }
    return (
      <Fragment>
        <Card style={{ height: '100%', overflow: 'hidden auto', margin: '0.833rem' }} className="m-card" bodyStyle={{ margin: '2rem 2rem 0 2rem' }}>

          <div>
            <div>
              <div style={{ float: "left", marginTop: "20px" }}>
                <Button className='fcbtn m-btn-border m-btn-border-headColor btn-1c' onClick={this.showModal}>
                  发布新制度版本
                </Button>
                <BasicModal
                  title=""
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  afterClose={() => {
                    this.setState({
                      'fileList': []
                    })
                  }}
                >
                  <div style={{ padding: '1.833rem 5rem 0 0' }}>
                    <Form className="">
                      <Row>
                        <Col sm={12} md={12} xxl={12} >
                          <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="薪酬版本" required>
                            {getFieldDecorator('valMode1', {

                              rules: [{ required: true, message: '薪酬版本' }],
                            })(<Input placeholder="请输入" onChange={event => { this.setState({ vNa: event.target.value, }); }} />)
                            }
                          </Form.Item>
                        </Col>

                      </Row>
                      <Row>
                        <Col sm={12} md={12} xxl={12} >
                          <Form.Item labelCol={{ span: 12 }} label="制度文档" wrapperCol={{ span: 12 }}>
                            {getFieldDecorator('valMode2', {
                              initialValue: '',
                              rules: [{ required: true, message: '请上传附件' }],
                            })(
                              <Upload action={docsUpload} fileList={this.state.fileList} method="post" onChange={this.handleFileChange}>
                                <Button>
                                  <i className="iconfont icon-daochu" style={{fontSize:"1.5rem"}}/>&nbsp;点击上传附件
                                </Button>
                              </Upload>
                            )
                            }
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12} md={12} xxl={12} >
                          <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="创建人" required>
                            <div style={{ fontSize: "16px", textDecoration: "underline" }} className="m-color">{this.state.user.name}</div>
                          </Form.Item>
                        </Col>
                        <Col sm={12} md={12} xxl={12} >
                          <Form.Item labelCol={{ span: 12 }} label="是否引用已有版本" label-width="100px" wrapperCol={{ span: 12 }} >
                            {getFieldDecorator('valMode4', {
                              initialValue: '是',
                              rules: [{ required: true, message: '请上传附件' }],
                            })(
                              <Select onChange={value => {
                                this.setState({
                                  ask: value,
                                });
                              }}>
                                <Select.Option value="是">是</Select.Option >
                                <Select.Option value="否">否</Select.Option >
                              </ Select>)
                            }
                          </Form.Item>
                        </Col>
                      </Row>
                      <div style={{ display: this.state.ask === "否" ? "none" : "" }} id="_select">
                        <Row>
                          <Col sm={12} md={12} xxl={12} >
                            <Form.Item labelCol={{ span: 12 }} label="引用版本" label-width="100px" wrapperCol={{ span: 12 }} required>
                              <Select
                                placeholder="请选择"
                                onChange={value => {
                                  this.setState({
                                    quv: value,
                                  });
                                }}
                              >
                                {
                                  esaVersionData.map(item => (
                                    <Select.Option key={item.ID} value={item.ID}>{item.VERSION}</Select.Option>
                                  ))
                                }
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                      <Row>
                        <Col sm={24} md={24} xxl={24} >
                          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="特殊说明" >
                            {getFieldDecorator('remk', {
                              initialValue: '',
                              rules: [{ required: false }]
                            })(<TextArea style={{ minWidth: '9.5rem' }} autosize={{ minRows: 3, maxRows: 5 }} onChange={event => {
                              this.setState({
                                remk: event.target.value,
                              });
                            }} />)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </BasicModal>
              </div>
              <div style={{ float: "right", marginTop: "20px", marginLeft: "20px" }}>
                <Search
                  placeholder="请输入版本名称"
                  onSearch={value => this.searchdata(value)}
                  style={{ width: 200 }}
                />
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <Table
              className="m-table-customer"
              columns={columns}
              locale={{ emptyText: '暂无数据' }}
              pagination={pagination}
              dataSource={detailTableData}
              scroll={{
                x: true,
              }}
              pag
            />
          </div>
        </Card>
      </Fragment>
    );
  }

}
export default Form.create()(VersionConfig);
