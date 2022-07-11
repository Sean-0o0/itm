import React from 'react';
import { Row, Icon, Button, Col, message, Modal } from 'antd';
import G6 from '@antv/g6';

const tomcat = require('./Icon/tomcat.png');
const nginx = require('./Icon/nginx.png');
const redis = require('./Icon/redis.png');
const zookeeper = require('./Icon/zookeeper.png');
const combo = require('../Canvas/Icon/combo.jpg');
const no = require('../Canvas/Icon/no.jpg');

const imgObj = { tomcat, nginx, redis, zookeeper, combo, no };

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.node = ''; // 选中的节点
    this.nodeType = ''; // 添加节点模式时选择的类型
    this.graph = null; // g6实例

    this.state = {
      data: {
        // nodes: [
        //   // { id: '1-1', label: '1111', x: 350, y: 200, type: 'tomcat' },
        // ],
        // edges: [
        //   // { source: 'combo1', target: 'node3' }
        // ],
        // combos: [
        //   // { id: '4-0', label: 'Combo 1', type: 'circle', x: 100, y: 100 },
        // ]
"nodes":[{"id":"1-1","label":"1","ip":"1","type":"nginx","x":-24.034928721635623,"y":20.760571700848317,"panels":[{"title":"成功率","value":"11%"},{"title":"耗时","value":"111"},{"title":"耗时","value":"111"}],"style":{}},{"id":"1-2","label":"3","ip":"3","type":"tomcat","x":282.50015741250695,"y":61.99638841060974,"panels":[{"title":"成功率","value":"11%"},{"title":"耗时","value":"111"},{"title":"耗时","value":"111"}],"style":{},"comboId":"4-0","depth":1},{"id":"1-3","label":"2","ip":"2","type":"tomcat","x":283.50015741250695,"y":-11.00361158939026,"panels":[{"title":"成功率","value":"11%"},{"title":"耗时","value":"111"},{"title":"耗时","value":"111"}],"style":{},"comboId":"4-0","depth":1},{"id":"1-4","label":"5","ip":"5","type":"redis","x":623.96880132913,"y":61.00632609777385,"panels":[{"title":"成功率","value":"11%"},{"title":"耗时","value":"111"},{"title":"耗时","value":"111"}],"style":{},"comboId":"4-1","depth":1},{"id":"1-5","label":"4","ip":"4","type":"redis","x":621.96880132913,"y":-13.99367390222615,"panels":[{"title":"成功率","value":"11%"},{"title":"耗时","value":"111"},{"title":"耗时","value":"111"}],"style":{},"comboId":"4-1","depth":1}],"edges":[{"id":"2-0","source":"1-1","target":"4-0","type":"line-dash","style":{"stroke":"#1890ff","endArrow":true,"radius":10, lineWidth:2},"labelCfg":{"position":"middle","refY":-6,"refX":0,"autoRotate":true},"isComboEdge":true,"startPoint":{"x":176.46507127836438,"y":50.76057170084832,"index":3,"anchorIndex":3,"id":"176.46507127836438-50.76057170084832"},"endPoint":{"x":262.00015741250695,"y":50.49638841060974,"index":0,"anchorIndex":0,"id":"262.00015741250695-50.49638841060974"},"curveOffset":[-20,20],"curvePosition":[0.5,0.5]},{"id":"2-1","source":"4-0","target":"4-1","label":"X","type":"no-connect","style":{"stroke":"#1890ff","endArrow":true,"radius":10},"labelCfg":{"position":"middle","refY":-2,"refX":0,"autoRotate":true,"style":{"fill":"red","fontSize":20}},"isComboEdge":true,"startPoint":{"x":504.00015741250695,"y":50.49638841060974,"index":3,"anchorIndex":3},"endPoint":{"x":601.46880132913,"y":48.50632609777386,"index":0,"anchorIndex":0},"curveOffset":[-20,20],"curvePosition":[0.5,0.5]}],"combos":[{"id":"4-0","label":"群组1","ip":"群组1","type":"rect","x":383.00015741250695,"y":55.49638841060974,"panels":[{"title":"內存","value":"11%"},{"title":"CPU","value":"111"}],"depth":0,"size":[200,150],"style":{"lineWidth":1,"fill":"#fff","radius":10,"r":121.2023102090055,"width":202,"height":134},"anchorPoints":[[0,0.5],[0.5,0],[0.5,1],[1,0.5]],"labelCfg":{"refY":10,"position":"top","style":{"fontSize":12}},"children":[{"id":"1-2","comboId":"4-0","itemType":"node","depth":1},{"id":"1-3","comboId":"4-0","itemType":"node","depth":1}]},{"id":"4-1","label":"群组2","ip":"群组2","type":"rect","x":722.96880132913,"y":53.50632609777385,"panels":[{"title":"內存","value":"11%"},{"title":"CPU","value":"111"}],"depth":0,"size":[200,150],"style":{"lineWidth":1,"fill":"#fff","radius":10,"r":122.1730330310253,"width":203,"height":136},"anchorPoints":[[0,0.5],[0.5,0],[0.5,1],[1,0.5]],"labelCfg":{"refY":10,"position":"top","style":{"fontSize":12}},"children":[{"id":"1-4","comboId":"4-1","itemType":"node","depth":1},{"id":"1-5","comboId":"4-1","itemType":"node","depth":1}]}],"groups":[]
      }
    }
  }

  componentDidMount() {
    G6.registerNode('tomcat', this.getNodeConfig('tomcat', this));
    G6.registerNode('nginx', this.getNodeConfig('nginx', this));
    G6.registerNode('redis', this.getNodeConfig('redis', this));
    // 封装点击添加节点的交互
    G6.registerBehavior('click-add-node', this.getBehaviorConfig(this));
    G6.registerBehavior('click-add-combo', this.getBehaviorConfigOfCombo(this));
    G6.registerBehavior('click-add-edge', this.getBehaviorConfigOfEdge(this));
    this.registLineDashEdge();
    this.registNoConnectEdge();
    this.initCanvas();
  }

  // 定义线(不通状态下)
  registNoConnectEdge = () => {
    G6.registerEdge(
      'no-connect', {
        draw(cfg, group) {
          const { endPoint, startPoint } = cfg;
          const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;
          const shape = group.addShape('path', {
            attrs: {
              fill: 'red',
              stroke,
              path: [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x, endPoint.y],
              ],
              endArrow: true,
              lineWidth:2,
            },
            name: 'path-shape',
          });
          group.addShape('image', {
            attrs: {
              x: (endPoint.x + startPoint.x)/2 - 12.5,
              y: (endPoint.y + startPoint.y)/2 - 12.5,
              width: 25,
              height: 25,
              img: imgObj['no'],
            },
            name: 'image-shape',
          });
          return shape;
        }
      },
      // 'cubic', // extend the built-in edge 'cubic'
    );
  }

  // 定义线(连通状态下)
  registLineDashEdge = () => {
    const lineDash = [4, 2, 1, 2];
    G6.registerEdge(
      'line-dash',
      {
        afterDraw(cfg, group) {
          // get the first shape in the group, it is the edge's path here=
          const shape = group.get('children')[0];
          let index = 0;
          const startPoint = shape.getPoint(0);
          // add red circle shape
          const circle = group.addShape('circle', {
            attrs: {
              x: startPoint.x,
              y: startPoint.y,
              fill: '#1890ff',
              r: 3,
            },
            name: 'circle-shape',
          });

          circle.animate(
            ratio => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              // get the position on the edge according to the ratio
              const tmpPoint = shape.getPoint(ratio);
              // returns the modified configurations here, x and y here
              return {
                x: tmpPoint.x,
                y: tmpPoint.y,
              };
            },
            {
              repeat: true, // Whether executes the animation repeatly
              duration: 3000, // the duration for executing once
            },
          );

          // Define the animation
          shape.animate(
            () => {
              index++;
              if (index > 9) {
                index = 0;
              }
              const res = {
                lineDash,
                lineDashOffset: -index,
              };
              // returns the modified configurations here, lineDash and lineDashOffset here
              return res;
            },
            {
              repeat: true, // whether executes the animation repeatly
              duration: 3000, // the duration for executing once
            },
          );
        },
      },
      'line', // extend the built-in edge 'cubic'
    );
  }

  getBehaviorConfigOfCombo = (_this) => ({
    // 设定该自定义行为需要监听的事件及其响应函数
    getEvents() {
     // 监听的事件为 canvas:click，响应函数是 onClick
     return {
       'canvas:click': 'onClick',
     };
   },
   // 点击事件
   onClick(ev) {
     const id = _this.getId('combo');
      const model = {
        id,
        label: '群组',
        // type: 'circle',
        ip: '--',
        type: 'rect',
        x: ev.x,
        y: ev.y,
        panels: [
          { title: '內存', value: '11%' },
          { title: 'CPU', value: '111' },
        ],
      };
       _this.graph.addItem('combo', model); // 添加节点
       const nodeItem = _this.graph.findById(id);
        // 添加节点后 默认选中节点,并设置模式为编辑模式
        _this.graph.setItemState(nodeItem, 'selected', true);
        _this.node = nodeItem;
        setTimeout(() => {
          _this.graph.setMode('default');
          _this.props.changeMode('default');
          _this.setState({
            mode: 'default',
          });
          _this.props.handleChangeNode(model);
          // 清空组件库选中状态
          _this.props.handleChangeComponent(0);
        }, 50);
    }
  })

  /**
   * 除开始和结束外的自定义节点
   * @param type 节点类型 /开始/结束/用户分组/等待  等
   * @returns {{draw(*, *): *, getAnchorPoints(): number[][], afterDraw: afterDraw}}
   */
  getNodeConfig = (type, _this) => ({
    // eslint-disable-next-line no-shadow
    draw(cfg, group) {
      const color = cfg.error ? '#F4664A' : '#30BF78'
      const r = 2;
      // 添加content部分框
      const shape = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width: 200,
          height: 60,
          stroke: color,
          fill: '#fff',
          radius: r
        },
        name: 'main-box',
        draggable: true,
      });
      // 添加title框
      group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width: 200,
          height: 20,
          fill: color,
          radius: [r, r, 0, 0],
        },
        name: 'title-box',
        draggable: true,
      });

      // 添加title的logo图片
      group.addShape('image', {
        attrs: {
          x: 4,
          y: 2,
          height: 16,
          width: 16,
          cursor: 'pointer',
          img: imgObj[type],
        },
        name: 'node-icon',
      });

      // 添加title
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: 4,
          x: 24,
          lineHeight: 20,
          text: cfg.label,
          fill: '#fff',
        },
        name: 'title'
      });

       // content区域值
       if (cfg.panels && cfg.panels.length > 0) {
        cfg.panels.forEach((item, index) => {
          // name text
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              y: 25,
              x: 24 + index * 60,
              lineHeight: 20,
              text: item.title,
              fill: '#666',
            },
            name: `index-title-${index}`
          });
          // value text
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              y: 42,
              x: 24 + index * 60,
              lineHeight: 20,
              text: item.value,
              fill: '#666',
            },
            name: `index-title-${index}`
          });
        });
       }
      return shape;
    },
    /**
     *先与节点相交的位置
      */
    getAnchorPoints() {
      return [
        [0, 0.5],
        [0.5, 0],
        [0.5, 1],
        [1, 0.5],
      ];
    },
  });

  initCanvas = () => {
    if (!this.graph) {
      const width = document.getElementById('modeNode').offsetWidth;
      // const grid = new G6.Grid();
      const heightOfWin = window.innerHeight; // 窗口高度
      this.graph = new G6.Graph({
        container: 'modeNode',
        height: heightOfWin - 180,
        width,
        defaultCombo: {
          type: 'rect',
          size: [200, 150], // Combo 的最小大小
          style: {
            lineWidth: 1,
            fill: '#fff',
            radius:10,
          },
          anchorPoints: [[0, 0.5], [0.5, 0], [0.5, 1], [1, 0.5]],
          labelCfg: {
            refY: 10,
            position: 'top',
            style: {
              fontSize: 12,
            }
          },
        },
        modes: {
          default: [ // 默认模式可编辑
            {
              type: 'drag-node',
              enableDelegate: true,
            },
            'zoom-canvas',
            'drag-canvas',
            'drag-combo',
            'collapse-expand-combo'
          ],
          addCombo: [
            {
              type: 'drag-combo',
              enableDelegate: true,
            },
            'drag-combo',
            'click-add-combo',
          ],
          addEdge: [
            {
              type: 'drag-node',
              enableDelegate: true,
            },
            'drag-combo',
          ],
          delete: [
            {
              type: 'drag-node',
              enableDelegate: true,
            },
          ],
          addNode: [
            {
              type: 'drag-node',
              enableDelegate: true,
            },
            'drag-combo',
            'click-add-node',
          ],
        },
      });
    }
    this.graph.on('combo:click', (e) => {
      const currentMode = this.graph.getCurrentMode();
      const nodeItem = e.item;
      const model = nodeItem.getModel();
      if (currentMode === 'default') {
        // 先清除所有的选中状态
        this.clearAllSelectedState();
        this.graph.setItemState(nodeItem, 'selected', true);
        this.node = nodeItem;
        this.props.handleChangeNode(model);
        return false;
      }
      if (currentMode === 'addNode') { // 不能选择节点
        message.error('请点击空白位置!');
        return false;
      }
      if (currentMode === 'addEdge') {
        const nodeSelecteded = this.graph.findAllByState('node', 'selected');
        const comboSelected = this.graph.findAllByState('combo', 'selected');
        if (nodeSelecteded.length === 0 && comboSelected.length === 0) { // 如果没有选择过任何Node/Combo
          this.graph.setItemState(nodeItem, 'selected', true);
          this.node = nodeItem; // 存储第一个节点信息
        } else if (comboSelected.length === 1 || nodeSelecteded.length === 1) { // 已经选择了一个 选中第二个时 加线
          if (comboSelected.length === 1 && this.node._cfg.id === nodeItem._cfg.id) { // 如果两次选择相同 就取消第一次选中的
            this.graph.setItemState(this.node, 'selected', false);
            this.node = '';
            return false;
          }
          const source = this.node.getModel();
          const target = nodeItem.getModel();
          this.addEdge(source, target);
          this.graph.setItemState(this.node, 'selected', false);
          this.node = '';
          return false;
        }
      }
      if (currentMode === 'delete') { // 删除combo
        this.graph.removeItem(nodeItem);
        return false;
      }
    })
    this.graph.on('node:click', (e) => {
      const currentMode = this.graph.getCurrentMode();
      const nodeItem = e.item;
      const model = nodeItem.getModel();
      if (currentMode === 'default') {
        // 先清除所有的选中状态
        this.clearAllSelectedState();
        this.graph.setItemState(nodeItem, 'selected', true);
        this.node = nodeItem;
        this.props.handleChangeNode(model);
        return false;
      }
      if (currentMode === 'addNode') { // 不能选择节点
        message.error('请点击空白位置!');
        return false;
      }
      if (currentMode === 'addEdge') { // 选择两个节点添加连线
        const nodeSelecteded = this.graph.findAllByState('node', 'selected');
        const comboSelected = this.graph.findAllByState('combo', 'selected');
        if (nodeSelecteded.length === 0 && comboSelected.length === 0) { // 选择第一个时
          this.graph.setItemState(nodeItem, 'selected', true);
          this.node = nodeItem; // 存储第一个节点信息
        } else if (comboSelected.length === 1 || nodeSelecteded.length === 1) { // 已经选择了一个 选中第二个时 加线
          if (nodeSelecteded.length === 1 && this.node._cfg.id === nodeItem._cfg.id) { // 如果两次选择相同 就取消第一次选中的
            this.graph.setItemState(this.node, 'selected', false);
            this.node = '';
            return false;
          }
          const source = this.node.getModel();
          const target = nodeItem.getModel();
          this.addEdge(source, target);
          this.graph.setItemState(this.node, 'selected', false);
          this.node = '';
          return false;
        }
      }
      if (currentMode === 'delete') { // 不能选择节点
        this.graph.removeItem(nodeItem);
        return false;
      }
    });
    this.graph.data(this.state.data);
    this.graph.render();
    this.graph.setMode('default');
  }

  /**
   * 自定义点击添加node行为的配置
   */
  getBehaviorConfig = _this => ({
    // 设定该自定义行为需要监听的事件及其响应函数
    getEvents() {
    // 监听的事件为 canvas:click，响应函数是 onClick
      return {
        'canvas:click': 'onClick',
      };
    },
    // 点击画布添加节点(node/group/judge/combo)事件
    onClick(ev) {
      if (_this.nodeType === 'group' || _this.nodeType === 'judge') {
        message.info('请点击要分组或分支的节点!');
      } else {
        const id = _this.getId('node');
        const model = {
          id,
          label: '--',
          ip: '--',
          type: _this.nodeType,
          x: ev.x,
          y: ev.y,
          panels: [
            { title: '成功率', value: '11%' },
            { title: '耗时', value: '111' },
            { title: '耗时', value: '111' },
          ],
        };
        _this.graph.addItem('node', model); // 添加节点
        const nodeItem = _this.graph.findById(id);
        // 添加节点后 默认选中节点,并设置模式为编辑模式
        _this.graph.setItemState(nodeItem, 'selected', true);
        _this.node = nodeItem;
        setTimeout(() => {
          _this.graph.setMode('default');
          _this.props.changeMode('default');
          _this.setState({
            mode: 'default',
          });
          _this.props.handleChangeNode(model);
          // 清空组件库选中状态
          _this.props.handleChangeComponent(0);
        }, 50);
      }
    },
  })

  getBehaviorConfigOfEdge = _this => ({
    getEvents() {
      return {
        'node:click': 'onClick', // The event is canvas:click, the responsing function is onClick
        mousemove: 'onMousemove', // The event is mousemove, the responsing function is onMousemove
        'edge:click': 'onEdgeClick', // The event is edge:click, the responsing function is onEdgeClick
      };
    },
    // The responsing function for node:click defined in getEvents
    onClick(ev) {
      const self = this;
      const node = ev.item;
      const graph = self.graph;
      // The position where the mouse clicks
      // const point = { x: ev.x, y: ev.y };
      const model = node.getModel();
      if (self.addingEdge && self.edge) {
        graph.updateItem(self.edge, {
          target: model.id,
        });
        self.edge = null;
        self.addingEdge = false;
      } else {
        // Add anew edge, the end node is the current node user clicks
        self.edge = graph.addItem('edge', {
          source: model.id,
          target: model.id,
        });
        self.addingEdge = true;
      }
    },
    // The responsing function for mousemove defined in getEvents
    onMousemove(ev) {
      const self = this;
      // The current position the mouse clicks
      const point = { x: ev.x, y: ev.y };
      if (self.addingEdge && self.edge) {
        // Update the end node to the current node the mouse clicks
        self.graph.updateItem(self.edge, {
          target: point,
        });
      }
    },
    // The responsing function for edge:click defined in getEvents
    onEdgeClick(ev) {
      const self = this;
      const currentEdge = ev.item;
      if (self.addingEdge && self.edge === currentEdge) {
        self.graph.removeItem(self.edge);
        self.edge = null;
        self.addingEdge = false;
      }
    },
   })

  /**
   * 加线
   * @param sourceModel 起点Model
   * @param targetModel 终点Model
   */
  addEdge = (sourceModel, targetModel) => {
    const source = sourceModel.id;
    const target = targetModel.id;
    const newModel = {
      id: this.getId('edge'),
      source,
      target,
      type: 'line',
      style: {
        stroke: '#1890ff',
        endArrow: true,
        radius: 10,
        lineWidth:2,
      },
      labelCfg: {
        position: 'middle',
        refY: -2,
        refX: 0,
        autoRotate: true,
        style: { fill: 'red', fontSize: 20 }
      }
    };
    this.graph.addItem('edge', newModel);
  }

  // 进入加线模式
  beginAddEdge = () => {
    this.graph.setMode('addEdge');
    this.clearAllSelectedState();
    this.props.changeMode('addEdge');
  }

  // 进入删除模式
  beginDelete = () => {
    this.graph.setMode('delete');
    this.clearAllSelectedState();
    this.props.changeMode('delete');
  }

  // 进入添加combo模式
  beginAddCombo = () => {
    this.graph.setMode('addCombo');
    this.clearAllSelectedState();
    this.props.changeMode('addCombo');
  }

  // 进入编辑模式
  beginEdit = () => {
    this.graph.setMode('default');
    this.clearAllSelectedState();
    this.props.changeMode('default');
  }

  /**
   * 添加点击组件库进入添加节点
   * @param type // 节点类型
   */
  addNode = (type) => {
    this.nodeType = type;
    // 点击组件库强制进入添加节点模式
    this.graph.setMode('addNode');
    this.clearAllSelectedState();
    this.setState({
      mode: 'addNode',
    });
    // this.props.changeMode('addNode');
  }

  /**
   * 计算新节点或者线的id
   * @param type node/edge/group/combo
   * @description 根据该类型下x-y中的y的最大值往后+1
   */
  getId = (type) => {
    const data = this.graph.save();
    const { edges = [], nodes = [], groups = [], combos = [] } = data;
    let id = '';
    let idSuffix = '999';
    if (type === 'node') {
      if (nodes.length === 0) {
        id = '1-0';
      } else {
        const idArr = nodes.map((item) => { return item.id; });
        const idSuffixArr = [];
        idArr.forEach((element) => {
          idSuffixArr.push(Number(element.split('-')[1]));
        });
        idSuffix = Math.max(...idSuffixArr) + 1;
        id = `1-${idSuffix}`;
      }
    } else if (type === 'edge') {
      if (edges.length === 0) {
        // 如果是第一条线
        id = '2-0';
      } else {
        const idArr = edges.map((item) => { return item.id; });
        const idSuffixArr = [];
        idArr.forEach((element) => {
          idSuffixArr.push(Number(element.split('-')[1]));
        });
        idSuffix = Math.max(...idSuffixArr) + 1;
        id = `2-${idSuffix}`;
      }
    } else if (type === 'group') {
      if (groups.length === 0) {
        // 如果是第一个群组
        id = '3-0';
      } else {
        const idArr = groups.map((item) => { return item.id; });
        const idSuffixArr = [];
        idArr.forEach((element) => {
          idSuffixArr.push(Number(element.split('-')[1]));
        });
        idSuffix = Math.max(...idSuffixArr) + 1;
        id = `3-${idSuffix}`;
      }
    } else if (type === 'combo') {
      if (combos.length === 0) {
        // 如果是第一个群组
        id = '4-0';
      } else {
        const idArr = combos.map((item) => { return item.id; });
        const idSuffixArr = [];
        idArr.forEach((element) => {
          idSuffixArr.push(Number(element.split('-')[1]));
        });
        idSuffix = Math.max(...idSuffixArr) + 1;
        id = `4-${idSuffix}`;
      }
    }
    return id;
  }

  /**
   * 更新节点name
   * @param node
   */
  updateNodeLabel = (node) => {
    const { id = '' } = node;
    if (id) {
      // 通过 ID 查询节点实例
      const item = this.graph.findById(id);
      // const model = item.getModel();
      const newModel = {
        ...node,
      };
      this.graph.updateItem(item, newModel);
      item.clearCache();
    }
  }

  // 清楚所有(node/edge/combo)选中状态
  clearAllSelectedState = () => {
    const nodesOfSelected = this.graph.findAllByState('node', 'selected');
    nodesOfSelected.forEach((item) => {
      item.setState('selected', false);
    });
    const edgesOfSelected = this.graph.findAllByState('edge', 'selected');
    edgesOfSelected.forEach((item) => {
      item.setState('selected', false);
    });
    const combosSelected = this.graph.findAllByState('combo', 'selected');
    combosSelected.forEach((item) => {
      item.setState('selected', false);
    });
    this.node = '';
  }
  // 刷新画布
  handleRefresh = () => {
    const data = this.graph.save();
    this.graph.changeData(data);
  }

  // 保存数据
  handleSave = () => {
    const sourceData = this.graph.save();
    const { basicInfo = {} } = this.props;
    console.info('活动基础信息:', basicInfo);
    console.info('画布元素信息:', JSON.stringify(sourceData));
  }

  // 切回默认模式
  handleEdit = () => {
    this.graph.setMode('default');
  }

  // 重置画布
  handleReset = () => {
    const _this = this;
    Modal.confirm({
      title: '重置',
      content: '是否清除改动回到初始状态?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { data = [] } = _this.state;
        _this.clearAllSelectedState();
        _this.graph.clear();
        _this.graph.read(data);
        // _this.graph.changeData(data);
      },
      onCancel() {
        return false;
      },
    });
  }

  render() {
    return (
      <React.Fragment>
        <Row style={{ background: '#fff' }}>
          <Col span={24} style={{ textAlign: 'right' }} >
            {/* <Button title='默认' onClick={this.handleEdit}><Icon type="edit" /></Button>
            <Button title="刷新" onClick={this.handleRefresh}><Icon type="redo" /></Button> */}
            <Button title="保存" onClick={this.handleSave}><Icon type="save" /></Button>
            <Button title="重置" onClick={this.handleReset}><Icon type="close" /></Button>
          </Col>
        </Row>
        <div id="modeNode" />
      </React.Fragment>
    );
  }
}
export default Canvas;
