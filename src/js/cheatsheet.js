import { setOpenMenu, clearOpenMenu } from './menus.js';
import { marked } from './markdown.js';

const page = document.getElementById('page');

export function createCheatSheet() {
  if(getCheatSheet()) return;
  const sheet = document.createElement('div');
  sheet.classList.add('md-cheatsheet');

  const closeSheetBtn = document.createElement('button');
  closeSheetBtn.textContent = 'x';
  closeSheetBtn.classList.add('close-md-sheet-btn');
  sheet.appendChild(closeSheetBtn);
  closeSheetBtn.onclick = () => removeCheatSheet(sheet);

  markdownExamples.forEach(example => {
    const md = new MarkdownExample(example);

    sheet.appendChild(md.createElement());
  })

  page.appendChild(sheet);
  setOpenMenu('md cheatsheet');
}

export function getCheatSheet() {
    return document.querySelector('.md-cheatsheet');
}

export function removeCheatSheet(sheet) {
    if(!sheet) return;
    sheet.remove();
    clearOpenMenu()
}

export function toggleCheatSheet() {
    const sheet = getCheatSheet()
    if(sheet) removeCheatSheet(sheet);
    else createCheatSheet();
}

class MarkdownExample {
  constructor(obj) {
    this.title = obj.title;
    this.content = obj.content;
  }

  createElement() {
    const example = document.createElement('div');
    example.classList.add('markdown-example');

    const title = document.createElement('div');
    title.classList.add('markdown-example-title');
    title.textContent =  this.title;

    const container = document.createElement('div');
    container.classList.add('markdown-display-container')

    const input = document.createElement('div');
    input.classList.add('markdown-input', 'markdown-display');
    input.textContent = this.content;

    const output = document.createElement('div');
    output.classList.add('markdown-output', 'markdown-display');
    output.innerHTML = marked.parse(this.content);

    container.append(input, output);
    example.append(title, container);

    return example;
  }
}

const markdownExamples = [
  {title: 'Headers', content: `# h1
  ## h2
  ### h3
  `},
  {title: 'Bold text', content: '**Kangae**'},
  {title: 'Italic', content: '*Kangae*'},
  {title: 'Blockquote', content: '> First learn the meaning of what you say, and then speak'},
  {title: 'Ordered List', content: `
  1. First item
  2. Second item
  3. Third item
  `},
  {title: 'Unordered List', content: `
  - First item
  - Second item
  - Third item
  `},
  {title: 'Code', content:`code`},
  {title: 'Code block',
  content: `\`\`\`\`
  \`\`\`
  for(let i = 0; i < 10; i++){
    console.log(i)
  }
  \`\`\`
  \`\`\`\``
  },
  {title: 'Checkboxes', content:`
  - [x] Checked
  - [ ] Unchecked
  `},
  {title: 'External Links', content: '[My Channel](https://www.youtube.com/@TaoSigmund)'},
]
