import React, { useEffect, useState, useMemo } from 'react';
import { Form, Upload, Modal, Icon, Button, Spin, Checkbox, Dropdown, Menu } from 'antd';
import { CheckInvoice } from '../../../../../../../services/pmsServices';
import moment from 'moment';
const SelectReceipt = props => {
  //弹窗全屏
  const [isModalFullScreen, setIsModalFullScreen] = useState(false);
  //加载状态
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [checkedALL, setCheckedALL] = useState(false); //全选
  const [indeterminate, setIndeterminate] = useState(false); //全选
  const {
    visible,
    setVisible,
    form,
    userykbid,
    setUploadReceiptVisible,
    setInputReceiptVisible,
    receiptData,
    setReceiptData,
    setReceiptDisplay,
  } = props;
  //防抖定时器
  let timer = null;

  useEffect(() => {
    let count = 0;
    receiptData?.forEach(x => {
      if (x.checked) count++;
    });
    setCheckedALL(count === receiptData?.length);
    setIndeterminate(count > 0 && count < receiptData?.length);
    return () => {
      clearTimeout(timer);
    };
  }, [props]);

  const handleSubmit = () => {
    setVisible(false);
    let finalArr = [];
    receiptData?.forEach(x => {
      if (x.checked) {
        finalArr.push(x);
      }
    });
    setReceiptDisplay(p => [...finalArr]);
    setReceiptData(p => [...finalArr]);
    setCheckedALL(false);
    setIndeterminate(false);
  };
  const handleClose = () => {
    setVisible(false);
    setReceiptData([]);
  };
  //防抖
  const debounce = (fn, waits) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };
  const handleReceiptMenuClick = e => {
    if (e.key === '1') {
      setUploadReceiptVisible(true);
      return;
    }
    if (e.key === '2') {
      setInputReceiptVisible(true);
      return;
    }
  };
  const menu = (
    <Menu onClick={handleReceiptMenuClick}>
      <Menu.Item key="1">
        <Icon type="file-pdf" />
        电子发票文件
      </Menu.Item>
      {/* <Menu.Item key="2">
        <Icon type="form" />
        手录发票
      </Menu.Item> */}
    </Menu>
  );
  const getSelectReceipt = () => {
    const getRecepitItem = data => {
      return (
        <div className="receipt-item" key={data?.invoiceId}>
          <div className="item-title">
            <Checkbox
              onChange={e => {
                let arr = [...receiptData];
                let count = 0;
                arr.forEach(x => {
                  if (x.invoiceId === data?.invoiceId) {
                    x.checked = e.target.checked;
                  }
                  if (x.checked) {
                    count++;
                  }
                });
                setReceiptData(p => [...arr]);
                setIndeterminate(count > 0 && count < receiptData?.length);
                setCheckedALL(count === receiptData?.length);
              }}
              checked={data?.checked}
            >
              通过{data?.source}导入了 1 张发票
            </Checkbox>
          </div>
          <div
            className={'item-info' + (data.selectHover ? ' hover' : '')}
            onMouseEnter={() => {
              let arr = [...receiptData];
              arr.forEach(x => {
                if (x.invoiceId === data?.invoiceId) {
                  x.selectHover = true;
                }
              });
              setReceiptData(p => [...arr]);
            }}
            onMouseLeave={() => {
              let arr = [...receiptData];
              arr.forEach(x => {
                if (x.invoiceId === data?.invoiceId) {
                  x.selectHover = false;
                }
              });
              setReceiptData(p => [...arr]);
            }}
          >
            <div className="info-title">
              <div className="title-left">
                <Checkbox
                  onChange={e => {
                    let arr = [...receiptData];
                    let count = 0;
                    arr.forEach(x => {
                      if (x.invoiceId === data?.invoiceId) {
                        x.checked = e.target.checked;
                      }
                      if (x.checked) {
                        count++;
                      }
                    });
                    setReceiptData(p => [...arr]);
                    setIndeterminate(count > 0 && count < receiptData?.length);
                    setCheckedALL(count === receiptData?.length);
                  }}
                  checked={data?.checked}
                >
                  {data?.xsfmc}
                </Checkbox>
                <div className="title-tag-icon"></div>
                {data?.isCheck && <div className="title-tag">已验真</div>}
              </div>
              ¥ {data?.zje}
            </div>
            <div className="info-expand">
              <div className="expand-left">
                <div className="type-tag">{data?.invoiceType}</div>
                {moment(Number(data?.date)).format('YYYY年MM月DD日')}
              </div>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="select-receipt-content">
        <div className="top-console">
          <div className="select-all">
            <Checkbox
              onChange={e => {
                // console.log(
                //   '🚀 ~ file: index.js ~ line 127 ~ getSelectReceipt ~ e.target',
                //   e.target,
                // );
                let arr = [...receiptData];
                arr.forEach(x => {
                  x.checked = e.target.checked;
                  setCheckedALL(e.target.checked);
                });
                setReceiptData(p => [...arr]);
                setIndeterminate(false);
              }}
              checked={checkedALL}
              indeterminate={indeterminate}
            >
              全选
            </Checkbox>
            <span>
              已选{' '}
              {(() => {
                let count = 0;
                receiptData.forEach(x => {
                  if (x.checked) {
                    count++;
                  }
                });
                return count;
              })()}{' '}
              张发票, 共¥
              {(() => {
                let count = 0;
                receiptData.forEach(x => {
                  if (x.checked) {
                    count += Number(x.zje ?? 0);
                  }
                });
                return count;
              })()}
            </span>
          </div>
          <Dropdown overlay={menu}>
            <Button>
              <Icon type="upload" />
              继续添加
            </Button>
          </Dropdown>
        </div>
        <div className="receipt-list">{receiptData?.map(item => getRecepitItem(item))}</div>
      </div>
    );
  };
  return (
    <Modal
      wrapClassName="editMessage-modify"
      style={{ top: '10px' }}
      width={'800px'}
      maskClosable={false}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={102}
      cancelText={null}
      okText="与该消费绑定"
      bodyStyle={{
        padding: '0',
        overflow: 'hidden',
      }}
      title={null}
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
    >
      <div className="body-title-box">
        <strong>发票列表</strong>
      </div>
      {getSelectReceipt()}
    </Modal>
  );
};
export default Form.create()(SelectReceipt);
