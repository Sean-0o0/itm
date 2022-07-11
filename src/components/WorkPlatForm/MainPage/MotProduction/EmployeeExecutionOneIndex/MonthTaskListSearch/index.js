import React, { Fragment } from 'react';
import {Select,DatePicker,Button, Form} from 'antd';
import moment from 'moment';


const { MonthPicker } = DatePicker;
const { Option } = Select;
class MonthTaskListSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zycd: '',
      ddsj: '',
      selectMonth: null,
    };
  }
  componentDidMount() {
  }

  changeDdsj=(value)=>{
    this.setState({
      ddsj: value
    });
  }
  
  changeZycd=(value)=>{
    this.setState({
      zycd: value
    });
  }

  changeMonth=(value)=>{
    this.setState({
      selectMonth: value
    });
  }

  searchData=()=>{
    const { changeParam } = this.props;
    const { ddsj, zycd, selectMonth } = this.state;
    const data = [
      {
        name: 'ddsj',
        value: ddsj
      },
      {
        name: 'zycd',
        value: zycd
      },
      {
        name: 'selectMonth',
        value: selectMonth == null ? null : moment(selectMonth).format("YYYYMM")
      },
  ]
    changeParam(data);
  }

  reset = () => {
    this.setState({
      zycd: '',
      ddsj: '',
      selectMonth: null,
    })
  }
 

  render() {
    const { zycdDict  = [],ddsjList  = [] } = this.props;
    const {zycd, ddsj, selectMonth } = this.state;
    return (
      <Fragment>
        <div className="mot-empexc-sx">
            <div style={{color:'#333333',fontWeight:'bold'}}>查询</div>
            <Form>
            <div style={{marginTop:'2rem'}}>
                <div>督导月份:</div>
                <Form.Item>
                <MonthPicker value={ selectMonth}  style={{ width: '100%',marginTop:'1rem'}} placeholder="请选择月份" onChange={this.changeMonth}></MonthPicker>
                </Form.Item>
            </div>
            <div>
              <div>重要程度:</div>
              <Form.Item>
              <Select value={ zycd } style={{ width: '100%',marginTop:'1rem'}} onChange={this.changeZycd}>
                {
                  zycdDict.map(item=>(
                    <Option value={item.ibm}>{item.note}</Option>
                  ))
                }
              </Select>
              </Form.Item>
            </div>
            
            <div>
              <div>督导事件:</div>
              <Form.Item>
              <Select 
                  value={ ddsj } 
                  allowClear 
                  showSearch
                  placeholder="请选择" 
                  optionFilterProp="children" 
                  style={{ width: '100%',marginTop:'1rem'}}  
                  onChange={this.changeDdsj}
                  >
              {
                  ddsjList.map(item=>(
                    <Option value={item.EVNT_ID}>{item.EVNT_NM}</Option>
                  ))
                }
              </Select>
              </Form.Item>
            </div>    
            </Form>
            <div style={{marginTop:'3rem',textAlign:'right'}}>
              <Button className="factor-bottom m-btn-border-headColor" onClick={this.searchData}>查询</Button>
              <Button style={{marginLeft:'1rem'}} onClick={this.reset}>重置</Button>
            </div>
          </div>
      </Fragment>
    );
  }
}

export default Form.create()(MonthTaskListSearch);
