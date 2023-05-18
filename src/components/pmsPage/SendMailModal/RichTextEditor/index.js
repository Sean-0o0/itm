import React, {useState, useEffect} from 'react';
import E from 'wangeditor'
import {EncryptBase64, DecryptBase64} from '../../../Common/Encrypt';

let editor = null

function RichTextEditor(props) {
  const {value, onChange} = props;


  useEffect(() => {
    // 注：class写法需要在componentDidMount 创建编辑器
    editor = new E("#div1")

    // editor.config.uploadImgShowBase64 = true
    editor.config.onchange = (newHtml) => {
      onChange(newHtml);
    }
    // 配置菜单栏，设置不需要的菜单
    editor.config.excludeMenus = [
      'emoticon',
      'video',
      'link',
      'code',
      'todo',
      'quote',
      'image',
    ]
    ////console.log('我看一下高度是多少', document.body.offsetHeight, document.body.clientHeight)
    const windowHeight = document.body.offsetHeight
    editor.config.height = windowHeight * 0.5
    /**一定要创建 */
    editor.create()
    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
      editor.destroy()
    }
  }, [])

  useEffect(() => {
    if (value !== editor.txt.html()) {
      editor.txt.html(value);
    }
  }, [value])

  return (
    <div>
      <div id="div1"></div>
    </div>
  );
}

export default RichTextEditor;
