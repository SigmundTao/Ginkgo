import { marked } from 'https://cdn.jsdelivr.net/npm/marked/+esm'

const highlightExtension = {
    name: 'highlight',
    level: 'inline',
    start(src){ return src.indexOf('==') },
    tokenizer(src){
        const match = src.match(/^==([^=]+)==/)
        if(match) return { type: 'highlight', raw: match[0], text: match[1] }
    },
    renderer(token){ return `<mark class="highlight-md">${token.text}</mark>` }
}

marked.use({ extensions: [highlightExtension] })

export { marked }