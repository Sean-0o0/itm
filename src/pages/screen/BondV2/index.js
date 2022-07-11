import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import Bond from '../../../components/LargeScreen/BondV2';

class BondPage extends React.Component {

  render() {
    // const { dictionary} = this.props;
    // const { XYDP } = dictionary;
    const title = '总部银行间债券结算业务分屏';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '4'/>
          <Bond/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default BondPage;
