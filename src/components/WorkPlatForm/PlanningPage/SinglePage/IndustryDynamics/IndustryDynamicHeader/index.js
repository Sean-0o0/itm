import React from 'react';
import { Button, Input, message } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
import { FetchLivebosLink } from '../../../../../../services/amslb/user';
import LBFrameModal from '../../../../../Common/BasicModal/LBFrameModal';
import { FetchModNewsComment } from '../../../../../../services/planning/planning';
import { connect } from 'dva';
const { TextArea } = Input;

class IndustryDynamicHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      category: 0,
      keyword: '',
      addModalVisible: false,
      url: '',
      commentsVisible: false,
      inputValue: '',
      id: '',
    };
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }


  handleKeyChange = (e) => {
    this.setState({
      keyword: e.target.value,
    });
  };

  handleSearch = () => {
    const { callbackForHead } = this.props;
    const { keyword } = this.state;
    if (callbackForHead) {
      callbackForHead(keyword);
    }
  };

  fetchLBUrl = (e) => {
    FetchLivebosLink({
      method: 'Add',
      object: 'TASSESS_Industry_news',
    }).then((ret = {}) => {
      const { data = '' } = ret;
      if (data) {
        this.setState({
          url: data,
          addModalVisible: true,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  closeModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  submitAdd = (messageObj) => {
    const { refMethod } = this.props;
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.closeModal();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      //重新加载页面
      refMethod();
      // refMethod.FetchQueryIndustryNews();
      this.closeModal();
      message.success('新增成功');
    }
  };

  addComments = () => {
    this.setState({
      commentsVisible: true,
    })
  }

  submitComments = () => {
    const { inputValue, id } = this.state;
    const { refMethodComents } = this.props;
    FetchModNewsComment({
      notcId: 0,
      blogId: Number(id),
      comment: inputValue,
      playtyperk: '1',
    }).then(
      res => {
        const { records, code } = res;
        if (code > 0) {
          this.setState({
            datas: records,
          });
        }

      },
    ).finally(refMethodComents(id))
    this.callBackForModel();
  }

  callBackForModel = () => {
    this.setState({
      commentsVisible: false,
    })
  }

  handelChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  handelId = (id) => {
    // console.log("接受的id----4444",id)
    this.setState({
      id:id,
    })
  }


  render() {
    const { addModalVisible, url, commentsVisible } = this.state;

    const { authorities: { IndustryDynamics = [] } } = this.props;

    const modalProps = {
      style: { overflowY: 'auto', top: '20rem' },
      destroyOnClose: true,
      title: '评论',
      visible: commentsVisible,
      onCancel: this.callBackForModel,
      onOk: this.submitComments,
      callBackForModel: this.callBackForModel,
    };

    return (
      <div className='clearfix' style={{ display: 'flex' }}>
        <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500', padding: '0 2rem 0 2rem' }}
          className='fl header-dept'>关键字：
          <Input style={{ width: '14rem' }} placeholder='请输入关键字' onChange={value => this.handleKeyChange(value)}
            id='keyWord'>
          </Input>
        </div>
        <div>
          <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
            onClick={this.handleSearch}>查询</Button>&nbsp;&nbsp;
        </div>
        <div>
          {IndustryDynamics.includes('IndustryDynamicsAdd')
            &&
            <Button
              className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c' onClick={this.fetchLBUrl}>新增
            </Button>
          }
        </div>
        <div>
          {/* {IndustryDynamics.includes('IndustryDynamicsAdd')
          && */}
          &nbsp;&nbsp;<Button
            className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c' onClick={this.addComments}>评论
          </Button>
          {/* } */}
        </div>
        <LBFrameModal
          modalProps={{
            style: { top: '10rem' },
            destroyOnClose: true,
            title: '新增',
            width: '80rem',
            height: '57rem',
            visible: addModalVisible,
            onCancel: this.closeModal,
          }}
          frameProps={{
            width: '80rem',
            height: '52rem',
            src: `${localStorage.getItem('livebos') || ''}${url}`,
            onMessage: this.submitAdd,
          }}
        />

        <BasicModal {...modalProps} >
          <div style={{ padding: '2.5rem', width: '100%', display: 'flex' }}>
            <span style={{ width: '5rem' }}>评论:</span><TextArea
              onChange={this.handelChange.bind(this)}
              placeholder="请输入评论"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div>
        </BasicModal>
      </div>
    );
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(IndustryDynamicHeader);
