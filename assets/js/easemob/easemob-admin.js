/**
 * Created by kenshinn on 15-6-10.
 */

// 登录用户信息
function loginAdminInfo() {
    var accessToken = getAccessToken();
    var loginAdminUser = getCuser();
    var companyName = getCompanyName();
    var telephone = getTelephone();
    var email = getEmail();
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $('#username').text(loginAdminUser);
        $('#email').text(email);
        $('#companyName').text(companyName);
        $('#telephone').text(telephone);
    }
}


// 修改登录用户信息
function updateAdminInfo(username, companyName, telephone) {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var requestData = {};
    if (companyName != '' && companyName != null) {
        requestData.companyName = companyName;
    }
    if (telephone != '' && telephone != null) {
        requestData.telephone = telephone;
    }

    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url: baseUrl + '/management/users/' + username,
            type: 'PUT',
            data: JSON.stringify(requestData),
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (respData, textStatus, jqXHR) {
            },
            success: function () {
                layer.msg($.i18n.prop('admin_home_update_succ'), 3, 1);

                var companyNameInputObj = $('#companyNameInput');
                var telephoneInputObj = $('#telephoneInput');
                companyNameInputObj.val('');
                telephoneInputObj.val('');
                companyNameInputObj.hide();
                telephoneInputObj.hide();
                $('#showEditBtn').show();
                $('#saveAdminInfoBtn').hide();
                $('#cancelSaveAdminInfoBtn').hide();
                $('#telephone').show();
                $('#companyName').show();

                var date = new Date();
                date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
                $.cookie('companyName'+getCookieNameSufix(), companyName, {path: '/', domain: baseDomain, expires: date});
                $.cookie('telephone'+getCookieNameSufix(), telephone, {path: '/', domain: baseDomain, expires: date});


                loginAdminInfo();
            }
        });
    }
}

// 修改登录用户密码表单校验
function updateAdminPasswdFormValidate() {
    var oldPasswordObj = $('#oldpassword');
    var newPasswordObj = $('#newpassword');

    var oldPassword = oldPasswordObj.val();
    var newPassword = newPasswordObj.val();
    var reNewPassword = $('#renewpassword').val();

    var oldPasswordHiddenObj = $('#oldpasswordHidden');
    var oldPasswordEMsgObj = $('#oldpasswordEMsg');
    if ('' == oldPassword) {
        oldPasswordEMsgObj.text($.i18n.prop('admin_home_password_form_passwordEmpty'));
        oldPasswordObj.focus();
        oldPasswordHiddenObj.val('passwordEmpty');
        return false;
    }

    oldPasswordHiddenObj.val('');
    oldPasswordEMsgObj.text('');

    var newPasswordHiddenObj = $('#newpasswordHidden');
    var newPasswordEMsgObj = $('#newpasswordEMsg');
    if ('' == newPassword) {
        newPasswordEMsgObj.text($.i18n.prop('admin_home_password_form_newPasswordEmpty'));
        newPasswordObj.focus();
        newPasswordHiddenObj.val('newPasswordEmpty');
        return false;
    }

    newPasswordHiddenObj.val('');
    if (newPassword.length < 6) {
        newPasswordEMsgObj.text($.i18n.prop('admin_home_password_form_newPasswordIllegal'));
        newPasswordObj.focus();
        newPasswordHiddenObj.val('newPasswordIllegal');
        return false;
    }
    newPasswordHiddenObj.val('');
    newPasswordEMsgObj.text('');

    var reNewPasswordEMsgObj = $('#renewpasswordEMsg');
    var reNewPasswordHiddenObj = $('#renewpasswordHidden');
    if (reNewPassword != newPassword) {
        reNewPasswordEMsgObj.text($.i18n.prop('admin_home_password_form_passwordNotMatch'));
        reNewPasswordHiddenObj.val('passwordNotMatch');
        return false;
    }

    reNewPasswordHiddenObj.val('');
    reNewPasswordEMsgObj.text('');
    return true;
}

