
angular.module('Movies', [])
    .controller('MoviesController', function($scope, $http) {
        $http.get('../angular/data/movies-2014.json')
            .then(function(result) {
                $scope.movies = result.data;
            });
    });