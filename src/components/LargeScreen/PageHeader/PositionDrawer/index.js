import React from 'react';
import { Popover, Button, Select, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { AddBranSetting } from '../../../../services/largescreen';

class PageHeader extends React.Component {
    state = {
        visible: false,
        activeKey: []
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.dragger();
        })
    }

    handleChange = (event) => {
        const value = event.target.getAttribute('value');
        const name = event.target.innerHTML;
        const tags = document.querySelectorAll('.uncomplete-item');
        tags.forEach((item) => {
            item.classList.remove('uncomplete-item-selected');
        });
        event.target.classList.add('uncomplete-item-selected');
        this.setState({
            subId: value,
            activeKey: []
        })
    }

    callback = (key) => {
        const { activeKey = [] } = this.state;
        this.setState({
            activeKey: activeKey.length ? [] : ['1']
        })
    }

    saveConfig = () => {
        const { subId = '' } = this.props;
        const shows = document.getElementsByClassName("show") || [];
        let arr = "";
        for (let i = 0; i < shows.length; i++) {
            const show = shows[i];
            arr += `${show.getAttribute('value')},${i + 1};`;
        }
        AddBranSetting({
            bran: subId ? Number.parseInt(subId) : null,
            settings: arr
        })
            .then((ret = {}) => {
                const { code = 0, note = [] } = ret;
                if (code > 0) {
                    message.success(note);
                    const { fetchOrder } = this.props;
                    if (fetchOrder) {
                        fetchOrder(subId, 3);
                    }
                } else {
                    message.error(note);
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    }

    reset = () => {
        const { reset } = this.props;
        if (reset) {
            reset()
        }
    }

    dragger = () => {
        const list = document.getElementsByClassName('config-item') || [];
        let container = null;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            item.ondragstart = function () {
                event.stopPropagation();
                container = this;
            }
            item.ondragover = function () {
                event.preventDefault();
            }
            item.ondrop = function () {
                event.stopPropagation();
                if (container != null && container != this) {
                    let temp = document.createElement("div");
                    if (container.classList.contains("show") && this.classList.contains("show")) {
                        document.getElementById("show-box").replaceChild(temp, this);
                        document.getElementById("show-box").replaceChild(this, container);
                        document.getElementById("show-box").replaceChild(container, temp);
                    } else if (container.classList.contains("show") && this.classList.contains("hide")) {
                        document.getElementById("hide-box").replaceChild(temp, this);
                        document.getElementById("show-box").replaceChild(this, container);
                        document.getElementById("hide-box").replaceChild(container, temp);
                        container.classList.remove("show");
                        container.classList.add("hide");
                        this.classList.add("show");
                        this.classList.remove("hide");
                    } else if (container.classList.contains("hide") && this.classList.contains("show")) {
                        document.getElementById("show-box").replaceChild(temp, this);
                        document.getElementById("hide-box").replaceChild(this, container);
                        document.getElementById("show-box").replaceChild(container, temp)
                        container.classList.remove("hide");
                        container.classList.add("show");
                        this.classList.add("hide");
                        this.classList.remove("show");
                    }
                }
            }
        }
    }

    showPosition = () => {
        const { visible } = this.state;
        this.setState({
            visible: !visible
        }, () => {
            setTimeout(() => {
                this.dragger();
            }, 1000)

        })
    }

    onChange = (value) => {
        const { fetchOrder } = this.props;
        if (fetchOrder) {
            fetchOrder(value, 2);
        }
    };


    render() {
        const { visible = false, activeKey = [] } = this.state;
        const { data = [], cfgVisible = false, subsidiary = [], subId = '' } = this.props;
        const show = data.slice(0, 9) || [];
        const hide = data.slice(9) || [];

        const content = <div className='position-drawer'>
            <div className='flex-c xy-body' style={{ paddingTop: '1.5rem' }}>
                <div >
                    <div className="box-title">
                        <div className='card-title title-l'>分公司选择</div>
                    </div>
                    <div className="position" style={{ paddingTop: '2rem' }}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            onChange={this.onChange}
                            value={subId}
                            dropdownClassName='drop-cont'
                            filterOption={(input, option) => {
                                return option.props.children.includes(input)
                            }}
                            dropdownRender={menu => (
                                <Scrollbars autoHide style={{ width: '100%', height: '35rem' }}>
                                    {menu}
                                </Scrollbars>
                            )}
                        >
                            {subsidiary.map((item, index) => {
                                const { ID = '', NAME = '-' } = item;
                                return <Select.Option value={ID} key={index}>{NAME}</Select.Option>
                            })
                            }
                        </Select>
                        {/* <Collapse activevalue={activeKey} onChange={this.callback}>
                            <Collapse.Panel header={subName} value="1">
                                <div className={subId === '1' ? `uncomplete-item flex-r uncomplete-item-selected` : "uncomplete-item flex-r"} value='1' style={{ alignItems: 'center' }} onClick={this.handleChange}>福州分公司</div>
                                <div className={subId === '2' ? `uncomplete-item flex-r uncomplete-item-selected` : "uncomplete-item flex-r"} value='2' style={{ alignItems: 'center' }} onClick={this.handleChange}>北京分公司</div>
                                <div className={subId === '3' ? `uncomplete-item flex-r uncomplete-item-selected` : "uncomplete-item flex-r"} value='3' style={{ alignItems: 'center' }} onClick={this.handleChange}>上海分公司</div>
                            </Collapse.Panel>
                        </Collapse> */}
                    </div>
                    <div className="box-title" style={{ paddingTop: '3rem' }}>
                        <div className='card-title title-l'>模块顺序调整</div>
                    </div>
                    {cfgVisible && <div className="position-config" style={{ marginTop: '2rem' }}>
                        <div className='config-title'>已设置</div>
                        <div id='show-box' style={{ paddingLeft: '2.5rem' }}>
                            {show.map((item, index) => {
                                const { chartCode = "BranTop10Trend",
                                    chartName = "-"
                                } = item;
                                return <div value={chartCode} className="config-item show" draggable="true" key={index}>
                                    <img src={[require(`../../../../image/icon_config${index + 1}.png`)]} alt="" style={{ height: '5rem' }} />
                                    {chartName}
                                </div>
                            })

                            }
                        </div>
                        <div className='driver'></div>
                        <div className='config-title'>未设置</div>
                        <div id='hide-box' style={{ paddingLeft: '2.5rem' }}>
                            {hide.map((item, index) => {
                                const { chartCode = "BranTop10Trend",
                                    chartName = "-"
                                } = item;
                                return <div value={chartCode} className="config-item hide" draggable="true" key={index}>
                                    <img src={[require(`../../../../image/icon_config${index + 1}.png`)]} alt="" style={{ height: '5rem' }} />
                                    {chartName}
                                </div>

                            })
                            }
                        </div>
                        <div className='button-box'>
                            <div className="config-reset" onClick={this.reset}>
                                重置
                            </div>
                            <div className="config-confirm" onClick={this.saveConfig}>
                                确认
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div >

        return (
            <Popover
                className=''
                placement="bottomLeft"
                content={content}
                overlayClassName='position-popover'//样式类
                visible={visible}//手动显示
            >
                <Button onClick={this.showPosition} type="primary" shape="circle"
                    style={{ marginLeft: '2rem', backgroundColor: '#041866', background: `url(${require("../../../../image/position.png")})`, backgroundSize: 'cover', display: 'block' }}>
                </Button>
            </Popover>

        );
    }
}

export default PageHeader;
