import React from 'react';
import { List, Avatar, Tag, Button, Row, Col, message, Input, Pagination, Spin } from 'antd';
import { FetchTokenAuth } from '../../../../../services/token';
import { AES } from '../../../../../utils/aes_utils';
import { APP_SECRET, CLIENTID } from '../../../../../utils/config';

class OtherUser extends React.Component {
  constructor(props) {
    super(props);
    const { userBasicInfo = {} } = props;
    const { loginName = '' } = userBasicInfo;
    this.state = {
      loginName,
    };
  }
  onClickListItem = (it) => {
    const { loginName = '' } = this.state;
    if (it.loginName !== loginName) {
      this.setState({ loginName: it.loginName });
    }
  }
  onClickOk = () => {
    const { loginName = '' } = this.state;
    const { userBasicInfo = {}, closeRoleModal } = this.props;
    const { loginName: defaultLoginName = '' } = userBasicInfo;
    if (loginName !== defaultLoginName) {
      const obj = { timestamp: new Date().getTime(), target: loginName };
      let objJson = '{}';
      try {
        objJson = JSON.stringify(obj);
      } catch (e) {
        // do not
      }
      AES.setSecret(APP_SECRET);
      const config = {
        headers: { 'X-Auth-Token': AES.encryptBase64(objJson) },
      };
      FetchTokenAuth({
        CLIENTID,
      }, config).then((result) => {
        const { code = -1 } = result;
        if (code) {
          closeRoleModal();
          window.location.href = '';
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else {
      closeRoleModal();
    }
  }

  // 查询按钮点击回调
  onClickSearchButton = () => {
    const { getOtherUsers } = this.props;
    if (getOtherUsers) {
      getOtherUsers({ userInfo: this.inputValue, current: this.current });
    }
  }

  // 翻页回调
  paginationOnchage = (page) => {
    const { getOtherUsers } = this.props;
    this.current = page;
    if (getOtherUsers) {
      getOtherUsers({ userInfo: this.inputValue, current: page });
    }
  }

  render() {
    const { otherusers = [], userBasicInfo = {}, closeRoleModal, total = 0, getOtherUserloading = false } = this.props;
    const { loginName: defaultLoginName = '' } = userBasicInfo;
    const { loginName = '' } = this.state;
    // let first = {};
    // otherusers.every((it) => {
    //   if (it.loginName === loginName) {
    //     first = { ...it };
    //     return false;
    //   }
    //   return true;
    // });
    // const arr = otherusers.filter((it) => {
    //   return it.loginName !== loginName;
    // });
    // const dataSource = [first, ...arr];
    return (
      <React.Fragment>
        <Row>
          <Col span={24} style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Input style={{ width: '50%', marginRight: '1rem' }} placeholder="帐号/姓名" onPressEnter={this.onClickSearchButton} onChange={(e) => { this.inputValue = e.target.value; }} />
            <Button className="m-btn-radius m-btn-headColor" onClick={this.onClickSearchButton} >查 询</Button>
          </Col>
        </Row>
        <Spin spinning={getOtherUserloading}>
          <Row>
            <Col>
              <List
                itemLayout="horizontal"
                style={{ padding: '1rem 0.833rem', height: '25rem', overflow: 'auto' }}
                dataSource={otherusers}
                renderItem={item => (
                  <List.Item
                    style={{ borderBottom: 'none', backgroundColor: `${item.loginName === loginName ? '#e6f7ff' : ''}` }}
                    // eslint-disable-next-line no-nested-ternary
                    actions={item.loginName === defaultLoginName ? [<Tag color="blue">当前用户</Tag>] : item.loginName === loginName ? [] : []}
                    onClick={() => {
                      return this.onClickListItem(item);
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar style={{ marginLeft: '1rem', backgroundColor: `${item.loginName === loginName ? '#1890ff' : ''}` }} size={60} >{item.userName.substr(0, 1)}</Avatar>}
                      title={<Row>
                        <Col span={8}>{`${item.loginName}/${item.userName}`}</Col>
                        <Col span={16}>{item.orgName || '--'}</Col>
                      </Row>}
                      description={
                        item.roleName.map((it, index) => {
                          return <Tag style={{ marginBottom: '0.2rem' }} color={`${item.loginName === loginName ? '#1890ff' : ''}`} key={index}>{it}</Tag>;
                        })
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Spin>
        <Row>
          <Col span={24} style={{ marginBottom: 10, textAlign: 'right' }}>
            <Pagination simple defaultCurrent={1} pageSize={5} total={total} onChange={this.paginationOnchage} style={{ marginRight: '1rem' }} />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: 10, textAlign: 'center' }}>
            <Button style={{ marginRight: 8 }} className="m-btn-radius m-btn-headColor" onClick={this.onClickOk} > {`${loginName !== defaultLoginName ? '确定切换' : '确定'}`} </Button>
            <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={closeRoleModal}> 关闭 </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default OtherUser;
