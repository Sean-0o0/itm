import React, {Fragment} from 'react';
import moment from 'moment';
import {Input, Select, DatePicker, Icon, Progress, message} from 'antd';
import {connect} from 'dva';
import {FetchQueryLiftcycleMilestone, QueryZBYSFJ} from "../../../services/pmsServices";
import {cos} from "d3-shape/src/math";

const {Option} = Select;
const PASE_SIZE = 10;
const DEFAULT_CURRENT = 1;

class ZipFileModel extends React.Component {
  state = {
    open: false,
    time: null,
    type: '',
  };

  componentWillMount() {
  }

  getFile = () => {
    const {time,} = this.state;
    const {type} = this.props;
    if (time === null) {
      message.error("请选择导出年份");
    } else {
      const nf = time.year();
      // const type = "NZ"
      let url = "http://192.168.4.159:6011/ftq/projectManage/queryZBYSFJ?";
      url = url + "nf=" + nf + "&type=" + type;
      window.open(url);
    }
  }

  render() {
    const {open, time} = this.state;
    return (
      <Fragment>
        <div style={{
          height: '100%',
          padding: '2.381rem 3.571rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          fontSize: '2.083rem'
        }}>
          <Input.Group compact>
            <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}
                 className="operationListSelectBox">
            <span style={{fontSize: '2.381rem'}}>
              年份：&nbsp;&nbsp;
            </span>
              <div>
                <DatePicker
                  value={time}
                  open={open}
                  mode="year"
                  style={{zIndex: 999}}
                  placeholder="请选择年份"
                  format="YYYY"
                  onOpenChange={(status) => {
                    if (status) {
                      this.setState({open: true})
                    } else {
                      this.setState({open: false})
                    }
                  }}
                  onPanelChange={(v) => {
                    console.log(v)
                    this.setState({
                      time: v,
                      open: false
                    })
                  }}
                />
              </div>
            </div>
          </Input.Group>
          <div style={{textAlign: 'end'}}>
            <button class="ant-btn">取消</button>
            &nbsp;&nbsp;
            <button class="ant-btn ant-btn-primary" onClick={this.getFile}>确定</button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(({global = {}}) => ({
  authorities: global.authorities,
}))(ZipFileModel);
