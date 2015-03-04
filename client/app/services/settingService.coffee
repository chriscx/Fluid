angular.module('Admin').factory 'SettingsService', ($http, Settings) ->

  genericErrorCallback: (response) ->
    console.log "error", response
    $q.reject(response)

  genericSuccessCallback = (response) -> new Settings response.data

  getSettings: ->
    $http.get('/data/settings.json').then(@genericSuccessCallback, @genericErrorCallback)

  createSettings: (settings) ->
    $http.post('/data/settings.json', settings)

  saveSettings: (settings) ->
    $http.put('/data/settings.json', settings)
