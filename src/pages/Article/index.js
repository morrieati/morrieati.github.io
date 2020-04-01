import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import PubSub from 'pubsub-js'
import qs from 'query-string'
import axios from 'axios'

import { Remarkable } from 'remarkable'
import { linkify } from 'remarkable/linkify'
import meta from 'remarkable-meta'
import hljs from 'highlight.js'
import toc from 'markdown-toc'

import styles from './Article.module.scss'

const Article = () => {
  const { article } = qs.parse(window.location.search)

  const [content, setContent] = useState('')
  const [metadata, setMetadata] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [tableOfContents, setToc] = useState([])

  useEffect(() => {
    async function fetchData () {
      const host = 'https://raw.githubusercontent.com/realMorrisLiu/realMorrisLiu.github.io/src/src/articles/'

      try {
        const result = await axios.get(`${host}${article}.md`)
        return result.data
      } catch (e) {
        window.location.assign('/404')
      }
    }

    fetchData().then(text => {
      setLoaded(true)

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

      setContent(md.render(text))
      setMetadata(md.meta)
      setToc(toc(text, {}).json)
    })
  }, [article])

  return (
    <div className={styles.Article}>
      <Helmet onChangeClientState={({ title }) => PubSub.publish('title-changed', title)}>
        <title>{metadata.title}</title>
      </Helmet>
      {
        loaded
          ? (
            <div
              className={`markdown-body ${styles.Content}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )
          : <div className={styles.Loading}>Loading...</div>
      }
      <div className={styles.TOC}>
        <ul>
          {
            tableOfContents.map(item => (
              <li key={item.i} className={styles[`Level_${item.lvl}`]}>
                <a href={`#${item.slug}`}>{item.content}</a>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default Article
