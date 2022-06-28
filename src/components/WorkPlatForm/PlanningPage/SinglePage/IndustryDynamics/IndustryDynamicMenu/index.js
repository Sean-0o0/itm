import React from 'react';
import { Menu, } from 'antd';
import { FetchQueryNewsCateg } from '../../../../../../services/planning/planning';

class IndustryDynamicMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    this.FetchQueryNewsCateg();
  }

  FetchQueryNewsCateg = () => {
    FetchQueryNewsCateg({}).then(
      res => {
        const { records, code } = res;
        // console.log("resresresres", res)
        if (code > 0) {
          this.setState({
            datas: records,
          });
        }
      },
    ).catch();
  }

  changeMenu = e => {
    const { handleMenuChange } = this.props;
    handleMenuChange(e.key)
  }

  render() {
    const { datas = [], } = this.state;
    return (
      <div style={{ fontSize: '14px', fontWeight: 400, color: '#333333', lineHeight: '20px', width: '100%', height: '100%' }}>
        <Menu
          defaultSelectedKeys={['1']}
          onClick={this.changeMenu}
        >
          {
            datas.map((item) => {
              return (
                <Menu.Item key={item.categ===''?'0':item.categ}>
                  {item.className===''?'其他':item.className}
                </Menu.Item>
              )
            })
          }
        </Menu>
      </div>
    )
  }
}

export default IndustryDynamicMenu;
