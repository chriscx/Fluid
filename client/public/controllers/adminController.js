angular.module('Admin').controller('AdminController', function($scope, PostService, PageService, CategoryService) {
  $scope.addNewCategory = function(name) {
    if (name !== '') {
      $scope.categories.push({
        name: name,
        description: '',
        "new": true
      });
    }
    return $scope.newCategoryName = '';
  };
  $scope.saveCategory = function(selectedCategory) {
    if (selectedCategory["new"]) {
      return CategoryService.createCategory(selectedCategory);
    } else {
      return CategoryService.saveCategory(selectedCategory);
    }
  };
  $scope.deleteCategory = function(selectedCategory) {
    return CategoryService.deleteCategory(selectedCategory);
  };
  $scope.addNewPost = function(title) {
    if (title !== '') {
      $scope.posts.push({
        title: title,
        slug: getSlug(title),
        body: '',
        tags: [],
        category: '',
        updateDate: (new Date()).getTime(),
        published: true,
        "new": true
      });
    }
    return $scope.newPostTitle = '';
  };
  $scope.savePost = function(selectedPost) {
    if (selectedPost["new"]) {
      return PostService.createPost(selectedPost);
    } else {
      return PostService.savePost(selectedPost);
    }
  };
  $scope.deletePost = function(selectedPost) {
    return PostService.deletePost(selectedPost);
  };
  $scope.addNewPage = function(title) {
    if (title !== '') {
      $scope.pages.push({
        title: title,
        route: getSlug(title),
        body: '',
        updateDate: (new Date()).getTime(),
        published: true,
        "new": true
      });
    }
    return $scope.newPageTitle = '';
  };
  $scope.savePage = function(selectedPage) {
    if (selectedPage["new"]) {
      return PageService.createPage(selectedPage);
    } else {
      return PageService.savePage(selectedPage);
    }
  };
  return $scope.deletePage = function(selectedPage) {
    return PageService.deletePage(selectedPage);
  };
});
