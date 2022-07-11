/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Table } from 'antd';

// 引入请求路径的示例


// 右边内容模块-规则定义-已配置参数表格
class ConfiguredParameters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downArrow: true, // / 'iconfont icon-xsjt'  //箭头
    };
  }


  componentWillMount() {

  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.motDetail !== this.props.motDetail) {
      this.structTableData(nextProps.motDetail);
    }
  }

    fetchColumns = () => {
      const columns = [
        {
          title: '序号',
          dataIndex: 'xh',
          key: 'xh',
        },
        {
          title: '计算因子',
          dataIndex: 'jsyz',
          key: 'jsyz',
        },
        {
          title: '已配置参数',
          dataIndex: 'ypzcs',
          key: 'ypzcs',
        },
      ];

      return columns;
    }

    onArrowClick = () => {
      this.setState({
        downArrow: !this.state.downArrow,
      });
    }


    // 构造表格数据
    structTableData = (motDetail = {}) => {
      // const { motDetail = {} } = this.props;
      const jsonCalcRule = motDetail.jsonCalcRuleEff;
      const data = [];
      if (jsonCalcRule) {
        const JSONEff = JSON.parse(jsonCalcRule);
        JSONEff.map((effItem) => {
          const xh = effItem.COND_NO;
          const FCTR = effItem.FCTR;
          if (FCTR) {
            FCTR.map((fctrItem, fctrIndex) => {
              const obj = {
                xh: fctrIndex === 0 ? xh : '',
                COND_NO: effItem.COND_NO,
                jsyz: fctrItem.FCTR_NM,
                ypzcs: fctrItem.FCTR_VAR[0] ? fctrItem.FCTR_VAR[0].VAR_VAL : '--',
                FCTR_NO: fctrItem.FCTR_NO,
                FCTR_ID: fctrItem.FCTR_ID,
                FCTR_NM: fctrItem.FCTR_NM,
                WTHR_ALOW_DEF: fctrItem.FCTR_VAR[0] ? fctrItem.FCTR_VAR[0].WTHR_ALOW_DEF : '',
                VAR_DESC: fctrItem.FCTR_VAR[0] ? fctrItem.FCTR_VAR[0].VAR_DESC : '',
                VAR_VAL: fctrItem.FCTR_VAR[0] ? fctrItem.FCTR_VAR[0].VAR_VAL : '',
                VAR_CODE: fctrItem.VAR_CODE,
              };
              data.push(obj);
            });
          }
        });
      }


      this.setState({
        dataSource: data,
      });
    }


    render() {
      // const { dictionary = {}, motDetail = {} } = this.props;
      const { dataSource = [], downArrow } = this.state;

      return (
        <Fragment>
          <Row>
            <div className="mot-fbgz-color" style={{  borderTopLeftRadius: '8px', borderTopRightRadius: '8px', lineHeight: '40px' }}>
              <span style={{ marginLeft: '40px', color: '#FFF' }}>已配置参数</span>
              <div style={{ float: 'right', cursor: 'pointer' }} onClick={this.onArrowClick}><i className={downArrow ? 'iconfont icon-xl' : 'iconfont icon-sl'} style={{ marginRight: '40px', color: '#FFF', fontSize: '12px' }} /></div>
            </div>
          </Row>
          <Row>
            {
                        !downArrow && (
                        <Table
                          className="mot-prod-td-no-border-table"
                          dataSource={dataSource}
                          columns={this.fetchColumns()}
                        />
)
                    }

          </Row>
        </Fragment>
      );
    }
}

export default ConfiguredParameters;
