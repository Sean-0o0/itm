/*
 * @Author: yxm
 * @Date: 2021-03-30 20:08:09
 * @Description: 供livebos调用页面
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Bridge from 'livebos-bridge';
import { Switch, Route } from 'dva/router';
import ZipFileModel from './ZipFileModel/index';
import CapitalBudgetExport from './CapitalBudgetExport';
import NewProjectModel from './NewProjectModel';
import NewProjectModelV2 from './NewProjectModelV2';
import AnnexExport from './AnnexExport';
const { events } = Bridge.constants;
class SinglePage extends Component {
  closeDialog = () => {
    const { closeDialog } = this.props;
    if (closeDialog) {
      closeDialog();
    }
  };

  submitOperate = () => {
    const { submitOperate } = this.props;
    if (submitOperate) {
      submitOperate();
    }
  };

  render() {
    const {
      match: { url: parentUrl = '' },
    } = this.props;
    console.log('urlurlurl', parentUrl, this.props);
    return (
      <Fragment>
        <Switch>
          <Route
            exact
            path={`${parentUrl}/ZipFilePage/:params`}
            render={props => (
              <ZipFileModel
                {...props}
                submitOperate={this.submitOperate}
                closeDialog={this.closeDialog}
              />
            )}
          />
          <Route
            exact
            path={`${parentUrl}/SaveProject/:params`}
            render={props => (
              <NewProjectModelV2
                {...props}
                submitOperate={this.submitOperate}
                closeDialog={this.closeDialog}
              />
            )}
          />
          <Route
            exact
            path={`${parentUrl}/CapitalBudgetExportPage`}
            render={props => (
              <CapitalBudgetExport
                {...props}
                submitOperate={this.submitOperate}
                closeDialog={this.closeDialog}
              />
            )}
          />
          <Route
            exact
            path={`${parentUrl}/AnnexExport`}
            render={props => (
              <AnnexExport
                {...props}
                submitOperate={this.submitOperate}
                closeDialog={this.closeDialog}
              />
            )}
          />
        </Switch>
      </Fragment>
    );
  }
}

class SinglePageApp extends React.Component {
  state = {
    bridge: null,
    dialog: null,
  };

  componentDidMount = () => {
    this.connect();
  };

  connect = () => {
    const bridge = new Bridge(window.parent);
    bridge.onReady(() => {
      bridge.on(events.SESSION_TIME_OUT, () => {
        window.location.href = '/#/login';
      });
      this.setState(
        {
          bridge: bridge,
        },
        () => {
          this.getActiveDialog();
        },
      );
    });
  };

  close = () => {
    this.state.bridge.close();
    this.setState({
      bridge: null,
    });
  };

  closeDialog = () => {
    const { dialog = null } = this.state;
    if (dialog) {
      dialog.close();
    }
  };

  submitOperate = () => {
    const { dialog = null } = this.state;
    if (dialog) {
      dialog.operateCallback({
        callback: {
          closeFlag: true,
          reload: true,
        },
        message: '操作成功',
        success: true,
      });
    }
  };

  getActiveDialog = async () => {
    const { bridge = null } = this.state;
    if (bridge) {
      const dialog = await bridge.getActiveDialog();
      this.setState({
        dialog: dialog,
      });
    }
  };

  operateCallback = () => {
    const { dialog = null } = this.state;
    if (dialog) {
      dialog.operateCallback({
        callback: {
          closeFlag: true,
          reload: true,
        },
      });
    }
  };

  render() {
    return (
      <Fragment>
        <SinglePage
          {...this.props}
          closeDialog={this.closeDialog}
          submitOperate={this.submitOperate}
        />
      </Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(SinglePageApp);
