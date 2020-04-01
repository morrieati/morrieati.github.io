import React from 'react'
import PubSub from 'pubsub-js'
import { Helmet } from 'react-helmet'

import styles from './NoMatch.module.scss'

const NoMatch = () => {
  return (
    <div className={styles.NoMatch}>
      <Helmet onChangeClientState={({ title }) => PubSub.publish('title-changed', title)}>
        <title>不存在的页面</title>
      </Helmet>

      <span>你来到了不存在的页面，哈哈</span>
    </div>
  )
}

export default NoMatch
