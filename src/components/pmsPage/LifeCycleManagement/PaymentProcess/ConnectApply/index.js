import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Modal, Spin, Input, Radio, Select, Form, Empty } from 'antd';
import moment from 'moment';
import {
  GetApplyListProvisionalAuth,
  QueryRequisitionData,
} from '../../../../../services/pmsServices';
import { Col } from 'antd/es/grid';
const { Search } = Input;
const { Option } = Select;
export default function ConnectApply(props) {
  const { userykbid, dictionary = {}, glsqData = {}, setGlsqData, form = {} } = props;
  const { FRST = [], DJLX = [] } = dictionary; //字典 - 单据类型、法人实体
  const [modalData, setModalData] = useState({
    visible: false,
    loading: false,
    spinning: false,
    data: [],
    origin: [],
    radioObj: undefined,
    radioValue: undefined,
  }); //弹窗数据
  const [sltData, setSltData] = useState({
    type: 2,
    sort: 4,
    typeData: [
      // { title: '提交时间', value: 1 },
      { title: '申请金额', value: 2 },
      { title: '申请日期', value: 3 },
    ],
    sortData: [
      { title: '从大到小', value: 4 },
      { title: '从小到大', value: 5 },
    ],
  }); //example
  useEffect(() => {
    if (modalData.visible) {
      getData();
    }
    return () => {};
  }, [modalData.visible]);

  // useEffect(() => {
  //   console.log('@@modalData: ', modalData);
  //   return () => {};
  // }, [JSON.stringify(modalData)]);

  //获取关联数据
  const getData = () => {
    setModalData(p => ({
      ...p,
      spinning: true,
    }));
    QueryRequisitionData({
      staffId: userykbid,
    })
      .then(res => {
        if (res?.success) {
          let dataArray = JSON.parse(res.record);
          dataArray.sort((a, b) => Number(b.requisitionMoney) - Number(a.requisitionMoney));
          //to do ...
          setModalData(p => ({
            ...p,
            spinning: false,
            data: dataArray,
            origin: dataArray,
          }));
          // setGlsqData({
          //   radioObj: undefined,
          //   radioValue: undefined,
          // });
        }
      })
      .catch(e => {
        console.error('🚀关联数据', e);
        message.error('关联数据获取失败', 1);
        setModalData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };
  const handleBtnClick = () => {
    setModalData(p => ({ ...p, visible: true }));
  };
  const handleInputSearch = v => {
    let arr = modalData.origin.filter(o => {
      const codeMatch = o.code.toLowerCase().includes(v.toLowerCase());
      const titleMatch = o.title.toLowerCase().includes(v.toLowerCase());
      return codeMatch || titleMatch;
    });
    arr.sort((a, b) => {
      if (sltData.sort === 1 || sltData.sort === 5) {
        // 从小到大排序
        if (sltData.type === 1) {
          return Number(a.requisitionDate) - Number(b.requisitionDate);
        } else if (sltData.type === 2) {
          return Number(a.requisitionMoney) - Number(b.requisitionMoney);
        } else {
          return Number(a.requisitionDate) - Number(b.requisitionDate);
        }
      } else {
        // 从大到小排序
        if (sltData.type === 1) {
          return Number(b.requisitionDate) - Number(a.requisitionDate);
        } else if (sltData.type === 2) {
          return Number(b.requisitionMoney) - Number(a.requisitionMoney);
        } else {
          return Number(b.requisitionDate) - Number(a.requisitionDate);
        }
      }
    });
    setModalData(p => ({
      ...p,
      data: arr,
    }));
  };
  const handleTypeSltChange = v => {
    console.log('🚀 ~ file: index.js:125 ~ handleTypeSltChange ~ v:', v);
    setSltData(p => ({
      ...p,
      type: v,
      sortData:
        v === 2
          ? [
              { title: '从大到小', value: 4 },
              { title: '从小到大', value: 5 },
            ]
          : [
              { title: '从近到远', value: 1 },
              { title: '从远到近', value: 2 },
            ],
      sort: v === 2 ? 4 : [4, 5].includes(p.sort) ? 1 : p.sort,
    }));
    let arr = [...modalData.data];
    arr.sort((a, b) => {
      if (v === 2) {
        return Number(b.requisitionMoney) - Number(a.requisitionMoney);
      } else if (sltData.sort === 1) {
        // 从小到大排序
        if (v === 1) {
          return Number(a.requisitionDate) - Number(b.requisitionDate);
        } else {
          return Number(a.requisitionDate) - Number(b.requisitionDate);
        }
      } else {
        // 从大到小排序
        if (v === 1) {
          return Number(b.requisitionDate) - Number(a.requisitionDate);
        } else {
          return Number(b.requisitionDate) - Number(a.requisitionDate);
        }
      }
    });
    setModalData(p => ({
      ...p,
      data: arr,
    }));
  };
  const handleSortSltChange = v => {
    setSltData(p => ({
      ...p,
      sort: v,
    }));
    let arr = [...modalData.data];
    arr.sort((a, b) => {
      if (v === 1 || v === 5) {
        // 从小到大排序
        if (sltData.type === 1) {
          return Number(a.requisitionDate) - Number(b.requisitionDate);
        } else if (sltData.type === 2) {
          return Number(a.requisitionMoney) - Number(b.requisitionMoney);
        } else {
          return Number(a.requisitionDate) - Number(b.requisitionDate);
        }
      } else {
        // 从大到小排序
        if (sltData.type === 1) {
          return Number(b.requisitionDate) - Number(a.requisitionDate);
        } else if (sltData.type === 2) {
          return Number(b.requisitionMoney) - Number(a.requisitionMoney);
        } else {
          return Number(b.requisitionDate) - Number(a.requisitionDate);
        }
      }
    });
    setModalData(p => ({
      ...p,
      data: arr,
    }));
  };
  const handleRadioChange = v => {
    // console.log('🚀 ~ file: index.js:198 ~ handleRadioChange ~ v:', v, v.target.value);
    // setGlsqData({
    //   radioObj: v.target.slted,
    //   radioValue: v.target.value,
    // });
    setModalData(p => ({
      ...p,
      radioObj: v.target.slted,
      radioValue: v.target.value,
    }));
  };
  //跳转OA详情
  const jumpToOADetail = (id, userykbid) => {
    setModalData(p => ({
      ...p,
      spinning: true,
    }));
    GetApplyListProvisionalAuth({
      id,
      userykbid,
    })
      .then(res => {
        setModalData(p => ({
          ...p,
          spinning: false,
        }));
        window.open(res.url);
      })
      .catch(e => {
        console.error(e);
        message.error('详情跳转失败', 1);
        setModalData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };
  const handleModalClose = () => {
    setSltData({
      type: 2,
      sort: 4,
      typeData: [
        // { title: '提交时间', value: 1 },
        { title: '申请金额', value: 2 },
        { title: '申请日期', value: 3 },
      ],
      sortData: [
        { title: '从大到小', value: 4 },
        { title: '从小到大', value: 5 },
      ],
    });
    setGlsqData({
      radioObj: modalData.radioObj,
      radioValue: modalData.radioValue,
    });
    setModalData(p => ({
      ...p,
      visible: false,
      loading: false,
      spinning: false,
      data: [],
      origin: [],
    }));
  };

  //法人实体
  const getCompany = () => {
    if (form.getFieldValue('djlx') === '2' && FRST.length > 0)
      return (
        <Form.Item label="法人实体" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {form.getFieldDecorator('frst', {
            initialValue: FRST.find(x => x.ibm === '2').cbm,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select style={{ width: '100%' }}>
              {FRST.map(x => (
                <Option value={x.cbm} key={x.cbm}>
                  {x.note}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      );
    return (
      <Form.Item label="法人实体" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
        <div
          style={{
            width: '100%',
            height: '32px',
            backgroundColor: '#F5F5F5',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            marginTop: '5px',
            lineHeight: '32px',
            paddingLeft: '10px',
            fontSize: '14px',
          }}
        >
          {FRST.length > 0 ? FRST.find(x => x.ibm === '1')?.note : ''}
        </div>
      </Form.Item>
    );
  };

  const getSltedRadio = ({
    title = '--',
    code = '--',
    requisitionDate = null,
    requisitionMoney = '',
  }) => {
    //金额格式化
    const getAmountFormat = value => {
      if ([undefined, null, '', ' ', NaN].includes(value)) return '';
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const clearRadioObj = e => {
      e.stopPropagation();
      setGlsqData({
        radioObj: undefined,
        radioValue: undefined,
      });
    };
    return (
      <div className="selected-radio-wrapper" onClick={handleBtnClick}>
        <div className="hover-close" onClick={e => clearRadioObj(e)}>
          <i className="iconfont icon-close" />
        </div>
        <div className="radio-left">
          {title}
          <div className="code-date">
            {code}&nbsp;&nbsp;{moment(Number(requisitionDate)).format('YYYY-MM-DD')}
          </div>
        </div>
        <div className="radio-right">
          {getAmountFormat(requisitionMoney)}
          <div className="amount-label">申请金额</div>
        </div>
      </div>
    );
  };

  return (
    <div className="connect-applay-box">
      {form.getFieldValue('djlx') === '2' && <div className="connect-applay-title">关联申请</div>}
      {form.getFieldValue('djlx') === '2' && (
        <Button className="connect-applay-btn" onClick={handleBtnClick}>
          关联申请
        </Button>
      )}
      {glsqData.radioObj !== undefined && getSltedRadio(glsqData.radioObj)}
      <div className="divide-line"></div>
      {getCompany('法人实体', FRST.length > 0 ? FRST[0].note : undefined, 4, 20)}
      <Modal
        wrapClassName="editMessage-modify payment-connect-apply-modal"
        width={800}
        maskClosable={false}
        style={{ top: 10 }}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        zIndex={103}
        title={null}
        visible={modalData.visible}
        onCancel={handleModalClose}
        onOk={handleModalClose}
      >
        <div className="body-title-box">
          <strong>关联申请</strong>
        </div>
        <Spin spinning={modalData.spinning} tip="加载中">
          <div className="content-box">
            <Search
              placeholder="搜索标题和单号"
              onSearch={handleInputSearch}
              className="input-search"
              // loading={modalData.loading}
            />
            <Select className="selector-type" value={sltData.type} onChange={handleTypeSltChange}>
              {sltData.typeData.map(x => (
                <Option value={x.value} key={x.value}>
                  {x.title}
                </Option>
              ))}
            </Select>
            <Select className="selector-sort" value={sltData.sort} onChange={handleSortSltChange}>
              {sltData.sortData.map(x => (
                <Option value={x.value} key={x.value}>
                  {x.title}
                </Option>
              ))}
            </Select>
            {modalData.data.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
            <Radio.Group
              className="radio-list"
              onChange={handleRadioChange}
              value={modalData.radioValue}
            >
              {modalData.data.map(x => (
                <Radio className="radio-item" slted={x} value={x.id} key={x.id}>
                  <div className="radio-left">
                    {x.title}
                    <div className="code-date">
                      {x.code}&nbsp;&nbsp;{moment(Number(x.requisitionDate)).format('YYYY-MM-DD')}
                    </div>
                  </div>
                  <div className="radio-right">
                    {x.requisitionMoney}
                    <div className="amount-label">申请金额</div>
                  </div>
                  <div
                    className="radio-detail"
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      jumpToOADetail(x.id, userykbid);
                    }}
                  >
                    详情
                  </div>
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </Spin>
      </Modal>
    </div>
  );
}
