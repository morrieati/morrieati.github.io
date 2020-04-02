import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import PubSub from 'pubsub-js'
import dateFormat from 'dateformat'

import config from 'config'
import styles from './Home.module.scss'

const Home = () => {
  const [loaded, setLoaded] = useState(false)
  const [articles, setArticles] = useState([])

  useEffect(() => {
    async function fetchData () {
      try {
        const result = await fetch(`${config.article_dir}articles.json`)
        return await result.json()
      } catch (e) {
        window.location.assign('/404')
      }
    }

    fetchData().then(result => {
      setLoaded(true)
      setArticles(result.sort((a, b) => a.date - b.date))
    })
  }, [])

  return (
    <div className={styles.Home}>
      <Helmet onChangeClientState={({ title }) => PubSub.publish('title-changed', title)}>
        <title>这是首页</title>
      </Helmet>

      {
        loaded
          ? (
            <div className={styles.List}>
              {
                articles.map(({ key, title, author, date }, index) => (
                  <Link to={`/page?article=${key}`}>
                    <div key={index} className={styles.Article}>
                      <h2>{title}</h2>
                      <span className={styles.Author}>written by <b>{author}</b></span>
                      <span className={styles.Date}>{dateFormat(date, 'dddd, mmmm dS, yyyy')}</span>
                    </div>
                  </Link>
                ))
              }
              <code className={styles.End}> -- THE END -- </code>
            </div>
          )
          : <div className={styles.Loading}>Loading...</div>
      }
    </div>
  )
}

export default Home
