/**
 * Created by eric on 16/2/23.
 */
angular.module('app').provider('Billing', function () {
    this.host = 'http://localhost:8080';
    this.cluster = 'sdb';
    this.paymentCallback = 'http://localhost:8080/main.html#/integration/payment';
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
    this.setCluster = function (newCluster) {
        if(newCluster) {
            this.cluster = newCluster;
        }
    };
    this.setPaymentCallbackUrl = function (newCallback) {
        if(newCallback) {
            this.paymentCallback = newCallback;
        }
    }

    this.$get = function ($http, $localStorage, $cookies) {
        var self = this;

        // Copy from easemob-common.js
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
                        clientId: self.settings.account,
                        org: self.settings.account,
                        cluster: self.cluster
                    },
                    headers: {
                        'Authorization': 'Bearer ' + self.settings.token
                    }
                });
            },

            recharge: function (amount) {
                return $http({
                    url: self.host + '/transaction/start_recharge',
                    method: 'POST',
                    params: {
                        org: self.settings.account,
                        cluster: self.cluster
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + self.settings.token
                    },
                    data: 'accountId=' + self.settings.accountID + '&returnUrl=' + self.paymentCallback + '&amount=' + (amount * 100)
                });
            },
            
            getRechargeStatus: function (id) {
                return $http({
                    url: self.host + '/transaction/query_recharge_status',
                    method: 'GET',
                    params: {
                        internalOrderNo: id,
                        org: self.settings.account,
                        cluster: self.cluster
                    },
                    headers: {
                        'Authorization': 'Bearer ' + self.settings.token
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
                        endDate: end,
                        org: self.settings.account,
                        cluster: self.cluster
                    },
                    headers: {
                        'Authorization': 'Bearer ' + self.settings.token
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
                        endDate: end,
                        org: self.settings.account,
                        cluster: self.cluster
                    },
                    headers: {
                        'Authorization': 'Bearer ' + self.settings.token
                    }
                });
            },

            getConsumptionTrends: function () {
                return $http({
                    url: self.host + '/transaction/overview',
                    method: 'GET',
                    params: {
                        accountId: self.settings.accountID,
                        org: self.settings.account,
                        cluster: self.cluster
                    },
                    headers: {
                        'Authorization': 'Bearer ' + self.settings.token
                    }
                });
            }
        };

        return service;
    };
});