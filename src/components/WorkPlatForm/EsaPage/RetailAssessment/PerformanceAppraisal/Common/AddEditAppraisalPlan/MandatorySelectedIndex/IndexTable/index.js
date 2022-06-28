import React from 'react';
import { Form } from 'antd';
import EditableRow from './EditableRow';
import BasicDataTable from '../../../../../../../../Common/BasicDataTable';
import EditableCell from './EditableCell';

class IndexTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }
  componentDidMount() {
    const { onRef, indexDetail = [] } = this.props;
    if (onRef) {
      onRef(this);
    }
    this.fetchData(indexDetail);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.indexDetail) !== JSON.stringify(nextProps.indexDetail)) {
      this.fetchData(nextProps.indexDetail);
    }
  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => `${row.id}-${row.empLevelId}` === `${item.id}-${item.empLevelId}`);
    const item = newData[index];
    //计算折算比例
    const cvrtRatio = isNaN((parseFloat(row.std1Score) / parseFloat(row.examStd1)).toFixed(4))? '' : (parseFloat(row.std1Score) / parseFloat(row.examStd1)).toFixed(4);
    Reflect.set(row, 'cvrtRatio', cvrtRatio);
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
    // eslint-disable-next-line no-console
  };

  handleSubmit = () => {
    let indexList;
    this.props.form.validateFields((e) => {
      if (!e) {
        indexList = [];
        const { dataSource } = this.state;
        for (let i = 0; i < dataSource.length; i++) {
          const obj = dataSource[i];
          const indexObj = {
            ID: obj.id !== '' ? Number(obj.id) : '',
            SNO: obj.sno !== '' ? Number(obj.sno) : '',
            EXAM_INDI: obj.examIndi !== '' ? Number(obj.examIndi) : '',
            EMP_CLASS_ID: obj.empClassId !== '' ? Number(obj.empClassId) : '',
            EMP_LEVEL_ID: obj.empLevelId !== '' ? Number(obj.empLevelId) : '',
            // INDI_NAME: obj.indiName || '',
            // INDI_CODE: obj.indiCode || '',
            EXAM_WEIGHT: obj.examWeight !== '' ? Number(obj.examWeight) : '',
            IS_MUST: obj.isMust !== '' ? Number(obj.isMust) : '',
            EXAM_STD1: obj.examStd1 !== '' ? Number(obj.examStd1) : '',
            ELG_THLD: obj.elgThld !== '' ? Number(obj.elgThld) : '',
            // EXAM_STD2: obj. !=='' ? Number(obj.examStd2) : '',
            // EXAM_STD3: obj. !=='' ? Number(obj.examStd3) : '',
            // EXAM_STD4: obj. !=='' ? Number(obj.examStd4) : '',
            // EXAM_STD5: obj. !=='' ? Number(obj.examStd5) : '',
            // EXAM_STD6: obj. !=='' ? Number(obj.examStd6) : '',
            // EXAM_STD7: obj. !=='' ? Number(obj.examStd7) : '',
            // EXAM_STD8: obj. !=='' ? Number(obj.examStd8) : '',
            // EXAM_STD9: obj. !=='' ? Number(obj.examStd9) : '',
            // EXAM_STD10: obj. !=='' ? Number(obj.examStd10) : '',
            SCORE_BTM: obj.scoreBtm !== '' ? Number(obj.scoreBtm) : '',
            SCORE_TOP: obj.scoreTop !== '' ? Number(obj.scoreTop) : '',
            SCORE_MODE_ID: obj.scoreModeId !== '' ? Number(obj.scoreModeId) : '',
            WEIGHT_BTM: obj.WeightBtm !== '' ? Number(obj.WeightBtm) : '',
            WEIGHT_TOP: obj.WeightTop !== '' ? Number(obj.WeightTop) : '',
            ZERO_THLD: obj.zeroThld !== '' ? Number(obj.zeroThld) : '',
            PCT_THLD: obj.pctThld !== '' ? Number(obj.pctThld) : '',
            BIZ_QTY_UNIT: obj.bizQtyUnit || '',
            PCT_THLD_UNIT: obj.pctThldUnit || '',
            CVRT_RATIO: obj.cvrtRatio !== '' ? Number(obj.cvrtRatio) : '',
            STD1_SCORE: obj.std1Score !== '' ? Number(obj.std1Score) : '',
            // STD2_SCORE: obj. !=='' ? Number(obj.std2Score) : '',
            // STD3_SCORE: obj. !=='' ? Number(obj.std3Score) : '',
            // STD4_SCORE: obj. !=='' ? Number(obj.std4Score) : '',
            // STD5_SCORE: obj. !=='' ? Number(obj.std5Score) : '',
            // STD6_SCORE: obj. !=='' ? Number(obj.std6Score) : '',
            // STD7_SCORE: obj. !=='' ? Number(obj.std7Score) : '',
            // STD8_SCORE: obj. !=='' ? Number(obj.std8Score) : '',
            // STD9_SCORE: obj. !=='' ? Number(obj.std9Score) : '',
            // STD10_SCORE: obj. !=='' ? Number(obj.std10Score) : '',
          };
          indexList.push(indexObj);
        }
      }
    });
    return indexList;
  }
  // 新增业务数量、折算得分单元格
  handleCellAdd = (record) => {
    const dataSource = [...this.state.dataSource];
    for (let i = 0; i < dataSource.length; i++) {
      if (`${record.id}-${record.empLevelId}` === `${dataSource[i].id}-${dataSource[i].empLevelId}`) {
        for (let j = 1; j <= 10; j++) {
          const examStdElem = dataSource[i][`examStd${j}`];
          const stdScoreElem = dataSource[i][`std${j}Score`];
          if (examStdElem === undefined || stdScoreElem === undefined) {
            dataSource[i][`examStd${j}`] = '';
            dataSource[i][`std${j}Score`] = '';
            this.setState({ dataSource });
            break;
          }
        }
      }
    }
  }
  // 删除业务数量、折算得分单元格
  handleCellSub = (record) => {
    const dataSource = [...this.state.dataSource];
    for (let i = 0; i < dataSource.length; i++) {
      if (`${record.id}-${record.empLevelId}` === `${dataSource[i].id}-${dataSource[i].empLevelId}`) {
        for (let j = 1; j <= 11; j++) {
          const examStdElem = dataSource[i][`examStd${j}`];
          const stdScoreElem = dataSource[i][`std${j}Score`];
          if (examStdElem === undefined || stdScoreElem === undefined) {
            Reflect.deleteProperty(dataSource[i], `examStd${j - 1}`);
            Reflect.deleteProperty(dataSource[i], `std${j - 1}Score`);
            this.setState({ dataSource });
            break;
          }
        }
      }
    }
  }

  fetchData = (indexDetail = []) => {
    const { scoreMode1 = [], scoreMode2 = [] } = this.props;
    const dataSource = [...indexDetail].filter(item => item.isMust === '1'&& (item.version ===''||item.version===undefined));
    dataSource.forEach((item) => {
      if (scoreMode1.includes(item.scoreModeId)) {
        Reflect.set(item, 'type', 1);
      } else if (scoreMode2.includes(item.scoreModeId)) {
        Reflect.set(item, 'type', 2);
      } else {
        Reflect.set(item, 'type', 2);
      }
      for (let i = 10; i > 1; i--) {
        if (!item[`examStd${i}`]) {
          Reflect.deleteProperty(item, `examStd${i}`);
        }
        if (!item[`std${i}Score`]) {
          Reflect.deleteProperty(item, `std${i}Score`);
        }
      }
    });
    this.setState({ dataSource });
  }

  fetchColumns = () => {
    const { digit = 2 } = this.props;
    let columns = [
      {
        title: '考核指标',
        dataIndex: 'indiName',
        editable: false,
        ellipsis: true,
        width: '15%',
      },
      // {
      //   title: '操作',
      //   dataIndex: 'cz',
      //   align: 'center',
      //   width: 70,
      //   render: (value, record) => {
      //     return (
      //       record.scoreModeId === '2' ? (
      //         <div>
      //           <a onClick={() => this.handleCellAdd(record)} className="fs18">+</a>&nbsp;
      //           <a onClick={() => this.handleCellSub(record)} className="fs18">-</a>
      //         </div>
      //       ) : ''
      //     );
      //   },
      // },
      {
        title: '考核标准',
        dataIndex: 'examStd1',
        align: 'center',
        render: (value) => {
          return value != '' ? `${Number(value).toFixed(digit)}` : '';
        },
        // render: (value, record, index) => {
        //   const html = [];
        //   for (let i = 1; i <= 10; i++) {
        //     const element = record[`examStd${i}`];
        //     if (element) {
        //       html.push(<div key={i}>{element}</div>);
        //       continue;
        //     }
        //     break;
        //   }
        //   return html;
        // }
      },
      {
        title: '折算得分',
        dataIndex: 'zsdf',
        align: 'center',
        // render: (value, record, index) => {
        //   const html = [];
        //   for (let i = 1; i <= 10; i++) {
        //     const element = record[`std${i}Score`];
        //     if (element) {
        //       html.push(<div key={i}>{element}</div>);
        //       continue;
        //     }
        //     break;
        //   }
        //   return html;
        // }
        render: (value) => {
          return value != '' ? `${Number(value).toFixed(digit+2)}` : '';
        },
      },
      {
        title: '折算比例',
        dataIndex: 'cvrtRatio',
        align: 'center',
        editable: false,
        render: (value) => {
          return value != '' ? `${Number(value).toFixed(digit+2)}` : '';
        },
      },
      {
        title: '总分下限',
        dataIndex: 'scoreBtm',
        align: 'center',
        editable: true,
        render: (value) => {
          return value != '' ? `${Number(value).toFixed(digit)}` : '';
        },
      },
      {
        title: '总分上限',
        dataIndex: 'scoreTop',
        align: 'center',
        editable: true,
        render: (value) => {
          return value != '' ? `${Number(value).toFixed(digit)}` : '';
        },
      },
      {
        title: '零分阈值(%)',
        dataIndex: 'zeroThld',
        align: 'center',
        editable: true,
        render: (value) => {
          return value != '' ? `${Number(value).toFixed(digit)}` : '';
        },
      },
      {
        title: '合格阈值(%)',
        dataIndex: 'elgThld',
        align: 'center',
        editable: true,
        render: (value) => {
          return value !== '' ? `${Number(value).toFixed(digit)}` : '';
        },
      },
      {
        title: '百分阈值(%)',
        dataIndex: 'pctThld',
        align: 'center',
        editable: true,
        render: (value) => {
          return value != '' ? `${Number(value).toFixed(digit)}` : '';
        },
      },
      {
        title: '权重',
        dataIndex: 'examWeight',
        align: 'center',
        editable: true,
        render: (value) => {
          return value != '' ? `${Number(value).toFixed(digit)}` : '';
        },
      },
      // {
      //   title: '操作',
      //   dataIndex: 'qzcz',
      //   align: 'center',
      //   width: 70,
      //   // eslint-disable-next-line jsx-a11y/anchor-is-valid
      //   render: (value, record) => (
      //     <a onClick={() => this.handleDelete(`${record.id}-${record.empLevelId}`)} className="blue-link"><i className="iconfont icon-shanchu fs-inherit" /></a>
      //   ),
      // },
    ];
    const { form } = this.props;
    columns = columns.map((col) => {
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          form,
          digit: col.dataIndex === 'zsdf' || col.dataIndex === 'cvrtRatio'? 4: digit,
        }),
      };
    });
    return columns;
  }
  render() {
    const { dataSource = [] } = this.state;
    //console.log({dataSource})
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    return (
      <div>
        <Form className="m-form">
          <BasicDataTable
            rowKey={record => `${record.id}-${record.empLevelId}`}
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={this.fetchColumns()}
            pagination={{
              className: 'm-paging',
              size: 'small',
              showLessItems: true,
              hideOnSinglePage: true,
            }}
          />
        </Form>
      </div>
    );
  }
}

export default Form.create()(IndexTable);
