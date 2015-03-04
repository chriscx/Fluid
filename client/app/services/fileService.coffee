angular.module('Admin').factory 'FileService', ($http, File) ->

  genericErrorCallback: (response) ->
    console.log "error", response
    $q.reject(response)

  genericSuccessCallback = (response) -> new File response.data

  getFileList: () ->
    $http.get('/data/files.json')

  removeFile: (id) ->
    $http.delete("/data/files/#{id}")
