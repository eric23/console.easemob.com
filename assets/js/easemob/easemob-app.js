/**
 * Created by kenshinn on 15-6-10.
 */

// 创建应用表单校验
function createAppFormValidate() {
    var appNameObj = $('#appName');
    var appDescObj = $('#appDesc');
    var productNameObj = $('#productName');
    var appCreateFormAppNameMsgObj = $('#app_create_form_appNameMsg');
    var appCreateFormProductNameMsgObj = $('#app_create_form_productNameMsg');
    var appCreateFormAppDescMsgObj = $('#app_create_form_appDescMsg');

    var appName = appNameObj.val().trim();
    var appDesc = appDescObj.val().trim();
    var productName = productNameObj.val().trim();

    if ('' == appName) {
        appCreateFormAppNameMsgObj.text($.i18n.prop('app_create_form_appNameEmpty'));
        appCreateFormAppNameMsgObj.css('color', 'red');
        appNameObj.focus();
        return false;
    }
    var appNameRegex = /^[0-9a-zA-Z\-]*$/;
    if (!appNameRegex.test(appName)) {
        appCreateFormAppNameMsgObj.text($.i18n.prop('app_create_form_appNameMsg'));
        appCreateFormAppNameMsgObj.css('color', 'red');
        appNameObj.focus();
        return false;
    }
    appCreateFormAppNameMsgObj.text($.i18n.prop('app_create_form_ok'));
    appCreateFormAppNameMsgObj.css('color', 'blue');

    if ('' == productName) {
        appCreateFormProductNameMsgObj.text($.i18n.prop('app_create_form_productNameEmpty'));
        appCreateFormProductNameMsgObj.css('color', 'red');
        productNameObj.focus();
        return false;
    }
    var productNameRegex = /^[0-9a-zA-Z-_\u4e00-\u9faf ]*$/;
    if (!productNameRegex.test(productName)) {
        appCreateFormProductNameMsgObj.text($.i18n.prop('app_create_form_productNameMsg'));
        appCreateFormProductNameMsgObj.css('color', 'red');
        productNameObj.focus();
        return false;
    }
    appCreateFormProductNameMsgObj.text($.i18n.prop('app_create_form_ok'));
    appCreateFormProductNameMsgObj.css('color', 'blue');

    if ('' == appDesc) {
        appCreateFormAppDescMsgObj.text($.i18n.prop('app_create_form_appDescEmpty'));
        appCreateFormAppDescMsgObj.css('color', 'red');
        appDescObj.focus();
        return false;
    }
    var appDescReg = /^[0-9a-zA-Z,.?。，？、\/'":\u4e00-\u9faf ]{0,100}$/;
    if (!appDescReg.test(appDesc)) {
        appCreateFormAppDescMsgObj.text($.i18n.prop('app_create_form_appDescMsg'));
        appCreateFormAppDescMsgObj.css('color', 'red');
        appDescObj.focus();
        return false;
    }

    appCreateFormAppDescMsgObj.text($.i18n.prop('app_create_form_ok'));
    appCreateFormAppDescMsgObj.css('color', 'blue');

    return true;
}

// create new app
function saveNewApp() {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = $('#appName').val().trim();
    var allow_open_registration = $('input[name="allow_open_registration"]:checked').val();
    var appDesc = $('#appDesc').val().trim();
    var productName = $('#productName').val().trim();

    var dataBody = {
        'name': appName,
        'allow_open_registration': allow_open_registration,
        'appDesc': appDesc,
        'productName': productName
    };

    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if (createAppFormValidate()) {
            $.ajax({
                url: baseUrl + '/management/organizations/' + orgName + '/applications',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(dataBody),
                error: function (jqXHR, textStatus, errorThrown) {
                    layer.msg($.i18n.prop('app_create_form_failed'), 3, 5);
                },
                success: function (respData, textStatus, jqXHR) {
                    layer.msg($.i18n.prop('app_create_form_succ'), 3, 1);
                    $(respData.entities).each(function () {
                        var appName = this.applicationName;
                        if (appName != null && appName != "") {
                            var date = new Date();
                            date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
                            $.cookie('appName'+getCookieNameSufix(), appName, {path: '/', domain: baseDomain, expires: date});
                            EasemobCommon.disPatcher.toPageAppInfo();
                        } else {
                            $.cookie("appName", null, {path: "/"});
                            EasemobCommon.disPatcher.toPageAppList();
                        }
                    });
                }
            });
        }
    }
}