// 修改登录用户密码
validateAccessToken = '';
function updateAdminPasswd() {
    var oldPassword = $('#oldpassword').val();
    var newPassword = $('#newpassword').val();
    var username = getCuser();

    var fetchTokenData = {
        'grant_type': 'password',
        'username': username,
        'password': oldPassword
    };
    if (updateAdminPasswdFormValidate()) {
        //校验旧密码
        $.ajax({
            url: baseUrl + '/management/token',
            type: 'POST',
            data: JSON.stringify(fetchTokenData),
            error: function (jqXHR, textStatus, errorThrown) {
                $('#oldpasswordHidden').val('oldPasswordInCorrect');
                $('#oldpasswordEMsg').text($.i18n.prop('admin_home_password_form_oldPasswordInCorrect'));
            },
            success: function (respData, textStatus, jqXHR) {
                if (respData.access_token == '') {
                    return;
                }

                var resetPasswordData = {
                    'oldpassword': oldPassword,
                    'newpassword': newPassword
                };

                $.ajax({
                    url: baseUrl + '/management/users/' + username + '/password',
                    type: 'POST',
                    data: JSON.stringify(resetPasswordData),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function () {
                        layer.msg($.i18n.prop('admin_home_password_form_succ'), 3, 1);

                        $('#oldpassword').val('');
                        $('#newpassword').val('');
                        $('#renewpassword').val('');
                    },
                    error: function () {
                        layer.msg($.i18n.prop('admin_home_password_form_failed'), 3, 5);
                    }
                });
            }
        });
    }

}


// 获取orgadmin列表
function getOrgAdminList() {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var loginUser = getCuser();

    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span id="admin_list_table_loading">' + $.i18n.prop('admin_list_table_loading') + '</span></td></tr>';

        var orgAdminsBodyObj = $('#orgadminsBody');
        orgAdminsBodyObj.empty();
        orgAdminsBodyObj.append(loading);

        $.ajax({
            url: baseUrl + '/management/organizations/' + orgName + '/users',
            type: 'GET',
            async: false,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                $('tbody').html('');
                var selectOptions = '';
                var orgAdminListOrder = 0;
                $(respData.data).each(function () {
                    orgAdminListOrder = orgAdminListOrder + 1;
                    var username = this.username;
                    var confirmedStr = (this.confirmed == true) ? $.i18n.prop('admin_list_table_confirmed') : $.i18n.prop('admin_list_table_unConfirmed');
                    var email = this.email;
                    var companyName = this.properties.companyName;
                    var telephone = this.properties.telephone;

                    var ops = '';
                    var isCurrentUser = false;
                    if (username != loginUser) {
                        ops = '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="admin_list_table_operation_' + orgAdminListOrder + '">' + $.i18n.prop('admin_list_table_operation') + '</span><b class="caret"></b></a>' +
                            '<ul class="dropdown-menu">' + '<li data-filter-camera-type="all"><a href="javascript:void(0);" onclick="disConnAdminAndOrg(\'' + username + '\')"><span id="admin_list_table_remove_' + orgAdminListOrder + '">' + $.i18n.prop('admin_list_table_remove') + '</span></a></li>';
                    } else {
                        isCurrentUser = true;
                        ops = $.i18n.prop('admin_list_table_currentUser_disable');
                    }

                    selectOptions += '<tr>' +
                        '<td class="text-center">' + username + '</td>' +
                        '<td class="text-center">' + email + '</td>' +
                        '<td class="text-center">' + companyName + '</td>' +
                        '<td class="text-center">' + telephone + '</td>' +
                        '<input type="hidden" id="adminListConfirmed_' + orgAdminListOrder + '" isCurrentUser="' + isCurrentUser + '" value="' + this.confirmed + '">' +
                        '<td class="text-center" id="adminListConfirmedStr_' + orgAdminListOrder + '">' + confirmedStr + '</td>' +
                        '<td class="text-center">' +
                        '<ul class="nav-pills" style="list-style-type:none" id="adminListConfirmedStrOps_' + orgAdminListOrder + '">' + ops
                    '</ul>' +
                    '</li>' +
                    '</ul>' +
                    '</td>' +
                    '</tr>';
                });

                $('#orgAdminListOrder').val(orgAdminListOrder);

                $('#tr_loading').remove();
                orgAdminsBodyObj.append(selectOptions);
                var tbody = document.getElementsByTagName("tbody")[0];
                if (!tbody.hasChildNodes()) {
                    var option = '<tr><td class="text-center" colspan="9">' + $.i18n.prop('table_data_nodata') + '</td></tr>';
                    $('#tr_loading').remove();
                    orgAdminsBodyObj.append(option);
                }
            }
        });
    }
}

