import React from 'react'
import { Helmet } from 'react-helmet'

import styles from './Me.module.scss'

const Me = () => {
  return (
    <div className={styles.Me}>
      <Helmet>
        <title>关于我的一些事</title>
      </Helmet>
    </div>
  )
}

export default Me
