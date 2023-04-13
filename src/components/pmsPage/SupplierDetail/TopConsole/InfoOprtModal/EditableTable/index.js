import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Tooltip } from 'antd';

const EditableContext = React.createContext();

const EditableRow = Form.create()(({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
});
const EditableCell = props => {
  const [editing, setEditing] = useState(false); //正在编辑
  const inputRef = useRef(null);
  const {
    editable,
    dataIndex,
    title,
    record,
    index,
    handleSave,
    formdecorate,
    children,
    ...restProps
  } = props;

  useEffect(() => {
    // console.log('🚀 ~ file: index.js:28 ~ EditableCell ~ props:', props);
    return () => {};
  }, []);

  const save = e => {
    formdecorate.validateFields(
      [
        'LXR' + record['ID'],
        'ZW' + record['ID'],
        'DH' + record['ID'],
        'BZ' + record['ID'],
        'QTLXFS' + record['ID'],
        'YWSX' + record['ID'],
      ],
      (error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }
        setEditing(!editing);
        setTimeout(() => {
          if (!editing) inputRef.current?.focus();
        });
        handleSave({ ...record, ...values });
      },
    );
  };

  const getDecotator = () => {
    const recIndex = dataIndex + record['ID'];
    switch (dataIndex) {
      case 'LXR':
      case 'ZW':
      case 'DH':
        return formdecorate.getFieldDecorator(recIndex, {
          rules: [
            {
              required: true,
              message: `${title}不允许空值`,
            },
          ],
          initialValue: String(record[recIndex]),
        })(<Input ref={inputRef} onPressEnter={save} onBlur={save} />);
      default:
        return formdecorate.getFieldDecorator(recIndex, {
          initialValue: String(record[recIndex]),
        })(<Input ref={inputRef} onPressEnter={save} onBlur={save} />);
    }
  };
  const renderCell = () => {
    return editing ? (
      <Form.Item style={{ margin: 0 }}>{getDecotator()}</Form.Item>
    ) : ['BZ', 'QTLXFS'].includes(dataIndex) ? (
      <Tooltip title={record[dataIndex + record['ID']]} placement="topLeft">
        <div
          className="editable-cell-value-wrap"
          style={{ textAlign: 'left' }}
          onClick={() => {
            setEditing(!editing);
            setTimeout(() => {
              if (!editing) inputRef.current?.focus();
            });
          }}
        >
          {record[dataIndex + record['ID']]}
        </div>
      </Tooltip>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ textAlign: 'left' }}
        onClick={() => {
          setEditing(!editing);
          setTimeout(() => {
            if (!editing) inputRef.current?.focus();
          });
        }}
      >
        {record[dataIndex + record['ID']]}
      </div>
    );
  };
  return (
    <td {...restProps}>
      {editable ? <EditableContext.Consumer>{renderCell}</EditableContext.Consumer> : children}
    </td>
  );
};

export { EditableRow, EditableCell };
