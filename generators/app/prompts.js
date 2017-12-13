const _ = require('lodash')
const { basename } = require('path')

module.exports = author => [
  {
    name: 'name',
    message: '请输入你的项目名:',
    default: _.kebabCase(basename(process.cwd())),
    filter: _.kebabCase,
    validate: str => str.length > 0
  },
  {
    name: 'description',
    message: '请输入项目简介:'
  },
  {
    name: 'repository',
    message: '请输入项目地址:'
  },
  {
    name: 'author',
    message: '请输入项目作者名:',
    default: author
  },
  {
    name: 'keywords',
    message: '请输入项目关键词 (以空格分隔):',
    filter: words => words.split(/\s* \s*/g)
  }
]
