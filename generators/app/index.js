const Generator = require('yeoman-generator')
const chalk = require('chalk')
const path = require('path')
const mkdirp = require('mkdirp')
const _ = require('lodash')
const getPrompts = require('./prompts')

module.exports = class FromZeroGenerator extends Generator {
  initializing () {
    this.props = {}
  }
  prompting () {
    this.log('欢迎使用 ' + chalk.green('from-zero') + ' ! 接下来将会引导你创建一个' +
    chalk.yellow('新的项目') + '~')
    this.log('\n你可以随时按下 ' + chalk.cyan('Ctrl') + ' + ' +
    chalk.cyan('C') + ' 键来终止初始化\n\n')
    return this
      .prompt(getPrompts(this.user.git.name))
      .then(props => (
        (props.name = _.kebabCase(props.name)),
        (this.props = _.extend(this.props, props))
      ))
  }

  default () {
    const name = this.props.name
    if (path.basename(this.destinationPath()) !== name) {
      this.log(
        '# 项目应位于 ' + name + ' 中, 然而并不存在这个文件夹, 所以我帮你自动创建了(=゜ω゜)ノ'
      )
      mkdirp(name)
      this.destinationRoot(this.destinationPath(name))
    }
    if (this.fs.exists(path.join(this.destinationPath('package.json')))) {
      throw new Error('Package.json 文件已存在! 请清理文件夹后再尝试!')
    }
    this.composeWith(require.resolve('generator-license'), {
      name: this.props.author,
      email: '',
      website: this.props.repository,
      licensePrompt: '请选择一个开源协议:',
      defaultLicense: 'MIT'
    })
  }

  writing () {
    ['vscode', 'gitignore', 'eslintignore', 'eslintrc.json'].forEach(n => this.fs.copy(
      path.join(__dirname, n),
      this.destinationPath('.' + n)
    ))
    this.fs.copy(
      this.templatePath('**/*'),
      this.destinationPath()
    )
    this.fs.copy(
      this.templatePath(path.join(__dirname, 'packageLock.json')),
      this.destinationPath('package-lock.json')
    )
    const { dependencies, devDependencies, scripts } = this.fs.readJSON(
      path.join(__dirname, 'package.json'))
    const repository = this.props.repository
    const pkg = {
      private: true,
      name: this.props.name,
      version: '0.0.0',
      main: 'index.js',
      description: this.props.description,
      author: this.props.author,
      homepage: repository,
      keywords: _.uniq(this.props.keywords.concat(['from-zero'])),
      repository: { type: 'git', url: repository },
      scripts,
      dependencies,
      devDependencies
    }

    this.fs.writeJSON(this.destinationPath('package.json'), pkg)

    this.fs.copyTpl(
      path.join(__dirname, 'README.tpl.md'),
      this.destinationPath('README.md'),
      {
        repository,
        name: this.props.name,
        description: this.props.description,
        author: this.props.author,
        repositoryName: repository ? path.basename(repository).replace(/\.git$/, '') : ''
      }
    )
  }

  end () {
    const repo = this.props.repository
    if (repo) {
      try {
        const cwd = this.destinationPath('')
        this.spawnCommandSync('git', ['init', '--quiet'], { cwd })
        if (repo.endsWith('.git')) {
          this.spawnCommandSync('git', ['remote', 'add', 'origin', repo], { cwd })
        }
      } catch (e) {}
    }
    this.log(chalk.yellow('\n\n已初始化完毕! 请按照下面的提示进行操作~'))
    this.log('\n' + chalk.cyan('    0.') + ' 输入 ' + chalk.green('cd ' + this.props.name) +
      ' 进入项目文件夹\n' + chalk.cyan('    1.') + ' 输入 ' + chalk.green('npm install') +
      ' 以安装依赖\n' + chalk.cyan('    2.') + ' 输入 ' + chalk.green('npm start') +
      ' 进入开发模式\n' + chalk.cyan('    3.') + ' 输入 ' + chalk.green('npm run build') +
      ' 进行生产模式的构建操作\n\n' + chalk.yellow('祝您使用愉快 (/≧▽≦)/~┴┴'))
  }
}