// remove user from organization
function disConnAdminAndOrg(adminUserName) {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var loginUser = getCuser();
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if (adminUserName != '') {
            if (loginUser == adminUserName) {
                layer.msg($.i18n.prop('admin_list_table_currentUser_disable'), 3, 5);
            } else {
                var confirmOk = $.i18n.prop('confirm_ok');
                var confirmCancel = $.i18n.prop('confirm_cancel');
                Modal.confirm({
                    msg: $.i18n.prop('admin_list_table_disConnUser_confirm'),
                    title: "",
                    btnok: confirmOk,
                    btncl: confirmCancel
                }).on(function () {
                    $.ajax({
                        url: baseUrl + '/management/users/' + adminUserName + '/orgs/' + orgName,
                        type: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/json'
                        },
                        error: function (respData, textStatus, jqXHR) {
                            var error_description = jQuery.parseJSON(respData.responseText).error_description;
                            if ('Organizations must have at least one member.' == error_description) {
                                layer.msg($.i18n.prop('admin_list_table_disConnUser_oneAtLeast'), 3, 5);
                            } else {
                                layer.msg($.i18n.prop('admin_list_table_disConnUser_failed'), 3, 5);
                            }
                        },
                        success: function (respData, textStatus, jqXHR) {
                            var orgname = respData.data.name;
                            if (orgName == orgname) {
                                layer.msg($.i18n.prop('admin_list_table_disConnUser_succ'), 3, 1);
                                getOrgAdminList();
                            }
                        }
                    });
                });
            }
        }
    }
}

