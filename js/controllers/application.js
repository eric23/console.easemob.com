app.controller('ApplicationsController', ['$scope', '$http', function($scope, $http) {
    $scope.data = [];
    $scope.setPagingData = function(data){
        $.each(data.data, function (key, value) {
            key = key.substring(key.indexOf('/') + 1);
            var app = {'name': key, 'status': 'ok'};
            $scope.data.push(app);
        });
    };
    $scope.getPagedDataAsync = function () {
        setTimeout(function () {
            var data;
            var request = {
                url: 'https://a1.sdb.easemob.com/management/organizations/helloworld/applications',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer YWMtQqZ8WNVdEeWYoz8gh2zYagAAAVQjqftz_VRwoA4rHK5xRpD11_MakoPeJfc',
                    'Content-Type': 'application/json'
                }
            };

            $http(request).success(function (data) {
               $scope.setPagingData(data);
            });

        }, 100);
    };

    $scope.getPagedDataAsync();

    $scope.toggleAllSelection = function() {
        for(var i=0; i<$scope.data.length; i++) {
            $scope.data[i].selected = !$scope.data[i].selected;
        }
    };

    $scope.toggleSelection = function(e) {
        e.selected = true;
    };

    $scope.showApplicationDetail = function(e) {
        alert(e.name)
    };

}]);