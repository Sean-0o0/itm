import React, {useEffect, useState, useRef, Fragment} from 'react';
import {Modal, Form, message, Spin, Input, Button, Table, Steps, Select, Radio, Tooltip, Popover} from 'antd';
import EditCusRepTable from "./EditCusRepTable";
import PresetTable from "./PresetTable";
import {FetchQueryProjectInfoAll} from "../../../../../services/projectManage";
import {ConfigureCustomReport} from "../../../../../services/pmsServices";

const {Step} = Steps;
const {Option} = Select;

function OprtModal(props) {
  const {
    visible,
    setVisible,
    form,
    BGLX = [],
    ZDYBGMB = [],
    getBasicData,
    bgInfo = {},
    bgmb = [],
    bgdata = [],
    setBgInfo,
    title = ''
  } = props;
  // console.log("ZDYBGMB",ZDYBGMB);
  const {validateFields, getFieldValue, resetFields, getFieldDecorator} = form;
  const [isSpinning, setIsSpinning] = useState(false); //
  const [curStep, setCurStep] = useState(0); //当前tab ID
  const [fieldData, setFieldData] = useState([]); //传给后端的字段数据
  const [columnsData, setColumnsData] = useState([]); //字段数据-不包括填写字段
  const [allColumnsData, setAllColumnsData] = useState([]); //字段数据-所有
  const [tableData, setTableData] = useState([]); //默认数据
  const [presetData, setPresetData] = useState([]); //预设数据
  const [moduleId, setModuleId] = useState('-1'); //使用模版
  const [moduleFlag, setModuleFlag] = useState(false); //是否使用模版
  const [popoverVisible, setPopoverVisible] = useState(false); //是否使用模版
  // const [ZDLX, setZDLX] = useState(['分类字段', '填写字段']); //字段类型
  // const [bgDataTemp, setBgDataTemp] = useState([]); //字段类型

  // useEffect(() => {
  //   let count = 0;
  //   columnsData.forEach(x => {
  //     if (x.ZDLX === '分类字段') count++;
  //   });
  //   // console.log('🚀 ~ file: index.js:25 ~ useEffect ~ columnsData:', columnsData);
  //   if (count === 3) {
  //     setZDLX(['填写字段']);
  //   } else {
  //     setZDLX(['分类字段', '填写字段']);
  //   }
  //   return () => {};
  // }, [columnsData.length, JSON.stringify(columnsData)]);

  useEffect(() => {
    if (bgInfo.ID !== '-1' && bgmb && bgdata.length > 0) {
      // console.log("bgmb-jjjj",bgmb)
      // console.log("bgdata-jjjj",bgdata)
      dataSourceCallback(bgmb, true)
    }
    return () => {

    };
  }, [bgInfo, bgmb, bgdata]);

  const handleOk = () => {
    // 校验必填数据
    // presetData
    form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('bgmc')) {
          message.warn('请输入报告名称！');
          return;
        }
        if (errs.includes('bglx')) {
          message.warn('请选择报告类型！');
          return;
        }
      } else {
        configureCustomReport().then(() => {
          form.resetFields('bgmc')
        })
      }
    });
  };

  // 新建自定义报告
  const configureCustomReport = async () => {
    setIsSpinning(true);
    const payload = {
      fieldCount: fieldData.length,
      fieldInfo: JSON.stringify(fieldData),
      operateType: 'ADD',
      dataCount: presetData.length,
      presetData: JSON.stringify(presetData),
      reportId: -1,
      reportName: getFieldValue('bgmc'),
      reportType: Number(getFieldValue('bglx')),
    }
    if (bgInfo.ID !== '-1' && bgInfo.ID !== '') {
      payload.operateType = 'UPDATE'
      payload.reportId = bgInfo.ID
    }
    console.log("payloadpayload", payload)
    // return;
    ConfigureCustomReport({...payload})
      .then(res => {
        if (res?.success) {
          message.success('新增成功', 1);
          setIsSpinning(false);
          setVisible(false)
          setBgInfo({ID: '-1', BGMC: ''});
          setModuleFlag(false);
          setCurStep(0);
          getBasicData();
        }
      })
      .catch(e => {
        console.error('🚀自定义报告新增失败', e);
        message.error('新增失败', 1);
        setIsSpinning(false);
      });
  }

  const handleCancel = () => {
    resetFields();
    setModuleFlag(false);
    setBgInfo({ID: '-1', BGMC: ''});
    setCurStep(0);
    setVisible(false);
  };

  const onStepChange = v => {
    if (v === 1) {
      handleNext();
    } else setCurStep(v);
  };

  const handleNext = () => {
    form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('bgmc')) {
          message.warn('请输入报告名称！');
          return;
        }
        if (errs.includes('bglx')) {
          message.warn('请选择报告类型！');
          return;
        }
      } else {
        setCurStep(1);
      }
    });
  };
  const handleLast = () => {
    setCurStep(0);
  };

  //表格模板 - 列配置
  const rptTemplateColumns = [
    {
      title: '模板名称',
      key: 'MBMC',
      dataIndex: 'MBMC',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'CZ',
      dataIndex: 'CZ',
      align: 'center',
      width: 200,
      render: () => (
        <Fragment>
          <Popover
            title={null}
            placement="rightTop"
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={getCusRepExp}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            autoAdjustOverflow={true}
            content={getToDoItem()}
            overlayClassName="cusreport-card-content-popover"
          >
            <a style={{color: '#3361ff'}}>查看</a>
          </Popover>
          <a style={{color: '#3361ff', marginLeft: 6}} onClick={userCusRepExp}>使用</a>
        </Fragment>
      ),
    },
  ];

  //使用模版
  const getCusRepExp = (visable) => {
    setPopoverVisible(visable);
  }

  //待办块
  const getToDoItem = () => {
    const mb = JSON.parse(ZDYBGMB[0].note)
    // console.log("mbmbmbm",mb)
    return (
      <>
        <div style={{
          fontFamily: 'PingFangSC-Medium, PingFang SC',
          fontWeight: 'bold',
          borderRadius: '8px',
          color: '#606266',
          display: 'flex',
          textAlign: 'center',
          padding: '12px 0',
          backgroundColor: '#fafafa'
        }}>
          <div style={{width: '50%'}}>字段名称</div>
          <div style={{width: '50%'}}>字段类型</div>
        </div>
        <div style={{
          display: 'flex', maxHeight: '250px',
          overflowY: 'auto', height: '250px'
        }}>
          <div style={{width: '50%', display: 'grid', justifyContent: 'center', padding: '0 24px 16px 24px'}}>
            {mb.length > 0 && mb.map(item => (
              <div className="todo-card-box">
                <div className="todo-card-title">
                  <div className="todo-card-zdmc" style={{
                    fontFamily: 'Roboto-Regular, Roboto, PingFangSC-Regular, PingFang SC', fontWeight: 400,
                    color: '#303133'
                  }}>{item.ZDMC}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{width: '50%', display: 'grid', justifyContent: 'center', padding: '0 24px 16px 24px'}}>
            {mb.length > 0 && mb.map(item => (
              <div className="todo-card-box">
                <div className="todo-card-title">
                  <div className="todo-card-zdlx" style={{
                    fontFamily: 'Roboto-Regular, Roboto, PingFangSC-Regular, PingFang SC', fontWeight: 400,
                    color: '#303133'
                  }}>{item.ZDLX === '1' ? '分类字段' : '填写字段'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  //使用模版
  const userCusRepExp = () => {
    setModuleFlag(true);
    setModuleId('-1')
  }

  //表头数据
  const dataSourceCallback = (data, flag) => {
    console.log("datadatadata-asdad", data)
    //处理预设数据
    const columns = [];
    const allColumns = [];
    const fieldData = [];
    data.map(item => {
      if (item.ZDLX === '1') {
        const c = {
          title: item.ZDMC,
          dataIndex: flag ? item.QZZD : 'ZD' + item.ID,
          editable: true,
          ZDLX: item.ZDLX,
        };
        columns.push(c)
      }
      const ac = {
        title: item.ZDMC,
        dataIndex: flag ? item.QZZD : 'ZD' + item.ID,
        editable: true,
        ZDLX: item.ZDLX,
      };
      allColumns.push(ac)
      const f = {
        ZDLX: item.ZDLX,
        ZDMC: item.ZDMC,
      };
      fieldData.push(f)
    })
    // console.log("columnscolumns-ccc",columns)
    setFieldData([...fieldData])
    setColumnsData([...columns])
    setAllColumnsData([...allColumns])
    const keysArr = [];
    allColumns.map(c => {
      keysArr.push(c.dataIndex)
    })
    //bgdata bgmb
    // console.log("keysArrkeysArr-ccc", keysArr)
    if (bgInfo.ID === '-1' || bgInfo.ID === '') {
      const newData = {}
      newData.ID = Date.now();
      newData.key = Date.now();
      newData['GLXM' + newData.ID] = '';
      newData['TXR' + newData.ID] = '';
      // newData.newDataFlag = true;
      keysArr.map(i => {
        Object.assign(newData, {[newData.ID + i]: ''})
      })
      setTableData([newData])
    } else {
      const newDataArr = [];
      // console.log("bgdata-ccc",bgdata)
      // console.log("keysArr",keysArr)
      bgdata.map((item, index) => {
        const newData = {}
        newData.ID = item.ID;
        newData.key = item.ID;
        newData.YF = item.YF;
        newData.GXZT = item.GXZT
        newData.SYJL = item.SYJL;
        newData['GLXM' + newData.ID] = item.GLXMID;
        newData['TXR' + newData.ID] = item.TXRID;
        keysArr.map(i => {
          Object.assign(newData, {[newData.ID + i]: item[i]})
        })
        newDataArr.push(newData)
      })
      console.log("newDataArr-ccc", newDataArr)
      setTableData([...newDataArr])

      //处理默认数据
      //处理预设数据
      let newObj = null
      const newDataSource = [];
      newDataArr.map((item) => {
        let keysArr = Object.keys(item)
        newObj = JSON.parse(JSON.stringify(item));
        keysArr.map(i => {
          //处理字段ZD
          if (i !== 'key' && i !== 'ID' && i !== 'YF' && i !== 'GXZT' && i !== 'SYJL' && !i.includes('GLXM') && !i.includes('TXR') && i !== 'newDataFlag') {
            let index = i.indexOf("Z");//获取第一个"Z"的位置
            let after1 = i.substring(index + 1);
            newObj["Z" + after1] = item[i];
            delete newObj[i];
          }
          if (i !== 'key' || i !== 'ID') {
            delete newObj['key'];
            delete newObj['ID'];
          }
          if (i.includes('GLXM')) {
            newObj["GLXM"] = item[i];
            delete newObj[i];
          }
          if (i.includes('TXR')) {
            newObj["TXR"] = item[i];
            delete newObj[i];
          }
          if (i === 'YF') {
            newObj["YF"] = item[i];
            delete item[i];
          }
          if (i === 'GXZT') {
            newObj["GXZT"] = item[i];
            delete item[i];
          }
          if (i === 'SYJL') {
            newObj["SYJL"] = item[i];
            delete item[i];
          }
        })
        newDataSource.push(newObj)
      })
      setPresetData([...newDataSource])
    }
  }

  //表格数据
  const presetTablDataSourceCallback = (data) => {
    console.log("callbackdata", data)
    setPresetData([...data])
  }

  return (
    <Modal
      wrapClassName="editMessage-modify custom-report-edit-modal"
      width={'850px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{backgroundColor: 'rgb(0 0 0 / 30%)'}}
      style={{top: '10px'}}
      title={null}
      visible={visible}
      onCancel={handleCancel}
      forceRender={true}
      footer={
        <div className="modal-footer">
          <Button className="btn-default" onClick={handleCancel}>
            取消
          </Button>
          {curStep === 0 ? (
            <Button
              loading={isSpinning}
              className="btn-primary"
              type="primary"
              onClick={handleNext}
            >
              下一步
            </Button>
          ) : (
            <Fragment>
              <Button
                loading={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={handleLast}
              >
                上一步
              </Button>
              <Button
                loading={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={handleOk}
              >
                保存
              </Button>
            </Fragment>
          )}
        </div>
      }
    >
      <div className="body-title-box">
        <strong>{title}</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box">
          <Steps
            current={curStep}
            onChange={onStepChange}
            type="navigation"
            style={{ marginBottom: 16 }}
          >
            <Step title="定义报告字段" status={curStep === 0 ? 'process' : 'wait'} />
            <Step title="预设填写数据" status={curStep === 1 ? 'process' : 'wait'} />
          </Steps>
          <div style={{ display: curStep !== 0 ? 'none' : 'block' }}>
            <Form.Item label="报告名称" labelCol={{span: 3}} wrapperCol={{span: 21}}>
              {getFieldDecorator('bgmc', {
                initialValue: bgInfo.BGMC || '',
                rules: [
                  {
                    required: true,
                    message: '报告名称不允许空值',
                  },
                ],
              })(<Input className="item-selector" placeholder="请输入报告名称" allowClear/>)}
            </Form.Item>
            <Form.Item label="报告类型" labelCol={{span: 3}} wrapperCol={{span: 21}}>
              {getFieldDecorator('bglx', {
                initialValue: bgInfo.LX || '1',
                rules: [
                  {
                    required: true,
                    message: '报告类型不允许空值',
                  },
                ],
              })(
                <Radio.Group className="item-component">
                  {/*{BGLX.map(x => (*/}
                  {/*  <Radio key={x.ibm} value={x.ibm}>*/}
                  {/*    {x.note}*/}
                  {/*  </Radio>*/}
                  {/*))}*/}
                  <Radio key='1' value='1'>
                    月报
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item required label="报告模版" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              <Table
                columns={rptTemplateColumns}
                rowKey={'MBMC'}
                dataSource={[
                  {
                    MBMC: ZDYBGMB[0]?.cbm,
                  },
                ]}
                pagination={false}
                bordered
              />
            </Form.Item>
            <Form.Item
              required
              label="报告字段"
              labelCol={{span: 3}}
              wrapperCol={{span: 21}}
              style={{marginBottom: 0}}
            >
              <EditCusRepTable
                ZDYBGMB={ZDYBGMB}
                bgid={moduleFlag ? moduleId : bgInfo.ID}
                bgmb={bgmb}
                dataSourceCallback={dataSourceCallback}
              />
            </Form.Item>
          </div>
          <Form.Item
            required
            label="预设字段"
            labelCol={{span: 3}}
            wrapperCol={{span: 21}}
            style={{marginBottom: 0, display: curStep === 0 ? 'none' : 'block'}}
          >
            <PresetTable
              tableData={tableData}
              setTableData={setTableData}
              columns={columnsData}
              allColumnsData={allColumnsData}
              presetTablDataSourceCallback={presetTablDataSourceCallback}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(OprtModal);
