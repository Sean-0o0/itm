import React, { useState, useRef, useEffect } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select, Form, Tooltip } from 'antd';
import moment from 'moment';
const { MonthPicker } = DatePicker;
const { Option } = Select;
const EditableContext = React.createContext();

const { TextArea } = Input;

const EditableRow = ({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
};
const EditableFormRow = Form.create()(EditableRow);
const EditableCell = props => {
  const [edited, setEdited] = useState(false);
  const targetNode = useRef(null);
  let LOGIN_USER_ID = String(JSON.parse(sessionStorage.getItem('user'))?.id);
  const {
    editable,
    dataIndex,
    record,
    handleSave,
    children,
    editing,
    editingindex,
    dltdata = [],
    title,
    borderleft,
    formdecorate,
    isadministrator,
    settabledata,
    issaved,
    setissaved,
    ...restProps
  } = props;

  useEffect(() => {
    if (editingindex === record.ID && issaved) setEdited(false);
    return () => {};
  }, [issaved, editingindex, record.ID]);

  const save = e => {
    formdecorate.validateFields([e.currentTarget.id], (error, values) => {
      if (error && error[e.currentTarget.id]) {
        console.log('有错误，不予保存');
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  const renderCell = () => {
    return (
      <Form.Item style={{ margin: 0 }}>
        {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
          rules: [{ max: 500, message: `${title}长度不能超过500` }],
          initialValue: record[dataIndex + record['ID']]?.replace(/<br>/g, '\n'),
        })(
          <TextArea
            ref={targetNode}
            onPressEnter={save}
            onBlur={save}
            onChange={e => {
              setEdited(true);
              setissaved(false); //改动过置为false
            }}
            maxLength={500}
            autoSize={{
              minRows: 1,
              maxRows: 8,
            }}
          />,
        )}
      </Form.Item>
    );
  };

  const getTxt = () => {
    const rec = ['-1', '', ' ', 'undefined'].includes(record[dataIndex + record.ID])
      ? ''
      : record[dataIndex + record.ID];
    switch (dataIndex) {
      case 'GLXM':
        if (record['GXZT' + record.ID] === '2')
          return (
            <div className="update-col">
              <span>{rec}</span>
              <div className="update-tag">已更新</div>
            </div>
          );
        return rec;
      case 'JHSXSJ':
        return rec === '' ? '' : moment(rec).format('YYYY-MM-DD');
      case 'TXR':
        //管理员特殊处理
        if (String(record['TXRID' + record.ID]) === '0') return '';
        return String(record['TXRID' + record.ID]) === LOGIN_USER_ID ? (
          <div className="current-login-user">
            <div className="blue-point"></div>
            {rec}
          </div>
        ) : (
          rec
        );
      default:
        return rec;
    }
  };
  return (
    <>
      <td style={borderleft ? { borderLeft: '1px solid #e8e8e8' } : {}} {...restProps}>
        {edited && !issaved && (
          <img
            className="edited-img"
            src={require('../../../../image/pms/WeeklyReportDetail/edited.png')}
            alt=""
          ></img>
        )}
        {dltdata.filter(x => x.ID === record.ID).length > 0 && !borderleft ? (
          <div
            className="normal-cell-value-wrap"
            style={{ textDecoration: 'line-through', color: 'red' }}
          >
            {dataIndex === 'OPRT' ? children : getTxt()}
          </div>
        ) : editingindex === record.ID &&
          editable &&
          (isadministrator || String(record['TXRID' + record.ID]) === LOGIN_USER_ID) ? (
          <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
        ) : (
          <div className="normal-cell-value-wrap">{dataIndex === 'OPRT' ? children : getTxt()}</div>
        )}
      </td>
    </>
  );
};
export { EditableFormRow, EditableCell };
