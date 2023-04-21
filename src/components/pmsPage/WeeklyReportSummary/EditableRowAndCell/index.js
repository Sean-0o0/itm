import React, { useState, useRef, useEffect } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select, Form, Tooltip } from 'antd';
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();

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
  const [curSOpen, setCurSOpen] = useState(false);
  // const [disabled, setDisabled] = useState(false); //非提交

  const targetNode = useRef(null);
  const editingRef = useRef(false);
  const {
    issaved,
    editable,
    dataIndex,
    title,
    record,
    index,
    handleSave,
    children,
    editingindex,
    dltdata,
    ...restProps
  } = props;

  const save = e => {
    const { record, handleSave, formdecorate } = props;
    let dataIndexArr = [
      'bznr' + record['id'],
      'xzjh' + record['id'],
      'bbh' + record['id'],
      'dqjd' + record['id'],
      'zysjsm' + record['id'],
    ];
    formdecorate.validateFields(dataIndexArr, (error, values) => {
      if (error && error[e.currentTarget.id]) {
        console.log('有错误，不予保存');
        return;
      }
      // console.log(values);
      handleSave({ ...record, ...values });
    });
  };

  const getTitle = dataIndex => {
    switch (dataIndex) {
      case 'bznr':
        return '重要事项说明';
      case 'xzjh':
        return '下周工作安排';
      case 'bbh':
        return '版本号';
      case 'jhsxrq':
        return '计划上线日期';
      case 'dqzt':
        return '进度状态';
      case 'dqjd':
        return '当前进度';
      case 'zysjsm':
        return '重要事项说明';
      default:
        return '';
    }
  };

  const getFormDec = (form, idDataIndex, dataIndex, required, value, node) => {
    let message = `${getTitle(dataIndex)}不允许空值`;
    const getRules = dataIndex => {
      switch (dataIndex) {
        case 'dqzt':
        case 'jhsxrq':
          return [
            // { required, message }
          ];
        case 'bznr':
        case 'xzjh':
        case 'zysjsm':
          return [
            // { required, message },
            // { whitespace: true, message },
            { max: 1000, message: `${getTitle(dataIndex)}长度不能超过1000` },
          ];
        case 'bbh':
        case 'dqjd':
          return [
            // { required, message },
            // { whitespace: true, message },
            { max: 30, message: `${getTitle(dataIndex)}长度不能超过30` },
          ];
        default:
          return [
            // { required, message },
            // { whitespace: true, message },
          ];
      }
    };
    let rules = getRules(dataIndex);
    return form.getFieldDecorator(idDataIndex, { rules, initialValue: value })(
      node ? (
        node
      ) : (
        <Input ref={targetNode} onPressEnter={save} onBlur={save} onChange={e => setEdited(true)} />
      ),
    );
  };

  const handleDateChange = (d, ds) => {
    const { record, handleSave, formdecorate } = props;
    let newVal = {
      ['jhsxrq' + record['id']]: ds === '' ? '' : moment(ds).format('YYYYMMDD'),
    };
    setEdited(true);
    handleSave({ ...record, ...newVal });
  };

  const handlecurSChange = num => {
    const { record, handleSave, formdecorate } = props;
    formdecorate.validateFields(['dqzt' + record['id']], (error, values) => {
      if (error) {
        console.log('有错误，不予保存');
        return;
      }
      let newVal = {
        ['dqzt' + record['id']]: getCurS(num),
      };
      setEdited(true);
      handleSave({ ...record, ...newVal });
    });
  };
  const getCurS = num => {
    switch (num) {
      case '1':
        return '低风险';
      case '2':
        return '中风险';
      case '3':
        return '高风险';
      case '4':
        return '进度正常';
      case '5':
        return '延期';
    }
  };
  const curSData = [
    {
      txt: '低风险',
      num: '1',
    },
    {
      txt: '中风险',
      num: '2',
    },
    {
      txt: '高风险',
      num: '3',
    },
    {
      txt: '进度正常',
      num: '4',
    },
    {
      txt: '延期',
      num: '5',
    },
  ];
  const getSelect = (onChange, open, setOpen, data) => {
    return (
      <Select
        style={{ width: '100%', borderRadius: '8px !important' }}
        placeholder="请选择"
        onChange={onChange}
        open={open}
        onDropdownVisibleChange={visible => setOpen(visible)}
      >
        {data?.map((item = {}, ind) => {
          return (
            <Option key={ind} value={item.num}>
              {item.txt}
            </Option>
          );
        })}
      </Select>
    );
  };
  const renderItem = (form, dataIndex, record) => {
    let idDataIndex = dataIndex + record['id'];
    const cplTimeNode = (
      <DatePicker
        ref={node => (targetNode.current = node)}
        placeholder="请选择日期"
        onChange={handleDateChange}
        // disabled={disabled} //非提交
      />
    );
    const cplTimeValue = ['', ' ', null, undefined].includes(record[idDataIndex])
      ? null
      : moment(String(record[idDataIndex]));
    const curStatusNode = getSelect(handlecurSChange, curSOpen, setCurSOpen, curSData);
    switch (dataIndex) {
      case 'jhsxrq':
        return getFormDec(form, idDataIndex, dataIndex, false, cplTimeValue, cplTimeNode);
      case 'dqzt':
        return getFormDec(
          form,
          idDataIndex,
          dataIndex,
          false,
          String(record[idDataIndex]),
          curStatusNode,
        );
      default:
        return getFormDec(form, idDataIndex, dataIndex, false, String(record[idDataIndex])); //false,非必填
    }
  };
  const renderCell = form => {
    const { children, dataIndex, record, formdecorate } = props;
    return (
      <Form.Item style={{ margin: 0 }}>{renderItem(formdecorate, dataIndex, record)}</Form.Item>
    );
  };
  const handleTxt = (dataIndex, record, children) => {
    let item = record[dataIndex + record.id];
    switch (dataIndex) {
      case 'bznr':
      case 'xzjh':
      case 'dqzt':
      case 'dqjd':
      case 'zysjsm':
        return item;
      case 'jhsxrq':
        return item ? moment(item).format('YYYY-MM-DD') : '';
      case 'bbh':
        if (record.zt === '2')
          return (
            <div className="update-col">
              <span>{item}</span>
              <div className="update-tag">已更新</div>
            </div>
          );
        return item;
      default:
        return children;
    }
  };
  return (
    <>
      <td
        style={
          ['bznr', 'xzjh', 'gzmk'].includes(dataIndex) ? { borderRight: '1px solid #e8e8e8' } : {}
        }
        {...restProps}
      >
        {!issaved && edited && (
          <img
            className="edited-img"
            src={require('../../../../image/pms/WeeklyReportDetail/edited.png')}
            alt=""
          ></img>
        )}
        {dltdata.includes(record.id) &&
        !['gzmk', 'operation', 'bznr', 'xzjh'].includes(dataIndex) ? (
          <div
            className="normal-cell-value-wrap"
            style={{ textDecoration: 'line-through', color: 'red' }}
          >
            {handleTxt(dataIndex, record, children)}
          </div>
        ) : editingindex === record.id && editable ? (
          <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
        ) : (
          <div className="normal-cell-value-wrap">{handleTxt(dataIndex, record, children)}</div>
        )}
      </td>
    </>
  );
};
export { EditableFormRow, EditableCell };
