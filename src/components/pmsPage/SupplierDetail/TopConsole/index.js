import { Breadcrumb, Button, message, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import InfoOprtModal from './InfoOprtModal';
const { Item } = Breadcrumb;
export default function TopConsole(props) {
  const { routes, detailData, GYSLX, getDetailData,splId } = props;
  const {
    splInfo = [],
    overviewInfo = [],
    contactInfo = [],
    prjPurchase = [],
    HROutsource = [],
    splEvaluation = [],
  } = detailData;
  const [visible, setVisible] = useState(false); //弹窗显示
  useEffect(() => {
    return () => {};
  }, []);
  //获取项目标签
  // const getTags = (text = '', idtxt = '') => {
  //   //获取项目标签数据
  //   const getTagData = (tag, idtxt) => {
  //     let arr = [];
  //     let arr2 = [];
  //     if (
  //       tag !== '' &&
  //       tag !== null &&
  //       tag !== undefined &&
  //       idtxt !== '' &&
  //       idtxt !== null &&
  //       idtxt !== undefined
  //     ) {
  //       if (tag.includes(',')) {
  //         arr = tag.split(',');
  //         arr2 = idtxt.split(',');
  //       } else {
  //         arr.push(tag);
  //         arr2.push(idtxt);
  //       }
  //     }
  //     let arr3 = arr.map((x, i) => {
  //       return {
  //         name: x,
  //         id: arr2[i],
  //       };
  //     });
  //     // console.log('🚀 ~ file: index.js ~ line 73 ~ arr3 ~ arr3 ', arr3, arr, arr2);
  //     return arr3;
  //   };
  //   return (
  //     <div className="prj-tags">
  //       {getTagData(text, idtxt).length !== 0 && (
  //         <>
  //           {getTagData(text, idtxt)
  //             ?.slice(0, 4)
  //             .map((x, i) => (
  //               <Link
  //                 to={{
  //                   pathname:
  //                     '/pms/manage/labelDetail/' +
  //                     EncryptBase64(
  //                       JSON.stringify({
  //                         bqid: x.id,
  //                       }),
  //                     ),
  //                   state: { routes },
  //                 }}
  //                 key={x.id}
  //                 className="tag-item"
  //               >
  //                 {x.name}
  //               </Link>
  //             ))}
  //           {getTagData(text, idtxt)?.length > 4 && (
  //             <Popover
  //               overlayClassName="tag-more-popover"
  //               content={
  //                 <div className="tag-more">
  //                   {getTagData(text, idtxt)
  //                     ?.slice(4)
  //                     .map((x, i) => (
  //                       <div className="tag-item">
  //                         <Link
  //                           to={{
  //                             pathname:
  //                               '/pms/manage/labelDetail/' +
  //                               EncryptBase64(
  //                                 JSON.stringify({
  //                                   bqid: x.id,
  //                                 }),
  //                               ),
  //                             state: { routes },
  //                           }}
  //                           key={x.id}
  //                           style={{ color: '#3361ff' }}
  //                         >
  //                           {x.name}
  //                         </Link>
  //                       </div>
  //                     ))}
  //                 </div>
  //               }
  //               title={null}
  //             >
  //               <div className="tag-item">...</div>
  //             </Popover>
  //           )}
  //         </>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div className="top-console-box">
      {visible && (
        <InfoOprtModal
          visible={visible}
          setVisible={setVisible}
          oprtType={'EDIT'}
          detailData={detailData}
          GYSLX={GYSLX}
          getDetailData={getDetailData}
          splId={splId}
        />
      )}
      <Breadcrumb separator=">">
        {routes?.map((item, index) => {
          const { name = item, pathname = '' } = item;
          const historyRoutes = routes.slice(0, index + 1);
          return (
            <Item key={index}>
              {index === routes.length - 1 ? (
                <>{name}</>
              ) : (
                <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>
              )}
            </Item>
          );
        })}
      </Breadcrumb>
      <div className="prj-info-row">
        {/* <div className="prj-name">{prjBasic?.XMMC}</div> */}
        <div className="tag-row">
          {/* {getTags(prjBasic.XMBQ, prjBasic.XMBQID)} */}
          {
            <Button className="btn-edit" onClick={() => setVisible(true)}>
              编辑
            </Button>
          }
        </div>
      </div>
    </div>
  );
}