// create new admin user form validation
function createAdminUserFormValidate() {
    var adminCreateAdminUserNameObj = $('#admin_create_adminUserName');
    adminCreateAdminUserNameObj.val(adminCreateAdminUserNameObj.val().trim());
    var adminUserName = adminCreateAdminUserNameObj.val();

    if (adminUserName == '') {
        $('#admin_create_adminUserNameMsg').hide();
        $('#admin_create_adminUserNameEEMsg').hide();
        $('#admin_create_adminUserNameEMsg').show();
        $('#admin_create_adminUserNameOMsg').hide();
        return false;
    }

    var adminUserNameRegex = /^[0-9a-zA-Z]*$/;
    if (adminUserName != '' && !adminUserNameRegex.test(adminUserName)) {
        $('#admin_create_adminUserNameMsg').hide();
        $('#admin_create_adminUserNameOMsg').hide();
        $('#admin_create_adminUserNameEEMsg').hide();
        $('#admin_create_adminUserNameEMsg').show();
        return false;
    }

    var adminCreateAdminPasswordObj = $('#admin_create_adminPassword');
    adminCreateAdminPasswordObj.val(adminCreateAdminPasswordObj.val().trim());
    var adminPassword = adminCreateAdminPasswordObj.val();
    if (adminPassword == '') {
        $('#admin_create_adminPasswordMsg').hide();
        $('#admin_create_adminPasswordEMsg').show();
        $('#admin_create_adminPasswordEMatchMsg').hide();
        $('#admin_create_adminPasswordOMsg').hide();
        return false;
    }

    if (adminUserName == adminPassword) {
        $('#admin_create_adminPasswordMsg').hide();
        $('#admin_create_adminPasswordEMsg').hide();
        $('#admin_create_adminPasswordEMatchMsg').show();
        $('#admin_create_adminPasswordOMsg').hide();
        return false;
    }

    var adminCreateAdminRePasswordObj = $('#admin_create_adminRePassword');
    adminCreateAdminRePasswordObj.val(adminCreateAdminRePasswordObj.val().trim());
    var adminRePassword = adminCreateAdminRePasswordObj.val();
    if (adminRePassword == '') {
        $('#admin_create_adminRePasswordMsg').hide();
        $('#admin_create_adminRePasswordEMsg').show();
        $('#admin_create_adminPasswordEMatchMsg').hide();
        $('#admin_create_adminRePasswordOMsg').hide();
        return false;
    }
    if ('' != adminRePassword && adminPassword != adminRePassword) {
        $('#admin_create_adminRePasswordMsg').hide();
        $('#admin_create_adminRePasswordEMsg').show();
        $('#admin_create_adminPasswordEMatchMsg').hide();
        $('#admin_create_adminRePasswordOMsg').hide();
        return false;
    }

    var adminCreateAdminEmailObj = $('#admin_create_adminEmail');
    adminCreateAdminEmailObj.val(adminCreateAdminEmailObj.val().trim());
    var adminEmail = adminCreateAdminEmailObj.val();
    if (adminEmail == '') {
        $('#admin_create_adminEmailMsg').show();
        $('#admin_create_adminEmailEMsg').hide();
        $('#admin_create_adminEmailEEMsg').hide();
        $('#admin_create_adminEmailOMsg').hide();
        return false;
    }
    var adminEmailRegex = /^([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z0-9]{1,10}$/;
    if (adminEmail != '' && !adminEmailRegex.test(adminEmail)) {
        $('#admin_create_adminEmailMsg').hide();
        $('#admin_create_adminEmailEMsg').show();
        $('#admin_create_adminEmailEEMsg').hide();
        $('#admin_create_adminEmailOMsg').hide();
        return false;
    }

    var adminCompany = $('#admin_create_adminCompany').val();
    if (adminCompany == '') {
        $('#admin_create_adminCompanyMsg').show();
        $('#admin_create_adminCompanyEMsg').hide();
        $('#admin_create_adminCompanyOMsg').hide();
        return false;
    }
    var adminCompanyRegex = /^[0-9a-zA-Z\-_.\u4e00-\u9faf ]*$/;
    if (adminCompany != '' && !adminCompanyRegex.test(adminCompany)) {
        $('#admin_create_adminCompanyMsg').hide();
        $('#admin_create_adminCompanyEMsg').show();
        $('#admin_create_adminCompanyOMsg').hide();
        return false;
    }

    var adminCreateAdminTelObj = $('#admin_create_adminTel');
    adminCreateAdminTelObj.val(adminCreateAdminTelObj.val().trim());
    var regTel = adminCreateAdminTelObj.val();
    if (regTel == '') {
        $('#admin_create_adminTelMsg').show();
        $('#admin_create_adminTelEMsg').hide();
        $('#admin_create_adminTelOMsg').hide();
        return false;
    }
    if (regTel != '' && !checkTel(regTel)) {
        $('#admin_create_adminTelMsg').hide();
        $('#admin_create_adminTelEMsg').show();
        $('#admin_create_adminTelOMsg').hide();
        return false;
    }

    return true;
}

// add new organization admin user
function saveNewAdminUserSubmit(adminUsername, adminPassword, adminEmail, adminCompany, adminTel) {
    var accessToken = getAccessToken();
    var orgName = getOrgname();

    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if (createAdminUserFormValidate()) {

            var confirmOk = $.i18n.prop('confirm_ok');
            var confirmCancel = $.i18n.prop('confirm_cancel');
            Modal.confirm({
                msg: $.i18n.prop('admin_create_form_confirm'),
                title: "",
                btnok: confirmOk,
                btncl: confirmCancel
            }).on(function () {
                var data = {
                    username: adminUsername,
                    password: adminPassword,
                    email: adminEmail,
                    companyName: adminCompany,
                    telephone: adminTel,
                    category: 'admin_append',
                    'webLocale': getLocaleInfo()
                };

                // 创建管理员用户
                $.ajax({
                    url: baseUrl + '/management/users',
                    type: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'application/json'
                    },
                    async: false,
                    data: JSON.stringify(data),
                    error: function (respData, textStatus, errorThrown) {
                        var error_description = jQuery.parseJSON(respData.responseText).error_description;

                        if (error_description.indexOf("Entity user requires that property named username be unique") > -1) {
                            $('#admin_create_adminUserNameEEMsg').show();
                            $('#admin_create_adminUserNameEMsg').hide();
                            $('#admin_create_adminUserNameOMsg').hide();
                        } else if (error_description.indexOf("Entity user requires that property named email be unique") > -1) {
                            $('#admin_create_adminEmailEEMsg').show();
                            $('#admin_create_adminEmailOMsg').hide();
                            $('#admin_create_adminEmailEMsg').hide();
                        } else {
                            layer.msg($.i18n.prop('admin_create_form_failed'), 5, 5);
                        }
                    },
                    success: function (respData, textStatus, jqXHR) {
                        clearNewAdminUserBox();
                        var adminUserName = respData.data.username;
                        if (adminUserName != '') {
                            $.ajax({
                                url: baseUrl + '/management/users/' + adminUserName + '/orgs/' + orgName,
                                type: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + accessToken,
                                    'Content-Type': 'application/json'
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    layer.msg($.i18n.prop('admin_create_form_failed'), 5, 5);
                                },
                                success: function (respData, textStatus, jqXHR) {
                                    var orgname = respData.data.name;
                                    if (orgName == orgname) {
                                        layer.msg($.i18n.prop('admin_create_form_succ'), 5, 1);
                                        initOrgAminCreateForm();
                                    }
                                }
                            });
                        }
                    }
                });
            });
        }
    }
}


