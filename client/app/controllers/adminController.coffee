angular.module('Admin').controller 'AdminController', ($scope, PostService, PageService, CategoryService) ->

  $.get '/blog/posts/0/100/posts.json', (data) ->
    $scope.$apply ->
      for i of data.entries
        data.entries[i].oldSlug = data.entries[i].slug
      $scope.posts = data.entries

  $.get '/blog/categories.json', (data) ->
    console.log data
    $scope.$apply ->
      for i of data.categories
        data.categories[i].oldName = data.categories[i].name
      $scope.categories = data.categories

  $.get '/pages.json', (data) ->
    $scope.$apply ->
      for i of data.pages
        data.pages[i].oldRoute = data.pages[i].route
      $scope.pages = data.pages

  $scope.addNewCategory = (name) ->
    if name isnt ''
      $scope.categories.push
        name: name
        description: ''
        new: true

    $scope.newCategoryName = ''

  $scope.saveCategory = (selectedCategory) ->
    if selectedCategory.new
      CategoryService.createCategory selectedCategory
    else
      CategoryService.saveCategory selectedCategory

  $scope.deleteCategory = (selectedCategory) ->
    CategoryService.deleteCategory selectedCategory

  $scope.addNewPost = (title) ->
    if title isnt ''
      $scope.posts.push
        title: title
        slug: getSlug(title)
        body: ''
        tags: []
        category: ''
        updateDate: (new Date()).getTime()
        published: true
        new: true

    $scope.newPostTitle = ''

  $scope.savePost = (selectedPost) ->
    if selectedPost.new
      PostService.createPost selectedPost
    else
      PostService.savePost selectedPost

  $scope.deletePost = (selectedPost) ->
    PostService.deletePost selectedPost

  $scope.addNewPage = (title) ->
    if title isnt ''
      $scope.pages.push
        title: title
        route: getSlug(title)
        body: ''
        updateDate: (new Date()).getTime()
        published: true
        new: true

    $scope.newPageTitle = ''

  $scope.savePage = (selectedPage) ->
    if selectedPage.new
      PageService.createPage selectedPage
    else
      PageService.savePage selectedPage

  $scope.deletePage = (selectedPage) ->
    PageService.deletePage selectedPage
