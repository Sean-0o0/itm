import React from 'react';
import lodash from 'lodash';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Draft extends React.Component {
  constructor(props) {
    super(props);
    const { defaultValue = '' } = props;
    let editorState = '';
    // 设置初始值
    if (defaultValue !== '') {
      // 初始值为文本
      if (typeof defaultValue === 'string') { // 对于html先转义再转成editorState对象
        // const html = this.HTMLDecode(defaultValue);
        const contentBlock = htmlToDraft(defaultValue);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          editorState = EditorState.createWithContent(contentState);
        }
      } else if (typeof defaultValue === 'object') { // 初始值为对象
        const { html: defaultHtml = '', editorState: defaultEditorState = '' } = defaultValue;
        // 将文件信息放到输入框中
        if (defaultEditorState) {
          editorState = defaultEditorState;
        } else { // 如果初始值为对象，那么将其中的html放到输入框中
          const html = this.HTMLDecode(defaultHtml);
          const contentBlock = htmlToDraft(html);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            editorState = EditorState.createWithContent(contentState);
          }
        }
      }
    }
    this.state = {
      editorState,
    };
  }

  componentDidMount() {
    const { allowPasteImg = false } = this.props;
    if (allowPasteImg) {
      setTimeout(() => {
        this.bindPasteEvent();
      }, 500);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Reflect.has(nextProps, 'value')) {
      const { value = '' } = nextProps;
      if (value !== '') {
        if (typeof value === 'string') { // 对于html先转义再转成editorState对象
          const html = this.HTMLDecode(value);
          const contentBlock = htmlToDraft(html);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
              editorState,
            };
          }
        } else if (typeof value === 'object') {
          const { editorState, fileList = [] } = value;
          this.setState({
            editorState,
            fileList,
          });
        }
      }
    }
  }

  onEditorStateChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const outputText = contentState.getPlainText();
    this.setState({
      editorState,
    });
    const { onChange } = this.props;
    const tempHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const html = this.clearBrank(tempHtml);
    if (onChange) {
      onChange({
        html,
        editorState,
        text: outputText,
        fileList: this.state.fileList,
      });
    }
  }

  clearBrank = (html) => { // 清除html里面的空格
    let str = '';
    let i = 0;
    while (i < html.length) {
      if (html[i] === '>') {
        const tempStart = i;
        let tempEnd = i;
        for (let j = tempStart; j < html.length; j++) {
          if (html[j] === '<') {
            tempEnd = j;
            break;
          }
        }
        if (tempStart < tempEnd) {
          let tempStr = html.substr(tempStart, tempEnd - tempStart);
          tempStr = tempStr.split(' ').join('&nbsp;');
          str += tempStr;
          i = tempEnd;
        } else {
          str += html[i];
          i++;
        }
      } else {
        str += html[i];
        i++;
      }
    }
    return str;
  }

  // HTML转义
  HTMLEncode = (html) => {
    let temp = document.createElement('div');
    if (temp.textContent != null) {
      temp.textContent = html;
    } else {
      temp.innerText = html;
    }
    const output = temp.innerHTML;
    temp = null;
    return output;
  }

  // HTML反转义
  HTMLDecode = (text) => {
    let temp = document.createElement('div');
    temp.innerHTML = text;
    const output = temp.innerText || temp.textContent;
    temp = null;
    return output;
  }

  bindPasteEvent = () => {
    const { onChange, value } = this.props;
    if (this._editor) {
      const cont = (this._editor.getElementsByClassName('rdw-editor-main') || [])[0];
      cont.addEventListener('paste', (e) => {
        const { clipboardData } = e;
        const item = lodash.get(clipboardData, 'items[0]', {});
        if (lodash.get(item, 'kind', '') === 'file' && lodash.get(item, 'type', '').indexOf('image') === 0) {
          const blob = item.getAsFile && item.getAsFile();
          // 判断是不是图片，最好通过文件类型判断
          const isImg = (blob && 1) || -1;
          const reader = new FileReader();
          if (isImg >= 0) {
            // 将文件读取为 DataURL
            reader.readAsDataURL(blob);
          }
          // 文件读取完成时触发
          reader.onload = (event) => {
            // 获取base64流
            const base64Str = event.target.result;
            // 获取当前的内容
            /* const currentContentState = this.state.editorState.getCurrentContent();
            const preText = currentContentState.getPlainText(); */
            const tempHtml = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
            const preHtml = this.clearBrank(tempHtml);
            const tmplHtml = `${preHtml}<img src='${base64Str}' style='max-width: 300px, max-height: 300px' alt='' />`;
            let editorState = '';
            const contentBlock = htmlToDraft(tmplHtml);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              editorState = EditorState.createWithContent(contentState);
            }
            this.setState({ editorState });
            if (onChange) {
              if (typeof value === 'string') {
                onChange({ html: tmplHtml, editorState });
              } else if (typeof value === 'object') {
                onChange({ ...value, html: tmplHtml });
              }
            }
          };
        }
      });
    }
  }

  render() {
    // const { editorState } = this.state;
    const { readOnly = false } = this.props;
    const { editorState } = this.state;
    return (
      <div ref={(e) => { this._editor = e; }}>
        <Editor
          readOnly={readOnly}
          wrapperClassName="demo-wrapper"
          hashtag={{
            separator: ' ',
            trigger: '#',
          }}
          onChange={this.handleChange}
          localization={{ locale: 'zh' }}
          // wrapperStyle={}
          editorClassName="ant-input"
          editorStyle={{ height: '100%', minHeight: '20rem' }}
          toolbarClassName="toolbar-class"
          // toolbarStyle={}
          editorState={editorState}
          // defaultEditorState={EditorState.createWithContent(ContentState.createFromText(value[0] || ''))}
          // onChange={this.onChange}
          onEditorStateChange={this.onEditorStateChange}
          // toolbarCustomButtons={[<FileUploadButton fileList={this.state.fileList} resetFileList={this.resetFileList} ContentState={ContentState} EditorState={EditorState} Modifier={Modifier} />]}
          toolbar={
            {
              options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'textAlign', 'colorPicker', 'link', 'remove', 'history'],
              inline: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ['bold', 'italic', 'underline'],
              },
            }
          }
        />
      </div>
    );
  }
}
export default Draft;
