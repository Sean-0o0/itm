import React, { Fragment } from 'react';
import { Row } from 'antd';
// 引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';


// 右边内容模块-内容模板
class ContentTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentWillReceiveProps() {

  }

  // 替换模板中的变量
  structTmplData = (codeArrList = [], cntntTmpl) => {
    let temp = cntntTmpl;

    codeArrList.forEach((item) => {
      if (temp.indexOf(item.varCodeUse) !== -1) {
        temp = temp.replace(item.varCodeUse, item.varDescUse);
      }
    });

    return temp;
  }


  render() {
    const { motDetail = {}, codeArrList = [] } = this.props;

    return (
      <Fragment>
        <Row>

          <div style={{ color: '#333333', fontWeight: 'bold' }}>内容模板 </div>
          <div style={{ padding: '1rem' }}>{this.structTmplData(codeArrList, motDetail.cntntTmpl)}</div>
        </Row>
      </Fragment>
    );
  }
}

export default ContentTemplate;
