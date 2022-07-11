/* eslint-disable no-shadow */
import React, { Fragment } from 'react';
import { Input, Select } from 'antd';
import { FetchqueryData } from '../../../../../../../../services/motProduction';

const { Option } = Select;
/**
 * 考评人员结构配置
 */

class FCTR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    this.FetchqueryData(this.props.item);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      this.FetchqueryData(nextProps.item);
    }
  }
  FetchqueryData = (item) => {
    if (item.CTL_TP === '2') {
      const data = [{ ibm: '0', note: '--请选择--' }];
      const parms = {
        current: 1,
        keyword: '',
        owner: item.DATA_SOURCE,
        paging: 0,
        pageSize: 10,
        tablesql: item.VAL_FMLA,
        sort: '',
        total: -1,
      };
      FetchqueryData(parms).then((ret = {}) => {
        const { records = [] } = ret;
        if (records && records.length > 0) {
          records.forEach((item) => {
            const Item = { ibm: item.id, note: item.name };
            data.push(Item);
          });
          this.setState({ data });
        }
      });
    }
  }
  onChangeInput = (e) => {
    const { indexFCTR, index } = this.props;
    this.props.onChangeInput(e.target.value, indexFCTR, index);
  }
  onChangeSelect = (value) => {
    const { indexFCTR, index } = this.props;
    this.props.onChangeSelect(value, indexFCTR, index);
  }
  render() {
    const { data } = this.state;
    const { type, item } = this.props;
    return (
      <Fragment>
        <div className="mot-event-calcRule" style={{ paddingLeft: 0 }}>
          <span style={{ color: '#333333', marginTop: '4px', width: '50%' }}>{item.VAR_DESC}</span>
          {
                    item.CTL_TP === '1' ? <Input value={item.VAR_VAL} style={{ width: '50%' }} disabled={type} onChange={this.onChangeInput} />
                      : (
                        <Select value={item.VAR_VAL === '' ? '0' : item.VAR_VAL} style={{ width: '50%' }} disabled={type} onChange={this.onChangeSelect}>
                          {data.map(selsectItem =>
                            <Option value={selsectItem.ibm}>{selsectItem.note}</Option>)}
                        </Select>
)
                  }
        </div>
      </Fragment>
    );
  }
}
export default FCTR;
