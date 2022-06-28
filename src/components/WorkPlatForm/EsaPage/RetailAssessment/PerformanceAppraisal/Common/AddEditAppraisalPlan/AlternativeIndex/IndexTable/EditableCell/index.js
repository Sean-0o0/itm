import React from 'react';
import { Form, Input } from 'antd';
/**
 * 可编辑单元格
 */

class EditableCell extends React.Component {
  constructor(props) {
    const { record = {} } = props;
    super(props);
    this.state = {
      editing: record.isRvs === '1' ? true : false,
    };
  }
  toggleEdit = () => {
    const { editing } = this.state;
    this.setState({ editing: !editing });
  };
  save = (e) => {
    const { record, handleSave, form = {} } = this.props;
    form.validateFields((error, values) => {
      const { id } = e.currentTarget;
      if (error && error[id]) {
        return;
      }
      // this.toggleEdit();
      handleSave({ ...record, [id.substr(id.indexOf('-') + 1)]: values[id] });
    });
  };
  numberValidator = (rule, value, callback) => {
    const { dataIndex } = this.props;
    // if (!value) {
    //   callback('请输入');
    // } else
    if (Number.isNaN(Number(value)) && dataIndex !== 'indiName') {
      callback('请输入数字');
    } else if (dataIndex === 'ywsl' && Number(value) === 0) {
      callback('业务数量不能为0');
    } else {
      callback();
    }
  }
  // 业务数量 折算得分
  renderCell = () => {
    const { dataIndex, record = {}, form = {}, digit } = this.props;
    const html = [];
    for (let i = 1; i <= 10; i++) {
      const objName = dataIndex === 'ywsl' ? `examStd${i}` : `std${i}Score`;
      const element = record[objName];
      if (element !== undefined && record.isRvs === '1' && record.type === 1 && record.scoreModeId !== '2') {
        const node = (
          <Form.Item style={{ margin: 0 }} key={i}>
            <div className="df">
              {
                form.getFieldDecorator(`${record.id}_${record.empLevelId}-${objName}`, {
                  initialValue: record[objName] !== '' ? `${Number(record[objName]).toFixed(digit)}` : '',
                  rules: [
                    { validator: this.numberValidator },
                  ],
                })(<Input onPressEnter={this.save} onBlur={this.save} onKeyUp={this.save} />)
              }{dataIndex === 'ywsl' ? <span style={{ lineHeight: '32px' }}>{record.bizQtyUnit}</span> : ''}
            </div>
          </Form.Item>
        );
        html.push(node);
      } else if (record[objName]) {
        const node = (
          <p>{Number(record[objName]).toFixed(digit)}</p>
        );
        html.push(node);
      } else {
        break;
      }
    }
    return html;
  }
  render() {
    const { editing } = this.state;
    const typeArr = [['zeroThld', 'pctThld'], ['scoreBtm', 'scoreTop']];//type不同时不可编辑的列
    const { title, editable: pEditable, children, dataIndex, record = {}, handleSave, form = {}, digit, ...restProps } = this.props;
    let childNode = children;
    // 是否可编辑
    let editable = pEditable;
    // scoreMode = 1, 2, 3, 4, 5, 6，零分阈值，合格阈值，百分阈值不可编辑['zeroThld', 'elgThld', 'pctThld']
    // scoreMode = 4，只可编辑折算得分、总分下限、总分上限['zsdf', 'scoreBtm', 'scoreTop']
    // scoreMode = 7，只可编辑零分阈值，合格阈值、百分阈值['zeroThld', 'elgThld', 'pctThld']
    if (dataIndex === 'examWeight') {
      editable = true;
    } else {
      if (['1', '2', '3', '4', '5', '6'].includes(record.scoreModeId) && ['zeroThld', 'elgThld', 'pctThld'].includes(dataIndex)) {
        editable = false;
      } else if (record.scoreModeId === '4') {
        editable = false;
        if (['zsdf', 'scoreBtm', 'scoreTop'].includes(dataIndex)) {
          editable = true;
        }
      } else if (record.scoreModeId === '7') {
        editable = false;
        if (['zeroThld', 'elgThld', 'pctThld'].includes(dataIndex)) {
          editable = true;
        }
      }
    }
    if (editable) {
      childNode = dataIndex === 'examWeight' || (editing && !typeArr[record.type - 1].includes(dataIndex)) ? (
        <Form.Item style={{ margin: 0 }}>
          <div className="df">
            {
              form.getFieldDecorator(`${record.id}_${record.empLevelId}-${dataIndex}`, {
                initialValue: record[dataIndex] !== '' ? `${Number(record[dataIndex]).toFixed(digit)}` : '',
                rules: [
                  { validator: this.numberValidator },
                ],
              })(<Input onPressEnter={this.save} onBlur={this.save} />)
            }{dataIndex === 'zeroThld' || dataIndex === 'pctThld' || dataIndex === 'elgThld' ? <span style={{ lineHeight: '32px' }}>%</span> : ''}
          </div>
        </Form.Item>
      ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
          // onClick={this.toggleEdit}
          >
            {children[2]}
          </div>
        );
    }
    if (dataIndex === 'ywsl' || dataIndex === 'zsdf') {
      childNode = this.renderCell();
    }
    return <td {...restProps}>{childNode}</td>;
  }
}

export default EditableCell;
