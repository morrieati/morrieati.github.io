import fs from 'fs'
import path from 'path'
import { renderMarkdown } from './markdown'

const articleDir = path.join(__dirname, '../../public/articles')

const metas = fs.readdirSync(articleDir).filter(file => file.endsWith('.md')).map(file => {
  const text = fs.readFileSync(path.join(articleDir, file), 'utf8')
  const { meta } = renderMarkdown(text)
  return { ...meta, key: file.slice(0, file.lastIndexOf('.')) }
})

fs.writeFileSync(path.join(articleDir, 'articles.json'), JSON.stringify(metas))
