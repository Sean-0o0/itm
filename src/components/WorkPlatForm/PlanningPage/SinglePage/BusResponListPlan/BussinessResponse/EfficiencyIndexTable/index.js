import React from 'react';
import { Button, Row, message, Select } from 'antd';
import BasicIndexTable from '../../../../Common/BasicIndexTable';
import {
  FetchQueryIndiList,
  FetchQueryBusResponList,
  FetchQueryAssessPlanBusDetail,
} from '../../../../../../../services/planning/planning';

class EfficiencyIndexTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      column: [],
      option: [],             //二级指标下拉选项

      //下拉框主要参数:
      //1|高管考核方案;2|业务条线;3|职能部门	 	I_PLANTYPE   考核方案类型 当前页面属于业务条线 所以该参数固定为2
      //1|经营指标;2|管理指标;3|质量系数;4|具体考核方案	 I_IDXCLASS  指标类别 这个参数根据表格来确定 该页面有4个表格
      managementOption: [],       //经营指标二级下拉框

      selectedArray: [],
      massFactorTemplate: [],     //质量系数下拉框
      dataSource: [],              //质量系数表格数据
    };
  }

  componentDidMount() {
    const { managementOption } = this.state;
    const { idxClass, planType } = this.props;
    //获取下拉框内容
    FetchQueryIndiList(
      {
        'current': 1,
        'idxClass': idxClass,  //1表示经营指标表格
        'pageSize': 999,
        'paging': 1,
        'planType': 2,//业务条线页面固定为2
        //"sort": "", //排序字段 暂时不使用
        'total': -1,
      },
    ).then((ret) => {
      ret.records.forEach((item, index) => {
        //创建两个数组 分开装下拉框的内容
        const param = {
          //'idxClass': item.idxClass,
          'key': item.idxType,
          'value': item.idxTypeName,
        };
        if (JSON.stringify(managementOption).indexOf(JSON.stringify(param)) === -1) {
          managementOption.push(param);
        }
      });
      this.setState(
        {
          managementOption: managementOption,
          option: ret.records,
        },
      );
    });

    //获取质量系数下拉框数据
    FetchQueryBusResponList({
      planType,
      'yr': new Date().getFullYear(),
    }).then((res) => {
      const { records, code } = res;
      if (code > 0) {
        this.setState({
          massFactorTemplate: records,
        });
      }
    });
  }

  addData = (params) => {
    let { data, changeData } = this.props;
    //将添加的数据推入data中
    let flag = true;
    if (data.length === 0) {
      data.push(params);
      flag = false;
    }
    if (flag && data.length > 0 && !(data[data.length - 1].INDI_ID === '')) {
      data.push(params);
    } else if (flag) {
      message.error('请选择下拉框');
    }
    //将三级指标数组删除本次添加的三级指标
    changeData(3, data);
  };
  deleteData = (data, obj, index) => {
    //obj是删除掉的行数据  取出放置到下拉框中
    const { changeData } = this.props;
    const { selectedArray } = this.state;
    let tempSelectedArray = JSON.parse(JSON.stringify(selectedArray));
    //将删除的数据从已选框中删除
    tempSelectedArray.splice(index, 1);

    this.setState({
      selectedArray: tempSelectedArray,
    }, () => {
      changeData(3, data);
    });
  };

  handleChangeData = (data, pos, num = '') => {
    //将data中已选择的三级指标放到数组中
    const { changeData } = this.props;
    let selectedArray = [];
    if (num === '') {
      data.forEach((item, index) => {
        selectedArray.push(Number(item.INDI_ID));
      });
      this.setState({
        selectedArray: selectedArray,
      });
    }
    this.props.changeData(3, data);
  };

  numberToString = (array) => {
    let tempArray = JSON.parse(JSON.stringify(array));
    tempArray.forEach((item, index) => {
      for (let obj in item) {

        if (obj === 'INDI_ID' || obj === 'INDI_TYPE') {
          item[obj] = '' + item[obj];
        }
      }
    });
    return tempArray;
  };

  changeOpen = () => {
    const { defaultOpen = false } = this.props;
    this.props.changeOpen && this.props.changeOpen(!defaultOpen, 2);
  };

  //改变 质量系数模板
  queryMassFactor = (planId) => {
    if (!planId) {
      //清除了下拉选项
      this.setState({
        dataSource: [],
      });
    } else {
      FetchQueryAssessPlanBusDetail({ planId }).then(res => {
        const { code = 0, result = {} } = res;
        if (code > 0) {
          const resultList = JSON.parse(result);
          if (resultList.result3.length > 0) {
            this.props.changeData(3, resultList.result3);
            this.setState({
              dataSource: resultList.result3,
            });
          }

          // this.setState({
          //     headerInfo: JSON.parse(note),
          //     assessInfo: resultList,
          // });
        }
      }).catch(e => {
        message.error(!e.success ? e.message : e.note);
      });
    }
  };

  render() {
    const { managementOption = [], option, massFactorTemplate } = this.state;
    const { column = [], data = [], title, idxClass, defaultOpen = false, edit = false } = this.props;

    let { dataSource = [] } = this.state;
    if (dataSource.length === 0) {
      dataSource = this.numberToString(data);
    }

    if (column && column.length > 0) {
      column[0].option = managementOption;
      column[1].option = option;
    }

    const defaultRow = {
      //idxTypeName: '管理指标',
      //{"INDI_CLASS":3,"INDI_ID":8,"ASSESS_NOTE":"考核内容1","SCORE_RULE":"评分规则1","WEIGHT":0.1}
      INDI_CLASS: idxClass,
      INDI_ID: '',
      ASSESS_NOTE: '',
      SCORE_RULE: '',
      WEIGHT: '',
    };
    return (

      <div>
        {title &&
        <div className='dp-table-title' style={{ display: 'flex', alignItems: 'center', paddingRight: '1rem' }}>
          <div style={{
            marginRight: '1rem',
            float: 'left',
            width: '0.75rem',
            height: '1rem',
            border: '1px #54A9DF solid',
            background: '#54A9DF',
            display: 'inline-block',
          }} />
          质量系数
          <div onClick={this.changeOpen}>
            {defaultOpen === true ?
              <i className='iconfont iconfont icon-down-solid-arrow' style={{ fontSize: '1rem' }} /> :
              <i className='iconfont icon-right-solid-arrow' style={{ fontSize: '1rem' }} />
            }
          </div>
        </div>}
        {column.length > 0 && defaultOpen === true &&
        <>
          {!edit && <>
            <b> 选择已有方案：</b><Select defaultValue='请选择质量系数模板'
                                   onChange={this.queryMassFactor} allowClear showSearch
                                   style={{ width: 240, marginBottom: '1rem' }}
                                   filterOption={(input, option) =>
                                     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            {
              massFactorTemplate.map(item => {
                return <Select.Option title={item.planName} key={item.planId} value={item.planId}>{item.planName}</Select.Option>;
              })
            }
          </Select>
          </>}
          < BasicIndexTable
            // title={'效率指标'}
            handleChangeData={this.handleChangeData}
            deleteData={this.deleteData}
            data={dataSource}
            column={column}
            operation={1} //操作类型 0：查看||1: 修改/新增
            bordered={true}
            onRef={(ref) => this.child1 = ref}
            // selectedArray={selectedArray}
          />
        </>}
        {defaultOpen === true &&
        <Row style={{
          border: '1px solid #E8E8E8',
          borderTop: 'none',
          height: '4rem',
          textAlign: 'center',
          lineHeight: '4rem',
        }}>
          <Button style={{ marginTop: '7px' }} className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor '
                  onClick={() => {
                    this.addData(defaultRow);
                  }}>
            {'添加质量系数'}
          </Button>
          {/* <AddNewRow ButtonName="添加经营指标" flag={2}  rowParam={rowParam} handleOptionChange={this.handleOptionChange}  addData={this.addData} text={text} /> */}
        </Row>
        }
      </div>
    );
  }
}

export default EfficiencyIndexTable;
