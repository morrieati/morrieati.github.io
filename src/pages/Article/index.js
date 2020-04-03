import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import PubSub from 'pubsub-js'
import qs from 'query-string'

import config from 'config'
import Loading from 'components/Loading'
import { renderMarkdown } from 'utils/markdown'

import styles from './Article.module.scss'

const Article = () => {
  const { article } = qs.parse(window.location.search)

  const [content, setContent] = useState('')
  const [metadata, setMeta] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [toc, setToc] = useState([])
  const [title, setTitle] = useState({})

  useEffect(() => {
    async function fetchData () {
      const result = await fetch(`${config.article_dir}${article}.md`)
      return await result.text()
    }

    fetchData().then(text => {
      setLoaded(true)

      const { content, meta, toc } = renderMarkdown(text)
      const title = toc.shift()

      setToc(toc)
      setMeta(meta)
      setTitle(title)
      setContent(content)
    }).catch(e => {
      console.error(e)
      window.location.assign('/404')
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
          : <Loading />
      }
      <div className={styles.TOC}>
        <ul>
          <li className={styles.Title}>
            <a href={`#${title.slug}`}>{title.content}</a>
          </li>
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
