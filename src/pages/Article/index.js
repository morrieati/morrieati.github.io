import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import PubSub from 'pubsub-js'
import qs from 'query-string'
import axios from 'axios'

import config from 'config'
import { renderMarkdown } from 'utils/markdown'

import styles from './Article.module.scss'

const Article = () => {
  const { article } = qs.parse(window.location.search)

  const [content, setContent] = useState('')
  const [metadata, setMeta] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [toc, setToc] = useState([])

  useEffect(() => {
    async function fetchData () {
      try {
        const result = await axios.get(`${config.article_dir}${article}.md`)
        return result.data
      } catch (e) {
        window.location.assign('/404')
      }
    }

    fetchData().then(text => {
      setLoaded(true)

      const { content, meta, toc } = renderMarkdown(text)

      setToc(toc)
      setMeta(meta)
      setContent(content)
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
            toc.map(item => (
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
