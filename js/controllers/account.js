app.controller('AccountController', ['$scope', function($scope){
    $scope.account = {
        notEnoughBalance: true,
        balance: 0.0,
        moreRecharge: false,
        moreConsumption: false,
        recharges: [
            {id: '001', amount: 500, desc: '支付宝充值', date: '2016-02-18 15:00:09'},
            {id: '002', amount: 500, desc: '支付宝充值', date: '2016-02-19 15:00:09'},
            {id: '003', amount: 500, desc: '支付宝充值', date: '2016-02-20 15:00:09'}
        ],
        consumptions: [
            {id: '001', amount: 150, desc: '开通回调', date: '02-18'},
            {id: '002', amount: 200, desc: '月扣费', date: '02-19'},
            {id: '003', amount: 68, desc: '月扣费', date: '02-20'}
        ]
    };

    $scope.getRandomData = function() {
        var data = [],
            totalPoints = 150;
        if (data.length > 0)
            data = data.slice(1);
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }
            data.push(y);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }
        return res;
    }

    $scope.d4 = $scope.getRandomData();
}]);

app.controller('AccountRechargeCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
    $scope.account = {
        balance: 0.0
    };

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('RechargeModalCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'accountRecharge.html',
            controller: 'AccountRechargeCtrl',
            size: size,
            backdrop: 'static'
        });

        modalInstance.result.then(function (selectedItem) {
            $log.info(selectedItem);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);