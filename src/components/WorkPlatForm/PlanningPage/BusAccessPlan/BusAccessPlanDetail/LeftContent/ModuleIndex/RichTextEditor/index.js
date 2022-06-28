import React, { useState, useEffect } from 'react';
import E from 'wangeditor'
import { EncryptBase64, DecryptBase64 } from '../../../../../../../Common/Encrypt';

let editor = null

// class RichTextEditor extends React.Component {
//
// }
function RichTextEditor(item) {
    //{"MODULAR_ID":6,"MODULAR_NAME":"激励方式","NOTE":"激励方式说明内容","SNO":1}
    let obj = {}
    let test = '';
    let content = ''
    for (let id in item) {
        if (id == 'id') {
            test = item[id] //获取到传递进来的id的数字 创建不同的富文本编译器挂载的dev
            obj.MODULAR_ID = test
            obj.MODULAR_NAME = item.name
            obj.SNO = item.sort
            item.data && item.data.forEach((ele, index) => {
                if (ele.MODULAR_ID == test) {
                    content = DecryptBase64(ele.NOTE)
                }
            });

        }
    }
    // const [content, setContent] = useState('')


    useEffect(() => {
        // 注：class写法需要在componentDidMount 创建编辑器
        const str = `#dev${test}`
        editor = new E(str)

        editor.config.uploadImgShowBase64 = true
        // 配置菜单栏，设置不需要的菜单
        editor.config.excludeMenus = [
            'emoticon',
            'video',
            'link',
            'code',
            'todo',
            'quote'
        ]
        if(editor){
          editor.destroy();
        }
        editor.config.height = 100%
        /**一定要创建 */
        editor.create()
        editor.txt.html(content);
        editor.$textElem.attr('contenteditable', false)
        return () => {
            // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
          //editor.destroy()
          ////console.log("---editor销毁了----");
        }
    }, )
    //只有依赖项 useEffect第二个参数[item.data]发生变化，才会重新渲染。为空时只渲染一次

    return (
        <div style={{ height: '100%'}}>
            <div id={`dev${test}`} style={{ height: '100%'}}></div>
        </div>
    );
}

export default RichTextEditor;
