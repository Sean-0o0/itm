import React, { useEffect, useCallback, Fragment } from 'react';
import { Divider, Empty, Popover, Tooltip } from 'antd';
import styles from './styles.less';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';

export default function LeftPrjList(props) {
  const {
    list = [],
    fromSituationPage = false,
    height = '',
    handlePrjItemClick = () => {},
    curPrjID = -1,
    routes = [],
  } = props;
  useEffect(() => {
    return () => {};
  }, []);
  //获取评分状态色
  const getTagBgColor = useCallback((tagTxt = '') => {
    if (tagTxt === '未全部打分') return '#F9A812';
    else if (tagTxt === '打分完成') return '#46CB9F';
    else return '#C0C4CC';
  }, []);

  //获取项目标签
  const getTags = (text = '', idtxt = '') => {
    //获取项目标签数据
    const getTagData = (tag, idtxt) => {
      let arr = [];
      let arr2 = [];
      if (
        tag !== '' &&
        tag !== null &&
        tag !== undefined &&
        idtxt !== '' &&
        idtxt !== null &&
        idtxt !== undefined
      ) {
        if (tag.includes(',')) {
          arr = tag.split(',');
          arr2 = idtxt.split(',');
        } else {
          arr.push(tag);
          arr2.push(idtxt);
        }
      }
      let arr3 = arr.map((x, i) => {
        return {
          name: x,
          id: arr2[i],
        };
      });
      return arr3;
    };
    return (
      <div className={styles.itemMiddle}>
        {getTagData(text, idtxt).length !== 0 && (
          <>
            {getTagData(text, idtxt)
              ?.slice(0, 4)
              .map((x, i) => (
                <Link
                  to={{
                    pathname:
                      '/pms/manage/labelDetail/' +
                      EncryptBase64(
                        JSON.stringify({
                          bqid: x.id,
                        }),
                      ),
                    state: { routes },
                  }}
                  key={x.id}
                  style={{ color: '#3361ff' }}
                  className={styles.tagItem}
                >
                  {x.name}
                </Link>
              ))}
            {getTagData(text, idtxt)?.length > 4 && (
              <Popover
                overlayClassName="tag-more-popover"
                content={
                  <div className="tag-more">
                    {getTagData(text, idtxt)
                      ?.slice(4)
                      .map((x, i) => (
                        <div className='tag-item' key={x.id}>
                          <Link
                            to={{
                              pathname:
                                '/pms/manage/labelDetail/' +
                                EncryptBase64(
                                  JSON.stringify({
                                    bqid: x.id,
                                  }),
                                ),
                              state: { routes },
                            }}
                            key={x.id}
                            style={{ color: '#3361ff' }}
                          >
                            {x.name}
                          </Link>
                        </div>
                      ))}
                  </div>
                }
                title={null}
              >
                <div className={styles.tagItem} key="...">
                  ...
                </div>
              </Popover>
            )}
          </>
        )}
      </div>
    );
  };
  return (
    <div className={styles.prjListBox} style={{ height }}>
      {list.map(x => (
        <div
          className={styles.prjItem}
          key={x.XMID}
          onClick={() =>
            fromSituationPage
              ? handlePrjItemClick(x.XMID, x.XMMC, x.XMJD, x.PJF, x.DQLCB)
              : handlePrjItemClick(x.XMID, x.XMMC, x.DFZT === '打分完成', x.KQPJ === '1')
          }
          style={curPrjID === x.XMID ? { backgroundColor: '#3361ff1a' } : {}}
        >
          <div className={styles.itemTop}>
            <div className={styles.itemName}>
              <Tooltip title={x.XMMC} placement="topLeft">
                {x.XMMC}
              </Tooltip>
            </div>
            <div className={styles.statusTag} style={{ backgroundColor: getTagBgColor(x.DFZT) }}>
              {x.DFZT}
            </div>
          </div>
          <div className="item-middle">{getTags(x.BQ, x.BQID)}</div>
          <div className={styles.itemBottom}>
            {fromSituationPage && (
              <Fragment>
                <span className={styles.grayTxtItem}>年份：{x.XMNF}</span>
                <Divider type="vertical" style={{ color: '#909399' }} />
              </Fragment>
            )}
            <span className={styles.grayTxtItem}>项目经理：{x.XMJL}</span>
            {fromSituationPage && (
              <Fragment>
                <Divider type="vertical" style={{ color: '#909399' }} />
                <span className={styles.grayTxtItem}>进度：{x.XMJD + '%'}</span>
              </Fragment>
            )}
          </div>
        </div>
      ))}
      {list.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
    </div>
  );
}