// fetch app list
function getAppList() {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span id="app_list_apps_loading">正在读取数据...</span></td></tr>';
        $('#appListBody').empty();
        $('#appListBody').append(loading);
        $.ajax({
            url: baseUrl + '/management/organizations/' + orgName + '/applications',
            type: 'GET',
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                var appData = jQuery.parseJSON(JSON.stringify(respData.data));
                var uuidArr = [];
                var nameArr = [];
                var option = '';
                statusOrder = 0;
                $.each(appData, function (key, value) {
                    statusOrder = statusOrder + 1;
                    nameArr.push(key);
                    uuidArr.push(value);
                    key = key.substring(key.indexOf('/') + 1);

                    option += '<tr><td class="text-center"><a href="app_info.html?appName=' + key + '">' + key + '</a></td>' +
                        '<td class="text-center"><span id="app_list_appstatus_content_' + statusOrder + '">' + $.i18n.prop('app_list_appstatus_content') + '</span></td>' +
                        '</tr>';
                });

                $('#statusOrder').val(statusOrder);

                $('#tr_loading').remove();
                $('#appListBody').append(option);
                var tbody = document.getElementsByTagName("tbody")[0];
                if (!tbody.hasChildNodes()) {
                    option = '<tr><td class="text-center" colspan="7" id="applist_table_nodata">' + $.i18n.prop('table_data_nodata') + '</td></tr>';
                    $('#appListBody').append(option);
                }
            }
        });
    }
}


// fetch app info
function fetchAppInfo(accessToken, orgName, appName) {
    $.ajax({
        url: baseUrl + '/management/organizations/' + orgName + '/applications/' + appName,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },
        success: function (respData, textStatus, jqXHR) {
            $(respData.entities).each(function () {
                var created = format(this.created);
                var modified = format(this.modified);
                var applicationName = this.applicationName;
                var organizationName = this.organizationName;
                var showLinkBigdata = this.show_link_bigdata;

                var date = new Date();
                date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
                if(showLinkBigdata) {
                    $.cookie(organizationName + '_' + applicationName + '_showLinkBigdata'+getCookieNameSufix(), showLinkBigdata, {path: '/', domain: baseDomain, expires: date});
                } else {
                    $.cookie(organizationName + '_' + applicationName + '_showLinkBigdata'+getCookieNameSufix(), null, {path: "/", domain: baseDomain, expires: date-1000});
                }

                var allowOpen = this.allow_open_registration ?
                    $.i18n.prop('app_profile_text_registrationModel_open') :
                    $.i18n.prop('app_profile_text_registrationModel_auth');
                var tag = this.allow_open_registration ? '0' : '1';
                var image_thumbnail_width = '170';
                if (this.image_thumbnail_width != null && this.image_thumbnail_width != undefined) {
                    image_thumbnail_width = this.image_thumbnail_width;
                }
                var image_thumbnail_height = '170';
                if (this.image_thumbnail_height != null && this.image_thumbnail_height != undefined) {
                    image_thumbnail_height = this.image_thumbnail_height;
                }
                $('#appKey').text(organizationName + '#' + applicationName);
                $('#xmlandroidAppkey').text(organizationName + '#' + applicationName);
                $('#created').text(created);
                $('#modified').text(modified);
                $('#allowOpen').text(allowOpen);
                $('#allowOpenHdd').val(tag);
                $('#image_thumbnail_width').text(image_thumbnail_width + 'px');
                $('#image_thumbnail_height').text(image_thumbnail_height + 'px');
                $('#imageHeightHide').val(image_thumbnail_width);
                $('#imageWidthHide').val(image_thumbnail_height);
            });

            $('#showName').text(respData.applicationName);
        }
    });
}

// fetch app credentials
function fetchAppCredentials(accessToken, orgName, appName) {
    $.ajax({
        url: baseUrl + '/' + orgName + '/' + appName + '/credentials',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },
        success: function (respData, textStatus, jqXHR) {
            $('#client_id').text(respData.credentials.client_id);
            $('#client_secret').text(respData.credentials.client_secret);
        }
    });
}

// 获取app详情
function getAppOverView() {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = getAppName();
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        fetchAppInfo(accessToken, orgName, appName);

        fetchAppCredentials(accessToken, orgName, appName);

        fetchAppUserCount(accessToken, orgName, appName);
    }
}


