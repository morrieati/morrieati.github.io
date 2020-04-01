import React from 'react'
import PubSub from 'pubsub-js'
import { Helmet } from 'react-helmet'

const Home = () => {
  return (
    <div>
      <Helmet onChangeClientState={({ title }) => PubSub.publish('title-changed', title)}>
        <title>这是首页</title>
      </Helmet>
    </div>
  )
}

export default Home
