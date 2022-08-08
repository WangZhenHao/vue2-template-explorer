import './style.css';
import theme from './theme';
import { compileToFunctions } from './vue-template-compiler/browser.js'

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

window.init = () => {
  const monaco = window.monaco;

  monaco.editor.defineTheme('my-theme', theme);
  monaco.editor.setTheme('my-theme');

  const editor = monaco.editor.create(document.getElementById('source'), {
    value: `<div>
    <div>Hello World!111111</div> 
</div>`,
    language: 'html',
    ...sharedEditorOptions,
    wordWrap: 'bounded',
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
      let fn = ''
      if(res.staticRenderFns.length) {
        fn = res.staticRenderFns[0]
      } else {
        fn = res.render
      }

      // console.log(String(fn))
      if(fn) {
        output.setValue(fn.toString())
      }

    } catch (error) {
        console.error(error)
    }
   

    
  }

  editor.onDidChangeModelContent(debounce(reCompile))
  reCompile()
};