// fetch the im users count of the app
function fetchAppUserCount(accessToken, orgName, appName) {

    var counterName = 'application.collection.users';
    if(newMetricsRegisterUsers) {
        counterName = 'im_users';
    }

    var userCount = 0;
    $.ajax({
        url: baseUrl + '/' + orgName + '/' + appName + '/counters?counter='+counterName+'&pad=true',
        type: 'GET',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },
        success: function (respData, textStatus, jqXHR) {
            $.each(respData.counters, function () {
                if (this.values.lenght == 0) {
                    userCount = 0;
                } else {
                    $.each(this.values, function () {
                        var userValue = parseInt(this.value);
                        if (userValue < 0) {
                            userValue = 0;
                        }
                        userCount = userValue;
                    });
                }
            });
        }
    });

    $('#totalRegisteredUsers').text(userCount);
}


//修改缩略图大小
function updateImage() {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = getAppName();
    var imgReg = /^[0-9]*$/;
    var imgWidth = $('#imageWidth').val();
    var imgHeight = $('#imageHeight').val();

    if (imgWidth == '') {
        $('#imageWidthSpan').text($.i18n.prop('app_profile_alert_imageHeightSpan_empty'));
        return;
    }
    if (imgHeight == '') {
        $('#imageHeightSpan').text($.i18n.prop('app_profile_alert_imageWidthSpan_empty'));
        return;
    }

    $('#imageWidthSpan').text('');
    $('#imageHeightSpan').text('');

    if (!imgReg.test(imgHeight)) {
        $('#imageHeightSpan').text($.i18n.prop('app_profile_alert_imageHeightSpan_int'));
    } else if (!imgReg.test(imgWidth)) {
        $('#imageWidthSpan').text($.i18n.prop('app_profile_alert_imageWidthSpan_int'));
    } else {

        var d = {
            image_thumbnail_width: parseInt(imgWidth),
            image_thumbnail_height: parseInt(imgHeight)
        };
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName,
            type: 'PUT',
            data: JSON.stringify(d),
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
                layer.msg($.i18n.prop('app_profile_alert_update_failure'), 3, 5);
            },
            success: function (respData, textStatus, jqXHR) {
                layer.msg($.i18n.prop('app_profile_alert_update_done'), 3, 1);

                $('#image_thumbnail_width').text(imgWidth + 'px');
                $('#image_thumbnail_height').text(imgHeight + 'px');
                $('#imageHeightHide').val(imgWidth);
                $('#imageWidthHide').val(imgHeight);

                $('#closeButn').click();
            }
        });
    }
}

// 切换app注册模式
function changeAllowOpen() {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appKey = $('#appKey').text().replace('#', '/');
    var tag = $('#allowOpenHdd').val();

    var allow_open_registration = true;
    if (tag == 0) {
        allow_open_registration = false;
    }

    var d = {
        'allow_open_registration': allow_open_registration
    };

    $.ajax({
        url: baseUrl + '/' + appKey,
        type: 'PUT',
        data: JSON.stringify(d),
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        success: function (respData) {
            layer.msg($.i18n.prop('app_profile_btn_change_alert_succ'), 3, 1);
            $(respData.entities).each(function () {
                var tag = this.allow_open_registration ? '0' : '1';
                var modified = format(this.modified);
                $('#modified').text(modified);
                $('#allowOpenHdd').val(tag);
                if (this.allow_open_registration) {
                    $('#allowOpen').text($.i18n.prop('app_profile_text_registrationModel_open'));
                } else {
                    $('#allowOpen').text($.i18n.prop('app_profile_text_registrationModel_auth'));
                }
            });
        },
        error: function (data) {
            layer.msg($.i18n.prop('app_profile_btn_change_alert_failure'), 3, 5);
        }
    });
}


function check() {
    if (count == 0) {
        count++;
        return true;
    } else {
        return false;
    }
}

function saveNewAppPre() {
    if (check()) {
        count = 0;
        saveNewApp();
    }
}

function removeAllSpace(str) {
    return str.replace(/\s+/g, '');
}

//显示修改缩略图
function showImage() {
    $('#imageWidth').val('' + $('#imageHeightHide').val());
    $('#imageHeight').val('' + $('#imageWidthHide').val());
    $('#showUpdateImage').click();
}

//修改缩略图
function updateImageHTML() {
    updateImage();
}