function initOrgAminCreateForm() {
    $('#admin_create_adminUserNameMsg').show();
    $('#admin_create_adminUserNameEMsg').hide();
    $('#admin_create_adminUserNameEEMsg').hide();
    $('#admin_create_adminUserNameOMsg').hide();
    $('#admin_create_adminPasswordMsg').show();
    $('#admin_create_adminPasswordEMsg').hide();
    $('#admin_create_adminPasswordOMsg').hide();
    $('#admin_create_adminRePasswordMsg').show();
    $('#admin_create_adminRePasswordEMsg').hide();
    $('#admin_create_adminRePasswordOMsg').hide();
    $('#admin_create_adminEmailMsg').show();
    $('#admin_create_adminEmailEMsg').hide();
    $('#admin_create_adminEmailEEMsg').hide();
    $('#admin_create_adminEmailOMsg').hide();
    $('#admin_create_adminTelMsg').show();
    $('#admin_create_adminTelEMsg').hide();
    $('#admin_create_adminTelOMsg').hide();
    $('#admin_create_adminCompanyMsg').show();
    $('#admin_create_adminCompanyEMsg').hide();
    $('#admin_create_adminCompanyOMsg').hide();
}


function saveNewAdminUser() {
    var adminUsernameInput = $('#admin_create_adminUserName').val();
    var adminEmailInput = $('#admin_create_adminEmail').val();
    var adminPasswordInput = $('#admin_create_adminPassword').val();
    var adminCompanyInput = $('#admin_create_adminCompany').val();
    var adminTelInput = $('#admin_create_adminTel').val();

    saveNewAdminUserSubmit(adminUsernameInput, adminPasswordInput, adminEmailInput, adminCompanyInput, adminTelInput);
}

function check() {
    if (count == 0) {
        count++;
        return true;
    } else {
        return false;
    }
}


function saveNewAdminUserPre() {
    if (check()) {
        count = 0;
        saveNewAdminUser();
    }
}


//　check org admin user on input field blurred
function onBlurAdminUserNameCheck() {
    var adminCreateAdminUserNameObj = $('#admin_create_adminUserName');
    adminCreateAdminUserNameObj.val(adminCreateAdminUserNameObj.val().trim());

    var adminUserName = adminCreateAdminUserNameObj.val();
    if (adminUserName == '') {
        $('#admin_create_adminUserNameMsg').show();
        $('#admin_create_adminUserNameEEMsg').hide();
        $('#admin_create_adminUserNameEMsg').hide();
        $('#admin_create_adminUserNameOMsg').hide();
        return;
    }

    var adminUserNameRegex = /^[0-9a-zA-Z]*$/;
    if (adminUserName != '' && !adminUserNameRegex.test(adminUserName)) {
        $('#admin_create_adminUserNameMsg').hide();
        $('#admin_create_adminUserNameEEMsg').hide();
        $('#admin_create_adminUserNameOMsg').hide();
        $('#admin_create_adminUserNameEMsg').show();
        return;
    }

    $('#admin_create_adminUserNameMsg').hide();
    $('#admin_create_adminUserNameOMsg').show();
    $('#admin_create_adminUserNameEEMsg').hide();
    $('#admin_create_adminUserNameEMsg').hide();
}

//　check org admin user password on input field blurred
function onBlurAdminPasswordCheck() {
    var adminCreateAdminPasswordObj = $('#admin_create_adminPassword');
    var admin_create_adminUserNameObj = $('#admin_create_adminUserName');
    adminCreateAdminPasswordObj.val(adminCreateAdminPasswordObj.val().trim());

    var adminPassword = adminCreateAdminPasswordObj.val();
    var adminUserName = admin_create_adminUserNameObj.val();

    var adminCreateAdminPasswordEMsgObj = $('#admin_create_adminPasswordEMsg');
    var adminCreateAdminPasswordMsgObj = $('#admin_create_adminPasswordMsg');
    var admin_create_adminPasswordEMatchMsgObj = $('#admin_create_adminPasswordEMatchMsg');
    var adminCreateAdminPasswordOMsgObj = $('#admin_create_adminPasswordOMsg');

    if (adminPassword == '') {
        adminCreateAdminPasswordEMsgObj.hide();
        adminCreateAdminPasswordMsgObj.show();
        admin_create_adminPasswordEMatchMsgObj.hide();
        adminCreateAdminPasswordOMsgObj.hide();
        return;
    }

    if (adminPassword == adminUserName) {
        adminCreateAdminPasswordEMsgObj.hide();
        adminCreateAdminPasswordMsgObj.hide();
        admin_create_adminPasswordEMatchMsgObj.show();
        adminCreateAdminPasswordOMsgObj.hide();
        return;
    }

    adminCreateAdminPasswordEMsgObj.hide();
    adminCreateAdminPasswordMsgObj.hide();
    admin_create_adminPasswordEMatchMsgObj.hide();
    adminCreateAdminPasswordOMsgObj.show();
}

