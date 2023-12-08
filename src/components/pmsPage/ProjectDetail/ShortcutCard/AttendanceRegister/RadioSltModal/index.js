import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, message, Modal, Radio } from 'antd';
import moment from 'moment';

export default (function RadioSltModal(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { visible, radioValue = {}, data = {}, fullAtdData = {} } = dataProps;
  const { setVisible, setRadioValue, setData, setFastSlting, setFullAtdData } = funcProps;
  const [modalStyle, setModalStyle] = useState({}); //

  useEffect(() => {
    if (data.selecting !== undefined && data.selecting.length > 0) {
      const momentDates = data.selecting?.map(date => moment(date, 'YYYY-MM-DD'));
      // @情况一 范围 为周一到周三 / 周四到周五
      // 开始日期为周一到周三内 放 最后一个 的 右边 ；周四到周五内 放 第一个 的 左边
      const isMondayToWednesday = momentDates.every(
        date => date.locale('en-ca').weekday() >= 1 && date.locale('en-ca').weekday() <= 3,
      );
      const isThursdayOrFriday = momentDates.every(date =>
        [4, 5].includes(date.locale('en-ca').weekday()),
      );

      // @情况二 剩余非工作日
      // 开始日期为周六则放第一个左边（只需要考虑这个）；为周日则放第一个右边（默认就是）
      const isSaturdayLeft =
        moment
          .min(momentDates)
          .locale('en-ca')
          .weekday() === 6;

      // @情况三 其他情况都用这个
      // 开始日期为周一到周三内 放第一个的右边（默认就是）；周四到周五内 放第一个的左边（只需要考虑这个）
      const isThursdayOrFridayLeft = [4, 5].includes(
        moment
          .min(momentDates)
          .locale('en-ca')
          .weekday(),
      );

      // 获取日期数组中的最小值和最大值
      const minDate = moment.min(momentDates).format('YYYY-MM-DD');
      const maxDate = moment.max(momentDates).format('YYYY-MM-DD');
      //获取定位元素日期 第一个 还是 最后一个，默认情况是 minDate 第一个
      const date = isMondayToWednesday ? maxDate : minDate;
      //获取定位元素
      const element = document.querySelector(`td.fc-daygrid-day[data-date='${date}']`);
      setModalStyle({
        top: Math.floor(element?.getBoundingClientRect()?.top),
        //左边 还是 右边，默认情况是 -88 放右边
        left:
          Math.floor(element?.getBoundingClientRect()?.left) -
          (isThursdayOrFriday || isThursdayOrFridayLeft || isSaturdayLeft ? 300 : -88),
        margin: 'unset',
      });
    }
    return () => {};
  }, [JSON.stringify(data.selecting)]);

  //提交数据
  const handleOk = () => {
    if (radioValue.type === 1 && radioValue.time === 1) {
      handleDataSave('attendance');
      fullAtdData.checked && handleFullAtdDataSave('attendance');
    } else if (radioValue.type === 1 && radioValue.time === 2) {
      handleDataSave('attendanceHalf');
      fullAtdData.checked && handleFullAtdDataSave('attendanceHalf');
    } else if (radioValue.type === 2 && radioValue.time === 1) {
      handleDataSave('leave');
      fullAtdData.checked && handleFullAtdDataSave('leave');
    } else if (radioValue.type === 2 && radioValue.time === 2) {
      handleDataSave('leaveHalf');
      fullAtdData.checked && handleFullAtdDataSave('leaveHalf');
    } else if (radioValue.type === 3 && radioValue.time === 1) {
      handleDataSave('overtime');
      fullAtdData.checked && handleFullAtdDataSave('overtime');
    } else if (radioValue.type === 3 && radioValue.time === 2) {
      handleDataSave('overtimeHalf');
      fullAtdData.checked && handleFullAtdDataSave('overtimeHalf');
    }
    handleCancel();
  };

  //取消
  const handleCancel = () => {
    setVisible(false);
    setData(p => ({ ...p, selecting: [] }));
    setRadioValue({
      type: 1,
      time: 1,
    });
    setFastSlting([]);
  };

  //清空
  const handleClearAll = () => {
    handleDataSave();
    handleCancel();
  };

  //选完保存
  const handleDataSave = useCallback(
    fieldStr =>
      setData(p => {
        for (var key in p) {
          if (key !== 'selecting') {
            p[key] = p[key].filter(x => !p.selecting.includes(x));
          }
        }
        if (fieldStr === undefined)
          return {
            ...p,
            selecting: [],
          };
        return {
          ...p,
          selecting: [],
          [fieldStr]: [...p[fieldStr], ...p.selecting],
        };
      }),
    [setData],
  );

  //选完保存
  const handleFullAtdDataSave = useCallback(
    fieldStr =>
      setFullAtdData(p => {
        let obj = p.originData || {};
        for (var key in obj) {
          if (key !== 'selecting') {
            obj[key] = obj[key].filter(x => !data.selecting.includes(x));
          }
        }
        if (fieldStr === undefined)
          return {
            ...p,
            originData: {
              ...obj,
              selecting: [],
            },
          };
        return {
          ...p,
          originData: {
            ...obj,
            selecting: [],
            [fieldStr]: [...(obj[fieldStr] || []), ...(data.selecting || [])],
          },
        };
      }),
    [setFullAtdData, JSON.stringify(data)],
  );

  //选中范围是否包含周末
  const includesWeekDay = useMemo(() => {
    return data.selecting.some(x =>
      [0, 6].includes(
        moment(x, 'YYYY-MM-DD')
          .locale('en-ca')
          .weekday(),
      ),
    );
  }, [JSON.stringify(data.selecting)]);

  //判断两个字符串数组是否相交
  const checkIfArraysIntersect = (arr1, arr2) => {
    return arr1.some(x => arr2.includes(x));
  };

  return (
    <Modal
      title={null}
      footer={null}
      visible={visible}
      mask={false}
      closable={false}
      maskClosable={true}
      destroyOnClose
      className="attendance-register-slt-modal"
      width={300}
      style={modalStyle}
    >
      <div className="modal-title">登记内容</div>
      <div className="radio-row">
        <span className="radio-label">考勤</span>
        <Radio.Group
          defaultValue={radioValue.type}
          onChange={e => setRadioValue(p => ({ ...p, type: e.target.value }))}
        >
          <Radio value={1}>出勤</Radio>
          <Radio value={2}>请假</Radio>
          {includesWeekDay && <Radio value={3}>加班</Radio>}
        </Radio.Group>
      </div>
      <div className="radio-row">
        <span className="radio-label">时长</span>
        <Radio.Group
          defaultValue={radioValue.time}
          onChange={e => setRadioValue(p => ({ ...p, time: e.target.value }))}
        >
          <Radio value={1}>一天</Radio>
          <Radio value={2}>半天</Radio>
        </Radio.Group>
      </div>
      <div className="modal-footer">
        <Button className="cancel-btn" onClick={handleCancel}>
          取消
        </Button>
        {checkIfArraysIntersect(
          data.attendance.concat(
            data.attendanceHalf,
            data.leave,
            data.leaveHalf,
            data.overtime,
            data.overtimeHalf,
          ),
          data.selecting,
        ) && (
          <Button className="clearall-btn" onClick={handleClearAll}>
            清空
          </Button>
        )}
        <Button className="confirm-btn" type="primary" onClick={handleOk}>
          确认
        </Button>
      </div>
    </Modal>
  );
});
