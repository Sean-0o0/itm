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
  const LOGIN_USER_ID = String(JSON.parse(sessionStorage.getItem('user'))?.id);
  const {
    issaved,
    editable,
    dataIndex,
    record,
    handleSave,
    children,
    editingindex,
    dltdata = [],
    title,
    borderleft,
    formdecorate,
    isadministrator,
    ...restProps
  } = props;

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
          rules: [{ max: 1000, message: `${title}长度不能超过1000` }],
          initialValue: record[dataIndex + record['ID']]?.replace(/<br>/g, '\n'),
        })(
          <TextArea
            ref={targetNode}
            onPressEnter={save}
            onBlur={save}
            onChange={e => setEdited(true)}
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
      default:
        return rec;
    }
  };

  return (
    <>
      <td style={borderleft ? { borderLeft: '1px solid #e8e8e8' } : {}} {...restProps}>
        {!issaved && edited && (
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
