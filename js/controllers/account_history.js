/**
 * Created by eric on 16/2/23.
 */
app.controller('AccountHistoryController', ['$scope', '$http', '$stateParams', '$translate', 'toaster', 'Billing', function($scope, $http, $stateParams, $translate, toaster, Billing) {
    $scope.config = {
        queryPeriod: '1',
        type: $stateParams.type
    };

    $scope.data = [];

    $scope.fireQuery = function(queryPeriod) {
        var today = new Date();
        var start = new Date(today);
        switch (queryPeriod) {
            case '0':
                return;
            case '1':
                start.setDate(today.getDate() - 7);
                break;
            case '2':
                start.setDate(today.getDate() - 30);
                break;
            case '3':
                start.setMonth(today.getMonth() - 3);
                break;
            case '4':
                start.setMonth(today.getMonth() - 6);
                break;
            case '5':
                start.setFullYear(today.getFullYear() - 1);
                break;
            default:
                return;
        }

        if($scope.config.type === 'recharge') {
            Billing.getRechargeHistory(start.getTime(), today.getTime()).then(function success(response) {
                var recharges = response.data.data;
                if(recharges) {
                    $scope.data = [];
                    for(var i=0; i<recharges.length; i++) {
                        $scope.data.push({
                            'date': recharges[i].rechargeDatetime,
                            'amount': recharges[i].amount / 100,
                            'desc': recharges[i].type,
                            'id': recharges[i].id,
                            'status': recharges[i].status,
                            'recharge': true
                        });
                    }
                }
            }, function error(msg) {
                $translate('account.error.GET_HISTORY').then(function(text){
                    toaster.pop('error', text, msg.message);
                });
                console.log(msg);
            });
        } else if($scope.config.type === 'consumption') {
            Billing.getConsumptionHistory(start.getTime(), today.getTime()).then(function success(response) {
                var consumptions = response.data.data;
                if(consumptions) {
                    $scope.data = [];
                    for(var i=0; i<consumptions.length; i++) {
                        $scope.data.push({
                            'date': consumptions[i].transactionDatetime,
                            'amount': consumptions[i].amount / 100,
                            'desc': consumptions[i].type,
                            'id': consumptions[i].id,
                            'status': recharges[i].status,
                            'recharge': false
                        });
                    }
                }
            }, function error(msg) {
                $translate('account.error.GET_HISTORY').then(function(text){
                    toaster.pop('error', text, msg.message);
                });
                console.log(msg);
            });
        } else {

        }
    };

    $scope.fireQuery($scope.config.queryPeriod);
}]);