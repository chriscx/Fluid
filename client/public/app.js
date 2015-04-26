var FluidApp;

FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'textAngular', 'Index', 'User', 'Blog', 'Page', 'Admin']);

angular.module('Auth', []);

angular.module('Users', []);

angular.module('Blog', []);

angular.module('Site', []);

angular.module('Admin', []);

FluidApp.config([
  '$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {
      templateUrl: 'views/public.page.html',
      controller: 'PageController',
      access: {
        requiredLogin: false
      }
    }).when('/login', {
      templateUrl: 'views/public.login.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/logout', {
      template: '',
      controller: 'LogoutController',
      access: {
        requiredLogin: false
      }
    }).when('/signup', {
      templateUrl: 'views/public.signup.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/forgot', {
      templateUrl: 'views/public.forgot.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/reset/:token', {
      templateUrl: 'views/public.reset.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/admin', {
      templateUrl: 'views/admin.setting.list.html',
      controller: 'AdminSettingsController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog/posts', {
      templateUrl: 'views/admin.post.list.html',
      controller: 'AdminPostsController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog/posts/create', {
      templateUrl: 'views/admin.post.create.html',
      controller: 'AdminPostsController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog/posts/edit/:id', {
      templateUrl: 'views/admin.editPost.html',
      controller: 'AdminPostsController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/pages', {
      templateUrl: 'views/admin.page.list.html',
      controller: 'AdminPagesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/pages/create', {
      templateUrl: 'views/admin.page.create.html',
      controller: 'AdminPagesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/pages/edit/:route', {
      templateUrl: 'views/admin.page.edit.html',
      controller: 'AdminPagesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/files', {
      templateUrl: 'views/admin.file.list.html',
      controller: 'AdminFilesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/files/upload', {
      templateUrl: 'views/admin.file.upload.html',
      controller: 'AdminFilesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/user', {
      templateUrl: 'views/admin.user.html',
      controller: 'UserController',
      access: {
        requiredLogin: true
      }
    }).when('/blog', {
      templateUrl: 'views/public.blog.html',
      controller: 'BlogController',
      access: {
        requiredLogin: false
      }
    }).when('/blog/:id', {
      templateUrl: 'views/public.post.html',
      controller: 'PostController',
      access: {
        requiredLogin: false
      }
    }).when('/:id', {
      templateUrl: 'views/public.page.html',
      controller: 'PageController',
      access: {
        requiredLogin: false
      }
    }).otherwise({
      redirectTo: '/'
    });
  }
]);

FluidApp.config(function($httpProvider) {
  return $httpProvider.interceptors.push("authInterceptor");
});

FluidApp.run(function($rootScope, $location, $window, AuthenticationService) {
  return $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
    var ref;
    if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
      $location.path('/login');
    }
    if (((ref = nextRoute.originalPath) === '/login' || ref === '/signup') && AuthenticationService.isLogged) {
      return $location.path('/admin');
    }
  });
});

angular.module('User').factory('File', function($http, $location, $window) {
  var File;
  return File = (function() {
    function File(json) {
      if (json != null) {
        this.id = json.hasOwnProperty('id') ? json.id : null;
        this.path = json.hasOwnProperty('path') ? json.path : null;
      }
    }

    File.prototype.set = function(obj) {
      if (obj != null) {
        return this.path = json.hasOwnProperty('path') ? json.path : null;
      }
    };

    File.prototype.getInfo = function() {
      return {
        id: this.id,
        path: this.path
      };
    };

    File.prototype.get = function(attribute) {
      if (this.hasOwnProperty(attribute)) {
        return this[attribute];
      } else {
        return null;
      }
    };

    return File;

  })();
});

angular.module('Blog').factory('Menu', function($http) {
  var Menu;
  return Menu = (function() {
    var set;

    function Menu(obj) {
      if (obj != null) {
        this.id = obj.hasOwnProperty('id') ? obj.id : null;
        this.name = obj.hasOwnProperty('name') ? obj.name : null;
        this.route = obj.hasOwnProperty('route') ? obj.route : null;
        this.description = obj.hasOwnProperty('description') ? obj.description : null;
        this.order = obj.hasOwnProperty('order') ? obj.order : null;
      }
    }

    set = function(obj) {
      if (obj != null) {
        this.name = obj.hasOwnProperty('name') ? obj.name : null;
        this.route = obj.hasOwnProperty('route') ? obj.route : null;
        this.description = obj.hasOwnProperty('description') ? obj.description : null;
        return this.order = obj.hasOwnProperty('order') ? obj.order : null;
      }
    };

    Menu.prototype.getInfo = function() {
      return {
        id: this.id,
        name: this.name,
        route: this.route,
        description: this.description,
        order: this.order
      };
    };

    Menu.prototype.get = function(attribute) {
      if (this.hasOwnProperty(attribute)) {
        return this[attribute];
      } else {
        return null;
      }
    };

    return Menu;

  })();
});

angular.module('Site').factory('Page', function($http) {
  var Page;
  return Page = (function() {
    function Page(obj) {
      if (obj != null) {
        this.id = obj.hasOwnProperty('id') ? obj.id : null;
        this.title = obj.hasOwnProperty('title') ? obj.title : null;
        this.author = obj.hasOwnProperty('author') ? obj.author : null;
        this.body = obj.hasOwnProperty('body') ? obj.body : null;
        this.creationDate = obj.hasOwnProperty('creationDate') ? obj.creationDate : null;
        this.updateDate = obj.hasOwnProperty('updateDate') ? obj.updateDate : null;
        this.published = obj.hasOwnProperty('published') ? obj.published : null;
      }
    }

    Page.prototype.set = function(obj) {
      if (obj != null) {
        this.title = obj.hasOwnProperty('title') ? obj.title : null;
        this.author = obj.hasOwnProperty('author') ? obj.author : null;
        this.body = obj.hasOwnProperty('body') ? obj.body : null;
        this.creationDate = obj.hasOwnProperty('creationDate') ? obj.creationDate : null;
        this.updateDate = obj.hasOwnProperty('updateDate') ? obj.updateDate : null;
        return this.published = obj.hasOwnProperty('published') ? obj.published : null;
      }
    };

    Page.prototype.getInfo = function() {
      return {
        id: this.id,
        title: this.title,
        author: this.author,
        body: this.body,
        creationDate: this.creationDate,
        updateDate: this.updateDate,
        published: this.published
      };
    };

    Page.prototype.get = function(attribute) {
      if (this.hasOwnProperty(attribute)) {
        return this[attribute];
      } else {
        return null;
      }
    };

    return Page;

  })();
});

angular.module('Blog').factory('Post', function($http) {
  var Post;
  return Post = (function() {
    function Post(obj) {
      if (obj != null) {
        this.id = obj.hasOwnProperty('id') ? obj.id : null;
        this.title = obj.hasOwnProperty('title') ? obj.title : null;
        this.author = obj.hasOwnProperty('author') ? obj.author : null;
        this.body = obj.hasOwnProperty('body') ? obj.body : null;
        this.tags = obj.hasOwnProperty('tags') ? obj.tags : null;
        this.category = obj.hasOwnProperty('category') ? obj.category : null;
        this.comments = obj.hasOwnProperty('comments') ? obj.comments : null;
        this.creationDate = obj.hasOwnProperty('creationDate') ? obj.creationDate : null;
        this.updateDate = obj.hasOwnProperty('updateDate') ? obj.updateDate : null;
        this.published = obj.hasOwnProperty('published') ? obj.published : null;
      }
    }

    Post.prototype.set = function(obj) {
      if (obj != null) {
        this.title = obj.hasOwnProperty('title') ? obj.title : null;
        this.author = obj.hasOwnProperty('author') ? obj.author : null;
        this.body = obj.hasOwnProperty('body') ? obj.body : null;
        this.tags = obj.hasOwnProperty('tags') ? obj.tags : null;
        this.category = obj.hasOwnProperty('category') ? obj.category : null;
        this.comments = obj.hasOwnProperty('comments') ? obj.comments : null;
        this.creationDate = obj.hasOwnProperty('creationDate') ? obj.creationDate : null;
        this.updateDate = obj.hasOwnProperty('updateDate') ? obj.updateDate : null;
        return this.published = obj.hasOwnProperty('published') ? obj.published : null;
      }
    };

    Post.prototype.getInfo = function() {
      return {
        id: this.id,
        title: this.title,
        author: this.author,
        body: this.body,
        tags: this.tags,
        category: this.category,
        comments: this.comments,
        creationDate: this.creationDate,
        updateDate: this.updateDate,
        published: this.publishe
      };
    };

    Post.prototype.get = function(attribute) {
      if (this.hasOwnProperty(attribute)) {
        return this[attribute];
      } else {
        return null;
      }
    };

    return Post;

  })();
});

angular.module('Blog').factory('Settings', function($http) {
  var Settings;
  return Settings = (function() {
    function Settings(obj) {
      var i, len, property;
      this.title = null;
      this.description = null;
      this.keywords = null;
      this.author = null;
      this.header = null;
      this.footer = null;
      if (obj != null) {
        for (i = 0, len = obj.length; i < len; i++) {
          property = obj[i];
          this[attribute] = obj[property];
        }
      }
    }

    Settings.prototype.set = function(obj) {
      var i, len, property, results;
      if (obj != null) {
        results = [];
        for (i = 0, len = obj.length; i < len; i++) {
          property = obj[i];
          results.push(this[attribute] = obj[property]);
        }
        return results;
      }
    };

    Settings.prototype.getInfo = function() {
      return {
        title: this.title,
        description: this.description,
        keywords: this.keywords,
        author: this.author,
        header: this.header,
        footer: this.footer
      };
    };

    Settings.prototype.get = function(attribute) {
      if (this.hasOwnProperty(attribute)) {
        return this[attribute];
      } else {
        return null;
      }
    };

    return Settings;

  })();
});

angular.module('Users').factory('User', function($http, $location, $window, AuthenticationService) {
  var User;
  return User = (function() {
    function User(obj) {
      if (obj != null) {
        this.username = obj.hasOwnProperty('username') ? obj.username : null;
        this.email = obj.hasOwnProperty('email') ? obj.email : null;
        this.password = obj.hasOwnProperty('password') ? obj.password : null;
        this.firstname = obj.hasOwnProperty('firstname') ? obj.firstname : null;
        this.lastname = obj.hasOwnProperty('lastname') ? obj.lastname : null;
      }
    }

    User.prototype.set = function(obj) {
      if (obj != null) {
        this.username = obj.hasOwnProperty('username') ? obj.username : null;
        this.email = obj.hasOwnProperty('email') ? obj.email : null;
        this.password = obj.hasOwnProperty('password') ? obj.password : null;
        this.firstname = obj.hasOwnProperty('firstname') ? obj.firstname : null;
        return this.lastname = obj.hasOwnProperty('lastname') ? obj.lastname : null;
      }
    };

    User.prototype.getInfo = function() {
      return {
        username: this.username,
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname
      };
    };

    User.prototype.get = function(attribute) {
      if (this.hasOwnProperty(attribute) && attribute !== 'password') {
        return this[attribute];
      } else {
        return null;
      }
    };

    return User;

  })();
});

angular.module('Admin').controller('AdminFilesController', function($scope, $http, $routeParams, $location, $window, FileService) {
  var err;
  $scope.fileList = [];
  FileService.getList().success(function(data) {
    $scope.fileList = data;
    return console.log('success');
  }).error(function(status, data) {
    return err(status, data);
  });
  err = function(status, data) {
    if (status >= 400 && data.message === 'jwt expired') {
      return UserService.resetAuth();
    }
  };
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
  return $scope.removeFile = function(id) {
    return FileService.remove(id).success(function(data) {
      console.log('success');
      return FileService.getList().success(function(data) {
        $scope.fileList = data;
        return console.log('success');
      }).error(function(status, data) {
        return err(status, data);
      });
    }).error(function(status, data) {
      return err(status, data);
    });
  };
});

angular.module('Admin').controller('AdminPagesController', function($scope, $http, $routeParams, $location, $window, PostService, PageService) {
  var err;
  err = function(status, data) {
    if (status >= 400 && data.message === 'jwt expired') {
      return UserService.resetAuth();
    }
  };
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
  if ($location.path().lastIndexOf('/admin/pages/create', 0) === 0) {
    $scope.page = {
      title: '',
      author: $window.sessionStorage.username,
      route: '',
      body: '',
      published: true
    };
    return $scope.createPage = function(page) {
      return PageService.create(page).success(function(data) {
        console.log('success');
        return $location.path('/admin/pages');
      }).error(function(status, data) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/pages/edit', 0) === 0) {
    PageService.get($location.path().slice(18)).success(function(data) {
      $scope.page = data;
      $scope.page.ident = $scope.page.route;
      return console.log($scope.page);
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
    $scope.savePage = function(page) {
      console.log(page);
      return PageService.save(page.ident, page).success(function(data) {
        console.log('success');
        return $location.path('/admin/pages');
      }).error(function(status, data) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
    };
    return $scope.deletePage = function(page) {
      return PageService.remove(page.ident).success(function(data) {
        console.log('success');
        return $location.path('/admin/pages');
      }).error(function(status, data) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/pages', 0) === 0) {
    return PageService.getList().success(function(data) {
      return $scope.pageList = data;
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  } else {
    return $location.path('/admin');
  }
});

angular.module('Admin').controller('AdminPostsController', function($scope, $http, $routeParams, $location, $window, UserService, PostService, PageService) {
  var err;
  err = function(status, data) {
    if (status >= 400 && data.message === 'jwt expired') {
      return UserService.resetAuth();
    }
  };
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
  $scope.postList = [];
  if ($location.path().lastIndexOf('/admin/blog/posts/create', 0) === 0) {
    $scope.post = {
      title: '',
      author: $window.sessionStorage.username,
      body: '',
      tags: [],
      category: '',
      comments: [],
      published: true
    };
    return $scope.createPost = function(post) {
      return PostService.create(post).success(function(data, status, headers, config) {
        console.log('success');
        return $location.path('/admin/blog/posts');
      }).error(function(data, status, headers, config) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/blog/posts/edit', 0) === 0) {
    PostService.get($location.path().slice(23)).success(function(data) {
      $scope.post = data;
      $scope.post.ident = $scope.post.id;
      return $scope.post.tags = $scope.post.tags.join(", ");
    }).error(function(data, status, headers, config) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
    $scope.savePost = function(post) {
      console.log('post save');
      post.tags = post.tags.split(", ");
      console.log(post);
      return PostService.save(post.ident, post).success(function(data) {
        console.log('success');
        return $location.path('/admin/blog/posts');
      }).error(function(data, status, headers, config) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
    };
    return $scope.deletePost = function(post) {
      return PostService.remove(post.ident).success(function(data) {
        console.log('success');
        return $location.path('/admin/blog/posts');
      }).error(function(data, status, headers, config) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/blog/posts', 0) === 0) {
    return PostService.getList().success(function(data) {
      $scope.postList = data;
      return console.log($scope.postList);
    }).error(function(data, status, headers, config) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  } else {
    return $location.path('/admin');
  }
});

angular.module('Admin').controller('AdminSettingsController', function($scope, $http, $routeParams, $location, $window, MenuService, SettingService) {
  var err;
  $scope.categoryList = [];
  $scope.menuList = [];
  $scope.newMenu = {
    id: '',
    name: '',
    route: ''
  };
  $scope.settings = {
    accountCreation: true,
    title: 'Fluid',
    header: {
      content: 'Fluid\n========',
      body: ''
    },
    footer: {
      content: '',
      body: ''
    }
  };
  err = function(status, data) {
    if (status >= 400 && data.message === 'jwt expired') {
      return UserService.resetAuth();
    }
  };
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
  SettingService.get().success(function(data) {
    console.log('Settings');
    console.log(data);
    if (data !== null) {
      console.log('not null');
      $scope.settings = data;
    }
    return console.log($scope.settings);
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  $scope.saveSettings = function(data) {
    return SettingService.save(data).success(function(res) {
      return console.log('success');
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
  MenuService.getList().success(function(data) {
    return $scope.menuList = data;
  }).error(function(status, data) {
    err(status, data);
    console.log(status);
    return console.log(data);
  });
  $scope.createMenuItem = function(data) {
    console.log('click');
    return MenuService.create(data).success(function(res) {
      MenuService.getList().success(function(data) {
        return $scope.menuList = data;
      }).error(function(status, data) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
      return console.log('success');
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
  $scope.saveMenuItem = function(data) {
    return MenuService.save(data.id, data).success(function(data) {}).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
  return $scope.deleteMenuItem = function(data) {
    return MenuService.remove(data.id).success(function(data) {
      return MenuService.getList().success(function(data) {
        return $scope.menuList = data;
      }).error(function(status, data) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
});

angular.module('Blog').controller('BlogController', function($scope, $http, $sce, $routeParams, $location, $window, PostService, MenuService) {
  $scope.skip = 0;
  $scope.limit = 5;
  PostService.getBySlice($scope.skip, $scope.limit).success(function(data) {
    console.log(data);
    if (data.length !== 0) {
      return $scope.posts = data;
    }
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  $scope.getNext = function() {
    $scope.skip += 5;
    $scope.limit += 5;
    return PostService.getBySlice($scope.skip, $scope.limit).success(function(data) {
      console.log(data);
      if (data.length !== 0) {
        return $scope.posts = data;
      }
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.getPrevious = function() {
    $scope.skip -= 5;
    $scope.limit -= 5;
    return PostService.getBySlice($scope.skip, $scope.limit).success(function(data) {
      console.log(data);
      if (data.length !== 0) {
        return $scope.posts = data;
      }
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.sanatizeHtml = function(html) {
    return $sce.trustAsHtml(html);
  };
  return $scope.navIsActive = function() {
    if ($scope.skip === 0) {
      return true;
    } else {
      return false;
    }
  };
});

angular.module('Index').controller('IndexController', function($scope, $routeParams, $location, $window, $sce, UserService, AuthenticationService, MenuService, PageService, SettingService) {
  $scope.site = {
    title: 'Fluid',
    header: '',
    footer: ''
  };
  $scope.isActive = function(route) {
    if (route === '//') {
      route = '/';
    }
    return $location.path() === route;
  };
  MenuService.getList().success(function(data) {
    return $scope.menu = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  SettingService.get().success(function(data) {
    $scope.header = data.header;
    $scope.header.htmlSafe = $sce.trustAsHtml($scope.header.body);
    $scope.footer = data.footer;
    return $scope.footer.htmlSafe = $sce.trustAsHtml($scope.footer.body);
  }).error(function(status, data) {
    console.log(status);
    console.log(data);
    return $scope.page.htmlSafe = $sce.trustAsHtml($scope.page.body);
  });
  PageService.get('sider').success(function(data) {
    $scope.sider = data;
    return $scope.sider.htmlSafe = $sce.trustAsHtml($scope.sider.body);
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  return $scope.adminMenu = [
    {
      id: 'public',
      name: 'Public',
      order: 0,
      route: '/'
    }, {
      id: 'settings',
      name: 'Settings',
      order: 1,
      route: '/#/admin'
    }, {
      id: 'posts',
      name: 'Posts',
      order: 2,
      route: '/#/admin/blog/posts'
    }, {
      id: 'pages',
      name: 'Pages',
      order: 3,
      route: '/#/admin/pages'
    }, {
      id: 'files',
      name: 'Files',
      order: 4,
      route: '/#/admin/files'
    }
  ];
});

angular.module('User').controller('LogoutController', function($scope, $routeParams, $location, $window, UserService, AuthenticationService) {
  if (AuthenticationService.isLogged) {
    AuthenticationService.isLogged = false;
    delete $window.sessionStorage.token;
  }
  return $location.path('/');
});

angular.module('Page').controller('PageController', function($scope, $http, $routeParams, $location, $window, $sce, PageService, MenuService) {
  $scope.page = {};
  if ($location.path() === '/') {
    return PageService.get('index').success(function(data) {
      $scope.page = data;
      return $scope.page.htmlSafe = $sce.trustAsHtml($scope.page.body);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  } else {
    console.log($location.path().slice(1));
    return PageService.get($location.path().slice(1)).success(function(data) {
      $scope.page = data;
      return $scope.page.htmlSafe = $sce.trustAsHtml($scope.page.body);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  }
});

angular.module('Blog').controller('PostController', function($scope, $http, $routeParams, $location, $sce, $window, PostService, MenuService) {
  return PostService.get($location.path().slice(6)).success(function(data) {
    $scope.post = data;
    return $scope.post.htmlSafe = $sce.trustAsHtml($scope.post.body);
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});

angular.module('User').controller('UserController', function($scope, $http, $routeParams, $location, $window, UserService, AuthenticationService, MenuService) {
  $scope.alerts = [];
  $scope.user = {};
  if ($location.path().lastIndexOf('/admin/user', 0) === 0) {
    UserService.getUserData($window.sessionStorage.username).success(function(data) {
      $scope.user = data;
      return console.log($scope.user);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  }
  $scope.logIn = function(username, password) {
    console.log('login attempt: ' + username + ' ' + password);
    if (username !== undefined && password !== undefined) {
      return UserService.logIn(username, password).success(function(data) {
        AuthenticationService.isLogged = true;
        $window.sessionStorage.token = data.token;
        $window.sessionStorage.username = data.user.username;
        $window.sessionStorage.firstname = data.user.firstname;
        $window.sessionStorage.lastname = data.user.lastname;
        $location.path('/admin');
        return console.log('connexion success');
      }).error(function(status, data) {
        $scope.alerts.push({
          type: 'danger',
          msg: "Couldn't login :( Please check username and password !"
        });
        console.log(status);
        return console.log(data);
      });
    }
  };
  $scope.signUp = function(newUser) {
    if (newUser.username !== undefined && newUser.password !== undefined && newUser.email !== undefined && newUser.password === newUser.passwordCheck) {
      return UserService.signUp(newUser).success(function(data) {
        return $location.path('/login');
      }).error(function(status, data) {
        $scope.alerts.push({
          type: 'danger',
          msg: "Woops something went wrong... couldn't create an account for you"
        });
        console.log(status);
        return console.log(data);
      });
    }
  };
  $scope.update = function(user) {
    if (user.username !== undefined && user.username !== '' && user.email !== undefined && user.email !== '') {
      if (user.password === '') {
        del(user.password);
      }
      return UserService.updateUserData(user.username, user).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
  $scope.forgotPassword = function(email) {
    if (email !== undefined) {
      return UserService.forgotPassword(email).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
  return $scope.resetPassword = function(password) {
    if (password !== undefined) {
      return UserService.resetPassword($routeParams.token, password).success(function(data) {
        console.log('success');
        return $location.path('/login');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
});

angular.module('Auth').factory("authInterceptor", function($rootScope, $q, $window, $location, AuthenticationService) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = "Bearer " + $window.sessionStorage.token;
      }
      return config;
    },
    response: function(response) {
      if (response.status === 401) {
        AuthenticationService.isLogged = false;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.username;
        delete $window.sessionStorage.firstname;
        delete $window.sessionStorage.lastname;
        $location.path = '/login';
      }
      return response || $q.when(response);
    }
  };
});

angular.module('Auth').factory('AuthenticationService', function($window, $location) {
  var auth;
  auth = $window.sessionStorage.token !== undefined ? {
    isLogged: true
  } : {
    isLogged: false
  };
  return auth;
});

angular.module('Admin').factory('FileService', function($http, File) {
  var genericSuccessCallback;
  ({
    genericErrorCallback: function(response) {
      console.log("error", response);
      return $q.reject(response);
    }
  });
  genericSuccessCallback = function(response) {
    return new File(response.data);
  };
  return {
    getFileList: function() {
      return $http.get('/data/files.json');
    },
    removeFile: function(id) {
      return $http["delete"]("/data/files/" + id);
    }
  };
});

angular.module('Blog').factory('MenuService', function($http, Menu) {
  var genericSuccessCallback;
  ({
    genericErrorCallback: function(response) {
      console.log("error", response);
      return $q.reject(response);
    }
  });
  genericSuccessCallback = function(response) {
    return new Menu(response.data);
  };
  return {
    getMenuList: function() {
      return $http.get('/data/menu.json');
    },
    getMenu: function(id) {
      return $http.get("/data/menu/" + id + ".json");
    },
    removeMenu: function(id) {
      return $http["delete"]("/data/menu/" + id + ".json");
    },
    createMenu: function(id) {
      return $http.post('/data/menu/', id);
    },
    saveMenu: function(id, data) {
      return $http.put("/data/menu/" + id + ".json", data);
    }
  };
});

angular.module('Site').factory('PageService', function($http, Page) {
  var genericSuccessCallback;
  ({
    genericErrorCallback: function(response) {
      console.log("error", response);
      return $q.reject(response);
    }
  });
  genericSuccessCallback = function(response) {
    return new Page(response.data);
  };
  return {
    getPageList: function() {
      return $http.get('/data/pages.json');
    },
    getPage: function(id) {
      return $http.get("/data/page/" + id + ".json");
    },
    removePage: function(id) {
      return $http["delete"]("/data/page/" + id + ".json");
    },
    createPage: function(data) {
      return $http.post('/data/page/', data);
    },
    savePage: function(id, data) {
      return $http.put("/data/page/" + id + ".json", data);
    }
  };
});

angular.module('Blog').factory('PostService', function($http, Post) {
  return {
    genericErrorCallback: function(response) {
      console.log("error", response);
      return $q.reject(response);
    },
    getPostList: function() {
      return $http.get('/data/blog/posts.json');
    },
    getPostsBySlice: function(s, l) {
      var successCallback;
      successCallback = function(response) {
        return new Post(response.data);
      };
      return $http.get("/data/blog/post/" + s + "/" + l + "/posts.json");
    },
    getPost: function(id) {
      var successCallback;
      successCallback = function(response) {
        return new Post(response.data);
      };
      return $http.get("/data/blog/post/" + id + ".json").then(this.successCallback, this.genericErrorCallback);
    },
    createPost: function(data) {
      return $http.post('/data/blog/post/', data);
    },
    savePost: function(id, data) {
      return $http.put("/data/blog/post/" + id + ".json", data);
    },
    removePost: function(id) {
      return $http["delete"]("/data/blog/post/" + id + ".json");
    }
  };
});

angular.module('Admin').factory('SettingsService', function($http, Settings) {
  var genericSuccessCallback;
  ({
    genericErrorCallback: function(response) {
      console.log("error", response);
      return $q.reject(response);
    }
  });
  genericSuccessCallback = function(response) {
    return new Settings(response.data);
  };
  return {
    getSettings: function() {
      return $http.get('/data/settings.json').then(this.genericSuccessCallback, this.genericErrorCallback);
    },
    createSettings: function(settings) {
      return $http.post('/data/settings.json', settings);
    },
    saveSettings: function(settings) {
      return $http.put('/data/settings.json', settings);
    }
  };
});

angular.module('Users').factory('UserService', function($http, $q, User) {
  var genericSuccessCallback;
  ({
    genericErrorCallback: function(response) {
      console.log("error", response);
      return $q.reject(response);
    }
  });
  genericSuccessCallback = function(response) {
    return new User(response.data);
  };
  return {
    logInUser: function(userInfo) {
      return $http.post('/login', userInfo).then(this.genericSuccessCallback, this.genericErrorCallback);
    },
    signUpUser: function(user) {
      return $http.post('/signup', user).then(this.genericSuccessCallback, this.genericErrorCallback);
    },
    forgotUserPassword: function(email) {
      return $http.post('/forgot', {
        email: email
      });
    },
    resetUserPassword: function(info) {
      return $http.post('/reset', info);
    },
    getUser: function(username) {
      return $http.get("/data/user/" + username + ".json").then(this.genericSuccessCallback, this.genericErrorCallback);
    },
    updateUser: function(user) {
      var username;
      username = user.get('username');
      return $http.put("/data/user/" + username + ".json", user.getInfo());
    }
  };
});
