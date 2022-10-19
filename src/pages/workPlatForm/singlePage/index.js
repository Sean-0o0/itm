/*
 * @Author: yxm
 * @Date: 2021-03-30 20:08:09
 * @Description: 供livebos调用页面
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import LBDialog from 'livebos-frame/dist/LBDialog';
import {Switch, Route} from 'dva/router';
import ZipFileModel from './ZipFileModel/index';
import CapitalBudgetExport from "./CapitalBudgetExport";

class SinglePage extends Component {
  componentDidMount() {
    if (this.props.resizeDialog) {
      const height = this.getParamString('height') || 400;
      const width = this.getParamString('width') || 800;
      // eslint-disable-next-line no-console
      // //console.log(`高度：${this.getParamString('height')}`);
      this.props.resizeDialog({width, height});
    }
    if (this.props.dialogOpened) {
      const maximize = this.getParamString('maximize') || 'false';
      if (maximize === 'true') {
        this.props.dialogOpened();

      }
    }
  }

  // liveBos弹框确定
  onSubmitOperate = () => {
    const result = {code: 1};
    if (this.props.onSubmitOperate) {
      this.props.onSubmitOperate(result);
    }
  }
  // liveBos弹框关闭
  onCancelOperate = () => {
    if (this.props.onCancelOperate) {
      this.props.onCancelOperate();
    }
  }
  getParamString = (key) => {
    const {location: {search = ''}} = this.props;
    const regExp = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i');
    const paramString = search.match(regExp);
    if (paramString !== null) {
      return unescape(paramString[2]);
    }
    return null;
  }

  render() {
    const {
      match: {url: parentUrl = ''},
    } = this.props;
    console.log("urlurlurl", parentUrl);
    return (
      <Fragment>
        <Switch>
          <Route exact path={`${parentUrl}/ZipFilePage/:params`}
                 render={props => <ZipFileModel {...props} onSubmitOperate={this.onSubmitOperate}
                                                onCancelOperate={this.onCancelOperate}/>}/>

          <Route exact path={`${parentUrl}/CapitalBudgetExportPage`}
                 render={props => <CapitalBudgetExport {...props} onSubmitOperate={this.onSubmitOperate}
                                                       onCancelOperate={this.onCancelOperate}/>}/>
        </Switch>
      </Fragment>
    );
  }
}

const SinglePageApp = ({...props}) => {
  // console.log("propspropsprops",props)
  return (
    <Fragment>
      <LBDialog trustedOrigin="*">
        <SinglePage {...props} />
      </LBDialog>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(SinglePageApp);
