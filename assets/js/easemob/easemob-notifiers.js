/**
 * Created by kenshinn on 15-6-10.
 */

// 查询证书信息
function getAppCertificateIOS(pageAction){
    $('#paginauIOS').html('');
    var accessToken = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var appName = $.cookie('appName');
    if('next' == pageAction){
        pageNo += 1;
    } else if('forward' == pageAction){
        pageNo -= 1;
    }
    var temp = '';
    if(typeof(pageAction)!='undefined' && pageAction != ''){
        temp = '&cursor='+cursors[pageNo];
    }

    var loading = '<tr id="tr_loading"><td class="text-center" colspan="6"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;' + $.i18n.prop('app_notifiers_tableIOS_loading') + '</span></td></tr>';
    $('#appCredentialBodyIOS').empty();
    $('#appCredentialBodyIOS').append(loading);
    $.ajax({
        url:baseUrl+'/'+ orgName +'/' + appName + '/notifiers?limit=8'+temp,
        type:'GET',
        headers:{
            'Authorization':'Bearer ' + accessToken,
            'Content-Type':'application/json'
        },
        error: function(jqXHR, textStatus, errorThrown) {

        },
        success: function(respData, textStatus, jqXHR) {
            if(pageAction != 'forward'){
                cursors[pageNo + 1] =	respData.cursor;
            } else {
                cursors[pageNo + 1] = null;
            }

            var option = '';
            var IOSCertificates = [];
            $(respData.entities).each(function(){

                var certificate = {};
                if(this.provider == 'APNS'){
                    certificate.name = this.name;
                    certificate.certificateId = this.uuid;
                    certificate.provider = this.provider;
                    certificate.created = this.created;
                    certificate.modified = this.modified;
                    certificate.environment = this.environment;
                    IOSCertificates.push(certificate);
                }
            });

            var iosCertificatesOrder = 0;
            $(IOSCertificates).each(function(){
                iosCertificatesOrder = iosCertificatesOrder + 1;
                var name = this.name;
                var certificateId = this.certificateId;
                var provider = this.provider;
                if(provider == 'APNS'){
                    var environment = '';
                    if(this.environment == 'DEVELOPMENT') {
                        environment = $.i18n.prop('app_notifiers_tableIOS_notifier_dev');
                    } else if(this.environment == 'PRODUCTION'){
                        environment = $.i18n.prop('app_notifiers_tableIOS_notifier_production');
                    }

                    var created = format(this.created);
                    var modified = format(this.modified);
                    option += '<tr>'+
                        '<td class="text-center">'+name+'</td>' +
                        '<input id="app_notifiers_tableIOS_notifier_environment_type_'+iosCertificatesOrder+'" value="'+this.environment+'" type="hidden" />' +
                        '<td class="text-center" id="app_notifiers_tableIOS_notifier_environment_'+iosCertificatesOrder+'">'+environment+'</td>'+
                        '<td class="text-center">'+created+'</td>'+
                        '<td class="text-center">'+modified+'</td>'+
                        '<td class="text-center">&nbsp;<a href="javascript:void(0);" onclick="deleteAppNotifiersIOS(\''+ certificateId + '\')"><span id="app_notifiers_tableIOS_notifier_delete_'+iosCertificatesOrder+'">' + $.i18n.prop('app_notifiers_tableIOS_notifier_delete') + '</span></a></td>'+
                        '</tr>';
                }
            });


            $('#appCredentialBodyIOS').html('');
            $('#appCredentialBodyIOS').append(option);

            $('#iosCertificatesOrder').val(iosCertificatesOrder);

            var tbody = document.getElementsByTagName("tbody")[0];
            if(!tbody.hasChildNodes()){
                var option = '<tr><td class="text-center" colspan="6"><span id="table_data_nodata_ios">'+$.i18n.prop('table_data_nodata')+'</span></td></tr>';
                $('#tr_loading').remove();
                $('#appUserAdminBody').append(option);
                var pageLi = $('#paginauIOS').find('li');
                for(var i=0;i<pageLi.length;i++){
                    $(pageLi[i]).hide();
                }
            } else {
                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppNotifiersIOS()"><span id="app_notifiers_tableIOS_notifier_nav_previous">' + $.i18n.prop('app_notifiers_tableIOS_notifier_nav_previous') + '</span></a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppNotifiersIOS()"><span id="app_notifiers_tableIOS_notifier_nav_next">' + $.i18n.prop('app_notifiers_tableIOS_notifier_nav_next') + '</span></a> </li>';
                $('#paginau').html('');

                // 首页
                if(pageNo == 1){
                    if(respData.cursor == null){
                        $('#paginauIOS').append(ulB + ulE);
                    } else {
                        $('#paginauIOS').append(ulB + textOp2 + ulE);
                    }
                    // 尾页
                } else if(cursors.length != 0 && respData.cursor == null){
                    $('#paginauIOS').append(ulB + textOp1 + ulE);
                } else {
                    $('#paginauIOS').append(ulB + textOp1 + textOp2 + ulE);
                }
            }
            if(IOSCertificates.length == 0){
                option = '<tr><td class="text-center" colspan="6">' + $.i18n.prop('app_notifiers_tableIOS_notifier_nodata') + '</td></tr>';
                $('#appCredentialBodyIOS').append(option);
            }
        }
    });
}


