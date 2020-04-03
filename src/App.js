import React, { useState } from 'react'
import { Route, Switch } from 'react-router'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import PubSub from 'pubsub-js'

import Home from './pages/Home'
import Me from './pages/Me'
import NoMatch from './pages/NoMatch'
import Article from './pages/Article'

import styles from './App.module.scss'

const App = () => {
  const [title, setTitle] = useState(document.title)

  PubSub.subscribe('title-changed', (_, newTitle) => {setTitle(newTitle)})

  return (
    <div className={styles.Blog}>
      <Switch>
        <Route exact path={'/'}>
          <Home />
        </Route>
        <Route exact path={'/me'}>
          <Me />
        </Route>
        <Route exact path={'/page'}>
          <Article />
        </Route>
        <Route exact path={'/404'}>
          <NoMatch />
        </Route>
      </Switch>

      <nav className={styles.Nav}>
        <Link className={styles.SiteName} to={'/'}><span>护肝工程师的日常</span></Link>
        <span className={styles.ArticleTitle}>{title}</span>
        <span className={styles.Links}>
          <Link className={styles.Link} to={'/'}>Home</Link>
          <Link className={styles.Link} to={'/me'}>Me</Link>
          <a className={styles.Link} href={'https://github.com/realMorrisLiu'}>GitHub</a>
        </span>
      </nav>
    </div>
  )
}

const RouterApp = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default RouterApp
