import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select, Form, Tooltip, TreeSelect } from 'antd';
import moment from 'moment';
const { MonthPicker } = DatePicker;
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
  // console.log('n');
  const [edited, setEdited] = useState(false);
  const [curPOpen, setCurPOpen] = useState(false);
  const [curSOpen, setCurSOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  const targetNode = useRef(null);
  const {
    managerdata,
    issaved,
    editable,
    dataIndex,
    title,
    record,
    index,
    handleSave,
    children,
    editingindex,
    orgdata,
    dltdata,
    ...restProps
  } = props;

  const save = e => {
    if (dataIndex === 'manager') {
      formdecorate.validateFields(e.currentTarget.id, (error, values) => {
        if (error && error[e.currentTarget.id]) {
          console.log('有错误，不予保存');
          return;
        }
        setEdited(true);
        handleSave({ ...record, ...values });
      });
    } else {
      setEdited(true);
      handleSave({ ...record, [e.currentTarget.id]: e.currentTarget.value });
    }
  };

  const getTitle = dataIndex => {
    switch (dataIndex) {
      case 'annualPlan':
        return '年度规划';
      case 'cplTime':
        return '完成时间';
      case 'curProgress':
        return '项目进展';
      case 'curRate':
        return '项目进度';
      case 'curStatus':
        return '当前状态';
      case 'riskDesc':
        return '风险说明';
      case 'peopleNumber':
        return '专班人数';
      case 'orgName':
        return '使用部门';
      case 'manager':
        return '负责人';
      default:
        return '';
    }
  };

  const getFormDec = (form, idDataIndex, dataIndex, required, value, node) => {
    let message = `${getTitle(dataIndex)}不允许空值`;
    const getRules = dataIndex => {
      switch (dataIndex) {
        case 'manager':
          return [{ required, message }];
        case 'cplTime':
        case 'curProgress':
        case 'curStatus':
          return [];
        case 'annualPlan':
        case 'riskDesc':
          return [
            // { required, message },
            // { whitespace: true, message },
            { max: 1000, message: `${getTitle(dataIndex)}长度不能超过1000` },
          ];
        case 'curRate':
        case 'peopleNumber':
        case 'orgName':
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
      node ? node : <Input onBlur={save} />,
    );
    // return node ? node : <Input onBlur={save} defaultValue={value} maxLength={30}/>
  };

  const handleMonthChange = (d, ds) => {
    const { record, handleSave } = props;
    let newVal = {
      ['cplTime' + record['id']]: ds,
    };
    setEdited(true);
    handleSave({ ...record, ...newVal });
  };

  const handlecurPChange = num => {
    const { record, handleSave } = props;
    let newVal = {
      ['curProgress' + record['id']]: getCurP(num),
    };
    setEdited(true);
    handleSave({ ...record, ...newVal });
  };

  const handlecurSChange = num => {
    const { record, handleSave } = props;
    let newVal = {
      ['curStatus' + record['id']]: getCurS(num),
    };
    setEdited(true);
    handleSave({ ...record, ...newVal });
  };
  const getCurP = num => {
    switch (num) {
      case '1':
        return '规划中';
      case '2':
        return '进行中';
      case '3':
        return '已完成';
    }
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
  const curPData = [
    {
      txt: '规划中',
      num: '1',
    },
    {
      txt: '进行中',
      num: '2',
    },
    {
      txt: '已完成',
      num: '3',
    },
  ];
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
  const getSelect = (onChange, open, setOpen, data, width = 80) => {
    return (
      <Select
        style={{ width, borderRadius: '1.1904rem !important' }}
        placeholder="请选择"
        onChange={onChange}
        open={open}
        onDropdownVisibleChange={visible => setOpen(visible)}
        ref={targetNode}
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
  const handleManagerChange = (arr, a, b) => {
    const { record, handleSave } = props;
    let newVal = {
      ['manager' + record['id']]: [...arr],
    };
    setEdited(true);
    handleSave({ ...record, ...newVal });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //处理行高不对齐的bug
    }, 300);
  };
  const handleOrgChange = v => {
    const { record, handleSave } = props;
    let newVal = {
      ['orgName' + record['id']]: v,
    };
    setEdited(true);
    handleSave({ ...record, ...newVal });
  };
  const getManagerSelect = () => {
    return (
      <Select
        style={{ width: '184px', borderRadius: '8px !important' }}
        placeholder="请选择负责人"
        mode="multiple"
        showSearch
        optionFilterProp="children"
        onChange={handleManagerChange}
        open={managerOpen}
        onDropdownVisibleChange={visible => setManagerOpen(visible)}
        // ref={targetNode}
        onDeselect={() => {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //处理行高不对齐的bug
          }, 300);
        }}
      >
        {managerdata?.map((item = {}, ind) => {
          return (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          );
        })}
      </Select>
    );
  };
  const renderItem = (form, dataIndex, record) => {
    let idDataIndex = dataIndex + record['id'];
    const cplTimeNode = <MonthPicker placeholder="请选择月份" onChange={handleMonthChange} />;
    const cplTimeValue = ['', null, undefined, ' '].includes(record[idDataIndex])
      ? null
      : moment(record[idDataIndex]);
    const curProgressNode = getSelect(handlecurPChange, curPOpen, setCurPOpen, curPData);
    const curStatusNode = getSelect(handlecurSChange, curSOpen, setCurSOpen, curSData, 100);
    const managerNode = getManagerSelect();
    const orgNode = (
      <TreeSelect
        style={{ width: '200px', borderRadius: '8px !important' }}
        allowClear
        className="item-selector"
        showSearch
        treeNodeFilterProp="title"
        treeDefaultExpandAll
        dropdownClassName="newproject-treeselect"
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        treeData={orgdata}
        placeholder="请选择"
        onChange={handleOrgChange}
      />
    );
    switch (dataIndex) {
      case 'manager':
        return getFormDec(form, idDataIndex, dataIndex, true, record[idDataIndex], managerNode);
      case 'cplTime':
        return getFormDec(form, idDataIndex, dataIndex, false, cplTimeValue, cplTimeNode);
      case 'curProgress':
        return getFormDec(
          form,
          idDataIndex,
          dataIndex,
          false,
          String(record[idDataIndex]),
          curProgressNode,
        );
      case 'curStatus':
        return getFormDec(
          form,
          idDataIndex,
          dataIndex,
          false,
          String(record[idDataIndex]),
          curStatusNode,
        );
      case 'orgName':
        return getFormDec(
          form,
          idDataIndex,
          dataIndex,
          false,
          String(record[idDataIndex]),
          orgNode,
        );
      default:
        return getFormDec(form, idDataIndex, dataIndex, false, String(record[idDataIndex]));
    }
  };
  const renderCell = form => {
    const { children, dataIndex, record, formdecorate } = props;
    return (
      <Form.Item style={{ margin: 0 }}>{renderItem(formdecorate, dataIndex, record)}</Form.Item>
    );
    return editing ? (
      <Form.Item style={{ margin: 0 }}>{renderItem(formdecorate, dataIndex, record)}</Form.Item>
    ) : !['cplTime', 'manager'].includes(dataIndex) ? (
      <Tooltip title={String(record[dataIndex + record['id']])}>
        <div className="editable-cell-value-wrap">{String(record[dataIndex + record['id']])}</div>
      </Tooltip>
    ) : (
      <Form.Item style={{ margin: 0 }}>{renderItem(formdecorate, dataIndex, record)}</Form.Item>
    );
  };
  const handleTxt = (dataIndex, record, children) => {
    let item = record[dataIndex + record['id']];
    switch (dataIndex) {
      case 'manager':
        return item?.join('、');
      case 'cplTime':
        return ['', ' ', null, undefined].includes(item) ? '' : moment(item).format('YYYY-MM');
      case 'curProgress':
      case 'curRate':
      case 'curStatus':
      case 'annualPlan':
      case 'riskDesc':
      case 'peopleNumber':
      case 'orgName':
        return item;
      default:
        return children;
    }
  };
  return (
    <>
      <td style={dataIndex === 'module' ? { borderRight: '1px solid #e8e8e8' } : {}} {...restProps}>
        {!issaved && edited && (
          <img
            className="edited-img"
            src={require('../../../../image/pms/WeeklyReportDetail/edited.png')}
            alt=""
          ></img>
        )}
        {dltdata.includes(record.id) && !['module', 'operation'].includes(dataIndex) ? (
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
