angular.module('Admin').controller('AdminController', function($scope, $http, PostService, PageService, CategoryService) {
  PostService.getList().success(function(data) {
    $scope.postList = data;
    return $scope.postList.ident = $scope.postList.id;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  CategoryService.getList().success(function(data) {
    $scope.categoryList = data;
    return $scope.categoryList.ident = $scope.categoryList.name;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  PageService.getList().success(function(data) {
    $scope.pageList = data;
    return $scope.pageList.ident = $scope.pageList.route;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  $scope.createCategory = function(data) {
    return CategoryService.create(data).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.saveCategory = function(name, data) {
    return CategoryService.save(name, data).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.deleteCategory = function(name) {
    return CategoryService.remove(name).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.createPost = function(data) {
    return PostService.create(data).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.savePost = function(id, data) {
    return PostService.save(id, data).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.deletePost = function(id) {
    return PostService.remove(id).success(function(data) {
      return $console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.createPage = function(data) {
    return PageService.create(data).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.savePage = function(route, data) {
    return PageService.save(route, data).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.deletePage = function(route) {
    return PageService.remove(route).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.editPost = function(id) {
    return PostService.get(id).success(function(data) {
      $scope.PostToEdit = data;
      return $location.path('/admin/blog/posts/edit/' + id);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  return $scope.editPage = function(route) {
    return PageService.get(route).success(function(data) {
      $scope.PageToEdit = data;
      return $location.path('/admin/pages/edit/' + id);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
});
