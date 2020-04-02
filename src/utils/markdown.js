import { Remarkable } from 'remarkable'
import { linkify } from 'remarkable/dist/cjs/linkify'
import meta from 'remarkable-meta'
import hljs from 'highlight.js'
import toc from 'markdown-toc'

const renderMarkdown = (text) => {
  const md = new Remarkable('full', {
    html: true,
    xhtmlOut: true,
    breaks: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (err) {}
      }

      try {
        return hljs.highlightAuto(str).value
      } catch (err) {}

      return '' // use external default escaping
    },
  }).use(linkify).use(meta).use((remarkable) => {
    remarkable.renderer.rules.heading_open = (tokens, idx) => (
      `<h${tokens[idx].hLevel} id=${toc.slugify(tokens[idx + 1].content)}>`
    )
  })

  return {
    content: md.render(text),
    meta: md.meta,
    toc: toc(text, {}).json,
  }
}

export { renderMarkdown }
