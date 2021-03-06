// public/core.js
var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.days = []
    $scope.dagar = ["Måndag","Tisdag","Onsdag","Torsdag","Fredag"]
    


    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
            $scope.updateDays($scope.todos.length)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.table(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.updateDay = function(index, max) {
        previousIndex = $scope.days[index]
        while ($scope.days[index] == previousIndex) {
            $scope.days[index] = (Math.floor(Math.random() * max));
        }
    }

    $scope.updateDays = function(max) {
        for (var i = 0; i < $scope.dagar.length; i++) {
            $scope.days[i] = (Math.floor(Math.random() * max));
        };
    }

    $scope.goto = function (url) {
        window.location.href = url;
        return false;
    }
}