// 查询Google推送证书
function getAppCertificateAndroid(pageAction){
    $('#paginauAndroid').html('');
    var accessToken = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var appName = $.cookie('appName');
    if('next' == pageAction){
        pageNo += 1;
    } else if('forward' == pageAction){
        pageNo -= 1;
    }
    var temp = '';
    if(typeof(pageAction)!='undefined' && pageAction != ''){
        temp = '&cursor='+cursors[pageNo];
    }

    var appCredentialBodyAndroidObj = $('#appCredentialBodyAndroid');

    var loading = '<tr id="tr_loading"><td class="text-center" colspan="6"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;' + $.i18n.prop('app_notifiers_tableAndroid_loading') + '</span></td></tr>';
    appCredentialBodyAndroidObj.empty();
    appCredentialBodyAndroidObj.append(loading);
    $.ajax({
        url:baseUrl+'/'+ orgName +'/' + appName + '/notifiers?limit=8'+temp,
        type:'GET',
        headers:{
            'Authorization':'Bearer ' + accessToken,
            'Content-Type':'application/json'
        },
        error: function(jqXHR, textStatus, errorThrown) {

        },
        success: function(respData, textStatus, jqXHR) {
            if(pageAction != 'forward'){
                cursors[pageNo + 1] =	respData.cursor;
            } else {
                cursors[pageNo + 1] = null;
            }

            var option = '';
            var AndroidCertificates = [];
            $(respData.entities).each(function(){
                var certificate = {};
                if(this.provider == 'ANDROID'){
                    certificate.name = this.name;
                    certificate.certificateId = this.uuid;
                    certificate.provider = this.provider;
                    certificate.created = this.created;
                    certificate.environment = this.environment;
                    certificate.certificate = this.certificate;
                    certificate.modified = this.modified;
                    AndroidCertificates.push(certificate);
                }
            });

            var androidCertificatesOrder = 0;
            $(AndroidCertificates).each(function(){
                androidCertificatesOrder = androidCertificatesOrder + 1;
                var name = this.name;
                var certificateId = this.certificateId;
                var provider = this.provider;
                if(provider == 'ANDROID'){
                    var environment = '';
                    if(this.environment == 'DEVELOPMENT') {
                        environment = $.i18n.prop('app_notifiers_tableAndroid_notifier_dev');
                    } else if(this.environment == 'PRODUCTION'){
                        environment = $.i18n.prop('app_notifiers_tableAndroid_notifier_production');
                    }

                    var created = format(this.created);
                    var modified = format(this.modified);
                    option += '<tr>'+
                        '<td class="text-center">'+name+'</td>'+
                        '<input id="app_notifiers_tableAndroid_notifier_environment_type_'+androidCertificatesOrder+'" value="'+this.environment+'" type="hidden" />' +
                        '<td class="text-center" id="app_notifiers_tableAndroid_notifier_environment_'+androidCertificatesOrder+'">'+environment+'</td>'+
                        '<td class="text-center">'+this.certificate+'</td>'+
                        '<td class="text-center">'+created+'</td>'+
                        '<td class="text-center">'+modified+'</td>'+
                        '<td class="text-center">&nbsp;<a href="javascript:void(0);" onclick="deleteAppNotifiersAndroid(\''+ certificateId + '\')"><span id="app_notifiers_tableAndroid_notifier_delete_'+androidCertificatesOrder+'">' + $.i18n.prop('app_notifiers_tableAndroid_notifier_delete') + '</span></a></td>'+
                        '</tr>';
                }
            });

            appCredentialBodyAndroidObj.html('');
            appCredentialBodyAndroidObj.append(option);

            $('#androidCertificatesOrder').val(androidCertificatesOrder);

            var tbody = document.getElementsByTagName("tbody")[0];
            if(!tbody.hasChildNodes()){
                option = '<tr><td class="text-center" colspan="6">'+$.i18n.prop('table_data_nodata')+'</td></tr>';
                $('#tr_loading').remove();
                $('#appUserAdminBody').append(option);
                var pageLi = $('#paginauAndroid').find('li');
                for(var i=0;i<pageLi.length;i++){
                    $(pageLi[i]).hide();
                }
            } else {
                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppNotifiersAndroid()"><span id="app_notifiers_tableAndroid_notifier_nav_previous">' + $.i18n.prop('app_notifiers_tableAndroid_notifier_nav_previous') + '</span></a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppNotifiersAndroid()"><span id="app_notifiers_tableAndroid_notifier_nav_next">' + $.i18n.prop('app_notifiers_tableAndroid_notifier_nav_next') + '</span></a> </li>';
                $('#paginauAndroid').html('');

                // 首页
                if(pageNo == 1){
                    if(respData.cursor == null){
                        $('#paginauAndroid').append(ulB + ulE);
                    } else {
                        $('#paginauAndroid').append(ulB + textOp2 + ulE);
                    }
                    // 尾页
                } else if(cursors.length != 0 && respData.cursor == null){
                    $('#paginauAndroid').append(ulB + textOp1 + ulE);
                } else {
                    $('#paginauAndroid').append(ulB + textOp1 + textOp2 + ulE);
                }
            }
            if(AndroidCertificates.length == 0){
                option = '<tr><td class="text-center" colspan="6"><span id="app_notifiers_tableAndroid_notifier_nodata">' + $.i18n.prop('app_notifiers_tableAndroid_notifier_nodata') + '</span></td></tr>';
                $('#appCredentialBodyAndroid').append(option);
            }
        }
    });
}

