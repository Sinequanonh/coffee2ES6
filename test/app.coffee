app = angular.module 'app', [
  'app.config'
  'app.core'
]

app.run (Auth) ->
  Auth.init()
  return
