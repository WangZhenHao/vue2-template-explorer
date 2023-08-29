import './style.css';
import 'monaco-editor/min/vs/editor/editor.main.css'

import theme from './theme';
import { compileToFunctions } from './vue-template-compiler/browser.js'
import prettier from 'prettier/standalone'
import prettierPluginBabel from 'prettier/plugins/babel'
import prettierPluginEstree from 'prettier/plugins/estree'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';


const debounce = function (fn, wait = 300) {
  var timer = null;
  return function () {
    var context = this
    var args = arguments
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, wait)
  }
}

const sharedEditorOptions = {
  fontSize: 14,
  scrollBeyondLastLine: false,
  renderWhitespace: 'selection',
  minimap: {
    enabled: false,
  },
};

// console.log(compileToFunctions(`<div v-if="a==1"><div>Hello World!111111</div><div>Hello World!111111</div></div>`))

// window.init = () => {
  // const monaco = window.monaco;

  monaco.editor.defineTheme('my-theme', theme);
  monaco.editor.setTheme('my-theme');

  const editor = monaco.editor.create(document.getElementById('source'), {
    value: `<div v-if="a">
    <div>Hello World!</div> 
    <div>Hello World!</div>
</div>`,
    language: 'html',
    wordWrap: 'bounded',
    /* eslint-disable */
    ...sharedEditorOptions,
  });

  editor.getModel().updateOptions({
    tabSize: 2,
  });

  const output = monaco.editor.create(document.getElementById('output'), {
    value: '',
    language: 'javascript',
    // readOnly: true,
    ...sharedEditorOptions,
  });

  output.getModel().updateOptions({
    tabSize: 2,
  });

  // handle resize
  window.addEventListener('resize', () => {
    editor.layout();
    output.layout();
  });

  function reCompile() {
    const src = editor.getValue()

    try {
      const res = compileToFunctions(src)
      // console.log(compile(src), generateCodeFrame(src))
      let fn = ''
      if(res.staticRenderFns.length) {
        fn = res.staticRenderFns[0]
      } else {
        fn = res.render
      }
      
      // console.log(String(fn))
      if(fn) {
        prettier.format(fn.toString(), 
        {
          parser: "babel",
          plugins: [prettierPluginBabel, prettierPluginEstree],
        }).then(res => {
          output.setValue(res)
        })
        
      }

    } catch (error) {
        console.error(error)
    }
   

    
  }

  editor.onDidChangeModelContent(debounce(reCompile))
  reCompile()

 

// };

