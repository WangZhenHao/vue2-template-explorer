import './style.css';
import theme from './theme';
import { compileToFunctions } from './vue-template-compiler/browser.js'

const sharedEditorOptions = {
  fontSize: 14,
  scrollBeyondLastLine: false,
  renderWhitespace: 'selection',
  minimap: {
    enabled: false,
  },
};

console.log(compileToFunctions(`<div v-if="a==1"><div>Hello World!111111</div><div>Hello World!111111</div></div>`))

window.init = () => {
  const monaco = window.monaco;

  monaco.editor.defineTheme('my-theme', theme);
  monaco.editor.setTheme('my-theme');

  const editor = monaco.editor.create(document.getElementById('source'), {
    value: `<div>Hello World!111111</div>`,
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
    readOnly: true,
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

};
