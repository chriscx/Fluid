
var FluidApp = angular.module('FluidApp', []);

FluidApp.service('CategoryService', function() {

  this.createCategory = function(data) {

    $.post('/blog/category/' + data.name + '.json', data, function() {
      console.log('POST success');
    });
  }

  this.saveCategory = function(data) {
    $.put('/blog/category/' + data.name + '.json', data, function() {
      console.log('PUT success');
    });
  }

  function deleteCategory(data) {
    $.del('/blog/category/' + data.name + '.json',  function() {
      console.log('PUT success');
    });
  }
});

FluidApp.service('PostService', function() {

  this.createPost = function(data) {
    $.post('/blog/post/' + getSlug(data.title) + '.json', data, function() {
      console.log('POST success');
    });
  }

  this.savePost = function(data) {
    var oldId = data.oldId;
    delete data.oldId;
    $.put('/blog/post/' + oldId + '.json', data, function() {
      console.log('PUT success');
    });
  }

  this.deletePost = function(data) {
    $.del('/blog/post/' + getSlug(data.title) + '.json',  function() {
      console.log('DEL success');
    });
  }
});

FluidApp.service('PageService', function() {

  this.createPage = function(data) {

    $.post('/' + data.route, data, function() {
      console.log('POST success');
    });
  }

  this.savePage = function(data) {
    $.put('/' + data.route, data, function() {
      console.log('PUT success');
    });
  }

  function deletePage() {

    $.del('/' + route,  function() {
      console.log('PUT success');
    });
  }
});

FluidApp.controller('AdminController', function($scope, PostService, PageService) {

  $.get('/blog/posts/0/100/posts.json', function(data) {
    $scope.$apply(function(){
      $scope.posts = data.entries;
    });
  });

  $scope.addNewPost = function() {
    var title = $('#input_add_post').val();
    if(title !== '')
      $scope.posts.push({
        title: title,
        id: getSlug(title),
        body: '',
        tags: [],
        category: '',
        updateDate: (new Date()).getTime(),
        published: true
      });
      $('#input_add_post').val('');
  }

  $scope.savePost = function() {
    var title, data, body, tags, oldId;

    title = $('#input_post_title').val();
    body = $('#textarea_body_post').innerHTML;
    tags = $('#input_post_tags').val();
    oldId = $('#oldId').val();

    data = {
      title: title,
      id: getSlug(title),
      oldId: oldId,
      body: body,
      tags: [],
      category: '',
      updateDate: (new Date()).getTime(),
      published: true
    };

    if($('#select_post :selected').new)
      PostService.createPost(data);
    else
      PostService.savePost(data);
  }

  $scope.deletePost = function() {
    var data = {title: document.getElementById('input_post_title').value};
    PostService.deletePost(data);
  }

  $scope.addNewPage = function() {
    var title = $('#input_add_page').val();
    if(title !== '')
      scope.pages.push({
        title: title,
        route: '',
        body: '',
        updateDate: (new Date()).getTime(),
        published: true
      })
      $('#input_add_page').val('');
  }

  $scope.savePage = function() {
    var route, data, title, body;
    route = $('#input_page_route').val();
    title = $('#input_page_title').val();
    body = $('#textarea_body_page').innerHTML;
    data = {
      title: title,
      route: route,
      body: body,
      updateDate: (new Date()).getTime(),
      published: true
    }

    if($('#select_page :selected').new)
      PageService.createPage(data);
    else
      PageService.savePage(data);
  }

  $scope.deletePage = function() {
    var data = {name: document.getElementById('input_page_route').value};g
    PageService.deletePage(data);
  }
});
