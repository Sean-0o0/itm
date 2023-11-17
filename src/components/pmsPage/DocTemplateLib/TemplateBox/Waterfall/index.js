import { Empty } from 'antd';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';

/**根据父节点的ref和子元素的列数等数据，计算出子元素的宽度。用于响应式布局
 * @param fatherRef 父节点的ref
 * @param marginX 子元素的水平间距
 * @param actualColNum 一行个数 （一行有几列）
 * @param callback 根据浏览器宽度自动计算大小后的回调函数，参数是计算好的子元素宽度
 * @returns 返回子元素宽度的响应式数据
 */
const useColNum = listLength => {
  const [colNum, setColNum] = useState(4);
  const [itemWidth, setItemWidth] = useState('24%');
  let timer = null;

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
    };
  }, []);

  // 防抖
  const debounce = (fn, waits = 500) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };

  //屏幕宽度变化触发
  const resizeUpdate = e => {
    const fn = () => {
      let w = e.target.innerWidth; //屏幕宽度
      if (w < 1742) {
        setColNum(4);
        setItemWidth('24%');
      } else if (w < 2044) {
        setColNum(5);
        setItemWidth('19.1434%');
      } else if (w < 2346) {
        setColNum(6);
        setItemWidth('15.9245%');
      } else if (w < 2648) {
        setColNum(7);
        setItemWidth('13.6325%');
      } else if (w < 2950) {
        setColNum(8);
        setItemWidth('11.917%');
      } else if (w < 3252) {
        setColNum(9);
        setItemWidth('10.585%');
      } else {
        setColNum(10);
        setItemWidth('9.5209%');
      }
    };
    debounce(fn, 300);
  };
  return { colNum, itemWidth, actualColNum: listLength > colNum ? colNum : listLength };
};

/**展示瀑布流的组件  */
export default function Waterfall(props) {
  const { marginX = 30, list = [], itemRender } = props;
  /**瀑布流最外层的ref */
  const listRef = useRef(null);
  /**每一列的ref。是个数组 */
  const colRef = useRef([]);
  /**瀑布流每个模块的宽度。随着窗口大小变化而变化 */
  const { colNum, itemWidth, actualColNum } = useColNum(list.length);
  const [colList, setColList] = useState(Array.from({ length: actualColNum }, () => new Array())); //要展示的列表，二维数组

  /**把获取到的列表，按照规律放入二维数组中。 注，需要监听list的变化，再做这个函数，否则无法获取到最新的colList */
  const listToColList = (list, actualColNum) => {
    if (list.length > 0) {
      let finalArr = [];
      let n = actualColNum;
      // 循环list的前n个元素，将每个元素的ID和WDMB.items存入finalArr中
      finalArr = list.slice(0, n).map(x => [x]);

      // 循环list的剩余元素，将每个元素的WDMB.items加入finalArr中已有的项中items.length最短的数组中
      for (let i = n; i < list.length; i++) {
        let minIndex = 0; // 定义最短数组的下标为0
        let arrH = finalArr.map(x =>
          x.reduce(
            (acc, cur) => (cur.WDMB?.items.length > 5 ? 6 : cur.WDMB?.items.length) + 1.4 + acc,
            0,
          ),
        );
        minIndex = arrH.indexOf(Math.min(...arrH));
        finalArr[minIndex].push(list[i]);
      }
      setColList(finalArr);
    }
  };

  //监听list的变化，变化了就执行插入二维数组函数
  useEffect(() => {
    listToColList(list, actualColNum);
  }, [list, actualColNum]);

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = (actualColNum, width, data = []) => {
    let arr = [];
    if (data.length < actualColNum) {
      for (let i = 0; i < actualColNum - data.length; i++) {
        arr.push('');
      }
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };
  if (list.length === 0)
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无模板信息" />;
  return (
    <div className="waterfall-box" ref={listRef}>
      {colList.map((list, listI) => {
        return (
          <div key={listI} ref={r => (colRef.current[listI] = r)} className="tplt-item-wrapper">
            {list.map((k, i) => {
              return itemRender(k, i);
            })}
          </div>
        );
      })}
      {getAfterItem(colNum, itemWidth, colList)}
    </div>
  );
}
