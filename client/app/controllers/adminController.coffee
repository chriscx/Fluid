angular.module('Admin').controller 'AdminController', ($scope, PostService, PageService, CategoryService) ->

  # $.get '/blog/posts/0/100/posts.json', (data) ->
  #   $scope.$apply ->
  #     for i of data.entries
  #       data.entries[i].oldSlug = data.entries[i].slug
  #     $scope.posts = data.entries
  #
  # $.get '/blog/categories.json', (data) ->
  #   console.log data
  #   $scope.$apply ->
  #     for i of data.categories
  #       data.categories[i].oldName = data.categories[i].name
  #     $scope.categories = data.categories
  #
  # $.get '/pages.json', (data) ->
  #   $scope.$apply ->
  #     for i of data.pages
  #       data.pages[i].oldRoute = data.pages[i].route
  #     $scope.pages = data.pages

  PostService.getList().success((data) ->
    $scope.PostList = data
  ).error (status, data) ->
    console.log status
    console.log data

  CategoryService.getList().success((data) ->
    $scope.CategoryList = data
  ).error (status, data) ->
    console.log status
    console.log data

  PageService.getList().success((data) ->
    $scope.PageList = data
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.createCategory = (data) ->
    CategoryService.create(data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.saveCategory = (name, data) ->
    CategoryService.save(name, data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.deleteCategory = (name) ->
    CategoryService.remove(name).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.createPost = (data) ->
    PostService.create(data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.savePost = (id, data) ->
    PostService.save(id, data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.deletePost = (id) ->
    PostService.remove(id).success((data) ->
      $console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.createPage = (data) ->
    PageService.create(data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.savePage = (route, data) ->
    PageService.save(route, data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.deletePage = (route) ->
    PageService.remove(route).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  # $scope.addNewCategory = (name) ->
  #   if name isnt ''
  #     $scope.categories.push
  #       name: name
  #       description: ''
  #       new: true
  #
  #   $scope.newCategoryName = ''
  #
  # $scope.saveCategory = (selectedCategory) ->
  #   if selectedCategory.new
  #     CategoryService.createCategory selectedCategory
  #   else
  #     CategoryService.saveCategory selectedCategory
  #
  # $scope.deleteCategory = (selectedCategory) ->
  #   CategoryService.deleteCategory selectedCategory
  #
  # $scope.addNewPost = (title) ->
  #   if title isnt ''
  #     $scope.posts.push
  #       title: title
  #       slug: getSlug(title)
  #       body: ''
  #       tags: []
  #       category: ''
  #       updateDate: (new Date()).getTime()
  #       published: true
  #       new: true
  #
  #   $scope.newPostTitle = ''
  #
  # $scope.savePost = (selectedPost) ->
  #   if selectedPost.new
  #     PostService.createPost selectedPost
  #   else
  #     # oldSlug = data.oldSlug
  #     # data.slug = getSlug(data.title)
  #     # delete data.oldSlug
  #     PostService.savePost selectedPost
  #
  # $scope.deletePost = (selectedPost) ->
  #   PostService.deletePost selectedPost
  #
  # $scope.addNewPage = (title) ->
  #   if title isnt ''
  #     $scope.pages.push
  #       title: title
  #       route: getSlug(title)
  #       body: ''
  #       updateDate: (new Date()).getTime()
  #       published: true
  #       new: true
  #
  #   $scope.newPageTitle = ''
  #
  # $scope.savePage = (selectedPage) ->
  #   if selectedPage.new
  #     PageService.createPage selectedPage
  #   else
  #     # oldRoute = data.oldRoute
  #     # delete data.oldRoute
  #     PageService.savePage selectedPage
  #
  # $scope.deletePage = (selectedPage) ->
  #   PageService.deletePage selectedPage