//　check org admin user confirm password on input field blurred
function onBlurAdminRePasswordCheck() {
    var adminCreateAdminRePasswordObj = $('#admin_create_adminRePassword');
    adminCreateAdminRePasswordObj.val(adminCreateAdminRePasswordObj.val().trim());

    var adminRePassword = adminCreateAdminRePasswordObj.val();
    var adminPassword = $('#admin_create_adminPassword').val();


    var adminCreateAdminRePasswordMsgObj = $('#admin_create_adminRePasswordMsg');
    var adminCreateAdminRePasswordEMsgObj = $('#admin_create_adminRePasswordEMsg');
    var adminCreateAdminRePasswordOMsgObj = $('#admin_create_adminRePasswordOMsg');


    if (adminRePassword == '') {
        if (adminPassword != '') {
            adminCreateAdminRePasswordMsgObj.hide();
            adminCreateAdminRePasswordEMsgObj.show();
            adminCreateAdminRePasswordOMsgObj.hide();
        } else {
            adminCreateAdminRePasswordMsgObj.show();
            adminCreateAdminRePasswordEMsgObj.hide();
            adminCreateAdminRePasswordOMsgObj.hide();
        }
        return;
    }

    if ('' != adminRePassword && adminPassword != adminRePassword) {
        adminCreateAdminRePasswordMsgObj.hide();
        adminCreateAdminRePasswordEMsgObj.show();
        adminCreateAdminRePasswordOMsgObj.hide();
        return;
    }

    adminCreateAdminRePasswordMsgObj.hide();
    adminCreateAdminRePasswordEMsgObj.hide();
    adminCreateAdminRePasswordOMsgObj.show();
}

