import { Extension } from '@tiptap/core'
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model'
import { MarkdownSerializer } from 'prosemirror-markdown'

/**
 * 1) Define how to serialize Tiptap StarterKit nodes to Markdown.
 *    This setup covers:
 *      - doc
 *      - paragraph
 *      - blockquote
 *      - horizontal_rule
 *      - heading
 *      - ordered_list
 *      - bullet_list
 *      - list_item
 *      - code_block
 *      - text
 */
const nodes = {
  // The top-level document
  doc(state, node) {
    state.renderContent(node)
  },

  paragraph(state, node) {
    state.renderInline(node)
    state.closeBlock(node)
  },

  blockquote(state, node) {
    state.wrapBlock('> ', null, node, () => state.renderContent(node))
  },

  horizontalRule(state, node) {
    // By default we'll use '---' as a horizontal rule
    state.write('---')
    state.closeBlock(node)
  },

  heading(state, node) {
    const level = node.attrs.level
    state.write(`${'#'.repeat(level)} `)
    state.renderInline(node)
    state.closeBlock(node)
  },

  orderedList(state, node) {
    // Copied from default ProseMirror rules:
    // Adjust for 'order' attribute if needed
    let start = node.attrs.order || 1
    let maxW = String(start + node.childCount - 1).length
    let spacing = new Array(maxW + 2).join(' ')

    state.renderList(node, '  ', (i) => {
      let nStr = String(start + i)
      return nStr + '. ' + spacing.slice(nStr.length + 2)
    })
  },

  bulletList(state, node) {
    state.renderList(node, '  ', () => '* ')
  },

  listItem(state, node) {
    state.renderContent(node)
  },

  codeBlock(state, node) {
    // If you store language in node.attrs.language, you can use it here
    const { language = '' } = node.attrs
    state.write('```' + language + '\n')
    state.text(node.textContent, false)
    state.ensureNewLine()
    state.write('```')
    state.closeBlock(node)
  },

  text(state, node) {
    state.text(node.text)
  },
}

/**
 * 2) Define how to serialize marks (inline styles) to Markdown.
 *    Covers:
 *      - bold (strong)
 *      - italic (em)
 *      - strike
 *      - code
 *      - link
 */
const marks = {
  // Bold
  strong: {
    open: '**',
    close: '**',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  // Italic
  em: {
    open: '*',
    close: '*',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  // Strike
  strike: {
    open: '~~',
    close: '~~',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  // Inline code
  code: {
    open: '`',
    close: '`',
    escape: false,
  },
  // Link
  link: {
    open: (_state, mark) => '[',
    close: (_state, mark) => `](${mark.attrs.href})`,
  },
}

/**
 * 3) Create an instance of the ProseMirror MarkdownSerializer
 *    with our custom node/mark specs.
 */
const customMarkdownSerializer = new MarkdownSerializer(nodes, marks)

export const HTMLToMarkdownExtension = Extension.create({
  name: 'htmlToMarkdown',

  /**
   * We add a command that:
   *  a) Parses an HTML string into a ProseMirror document
   *  b) Uses our MarkdownSerializer to convert the doc to Markdown
   *  c) Returns that Markdown string
   */
  addCommands() {
    return {
      convertHTMLToMarkdown:
        () =>
        ({ editor }) => {
          const { state } = editor
          const { schema } = state
          const htmlString = editor.getHTML();

          // 1. Parse HTML into a ProseMirror Node
          const dom = new window.DOMParser().parseFromString(htmlString, 'text/html')
          const doc = ProseMirrorDOMParser.fromSchema(schema).parse(dom.body)
          console.log(doc)

          // 2. Convert the ProseMirror Node to Markdown
          const markdown = customMarkdownSerializer.serialize(doc)

          // Return the Markdown string
          return markdown
        },
    }
  },
})
