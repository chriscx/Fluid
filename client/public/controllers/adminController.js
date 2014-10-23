angular.module('Admin').controller('AdminController', function($scope, PostService, PageService, CategoryService) {
  $.get('/blog/posts/0/100/posts.json', function(data) {
    return $scope.$apply(function() {
      var i;
      for (i in data.entries) {
        data.entries[i].oldSlug = data.entries[i].slug;
      }
      return $scope.posts = data.entries;
    });
  });
  $.get('/blog/categories.json', function(data) {
    console.log(data);
    return $scope.$apply(function() {
      var i;
      for (i in data.categories) {
        data.categories[i].oldName = data.categories[i].name;
      }
      return $scope.categories = data.categories;
    });
  });
  $.get('/pages.json', function(data) {
    return $scope.$apply(function() {
      var i;
      for (i in data.pages) {
        data.pages[i].oldRoute = data.pages[i].route;
      }
      return $scope.pages = data.pages;
    });
  });
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