//　check org admin user email on input field blurreds
function onBlurAdminEmailCheck() {
    var adminCreateAdminEmailObj = $('#admin_create_adminEmail');
    adminCreateAdminEmailObj.val(adminCreateAdminEmailObj.val().trim());
    var adminEmail = adminCreateAdminEmailObj.val();


    var adminCreateAdminEmailMsgObj = $('#admin_create_adminEmailMsg');
    var adminCreateAdminEmailEMsgObj = $('#admin_create_adminEmailEMsg');
    var adminCreateAdminEmailEEMsgObj = $('#admin_create_adminEmailEEMsg');
    var adminCreateAdminEmailOMsgObj = $('#admin_create_adminEmailOMsg');

    if (adminEmail == '') {
        adminCreateAdminEmailMsgObj.show();
        adminCreateAdminEmailEMsgObj.hide();
        adminCreateAdminEmailEEMsgObj.hide();
        adminCreateAdminEmailOMsgObj.hide();
        return;
    }

    var adminEmailRegex = /^([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z0-9]{1,10}$/;
    if (adminEmail != '' && !adminEmailRegex.test(adminEmail)) {
        adminCreateAdminEmailMsgObj.hide();
        adminCreateAdminEmailEMsgObj.show();
        adminCreateAdminEmailEEMsgObj.hide();
        adminCreateAdminEmailOMsgObj.hide();
        return;
    }

    adminCreateAdminEmailMsgObj.hide();
    adminCreateAdminEmailEMsgObj.hide();
    adminCreateAdminEmailEEMsgObj.hide();
    adminCreateAdminEmailOMsgObj.show();
}

//　check org admin user telephone number on input field blurred
function onBlurAdminTelCheck() {
    var adminCreateAdminTelObj = $('#admin_create_adminTel');
    adminCreateAdminTelObj.val(adminCreateAdminTelObj.val().trim());
    var regTel = adminCreateAdminTelObj.val();
    if (regTel == '') {
        $('#admin_create_adminTelMsg').show();
        $('#admin_create_adminTelEMsg').hide();
        $('#admin_create_adminTelOMsg').hide();
        return;
    }

    if (regTel != '' && !checkTel(regTel)) {
        $('#admin_create_adminTelMsg').hide();
        $('#admin_create_adminTelEMsg').show();
        $('#admin_create_adminTelOMsg').hide();
        return;
    }

    $('#admin_create_adminTelMsg').hide();
    $('#admin_create_adminTelEMsg').hide();
    $('#admin_create_adminTelOMsg').show();
}

//　check org admin user company name on input field blurred
function onBlurAdminCompanyCheck() {
    var adminCreateAdminCompanyObj = $('#admin_create_adminCompany');
    adminCreateAdminCompanyObj.val(adminCreateAdminCompanyObj.val().trim());
    var adminCompany = adminCreateAdminCompanyObj.val();

    if (adminCompany == '') {
        $('#admin_create_adminCompanyMsg').show();
        $('#admin_create_adminCompanyEMsg').hide();
        $('#admin_create_adminCompanyOMsg').hide();
        return;
    }

    var adminCompanyRegex = /^[0-9a-zA-Z\-_.,\u4e00-\u9faf ]*$/;
    if (adminCompany != '' && !adminCompanyRegex.test(adminCompany)) {
        $('#admin_create_adminCompanyMsg').hide();
        $('#admin_create_adminCompanyEMsg').show();
        $('#admin_create_adminCompanyOMsg').hide();
        return;
    }

    $('#admin_create_adminCompanyMsg').hide();
    $('#admin_create_adminCompanyEMsg').hide();
    $('#admin_create_adminCompanyOMsg').show();
}

//　clear the form used to add new org admin user
function clearNewAdminUserBox() {
    $('#admin_create_adminUserName').val('');
    $('#admin_create_adminPassword').val('');
    $('#admin_create_adminRePassword').val('');
    $('#admin_create_adminEmail').val('');
    $('#admin_create_adminTel').val('');
    $('#admin_create_adminCompany').val('');
}

function showEdit() {
    var companyName = $('#companyName').text();
    var telephone = $('#telephone').text();
    $('#showEditBtn').hide();
    $('#companyName').hide();
    $('#telephone').hide();
    $('#saveAdminInfoBtn').show();
    $('#cancelSaveAdminInfoBtn').show();
    $('#companyNameInput').show();
    $('#companyNameInputMsg').show();
    $('#telephoneInput').show();
    $('#telephoneInputMsg').show();

    $('#companyNameInput').val(companyName);
    $('#telephoneInput').val(telephone);
}

function cancelSaveAdminInfo() {
    $('#showEditBtn').show();
    $('#companyName').show();
    $('#telephone').show();
    $('#saveAdminInfoBtn').hide();
    $('#cancelSaveAdminInfoBtn').hide();
    $('#companyNameInput').hide();
    $('#telephoneInput').hide();
    $('#companyNameInput').val('');
    $('#telephoneInput').val('');
    $('#companyNameInputMsg').hide();
    $('#telephoneInputMsg').hide();
}

function saveAdminInfo() {
    var username = $('#username').text();
    var companyNameInput = $('#companyNameInput').val();
    var telephoneInput = $('#telephoneInput').val();

    var companyNameInputRegex = /^[0-9a-zA-Z\-_.\u4e00-\u9faf ]*$/;
    if (!companyNameInputRegex.test(companyNameInput)) {
        $('#companyNameInputMsg').text($.i18n.prop('admin_create_form_companyIllegal'));
        $('#companyNameInputMsg').css('color', 'red');
        $('#companyNameInputMsgHidden').val('illegal');
        return;
    }
    $('#companyNameInputMsgHidden').val('');
    $('#companyNameInputMsg').hide();

    var telephoneInputRegex = /^[0-9]*$/;
    if (telephoneInput != '' && !telephoneInputRegex.test(telephoneInput)) {
        $('#telephoneInputMsg').text($.i18n.prop('admin_create_form_telephoneIllegal'));
        $('#telephoneInputMsg').css('color', 'red');
        $('#telephoneInputMsgHidden').val('illegal');
        return;
    }
    $('#telephoneInputMsgHidden').val('');
    $('#telephoneInputMsg').hide();

    updateAdminInfo(username, companyNameInput, telephoneInput);
}

