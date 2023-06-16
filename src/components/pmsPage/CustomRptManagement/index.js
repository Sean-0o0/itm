import React, { useEffect, useState, useRef } from 'react';
import { Button, Cascader, Checkbox, Icon, message, Radio } from 'antd';
import moment from 'moment';
import { QueryCustomQueryCriteria } from '../../../services/pmsServices/index';
import TreeUtils from '../../../utils/treeUtils';

export default function CustomRptManagement(props) {
  const {} = props;
  const [basicData, setBasicData] = useState({
    conditionGroup: [],
    columnFields: [],
  }); //条件基础数据
  const [popupVisible, setPopupVisible] = useState(false); //example
  useEffect(() => {
    getBasicData();
    return () => {};
  }, []);

  //
  const getBasicData = () => {
    QueryCustomQueryCriteria({
      queryType: 'SXTJ',
    })
      .then(res => {
        if (res?.success) {
          console.log(JSON.parse(res.result));
          // let data = TreeUtils.toTreeData(JSON.parse(res.result), {
          //   keyName: 'ID',
          //   pKeyName: 'FID',
          //   titleName: 'NAME',
          //   normalizeTitleName: 'label',
          //   normalizeKeyName: 'value',
          // })[0]?.children[0]?.children;
          let data = TreeUtils.toTreeData(JSON.parse(res.result), {//SXTJ
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'NAME',
            normalizeTitleName: 'label',
            normalizeKeyName: 'value',
          })[0]?.children;
          console.log('🚀 ~ file: index.js:32 ~ data ~ data:', data);
          // data.forEach(one => {
          //   one.children?.forEach(two => {
          //     two.label = <Checkbox>{two.label}</Checkbox>;
          //     two.children?.forEach(three => {
          //       three.label = <Radio>{three.label}</Radio>;
          //     });
          //   });
          // });
          setBasicData(p => ({ ...p, conditionGroup: data }));
        }
      })
      .catch(e => {
        message.error('接口信息获取失败', 1);
      });
  };

  return (
    <div className="custom-rpt-management-box">
      <Cascader
        options={basicData.conditionGroup}
        onChange={(value, selectedOptions) => {
          console.log(value, selectedOptions);
        }}
        // popupVisible={true}
        // onPopupVisibleChange={v => setPopupVisible(v)}
      >
        <Button type="dashed" icon={'plus-circle'}>
          添加组合条件
        </Button>
      </Cascader>
    </div>
  );
}
