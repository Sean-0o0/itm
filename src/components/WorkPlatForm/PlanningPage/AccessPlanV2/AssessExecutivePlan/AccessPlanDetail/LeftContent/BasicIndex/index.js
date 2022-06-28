import React from 'react';
import BasicIndexTable from '../../../../../Common/BasicIndexTable';

class BasicIndex extends React.Component {
    state = {
        defaultOpen1: true,
        defaultOpen2: true,
        defaultOpen3: true,
        defaultOpen4: true,
        defaultOpen5: true,
    };

    componentDidMount() {
    }

    getFirstColumns = () => {
      return [{
          columnName: '指标类型',
          colSpan: 1,
          dataIndex: 'INDI_CLASSNAME',
          type: '1',
          width: '8%',
          columnAlign: 'center'
        },
          {
            columnName: '指标名称',
            colSpan: 2,
            dataIndex: 'INDI_TYPENAME',
            type: '1',
            width: '14%',
            columnAlign: 'center'
          },
          {
            columnName: '指标名称2',
            colSpan: 0,
            dataIndex: 'INDI_NAME',
            type: '1',
            width: '20%',
            columnAlign: 'center'
          },
          {
            columnName: '基础目标',
            colSpan: 1,
            dataIndex: 'BASE_GOAL',
            type: '1',
            width: '20%',
            columnAlign: 'center'
          },
          {
            columnName: '分解目标',
            colSpan: 1,
            dataIndex: 'BREAK_GOAL',
            type: '1',
            width: '15%',
            columnAlign: 'center'
          },
          {
            columnName: '挑战目标',
            colSpan: 1,
            dataIndex: 'CHALLENGE_GOAL',
            type: '1',
            width: '15%',
            columnAlign: 'center'
          },
          {
            columnName: '权重%',
            width: '8%',
            // label: '1',
            colSpan: 1,
            dataIndex: 'WEIGHT',
            type: '1',
            columnAlign: 'center'
          }];
    }

    getSecondColumns = () => {
       return [{
        columnName: '指标类型',
        colSpan: 1,
        dataIndex: 'INDI_CLASSNAME',
        type: '1',
        width: '8%',
        align: 'center',
        columnAlign: 'left'
      },
        {
          columnName: '指标名称',
          colSpan: 1,
          dataIndex: 'INDI_NAME',
          type: '1',
          width: '14%',
          align: 'center',
          columnAlign: 'left'
        },
        {
          columnName: '内容',
          colSpan: 1,
          dataIndex: 'ASSESS_NOTE',
          type: '1',
          align: 'center',
          label: '2',
          width: '40%',
          columnAlign: 'left'
        },
        {
          columnName: '评分规则',
          colSpan: 1,
          dataIndex: 'SCORE_RULE',
          type: '1',
          label: '2',
          width: '30%',
          align: 'center',
          columnAlign: 'left'
        },
        {
          columnName: '权重%',
          width: '8%',
          colSpan: 1,
          dataIndex: 'WEIGHT',
          type: '1',
          // label: '1',
          columnAlign: 'center'
        }];
    }

    getThirdColumns = () => {
        return [{
                columnName: '指标类别',
                colSpan: 1,
                dataIndex: 'INDI_TYPENAME',
                type: '1',
                width: '8%',
                align: 'center',
                columnAlign: 'left'
            },
            {
                columnName: '指标名称',
                colSpan: 1,
                dataIndex: 'INDI_NAME',
                type: '1',
                width: '14%',
                align: 'center',
                columnAlign: 'left'
            },
            {
                columnName: '考核内容',
                colSpan: 1,
                dataIndex: 'ASSESS_NOTE',
                label: '2',
                type: '1',
                width: '40%',
                columnAlign: 'left'
            },
            {
                columnName: '评分规则',
                colSpan: 1,
                dataIndex: 'SCORE_RULE',
                label: '2',
                type: '1',
                width: '30%',
                columnAlign: 'left'
            },
            {
                columnName: '权重%',
                width: '8%',
                colSpan: 1,
                // label: '1',
                dataIndex: 'WEIGHT',
                type: '1',
                columnAlign: 'center'
            }];
    }

