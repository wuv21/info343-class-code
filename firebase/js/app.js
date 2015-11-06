angular.module('ChatApp', ['firebase'])
    .constant('firebaseUrl', 'https://info343chat.firebaseio.com/messages')
    .controller('ChatController', function($scope, $firebaseArray, firebaseUrl) {
        //create ref to Firebase
        var ref = new Firebase(firebaseUrl);
        ref.limitToLast(1000);

        $scope.messages = $firebaseArray(ref);

        //init form fields
        $scope.name = null;
        $scope.body = null;

        $scope.sendMessage = function() {
            //adds a new obj to array and syncs
            $scope.messages.$add({
                name: $scope.name,
                body: $scope.body,
                createdAt: Firebase.ServerValue.TIMESTAMP
            });

            $scope.body = null;
        }; //sendMessage()


    });
