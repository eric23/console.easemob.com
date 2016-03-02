app.controller('AccountController', ['$scope', '$translate', 'toaster', 'Billing', function($scope, $translate, toaster, Billing){
    $scope.account = {
        notEnoughBalance: false,
        balance: 0.0,
        moreRecharge: false,
        moreConsumption: false,
        recharges: [],
        consumptions: []
    };

    $scope.getAccount = function () {
        Billing.getAccount().then(function success(response){
            if(response.data.data) {
                var id = response.data.data.id;
                var balance = response.data.data.balance;

                if(id) {
                    Billing.setAccountID(id);
                } else {
                    throw new Error('Get account id failed!');
                }

                if(balance != undefined) {
                    $scope.account.balance = balance;
                    if(balance < 0) {
                        $scope.account.notEnoughBalance = true;
                    }
                }
            }
        }, function error(msg){
            $translate('account.error.GET_ACCOUNT').then(function(text){
                toaster.pop('error', text, msg.message);
            });

            console.log(msg);
        });
    };

    $scope.getAccount();

    $scope.getConsumptionTrends = function() {
        /*
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
        */
        var data = [
            {"amount":-5000000,"month":"2016-02"},
            {"amount":-4000000,"month":"2016-03"},
            {"amount":-8000000,"month":"2016-04"},
            {"amount":-1500000,"month":"2016-05"}
        ];
        var res = [];

        var monthCount = data.length;
        if(monthCount < 6) {
            for(var i=1; i<=6-monthCount; i++) {
                res.push([i, 0]);
            }
        }
        for(var i=0; i<data.length; i++) {
            res.push([6-monthCount+i+1, 0-data[i].amount/100]);
        }

        return res;
    };

    $scope.d4 = $scope.getConsumptionTrends();

    $scope.getRecharges = function() {
        Billing.getRechargeHistory().then(function success(response){
            if(response.data.data) {
                $scope.account.recharges = response.data.data;
                if(response.data.data.length > 5) {
                    $scope.account.moreRecharge = true;
                }
            }
        }, function error(msg){
            $translate('account.error.GET_RECHARGES').then(function(text){
                toaster.pop('error', text, msg.message);
            });
            console.log(msg);
        });
    };

    $scope.getRecharges();

    $scope.getConsumptions = function() {
        Billing.getConsumptionHistory().then(function success(response){
            if(response.data.data) {
                $scope.account.consumptions = response.data.data;
                if(response.data.data.length > 5) {
                    $scope.account.moreConsumption = true;
                }
            }
        }, function error(msg){
            $translate('account.error.GET_CONSUMPTIONS').then(function(text){
                toaster.pop('error', text, msg.message);
            });
            console.log(msg);
        });
    };

    $scope.getConsumptions();

}]);

app.controller('AccountRechargeCtrl', ['$scope', '$modalInstance', '$translate', 'toaster', 'Billing', function($scope, $modalInstance, $translate, toaster, Billing) {
    $scope.account = {processing:false, done:false};
    $scope.invoice = {};
    $scope.ok = function () {
        var amount = $scope.account.rechargeAmount;

        if(!amount || amount > 0) {
            Billing.recharge(amount).then(function success(response) {
                if(response.data.data) {
                    var orderId = response.data.data.internalOrderNo;
                    var payUrl = response.data.data.rechargeUrl;

                    if(orderId) {
                        $scope.account.orderId = orderId;
                    }

                    if(payUrl) {
                        window.open(payUrl);
                        $scope.account.processing = true;
                    }
                }

            }, function error(msg) {
                $translate('account.error.START_RECHARGING').then(function(text){
                    toaster.pop('error', text, msg.message);
                });
                console.log(msg);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.check = function () {
        if($scope.account.processing) {
            Billing.getRechargeStatus($scope.account.orderId).then(function success(response){
                if(response.data.data) {
                    var status = response.data.data.status;

                    if(status && status === 'CHARGED') {
                        $scope.invoice.id = response.data.data.tradeNo;
                        $scope.invoice.channel = response.data.data.type;
                        $scope.invoice.account = response.data.data.buyerId;
                        $scope.invoice.after = response.data.data.preAmount/100 + response.data.data.amount/100;
                        $scope.invoice.before = response.data.data.preAmount/100;
                        $scope.account.done = true;
                    } else {
                        console.log('Charging...');
                    }
                }
            }, function error(msg){
                $translate('account.error.CHECK_RECHARGING').then(function(text){
                    toaster.pop('error', text, msg.message);
                });
                console.log(msg);
            });
        }
    };

    var paymentWatcher = setInterval($scope.check, 10*1000);
    $scope.$watch('account.done', function (newValue) {
        if(newValue === true) {
            clearInterval(paymentWatcher);
        }
    }, true);

    $scope.done = function () {
        $scope.account = {};
        $scope.invoice = {};
        $modalInstance.close();
    };
}]);

app.controller('RechargeModalCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'accountRecharge.html',
            controller: 'AccountRechargeCtrl',
            size: size,
            backdrop: 'static',
            keyboard: false
        });

        modalInstance.result.then(function (selectedItem) {
            $log.info(selectedItem);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);