    handleResult = (array) => {
        const tempArray = JSON.parse(JSON.stringify(array))
        tempArray.forEach(element => {
            for (let obj in element) {
                if (obj !== 'BASE_GOAL' || obj !== 'BREAK_GOAL' || obj !== 'CHALLENGE_GOAL' || obj !== 'INDI_NAME' || obj !== 'WEIGHT' || obj !== 'ASSESS_EMPNAME' || obj !== 'INDI_TYPENAME') {
                    element[obj] = element[obj].replace(/\n/g, '<br/>')
                }
            }
        });
        return tempArray
    }

    changeOpen = (order) => {
        const { defaultOpen1, defaultOpen2, defaultOpen3, defaultOpen4, defaultOpen5 } = this.state;
        if (order === 1) {
            this.setState({
                defaultOpen1: !defaultOpen1,
            })
        } else if (order === 2) {
            this.setState({
                defaultOpen2: !defaultOpen2,
            })
        } else if (order === 3) {
            this.setState({
                defaultOpen3: !defaultOpen3,
            })
        } else if (order === 4) {
            this.setState({
                defaultOpen4: !defaultOpen4,
            })
        } else {
            this.setState({
                defaultOpen5: !defaultOpen5,
            })
        }
    }

    render() {
        const {
            defaultOpen1,
            defaultOpen2,
            defaultOpen3,
            defaultOpen4,
            defaultOpen5,
        } = this.state;

        const { assessInfo: {
            result1 = [],
            result2 = [],
            result3 = [],
        }, planType } = this.props;

        //ASSESS_NOTE
        const handleResult2 = this.handleResult(result2)
        const handleResult3 = this.handleResult(result3)
        return (
            <React.Fragment>
                {(<div style={{ paddingBottom: '2rem', paddingRight: '2rem' }}>
                        <div className='basic-index-box'>
                            <div className='basic-index-outline'>
                                {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingLeft: '1rem' }}>
                                    <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                                    效率指标
                                    <div onClick={() => { this.changeOpen(4) }}>
                                        {defaultOpen4 === true ?
                                            <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                                            <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                                        }
                                    </div>
                                </div>}
                            </div>
                            {defaultOpen4 &&
                                <BasicIndexTable
                                    data={result1}
                                    column={this.getFirstColumns()}
                                    sortColumn={2}
                                    bordered={true}
                                    onRef={(ref) => this.child1 = ref} />
                            }
                            {defaultOpen4 &&
                                <BasicIndexTable
                                    data={handleResult2}
                                    column={this.getSecondColumns()}
                                    sortColumn={2}
                                    bordered={true}
                                    onRef={(ref) => this.child2 = ref} />
                            }
                        </div>
                        <div className='basic-index-box'>
                            <div className='basic-index-outline'>
                                {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingLeft: '1rem' }}>
                                    <div style={{ marginRight: '1rem', float: 'left', width: '0.75rem', height: '1rem', border: '1px #54A9DF solid', background: '#54A9DF', display: 'inline-block', }} />
                                    质量系数
                                    <div onClick={() => { this.changeOpen(5) }}>
                                        {defaultOpen5 === true ?
                                            <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                                            <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                                        }
                                    </div>

                                </div>}
                            </div>
                            {defaultOpen5 &&
                                <BasicIndexTable
                                    data={handleResult3}
                                    sortColumn={1}
                                    column={this.getThirdColumns()}
                                    bordered={true}
                                    onRef={(ref) => this.child3 = ref} />
                            }
                        </div>
                    </div>)
                }
            </React.Fragment >
        );
    }
}
export default BasicIndex;
