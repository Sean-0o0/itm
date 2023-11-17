import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Spin } from 'antd';
import moment from 'moment';
import { QueryDocTemplateLibrary, QueryUserRole } from '../../../services/pmsServices';
import TopConsole from './TopConsole';
import { connect } from 'dva';
import TemplateBox from './TemplateBox';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(function DocTemplateLib(props) {
  const { userBasicInfo = {} } = props;
  const [filterData, setFilterData] = useState({
    fileType: undefined, //文档类型
    fileName: undefined, //模板名称
  }); //筛选栏数据
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [tpltData, setTpltData] = useState([]); //模板数据
  const [isGLY, setIsGLY] = useState(false); //是否管理员

  useEffect(() => {
    getDocTplt({});
    return () => {};
  }, []);

  //获取文档模板列表
  const getDocTplt = ({ fileType, fileName }) => {
    setIsSpinning(true);
    QueryDocTemplateLibrary({
      fileType,
      fileName,
      paging: -1,
      current: 1,
      pageSize: 1,
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          setTpltData(
            JSON.parse(res.result).map(x => ({
              ...x,
              WDMB: JSON.parse(x.WDMB || '{}'),
              ISFOLD: true,
            })),
          );
          getUserRole();
        }
      })
      .catch(e => {
        console.error('🚀文档模板列表', e);
        message.error('文档模板列表获取失败', 1);
        setIsSpinning(false);
      });
  };

  //获取用户角色
  const getUserRole = () => {
    QueryUserRole({
      userId: userBasicInfo.id,
    })
      .then(res => {
        if (res?.code === 1) {
          const { testRole = '{}' } = res;
          setIsGLY(JSON.parse(testRole).ALLROLE?.includes('文档模板库管理员'));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
      });
  };

  return (
    <div className="doc-template-lib-box">
      <Spin spinning={isSpinning} tip="加载中" wrapperClassName="doc-template-lib-spin-wrapper">
        <TopConsole dataProps={{ filterData }} funcProps={{ setFilterData, getDocTplt }} />
        <TemplateBox
          tpltData={tpltData}
          getDocTplt={getDocTplt}
          setTpltData={setTpltData}
          isGLY={isGLY}
        />
      </Spin>
    </div>
  );
});
