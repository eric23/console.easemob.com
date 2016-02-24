/**
 * Created by eric on 16/2/23.
 */
angular.module('app').provider('Billing', function () {
    this.host = 'http://localhost:8080';
    this.paymentCallback = 'http://localhost:8080';
    this.settings = {
        'account': '',
        'token': '',
        'accountID': ''
    };
    this.setHost = function (newHost) {
        if(newHost) {
            this.host = newHost;
        }
    };

    this.$get = function ($http, $localStorage, $cookies) {
        var self = this;

        // Migrate from easemob-common.js
        function getCookieNameSufix() {
            var url = window.location.href;
            var cookieNameSufix = '';

            if(url.indexOf('console') > -1 && url.indexOf('easemob.com') > -1) {
                var targetFreg = url.substring(url.indexOf('console') + 8, url.indexOf('easemob.com') - 1);
                if('.' == targetFreg) {
                    cookieNameSufix = 'bj';
                } else {
                    cookieNameSufix = '-' + targetFreg;
                }

                return cookieNameSufix;
            }
        }

        var service = {
            init: function() {
                if ( angular.isDefined($localStorage.billing) ) {
                    self.settings = $localStorage.billing;
                }
                // get account and token from cookie
                var email = $cookies['orgName' + getCookieNameSufix()];
                var token = $cookies['access_token' + getCookieNameSufix()];

                // sync with cookie
                self.settings.account = email;
                self.settings.token = token;
                $localStorage.billing = self.settings;
            },

            setAccountID: function (id) {
                if(id) {
                    self.settings.accountID = id;
                    $localStorage.billing = self.settings;
                }
            },

            getAccount: function () {
                return $http({
                    url: self.host + '/account/get',
                    method: 'GET',
                    params: {
                        clientId: self.settings.account
                    }
                });
            },

            recharge: function (amount) {
                return $http({
                    url: self.host + '/transaction/start_recharge',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'accountId=' + self.settings.accountID + '&returnUrl=' + self.paymentCallback + '&amount=' + (amount * 100)
                });
            },
            
            getRechargeStatus: function (id) {
                return $http({
                    url: self.host + '/transaction/query_recharge_status',
                    method: 'GET',
                    params: {
                        internalOrderNo: id
                    }
                });
            },
            
            getRechargeHistory: function (start, end) {
                return $http({
                    url: self.host + '/transaction/recharges',
                    method: 'GET',
                    params: {
                        accountId: self.settings.accountID,
                        startDate: start,
                        endDate: end
                    }
                });
            },

            getConsumptionHistory: function (start, end) {
                return $http({
                    url: self.host + '/transaction/transactions',
                    method: 'GET',
                    params: {
                        accountId: self.settings.accountID,
                        startDate: start,
                        endDate: end
                    }
                });
            },

            getConsumptionTrends: function () {
                return $http({
                    url: self.host + '/transaction/overview',
                    method: 'GET',
                    params: {
                        accountId: self.settings.accountID
                    }
                });
            }
        };

        return service;
    };
});