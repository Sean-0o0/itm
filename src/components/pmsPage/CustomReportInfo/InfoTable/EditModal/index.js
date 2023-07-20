import React, {useEffect, useState, useRef, Fragment} from 'react';
import {Modal, Form, message, Spin, Input, Button, Table, Steps, Select, Radio, Tooltip, Popover, Icon} from 'antd';
import EditCusRepTable from "./EditCusRepTable";
import PresetTable from "./PresetTable";
import moment from 'moment';
import {FetchQueryProjectInfoAll} from "../../../../../services/projectManage";
import {ConfigureCustomReport} from "../../../../../services/pmsServices";

const {Step} = Steps;
const {Option} = Select;

// 新增自定义报告
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
  // //console.log("ZDYBGMB",ZDYBGMB);
  const {validateFields, getFieldValue, resetFields, getFieldDecorator} = form;
  const [isSpinning, setIsSpinning] = useState(false); //
  const [curStep, setCurStep] = useState(0); //当前tab ID
  const [fieldData, setFieldData] = useState([]); //前端展示的字段数据
  const [fieldDataBack, setFieldDataBack] = useState([]); //传给后端的字段数据
  const [columnsData, setColumnsData] = useState([]); //字段数据-不包括填写字段
  const [allColumnsData, setAllColumnsData] = useState([]); //字段数据-所有
  const [tableData, setTableData] = useState([]); //默认数据
  const [presetData, setPresetData] = useState([]); //预设数据
  const [presetDataBack, setPresetDataBack] = useState([]); //传给后端的字段数据
  const [moduleId, setModuleId] = useState('-1'); //使用模版
  const [moduleFlag, setModuleFlag] = useState(false); //是否使用模版
  const [popoverVisible, setPopoverVisible] = useState(false); //是否使用模版
  // const [ZDLX, setZDLX] = useState(['分类字段', '填写字段']); //字段类型
  // const [bgDataTemp, setBgDataTemp] = useState([]); //字段类型

  const [presetFieldData, setPresetFieldData] = useState([]); //预设字段的数据源
  const [count, setCount] = useState(0); //预设字段的数据源字段个数
  const [ZDLXflag, setZDLXflag] = useState(false); //分类字段个数标志

  useEffect(() => {
    const keysArr = [];
    if (bgmb) {
      //console.log("bgmbbgmb-chchchch",bgmb)
      const columns = [];//展示的表头-不包含填写字段
      const allColumns = [];//表头所有字段-包含填写字段
      const fieldData = [];//传递给后端的字段数据
      const dataSource = [];
      const data = JSON.parse(JSON.stringify(bgmb));
      data.map((item, index) => {
        const num = Number(index) + 1
        dataSource.push({
          key: num,
          ID: num,
          ['ZDMC' + num]: item.ZDMC,
          ['ZDLX' + num]: item.ZDLX,
        })
      })
      //分类字段最多3个
      let ZDLXflag = presetFieldData.filter(item => item['ZDLX' + item.ID] === '1').length > 2;
      setZDLXflag(ZDLXflag);
      setCount(dataSource.length)
      setPresetFieldData([...dataSource])
      dataSource.map(item => {
        //不包含填写字段
        if (item['ZDLX' + item.ID] === '1') {
          const c = {
            title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
              fontFamily: 'SimSun, sans-serif',
              color: '#f5222d',
              marginRight: '4px',
              lineHeight: 1
            }}>*</span>{item['ZDMC' + item.ID]}</span>,
            dataIndex: 'ZD' + item.ID,
            editable: true,
            ZDLX: item['ZDLX' + item.ID],
            ZDMC: item['ZDMC' + item.ID],
          };
          columns.push(c)
        }
        const ac = {
          title: item['ZDMC' + item.ID],
          dataIndex: 'ZD' + item.ID,
          editable: true,
          ZDLX: item['ZDLX' + item.ID],
        };
        allColumns.push(ac)
        const f = {
          ZDLX: item['ZDLX' + item.ID],
          ZDMC: item['ZDMC' + item.ID],
        };
        fieldData.push(f)
      })
      setFieldData([...fieldData])
      setColumnsData([...columns])
      setAllColumnsData([...allColumns])
      allColumns.map(c => {
        keysArr.push(c.dataIndex)
      })
    }
    if (bgdata) {
      //console.log("bgmbbgmb-chchchch22222",keysArr)
      //  当前表格内的数据-tableData
      if (bgdata.length > 0) {
        //console.log("tableDatatableData", bgdata)
        const newDataArr = []
        bgdata.map(item => {
          let newData = {}
          newData.ID = item.ID;
          newData.key = item.ID;
          newData['YF' + newData.ID] = item.YF;
          newData['GXZT' + newData.ID] = item.GXZT
          newData['SYJL' + newData.ID] = item.SYJL;
          newData['GLXM' + newData.ID] = item.GLXMID;
          newData['TXR' + newData.ID] = item.TXRID;
          keysArr.map(i => {
            Object.assign(newData, {[newData.ID + i]: item[i]})
          })
          newDataArr.push(newData)
        })
        //console.log("newDataArr-chchchch22222",newDataArr)
        setTableData([...newDataArr])
        const arr = JSON.parse(JSON.stringify(newDataArr));
        //console.log("arrarr333", arr)
        //处理预设数据
        let newObj = null
        const newDataSource = [];
        arr.map((item) => {
          let keysArr = Object.keys(item)
          newObj = JSON.parse(JSON.stringify(item));
          keysArr.map(i => {
            //处理字段ZD
            if (i !== 'key' && i !== 'ID' && !i.includes('YF') && !i.includes('GXZT') && !i.includes('SYJL') && !i.includes('GLXM') && !i.includes('TXR') && i !== 'newDataFlag') {
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
            if (i.includes('YF')) {
              newObj["YF"] = item[i];
              delete newObj[i];
            }
            if (i.includes('GXZT')) {
              newObj["GXZT"] = item[i];
              delete newObj[i];
            }
            if (i.includes('SYJL')) {
              newObj["SYJL"] = item[i] || '-1';
              delete newObj[i];
            }
          })
          newDataSource.push(newObj)
        })
        //console.log("newDataSource333", newDataSource)
        setPresetData([...newDataSource])
      }
    }
    return () => {
    };
  }, [bgmb, bgdata]);

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
        //数据重新排序
        handleFiledAndData();
      }
    });
  };

  //处理传给后端的数据
  const handleFiledAndData = async () => {
    //删除后字段要重新排序
    const dataArr = []
    //字段必填校验-关联项目非必填 其他必填
    let fieldFlag = false;
    //记录为空的字段
    let fieldName = '';
    presetFieldData.map((item, index) => {
      // //console.log("indexindex",index)
      let data = {}
      let ID = index + 1;
      // data.key = index + 1
      // data.ID = index + 1
      data['ZDMC'] = item['ZDMC' + item.key]
      data['ZDLX'] = item['ZDLX' + item.key]
      dataArr.push(data);
    })
    //console.log("dataArrdataArr",dataArr)
    setFieldDataBack([...dataArr])
    //数据也要重新赋值
    const tableArr = []
    //console.log("columnsData-jjj",columnsData)
    //取出要校验必填的字段-只需校验分类字段和填写人
    let filedClounm = [];
    columnsData.forEach(e => {
      filedClounm.push({ZDMC: e.ZDMC, dataIndex: e.dataIndex})
    })
    console.log("filedClounmfiledClounm", filedClounm)
    tableData.map((item, index) => {
      let zdArr = [];
      zdArr = Object.keys(item)
      let tab = {}
      let newzdArr = [];
      newzdArr = zdArr.filter(item => item.includes("ZD"));
      console.log("zdArrzdArr", newzdArr)
      //console.log("2222-sss",item['TXR'+ item.ID])
      if (!item['TXR' + item.ID] || item['TXR' + item.ID] === undefined) {
        fieldName = "填写人";
        fieldFlag = true;
      }
      newzdArr.map((zd, ind) => {
        // 真实字段名-去除id
        let index = zd.indexOf("Z");//获取第一个"Z"的位置
        let after1 = zd.substring(index + 1);
        const aczd = 'Z' + after1
        //校验必填项
        if (zd.includes(item.ID)) {
          filedClounm.map((z, ind) => {
            if (z.dataIndex.includes('ZD') && zd.includes('ZD') && aczd === z.dataIndex) {
              //console.log("1111-sss",item[zd])
              if (item[zd] === undefined || item[zd] === '') {
                fieldFlag = true;
                fieldName = z.ZDMC;
              }
            }
          })
          //第几个字段
          if (zd.includes('ZD')) {
            let ID = ind + 1;
            // tab.ID = ind + 1;
            // tab.key = ind + 1;
            tab['ZD' + ID] = item[zd] || 'undefined';
          }
        }
      })
      tab['GLXM'] = item['GLXM' + item.ID] || '-1';
      tab['TXR'] = item['TXR' + item.ID] || '-1';
      tab['YF'] = item['YF' + item.ID] || moment(new Date(), 'YYYYMM').format('YYYYMM');//当月
      tab['GXZT'] = item['GXZT' + item.ID] || '1';
      tab['SYJL'] = item['SYJL' + item.ID] || '-1';
      if (!item['TXR' + item.ID] || item['TXR' + item.ID] === undefined) {
        //console.log("2222")
        fieldFlag = true;
      }
      tableArr.push(tab)
    })
    //console.log("tableArrtableArr",tableArr)
    setPresetDataBack([...tableArr])
    if (fieldFlag) {
      message.warn("请将" + fieldName + "数据填写完整！")
      return;
    }
    configureCustomReport([...dataArr], [...tableArr]);
  }

  // 新建自定义报告
  const configureCustomReport = (dataArr, tableArr) => {
    setIsSpinning(true);
    const payload = {
      fieldCount: dataArr.length,
      fieldInfo: JSON.stringify(dataArr),
      operateType: 'UPDATE',
      dataCount: tableArr.length,
      presetData: JSON.stringify(tableArr),
      reportId: bgInfo.ID,
      reportName: getFieldValue('bgmc'),
      reportType: Number(getFieldValue('bglx')),
    }
    console.log("payloadpayload", payload)
    // return;
    ConfigureCustomReport({...payload})
      .then(res => {
        if (res?.success) {
          message.success('修改成功！', 1);
          setIsSpinning(false);
          setVisible(false)
          resetFields();
          setBgInfo({ID: '-1', BGMC: ''});
          setModuleFlag(false);
          setCurStep(0);
          setPresetFieldData([])
          setPresetData([]);
          setPresetDataBack([])
          setTableData([])
          setColumnsData([])
          setAllColumnsData([])
          getBasicData();
        }
      })
      .catch(e => {
        console.error('🚀自定义报告新增失败', e);
        message.error('编辑自定义报告失败！', 1);
        setIsSpinning(false);
      });
  }

  const handleCancel = () => {
    resetFields();
    setModuleFlag(false);
    setBgInfo({ID: '-1', BGMC: ''});
    setCurStep(0);
    setPresetFieldData([])
    setPresetData([]);
    setPresetDataBack([])
    setTableData([])
    setColumnsData([])
    setAllColumnsData([])
    setVisible(false);
  };

  const onStepChange = v => {
    if (v === 1) {
      handleNext();
    } else setCurStep(v);
  };

  const handleNext = () => {
    console.log("1111", allColumnsData)
    let flag = false;
    allColumnsData.map(item => {
      if (item.title === '' || item.title === undefined || item.ZDLX === '' || item.ZDLX === undefined || item.dataIndex === '' || item.dataIndex === undefined) {
        flag = true;
      }
    })
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
      } else if (columnsData.filter(item => item.dataIndex !== 'GLXM' && item.dataIndex !== 'TXR' && item.ZDLX === '1').length < 1) {
        //至少要有一个分类字段
        message.warn('请至少添加一个分类字段！');
        return;
      } else if (flag) {
        //allColumnsData
        message.warn('请将报告字段数据填写完整！');
        return;
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
            content={getMBItem()}
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

  //模版查看
  const getMBItem = () => {
    const mb = JSON.parse(ZDYBGMB[0].note)
    // console.log("mbmbmbm", mb)
    const columns = []
    mb.map(item => {
      columns.push({
        align: 'center',
        title: item.ZDMC,
        dataIndex: 'XQBT',
        width: 80,
        key: 'XQBT',
      })
    })
    return (
      <div className="table-box">
        <Table columns={columns} rowKey={'id'} dataSource={[]} size="middle" pagination={false}/>
      </div>
    );
  };

  //使用模版-设置报告字段表格的数据源
  const userCusRepExp = () => {
    // setModuleFlag(true);
    // setModuleId('-1')
    //ZDYBGMB-新增时使用该模版
    const dataSource = [];
    const data = JSON.parse(ZDYBGMB[0].note);
    //使用模版id从200开始----id没有变动表格数据没有实时更新
    data.map((item, index) => {
      const num = Number(index) + 200
      dataSource.push({
        key: num,
        ID: num,
        ['ZDMC' + num]: item.ZDMC,
        ['ZDLX' + num]: item.ZDLX,
      })
    })
    //分类字段最多3个
    let ZDLXflag = presetFieldData.filter(item => item['ZDLX' + item.ID] === '1').length > 2;
    setZDLXflag(ZDLXflag);
    setCount(dataSource.length)
    setPresetFieldData([...dataSource])
    //字段变成下一个页面的表头
    //处理表头和表格数据
    handleTableFiledAndDataInit([...dataSource])
  }

  //模版字段数据源回调变化
  const presetFieldDataCallback = (data) => {
    //分类字段最多3个
    let ZDLXflag = data.filter(item => item['ZDLX' + item.ID] === '1').length > 2;
    setZDLXflag(ZDLXflag);
    setCount(data.length)
    //console.log("[...data][...data]", data)
    setPresetFieldData([...data])
    //处理表头和表格数据--//处理已填写的数据
    handleTableFiledAndData([...data])
  }

  const tableDataCallback = (data) => {
    //console.log("[...tabledata][...tabledata]", data)
    setTableData([...data])
  }

  //ZD1 ZD2 ZD3  ====> ZD1  ZD3   然后新增  是ZD1 ZD2 ZD3  还是ZD1 ZD3 ZD4
  //字段变了(只有字段名称变了-数据不变,删除了字段又新增了同名字段-数据置空,新增了一个字段-该字段数据为空)
  const handleTableFiledAndData = (data) => {
    //字段变成下一个页面的表头
    //处理下一个页面的表头和表格数据
    const columns = [];//展示的表头-不包含填写字段
    const allColumns = [];//表头所有字段-包含填写字段
    const fieldData = [];//传递给后端的字段数据
    //console.log("datadatadata", data)
    data.map(item => {
      //不包含填写字段
      if (item['ZDLX' + item.ID] === '1') {
        const c = {
          title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
            fontFamily: 'SimSun, sans-serif',
            color: '#f5222d',
            marginRight: '4px',
            lineHeight: 1
          }}>*</span>{item['ZDMC' + item.ID]}</span>,
          dataIndex: 'ZD' + item.ID,
          editable: true,
          ZDLX: item['ZDLX' + item.ID],
          ZDMC: item['ZDMC' + item.ID],
        };
        columns.push(c)
      }
      const ac = {
        title: item['ZDMC' + item.ID],
        dataIndex: 'ZD' + item.ID,
        editable: true,
        ZDLX: item['ZDLX' + item.ID],
      };
      allColumns.push(ac)
      const f = {
        ZDLX: item['ZDLX' + item.ID],
        ZDMC: item['ZDMC' + item.ID],
      };
      fieldData.push(f)
    })
    setFieldData([...fieldData])
    setColumnsData([...columns])
    setAllColumnsData([...allColumns])
    const keysArr = [];
    allColumns.map(c => {
      keysArr.push(c.dataIndex)
    })
    //  当前表格内的数据-tableData
    if (tableData.length > 0) {
      //console.log("tableDatatableData", tableData)
      const newDataArr = []
      tableData.map(item => {
        //初始需要默认有一条空数据
        const newData = {}
        newData.ID = item.ID;
        newData.key = item.key;
        newData['GLXM' + newData.ID] = item['GLXM' + newData.ID] || '';
        newData['TXR' + newData.ID] = item['TXR' + newData.ID] || '';
        keysArr.map(i => {
          Object.assign(newData, {[newData.ID + i]: item[newData.ID + i] ? (item[newData.ID + i] === 'undefined' ? '' : item[newData.ID + i]) : ''})
        })
        newDataArr.push(newData)
      })
      setTableData([...newDataArr])
    } else {
      //console.log("tableDatatableData", tableData)
      const newDataArr = []
      //初始需要默认有一条空数据
      const newData = {}
      newData.ID = Date.now();
      newData.key = Date.now();
      newData['GLXM' + newData.ID] = '';
      newData['TXR' + newData.ID] = '';
      keysArr.map(i => {
        Object.assign(newData, {[newData.ID + i]: ''})
      })
      newDataArr.push(newData)
      setTableData([...newDataArr])
    }

  }

  const handleTableFiledAndDataInit = (data) => {
    //字段变成下一个页面的表头
    //处理下一个页面的表头和表格数据
    const columns = [];//展示的表头-不包含填写字段
    const allColumns = [];//表头所有字段-包含填写字段
    const fieldData = [];//传递给后端的字段数据
    //console.log("datadatadata", data)
    data.map(item => {
      //不包含填写字段
      if (item['ZDLX' + item.ID] === '1') {
        const c = {
          title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
            fontFamily: 'SimSun, sans-serif',
            color: '#f5222d',
            marginRight: '4px',
            lineHeight: 1
          }}>*</span>{item['ZDMC' + item.ID]}</span>,
          dataIndex: 'ZD' + item.ID,
          editable: true,
          ZDLX: item['ZDLX' + item.ID],
          ZDMC: item['ZDMC' + item.ID],
        };
        columns.push(c)
      }
      const ac = {
        title: item['ZDMC' + item.ID],
        dataIndex: 'ZD' + item.ID,
        editable: true,
        ZDLX: item['ZDLX' + item.ID],
      };
      allColumns.push(ac)
      const f = {
        ZDLX: item['ZDLX' + item.ID],
        ZDMC: item['ZDMC' + item.ID],
      };
      fieldData.push(f)
    })
    setFieldData([...fieldData])
    setColumnsData([...columns])
    setAllColumnsData([...allColumns])
    const keysArr = [];
    allColumns.map(c => {
      keysArr.push(c.dataIndex)
    })
    //初始需要默认有一条空数据
    const newData = {}
    newData.ID = Date.now();
    newData.key = Date.now();
    newData['GLXM' + newData.ID] = '';
    newData['TXR' + newData.ID] = '';
    keysArr.map(i => {
      Object.assign(newData, {[newData.ID + i]: ''})
    })
    //console.log("newDataArr-ccc", newData)
    setTableData([newData])
  }

  //表格数据
  const presetTablDataSourceCallback = (data) => {
    //console.log("callbackdata", data)
    setPresetData([...data])
  }

  return (
    <Modal
      wrapClassName="editMessage-modify custom-report-edit-modal"
      width={'1150px'}
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
            style={{marginBottom: 16}}
          >
            <Step title="定义报告字段" status={curStep === 0 ? 'process' : 'wait'}/>
            <Step title="预设填写数据" status={curStep === 1 ? 'process' : 'wait'}/>
          </Steps>
          <div style={{display: curStep !== 0 ? 'none' : 'block'}}>
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
            <Form.Item label={<span>报告类型&nbsp;
              <Tooltip placement="topRight" overlayClassName='newpcus-bglx-tooltip' title={
                <span>
                  月报：<br/>
                  &nbsp;&nbsp;&nbsp;1、每月月末最后一天生成下月月报<br/>
                  &nbsp;&nbsp;&nbsp;2、每月月末最后五个工作日，对月报填写人进行提醒<br/>
                            </span>}>
                            <Icon type="question-circle-o"/>
                        </Tooltip>
                        </span>} labelCol={{span: 3}} wrapperCol={{span: 21}}>
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
            <Form.Item required label="报告模版" labelCol={{span: 3}} wrapperCol={{span: 21}}>
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
              {/*新增报告字段*/}
              <EditCusRepTable
                ZDLXflag={ZDLXflag}
                presetFieldData={presetFieldData}
                count={count}
                presetFieldDataCallback={presetFieldDataCallback}
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
              tableDataCallback={tableDataCallback}
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
