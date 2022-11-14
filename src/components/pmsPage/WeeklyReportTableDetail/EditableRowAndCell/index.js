import React, { useState, useRef, useEffect } from 'react'
import { Button, Icon, DatePicker, Input, Table, Select, Form, Tooltip } from 'antd';
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
    )
};
const EditableFormRow = Form.create()(EditableRow);
const EditableCell = (props) => {
    const [editing, setEditing] = useState(false);
    const [edited, setEdited] = useState(false);
    const [curPOpen, setcurPOpen] = useState(false);
    const [curSOpen, setcurSOpen] = useState(false);

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
            default:
                return '';
        }
    };

    const getFormDec = (form, idDataIndex, dataIndex, required, value, node) => {
        let message = `${getTitle(dataIndex)}不允许空值`;
        const getRules = (dataIndex) => {
            switch (dataIndex) {
                case 'cplTime' || 'curProgress' || 'curStatus':
                    return [{ required, message, }];
                case 'annualPlan' || 'riskDesc':
                    return [{ required, message, }, { whitespace: true, message }, { max: 1000, message: `${getTitle(dataIndex)}长度不能超过1000` }];
                case 'curRate':
                    return [{ required, message, }, { whitespace: true, message }, { max: 30, message: `${getTitle(dataIndex)}长度不能超过30` }];
                default:
                    return [{ required, message, }, { whitespace: true, message }];
            }
        };
        let rules = getRules(dataIndex);
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

    const handlecurPChange = (num) => {
        const { record, handleSave, formdecorate } = props;
        formdecorate.validateFields(['curProgress' + record['id']], (error, values) => {
            if (error) {
                console.log('有错误，不予保存');
                return;
            }
            toggleEdit();
            let newVal = {
                ['curProgress' + record['id']]: getCurP(num),
            };
            setEdited(true);
            handleSave({ ...record, ...newVal });
        });
    };

    const handlecurSChange = (num) => {
        const { record, handleSave, formdecorate } = props;
        formdecorate.validateFields(['curStatus' + record['id']], (error, values) => {
            if (error) {
                console.log('有错误，不予保存');
                return;
            }
            toggleEdit();
            let newVal = {
                ['curStatus' + record['id']]: getCurS(num),
            };
            setEdited(true);
            handleSave({ ...record, ...newVal });
        });
    };
    const getCurP = (num) => {
        switch (num) {
            case '1':
                return '规划中';
            case '2':
                return '进行中';
            case '3':
                return '已完成'
        }
    };
    const getCurS = (num) => {
        switch (num) {
            case '1':
                return '低风险';
            case '2':
                return '进度正常';
        }
    };
    const curPData = [
        {
            txt: '规划中',
            num: '1'
        }, {
            txt: '进行中',
            num: '2'
        }, {
            txt: '已完成',
            num: '3'
        }
    ];
    const curSData = [
        {
            txt: '低风险',
            num: '1'
        }, {
            txt: '进度正常',
            num: '2'
        }
    ];
    const getSelect = (onChange, open, setOpen, data) => {
        return (
            <Select
                style={{ width: '12rem', borderRadius: '8px !important' }}
                placeholder="请选择"
                onChange={onChange}
                open={open}
                onDropdownVisibleChange={(visible) => setOpen(visible)}
                ref={targetNode} onPressEnter={toggleEdit} onBlur={toggleEdit}
            >
                {
                    data?.map((item = {}, ind) => {
                        return <Option key={ind} value={item.num}>{item.txt}</Option>
                    })
                }
            </Select>
        );
    }
    const renderItem = (form, dataIndex, record) => {
        let idDataIndex = dataIndex + record['id'];
        const cplTimeNode = <MonthPicker ref={node => targetNode.current = node} placeholder="请选择月份" onChange={handleMonthChange} />;
        const cplTimeValue = moment(String(record[idDataIndex])) || null;
        const curProgressNode = getSelect(handlecurPChange, curPOpen, setcurPOpen, curPData);
        const curStatusNode = getSelect(handlecurSChange, curSOpen, setcurSOpen, curSData);

        switch (dataIndex) {
            case 'cplTime':
                return getFormDec(form, idDataIndex, dataIndex, true, cplTimeValue, cplTimeNode);
            case 'riskDesc':
                return getFormDec(form, idDataIndex, dataIndex, false, String(record[idDataIndex]));
            case 'curProgress':
                return getFormDec(form, idDataIndex, dataIndex, true, String(record[idDataIndex]), curProgressNode);
            case 'curStatus':
                return getFormDec(form, idDataIndex, dataIndex, true, String(record[idDataIndex]), curStatusNode);
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