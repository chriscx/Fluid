/**
*
*/
var FluidApp = angular.module('FluidApp', ['ui.bootstrap']);

/**
* Service for managing categories
* only to be used in admin view
*/
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

/**
* Service for managing posts
* only to be used in admin view
*/
FluidApp.service('PostService', function() {

  this.createPost = function(data) {
    $.post('/blog/post/' + getSlug(data.title) + '.json', data, function() {
      console.log('POST success');
    });
  }

  this.savePost = function(data) {
    var oldSlug = data.oldSlug;
    delete data.oldSlug;
    delete data.new
    $.put('/blog/post/' + oldSlug + '.json', data, function() {
      console.log('PUT success');
    });
  }

  this.deletePost = function(data) {
    $.del('/blog/post/' + getSlug(data.title) + '.json',  function() {
      console.log('DEL success');
    });
  }
});

/**
* Service for managing page
* only to be used in admin view
*/
FluidApp.service('PageService', function() {

  this.createPage = function(data) {

    $.post('/page/' + data.route + '.json', data, function() {
      console.log('POST success');
    });
  }

  this.savePage = function(data) {
    var oldRoute = data.oldRoute;
    delete data.oldRoute;
    delete data.new;
    $.put('/page/' + data.route + '.json', data, function() {
      console.log('PUT success');
    });
  }

  function deletePage() {

    $.del('/page/' + route + '.json',  function() {
      console.log('PUT success');
    });
  }
});

/**
* Admin Controller
*/

FluidApp.controller('AdminController', function($scope, PostService, PageService) {

  $.get('/blog/posts/0/100/posts.json', function(data) {
    data.oldId = data.id;
    $scope.$apply(function(){
      $scope.posts = data.entries;
    });
  });
  $.get('/blog/categories.json', function(data) {
    data.oldName = data.name;
    $scope.$apply(function(){
      $scope.categories = data.categories;
    });
  });
  $.get('/pages.json', function(data) {
    data.oldRoute = data.route;
    $scope.$apply(function(){
      $scope.pages = data.pages;
    });
  });

  $scope.addNewCategory = function(name) {
    if(name !== '')
      $scope.posts.push({
        name: name,
        description: '',
        new: true
      });
      $('#input_add_category').val('');
  }

  $scope.saveCategory = function(selectedCategory) {
    if(selectedCategory.new)
      CategoryService.createCategory(selectedCategory);
    else
      CategoryService.saveCategory(selectedCategory);
  }

  $scope.deleteCategory = function(selectedCategory) {
    CategoryService.deleteCategory(selectedCategory);
  }

  $scope.addNewPost = function(title) {
    if(title !== '')
      $scope.posts.push({
        title: title,
        slug: getSlug(title),
        body: '',
        tags: [],
        category: '',
        updateDate: (new Date()).getTime(),
        published: true,
        new: true
      });
      $('#input_add_post').val('');
  }

  $scope.savePost = function(selectedPost) {
    if(selectedPost.new)
      PostService.createPost(selectedPost);
    else
      PostService.savePost(selectedPost);
  }

  $scope.deletePost = function(selectedPost) {
    PostService.deletePost(selectedPost);
  }

  $scope.addNewPage = function(title) {
    if(title !== '')
      $scope.pages.push({
        title: title,
        route: getSlug(title),
        body: '',
        updateDate: (new Date()).getTime(),
        published: true,
        new: true
      })
      $('#input_add_page').val('');
  }

  $scope.savePage = function(selectedPage) {
    if(selectedPage.new)
      PageService.createPage(selectedPage);
    else
      PageService.savePage(selectedPage);
  }

  $scope.deletePage = function(selectedPage) {
    PageService.deletePage(selectedPage);
  }
});
