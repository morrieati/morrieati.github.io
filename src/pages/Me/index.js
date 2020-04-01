import React from 'react'
import PubSub from 'pubsub-js'
import { Helmet } from 'react-helmet'

import styles from './Me.module.scss'

const Me = () => {
  return (
    <div className={styles.Me}>
      <Helmet onChangeClientState={({ title }) => PubSub.publish('title-changed', title)}>
        <title>关于我的一些事</title>
      </Helmet>
    </div>
  )
}

export default Me