// 删除开发者推送证书
function deleteAppNotifiersIOS(credentialId){
    var accessToken = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var appName = $.cookie('appName');

    var confirmOk = $.i18n.prop('confirm_ok');
    var confirmCancel = $.i18n.prop('confirm_cancel');
    Modal.confirm({
        msg: $.i18n.prop('app_notifiers_delete_confirm'),
        title: "",
        btnok: confirmOk,
        btncl: confirmCancel
    }).on( function () {
        var layerNum = layer.load($.i18n.prop('app_notifiers_delete_layer_pending'));
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appName + '/notifiers/' + credentialId,
            type:'DELETE',
            headers:{
                'Authorization':'Bearer ' + accessToken,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_notifiers_delete_failed'), 3, 5);
            },
            success: function(respData, textStatus, jqXHR) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_notifiers_delete_succ'), 3, 1);
                getAppCertificateIOS('no');
            }
        });
    });
}


// 删除开发者推送证书
function deleteAppNotifiersAndroid(credentialId){
    var accessToken = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var appName = $.cookie('appName');

    var confirmOk = $.i18n.prop('confirm_ok');
    var confirmCancel = $.i18n.prop('confirm_cancel');
    Modal.confirm({
        msg: $.i18n.prop('app_notifiers_delete_confirm'),
        title: "",
        btnok: confirmOk,
        btncl: confirmCancel
    }).on( function () {
        var layerNum = layer.load($.i18n.prop('app_notifiers_delete_layer_pending'));
        $.ajax({
            url:baseUrl+'/'+ orgName +'/' + appName + '/notifiers/' + credentialId,
            type:'DELETE',
            headers:{
                'Authorization':'Bearer ' + accessToken,
                'Content-Type':'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_notifiers_delete_failed'), 3, 5);
            },
            success: function(respData, textStatus, jqXHR) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_notifiers_delete_succ'), 2, 1);
                getAppCertificateAndroid('no');
            }
        });
    });
}



// 上一页数据
function getPrevAppNotifiersIOS() {
    getAppCertificateIOS('forward');
}
function getPrevAppNotifiersAndroid() {
    getAppCertificateAndroid('forward');
}
// 下一页数据
function getNextAppNotifiersIOS() {
    getAppCertificateIOS('next');
}
function getNextAppNotifiersAndroid() {
    getAppCertificateAndroid('next');
}


function isBtnEnable() {
    if (count == 0) {
        count++;
        return true;
    } else {
        return false;
    }
}

