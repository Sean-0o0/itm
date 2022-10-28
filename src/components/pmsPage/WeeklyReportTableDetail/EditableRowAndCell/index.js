import React, { useState, useRef, useEffect } from 'react'
import { Button, Icon, DatePicker, Input, Table, Select, Form, Tooltip } from 'antd';
import moment from 'moment';
import { set } from 'store';
const { MonthPicker } = DatePicker;
const { TextArea } = Input;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
    // let obj = {...props,style: {height: 51}}
    // console.log(obj);
    return (
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
    )
};
const EditableFormRow = Form.create()(EditableRow);
const EditableCell = (props) => {
    const [editing, setEditing] = useState(false);
    const [edited, setEdited] = useState(false);
    const targetNode = useRef(null);
    const editingRef = useRef(false);
    const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        children,
        ...restProps
    } = props;
    useEffect(() => {
        editingRef.current = editing;
    }, [editing])

    const toggleEdit = () => {
        let value = !editing;
        setEditing(value);
        setTimeout(() => {
            if (editingRef.current) {
                targetNode?.current?.focus();
            }
        }, 0);
    };

    const save = e => {
        const { record, handleSave, formdecorate } = props;
        let dataIndexArr = [
            // 'cplTime' + record['id'],
            'annualPlan' + record['id'],
            'curProgress' + record['id'],
            'curRate' + record['id'],
            'curStatus' + record['id'],
            'riskDesc' + record['id'],
            'status' + record['id']
        ];
        formdecorate.validateFields(dataIndexArr, (error, values) => {
            if (error && error[e.currentTarget.id]) {
                console.log('有错误，不予保存');
                return;
            }
            toggleEdit();
            handleSave({ ...record, ...values });
        });

    };

    const getTitle = (dataIndex) => {
        switch (dataIndex) {
            case 'annualPlan':
                return '年度规划';
            case 'cplTime':
                return '完成时间';
            case 'curProgress':
                return '当前进展';
            case 'curRate':
                return '当前进度';
            case 'curStatus':
                return '当前状态';
            case 'riskDesc':
                return '风险说明';
            case 'status':
                return '状态';
            default:
                return '';
        }
    };

    const getFormDec = (form, idDataIndex, dataIndex, required, value, node) => {
        let message = `${getTitle(dataIndex)}不允许空值`;
        let rules = dataIndex === 'cplTime' ? [{ required, message, }] : [{ required, message, }, { whitespace: true, message }];

        return form.getFieldDecorator(idDataIndex, { rules, initialValue: value, })
            (node ? node : <Input ref={targetNode} onPressEnter={save} onBlur={save} onChange={(e) => setEdited(true)} />)
    };

    const handleMonthChange = (d, ds) => {
        const { record, handleSave, formdecorate } = props;
        formdecorate.validateFields(['cplTime' + record['id']], (error, values) => {
            if (error) {
                console.log('有错误，不予保存');
                return;
            }
            let newVal = {
                ['cplTime' + record['id']]: ds,
            };
            setEdited(true);
            handleSave({ ...record, ...newVal });
        });
    };

    const renderItem = (form, dataIndex, record) => {
        let idDataIndex = dataIndex + record['id'];
        const cplTimeNode = <MonthPicker ref={node => targetNode.current = node} placeholder="请选择月份" onChange={handleMonthChange} />;
        const cplTimeValue = moment(String(record[idDataIndex])) || null;

        switch (dataIndex) {
            case 'cplTime':
                return getFormDec(form, idDataIndex, dataIndex, true, cplTimeValue, cplTimeNode);
            case 'riskDesc':
                return getFormDec(form, idDataIndex, dataIndex, false, String(record[idDataIndex]));
            default:
                return getFormDec(form, idDataIndex, dataIndex, true, String(record[idDataIndex]));
        }
    };
    const renderCell = form => {
        const { children, dataIndex, record, formdecorate } = props;
        return (editing ?
            (<Form.Item style={{ margin: 0 }}>
                {renderItem(formdecorate, dataIndex, record)}
            </Form.Item>) : dataIndex !== 'cplTime' ? (
                <Tooltip title={String(record[dataIndex + record['id']])}>
                    <div
                        className="editable-cell-value-wrap"
                        onClick={toggleEdit}
                    >
                        {String(record[dataIndex + record['id']])}
                    </div>
                </Tooltip>
            ) : (<Form.Item style={{ margin: 0 }}>
                {renderItem(formdecorate, dataIndex, record)}
            </Form.Item>)
        );
    };
    return (
        <>
            <td {...restProps}>
                {edited && <img className='edited-img' src={require('../../../../image/pms/WeeklyReportDetail/edited.png')} alt=''></img>}
                {editable ? (
                    <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
                ) : (
                    <div
                        className="normal-cell-value-wrap"
                        onClick={toggleEdit}
                    >
                        {children}
                    </div>)}
            </td>
        </>

    );
}
export { EditableFormRow, EditableCell };