import React, { useState, useRef, useEffect } from 'react'
import { Button, Icon, DatePicker, Input, Table, Select, Form, Tooltip } from 'antd';
import moment from 'moment';
const { MonthPicker } = DatePicker;
const { Option } = Select;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
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
    const [txrOpen, setTxrOpen] = useState(false);
    const targetNode = useRef(null);
    const editingRef = useRef(false);
    const {
        issaved,
        txrdata,
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
            'bywcqk' + record['id'],
            'xygzjh' + record['id'],
            'ldyj' + record['id'],
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
            case 'bywcqk':
                return '本月完成情况';
            case 'xygzjh':
                return '下月工作计划';
            case 'ldyj':
                return '领导意见';
            case 'txr':
                return '填报人';
            default:
                return '';
        }
    };

    const getSelect = (onChange, open, setOpen, data) => {
        return (
            <Select
                style={{ width: '28rem', borderRadius: '8px !important' }}
                placeholder="请选择填报人"
                mode="multiple"
                onChange={onChange}
                open={open}
                onDropdownVisibleChange={(visible) => setOpen(visible)}
                ref={targetNode} onPressEnter={toggleEdit} onBlur={toggleEdit}
            >
                {
                    data?.map((item = {}, ind) => {
                        return <Option key={ind} value={item.id}>{item.name}</Option>
                    })
                }
            </Select>
        );
    }

    const getFormDec = (form, idDataIndex, dataIndex, required, value, node) => {
        let message = `${getTitle(dataIndex)}不允许空值`;
        const getRules = (dataIndex) => {
            switch (dataIndex) {
                case 'bywcqk' || 'xygzjh' || 'ldyj':
                    return [{ required, message, }, { whitespace: true, message }, { max: 1000, message: `${getTitle(dataIndex)}长度不能超过1000` }];
                case 'txr':
                    return [{ required, message, }];
                default:
                    return [{ required, message, }, { whitespace: true, message }];
            }
        };
        let rules = getRules(dataIndex);
        return form.getFieldDecorator(idDataIndex, { rules, initialValue: value, })
            (node ? node : <Input ref={targetNode} onPressEnter={save} onBlur={save} onChange={(e) => setEdited(true)} />)
    };
    const handleTxrChange = (arr) => {
        const { record, handleSave } = props;
            toggleEdit();
            let newVal = {
                ['txr' + record['id']]: [...arr],
            };
            setEdited(true);
            handleSave({ ...record, ...newVal });
    };

    const renderItem = (form, dataIndex, record) => {
        let idDataIndex = dataIndex + record['id'];
        switch (dataIndex) {
            case 'txr':
                const txrNode = getSelect(handleTxrChange, txrOpen, setTxrOpen, txrdata);
                let txrValue = record[idDataIndex];
                return getFormDec(form, idDataIndex, dataIndex, true, txrValue, txrNode);
            default:
                return getFormDec(form, idDataIndex, dataIndex, true, String(record[idDataIndex]));
        }
    };

    const renderCell = form => {
        const { children, dataIndex, record, formdecorate } = props;
        return (editing ?
            (
                <Form.Item style={{ margin: 0 }}>
                    {renderItem(formdecorate, dataIndex, record)}
                </Form.Item>
            ) 
            : 
            dataIndex !== 'txr' ?
             (
                <Tooltip title={String(record[dataIndex + record['id']])}>
                    <div
                        className="editable-cell-value-wrap"
                        onClick={toggleEdit}
                    >
                        {String(record[dataIndex + record['id']])}
                        {/* {dataIndex === 'txr' ? txrValue.join('、') : String(record[dataIndex + record['id']])} */}
                    </div>
                </Tooltip>
            ) 
            : (
                <Form.Item style={{ margin: 0 }}>
                    {renderItem(formdecorate, dataIndex, record)}
                </Form.Item>
            )
        );
    };
    return (
        <>
            <td {...restProps}>
                {!issaved && edited && <img className='edited-img' src={require('../../../../image/pms/WeeklyReportDetail/edited.png')} alt=''></img>}
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