function submitIOSCertificateForm() {
    if (isBtnEnable()) {
        var accessToken = $.cookie('access_token');
        var orgName = $.cookie('orgName');
        var appName = $.cookie('appName');

        var notifierName = $('#nameIOS').val();
        var passphrase = $('#passphraseIOS').val();

        var notifierNameRegex = /^[A-Za-z0-9_-]{1,50}$/;
        if (!notifierNameRegex.test(notifierName)) {
            layer.msg($.i18n.prop('app_notifiers_formIOS_name_illegal'), 3, 5);
            count = 0;
            return;
        }
        if (!validateFileSuffix($('#file').val())) {
            count = 0;
            return;
        }
        var notifierPassPhraseRegex = /^[\S]{1,40}$/;
        if (!notifierPassPhraseRegex.test(passphrase)) {
            layer.msg($.i18n.prop('app_notifiers_formIOS_phrase_illegal'), 3, 5);
            count = 0;
            return;
        }

        var ajax_option = {
            url: baseUrl + '/' + orgName + '/' + appName + '/notifiers',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip,deflate',
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (data) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_notifiers_formIOS_save_succ'), 3, 1);
                //clear form
                $('#nameIOS').val('');
                $('#passphraseIOS').val('');

                getAppCertificateIOS();
                count = 0;
            },
            error: function (data) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_notifiers_formIOS_save_failed'), 3, 1);
                count = 0;
            }
        };
        var layerNum = layer.load($.i18n.prop('app_notifiers_layer_pending'), 3);
        $('#certificateFormIOS').ajaxSubmit(ajax_option);
    }
}

function submitAndroidCertificateForm() {
    if (isBtnEnable()) {
        var accessToken = $.cookie('access_token');
        var orgName = $.cookie('orgName');
        var appName = $.cookie('appName');

        var notifierName = $('#nameAndroid').val();
        var certificate = $('#certificateAndroid').val();
        var notifierNameRegex = /^[A-Za-z0-9_-]{1,30}$/;
        var notifierPassPhraseRegex = /^[\S]{1,40}$/;
        if (!notifierNameRegex.test(notifierName)) {
            layer.msg($.i18n.prop('app_notifiers_formAndroid_name_illegal'), 3, 5);
            count = 0;
            return;
        }
        if (!notifierPassPhraseRegex.test(certificate)) {
            layer.msg($.i18n.prop('app_notifiers_formAndroid_phrase_illegal'), 3, 5);
            count = 0;
            return;
        }

        var ajax_option = {
            url: baseUrl + '/' + orgName + '/' + appName + '/notifiers',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip,deflate',
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (data) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_notifiers_formAndroid_save_succ'), 3, 1);
                //clear form
                $('#nameAndroid').val('');
                $('#certificateAndroid').val('');

                getAppCertificateAndroid();
                count = 0;
            },
            error: function (data) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_notifiers_formAndroid_save_failed'), 3, 5);
                count = 0;
            }
        };
        var layerNum = layer.load($.i18n.prop('app_notifiers_layer_pending'), 3);
        $('#certificateFormAndroid').ajaxSubmit(ajax_option);
    }
}


// 显示/隐藏制作证书按钮
function displayMakeCertificateTip(enable) {
    if (enable) {
        $('#certificate').show();
    } else {
        $('#certificate').hide();
    }
}

function showAndroidPushCertificateTab() {
    $('#androidPushCertificateTab').parent().attr('class', 'active');
    $('#iosPushCertificateTab').parent().removeAttr('class');

    $('#iosCertificateDiv').hide();
    $('#tableCertificateIOS').hide();
    $('#androidCertificateDiv').show();
    $('#tableCertificateAndroid').show();
    $('#app_notifiers_tableAndroid_title').text($.i18n.prop('app_notifiers_tableAndroid_title'));

    getAppCertificateAndroid();
}


function showIOSPushCertificateTab() {
    $('#iosPushCertificateTab').parent().attr('class', 'active');
    $('#androidPushCertificateTab').parent().removeAttr('class');

    $('#androidCertificateDiv').hide();
    $('#tableCertificateAndroid').hide();
    $('#iosCertificateDiv').show();
    $('#tableCertificateIOS').show();
    $('#app_notifiers_tableIOS_title').text($.i18n.prop('app_notifiers_tableIOS_title'));
    getAppCertificateIOS($.cookie('appName'));
}
