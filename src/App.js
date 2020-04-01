import React, { useEffect, useState } from 'react'
import { Switch, Route, useLocation } from 'react-router'
import { BrowserRouter as Router, Link } from 'react-router-dom'

import Home from './pages/Home'
import Me from './pages/Me'

import styles from './App.module.scss'

const App = () => {
  const [title, setTitle] = useState(document.title)

  let location = useLocation()
  useEffect(() => {
    setTitle(document.title)
  }, [location])

  return (
    <div className={styles.Blog}>
      <Switch>
        <Route exact path={'/'}>
          <Home />
        </Route>
        <Route path={'/me'}>
          <Me />
        </Route>
      </Switch>

      <footer className={styles.Footer}>
        <Link className={styles.SiteName} to={'/'}>护肝工程师的日常</Link>
        <span className={styles.ArticleTitle}>{title}</span>
        <span className={styles.Links}>
            <Link className={styles.Link} to={'/'}>Home</Link>
            <Link className={styles.Link} to={'/me'}>Me</Link>
            <a className={styles.Link} href={'https://github.com/realMorrisLiu'}>GitHub</a>
          </span>
      </footer>
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
