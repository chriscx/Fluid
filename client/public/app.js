var FluidApp;

FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'textAngular', 'Index', 'User', 'Blog', 'Page', 'Admin']);

angular.module('Index', []);

angular.module('User', []);

angular.module('Blog', []);

angular.module('Page', []);

angular.module('Admin', []);

FluidApp.config([
  '$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {
      templateUrl: 'views/page.html',
      controller: 'PageController',
      access: {
        requiredLogin: false
      }
    }).when('/login', {
      templateUrl: 'views/login.html',
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
      templateUrl: 'views/signup.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/forgot', {
      templateUrl: 'views/forgot.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/reset/:token', {
      templateUrl: 'views/reset.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/admin', {
      templateUrl: 'views/admin.settings.html',
      controller: 'AdminSettingsController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog/posts', {
      templateUrl: 'views/admin.posts.html',
      controller: 'AdminPostsController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog/posts/create', {
      templateUrl: 'views/admin.createPost.html',
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
      templateUrl: 'views/admin.pages.html',
      controller: 'AdminPagesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/pages/create', {
      templateUrl: 'views/admin.createPage.html',
      controller: 'AdminPagesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/pages/edit/:route', {
      templateUrl: 'views/admin.editPage.html',
      controller: 'AdminPagesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/files', {
      templateUrl: 'views/admin.files.html',
      controller: 'AdminFilesController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/files/upload', {
      templateUrl: 'views/admin.uploadFile.html',
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
      templateUrl: 'views/blog.html',
      controller: 'BlogController',
      access: {
        requiredLogin: false
      }
    }).when('/blog/:id', {
      templateUrl: 'views/post.html',
      controller: 'PostController',
      access: {
        requiredLogin: false
      }
    }).when('/:route', {
      templateUrl: 'views/page.html',
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
    var _ref;
    console.log($window.sessionStorage.token);
    console.log(AuthenticationService);
    if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
      $location.path('/login');
    }
    if (((_ref = nextRoute.originalPath) === '/login' || _ref === '/signup') && AuthenticationService.isLogged) {
      return $location.path('/admin');
    }
  });
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

angular.module('User').factory("authInterceptor", function($rootScope, $q, $window, $location, AuthenticationService) {
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

angular.module('User').factory('AuthenticationService', function($window, $location) {
  var auth;
  auth = $window.sessionStorage.token !== undefined ? {
    isLogged: true
  } : {
    isLogged: false
  };
  return auth;
});

angular.module('User').factory('FileService', function($http, $location, $window) {
  return {
    getList: function() {
      return $http.get('/data/files.json');
    },
    remove: function(id) {
      return $http["delete"]('/data/files/' + id);
    }
  };
});

angular.module('Blog').factory('MenuService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/menu.json');
    },
    get: function(id) {
      return $http.get('/data/menu/' + id + '.json');
    },
    remove: function(id) {
      return $http["delete"]('/data/menu/' + id + '.json');
    },
    create: function(id) {
      return $http.post('/data/menu/', id);
    },
    save: function(id, data) {
      return $http.put('/data/menu/' + id + '.json', data);
    }
  };
});

angular.module('Page').factory('PageService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/pages.json');
    },
    get: function(route) {
      return $http.get('/data/page/' + route + '.json');
    },
    remove: function(route) {
      return $http["delete"]('/data/page/' + route + '.json');
    },
    create: function(data) {
      return $http.post('/data/page/', data);
    },
    save: function(route, data) {
      return $http.put('/data/page/' + route + '.json', data);
    }
  };
});

angular.module('Blog').factory('PostService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/blog/posts.json');
    },
    getBySlice: function(s, l) {
      return $http.get('/data/blog/post/' + s + '/' + l + '/posts.json');
    },
    get: function(id) {
      return $http.get('/data/blog/post/' + id + '.json');
    },
    create: function(data) {
      return $http.post('/data/blog/post/', data);
    },
    save: function(id, data) {
      return $http.put('/data/blog/post/' + id + '.json', data);
    },
    remove: function(id) {
      return $http["delete"]('/data/blog/post/' + id + '.json');
    }
  };
});

angular.module('Blog').factory('SettingService', function($http) {
  return {
    get: function() {
      return $http.get('/data/settings.json');
    },
    create: function(data) {
      return $http.post('/data/settings.json', data);
    },
    save: function(data) {
      return $http.put('/data/settings.json', data);
    }
  };
});

angular.module('User').factory('UserService', function($http, $location, $window, AuthenticationService) {
  return {
    logIn: function(username, password) {
      return $http.post('/login', {
        username: username,
        password: password
      });
    },
    signUp: function(user) {
      console.log(user);
      return $http.post('/signup', user);
    },
    forgotPassword: function(email) {
      return $http.post('/forgot', {
        email: email
      });
    },
    resetPassword: function(token, password) {
      return $http.post('/reset', {
        token: token,
        password: password
      });
    },
    getUserData: function(username) {
      return $http.get('/data/user/' + username + '.json');
    },
    updateUserData: function(username, data) {
      return $http.put('/data/user/' + username + '.json', data);
    }
  };
});
