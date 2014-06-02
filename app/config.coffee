module.exports =

  #
  #	* Website's title
  #
  title: 'Fluid'

  
  port: '3333'

  #
  #	* environment variable
  #	* DEFAULT: production
  #
  env: 'development'

  #
  #	* website's menu:
  #
  menu:
    enabled: true
    content: [
      {
        label: 'Index'
        path: '/'
      }
      {
        label: 'Blog'
        path: '/blog'
      }
      {
        label: 'LinkedIn'
        path: '#'
      }
      {
        label: 'GitHub'
        path: '#'
      }
      {
        label: 'Contact'
        path: '/contact'
      }
    ]


  #
  #	* Routes to single web pages link to a view
  #
  routes: [
    path: '/'
    view: 'index'
    title: ''
  ]

  #
  #	* REQUIRED
  #	* blog enabling
  #
  blog:
    enabled: true


  #
  #	* REQUIRED
  #	* MongoDB connexion info
  #
  mongo:
    development:
      host: 'localhost'
      db: 'fluiddb_dev'
      user: ''
      password: ''

    production:
      host: 'localhost'
      db: 'fluiddb'
      user: ''
      password: ''

  ssl:
    enabled: false
    key: ''
    cert: ''


  #
  #	* REQUIRED
  #	* 160 bits key generated (replace it when installing)
  #
  secret: 'DD9E5F7F98E47AD47932ACBF77912'
