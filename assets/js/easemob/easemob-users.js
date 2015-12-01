/**
 * Created by kenshinn on 15-6-10.
 */


// 用户名
function onBlurCheckIMUsername(imUsername) {
    var imUsernameMsgObj = $('#imUsernameMsg');
    var imUsernameMsgTypeObj = $('#imUsernameMsgType');
    var imUsernameReg = /^[a-zA-Z0-9_\-.]*$/;
    if ('' == imUsername) {
        imUsernameMsgObj.text($.i18n.prop('app_users_form_username_error_empty'));
        imUsernameMsgTypeObj.val('empty');
        return false;
    }
    if (!imUsernameReg.test(imUsername)  || '.' == imUsername || '..' == imUsername) {
        imUsernameMsgObj.text($.i18n.prop('app_users_form_username_error_illegal'));
        imUsernameMsgTypeObj.val('illegal');
        return false;
    }
    imUsernameMsgTypeObj.val('');
    imUsernameMsgObj.text('');
    return true;
}

// 一次密码
function onBlurCheckIMPassword(password) {
    var passwordMsgObj = $('#passwordMsg');
    var passwordMsgTypeObj = $('#passwordMsgType');

    var passwordReg = /^[\s\S]*$/;
    if ('' == password) {
        passwordMsgObj.text($.i18n.prop('app_users_form_password_error'));
        passwordMsgTypeObj.val('error');
        return false;
    }
    if (!passwordReg.test(password)) {
        passwordMsgObj.text($.i18n.prop('app_users_form_password_error'));
        passwordMsgTypeObj.val('error');
        return false;
    }
    passwordMsgTypeObj.val('');
    passwordMsgObj.text('');
    return true;
}

// 二次密码
function onBlurCheckIMConfirmPassword(confirmPassword) {
    var passwordVal = $('#password').val();
    var confirmPasswordMsgObj = $('#confirmPasswordMsg');
    var confirmPasswordMsgTypeObj = $('#confirmPasswordMsgType');

    if ('' == confirmPassword) {
        confirmPasswordMsgObj.text($.i18n.prop('app_users_form_confirm_password_error_notmatch'));
        confirmPasswordMsgTypeObj.val('notmatch');
        return false;
    }
    if (passwordVal != confirmPassword) {
        confirmPasswordMsgObj.text($.i18n.prop('app_users_form_confirm_password_error_notmatch'));
        confirmPasswordMsgTypeObj.val('notmatch');
        return false;
    }
    confirmPasswordMsgTypeObj.val('');
    confirmPasswordMsgObj.text('');

    return true;
}

// save new im user
function saveNewIMUser() {
    var imUsername = $('#imUsername').val();
    var password = $('#password').val();
    var confirmPassword = $('#confirmPassword').val();

    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = $.cookie('appName');

    var flag = onBlurCheckIMUsername(imUsername) && onBlurCheckIMPassword(password) && onBlurCheckIMConfirmPassword(confirmPassword);
    if (flag) {
        // Create a user
        var requestData = {
            username: imUsername,
            password: password
        };
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users',
            type: EasemobCommon.httpMethod.POST,
            data: JSON.stringify(requestData),
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            success: function (respData) {
                layer.msg($.i18n.prop('app_users_form_msg_username_saved'), 3, 1);
                EasemobCommon.disPatcher.toPageAppUsers();
            },
            error: function (data) {
                var str = JSON.stringify(data.responseText).replace('}', '').replace('{', '').split(',');
                var tmpArr = [];
                var errorMsg = '';
                for (var i = 0; i < str.length; i++) {
                    tmpArr.push(str[i].replace(/\\/g, '').replace(/\"/g, '').split(':'));
                }
                for (var j = 0; j < tmpArr.length; j++) {
                    if ('error_description' == tmpArr[j][0]) {
                        if (tmpArr[j][1].indexOf("Entity user requires that property named username be unique") > -1) {
                            errorMsg = $.i18n.prop('app_users_form_errorMsg_username_duplicated');
                        } else {
                            errorMsg = $.i18n.prop('app_users_form_errorMsg_username_failure');
                        }
                    }
                }

                layer.msg(errorMsg, 3, 5);
            }
        });
    }
}


function selectAppUser(sel, username) {
    var value = sel.value;

    if (value == 'setUsername') {
        setUsername(username);
    } else if (value == 'sendMsg') {
        sendMessageOneUser(username);
    } else if (value == 'deleteUAdmin') {
        deleteAppUser(username);
    }
}

// 获取某个app下的用户
function getAppUserList(pageAction) {
    $('#checkAll').attr('checked', false);
    $('#paginau').html('');

    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');

    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="9"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;' + $.i18n.prop('app_users_table_loading') + '</td></tr>';
        var appUserBodyObj = $('#appUserBody');
        appUserBodyObj.empty();
        appUserBodyObj.append(loading);
        var userPage = $.cookie('userPage');

        if ('next' == pageAction) {
            pageNo += 1;
        } else if ('forward' == pageAction) {
            if (pageNo >= 2) {
                pageNo -= 1;
            } else {
                pageNo = 1;
            }
        }
        var temp = '';
        if (typeof(pageAction) != 'undefined' && pageAction != '' || pageAction == 'no') {
            temp = '&cursor=' + cursors[pageNo];
        }
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users?limit=10' + temp,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                if (pageAction != 'forward') {
                    if (respData.cursor) {
                        cursors[pageNo + 1] = respData.cursor;
                    } else {
                        cursors[pageNo + 1] = null;
                    }
                }

                if (respData.entities.length == 0 && respData.cursor == '' && (pageAction == 'next' || typeof(pageAction) == 'undefined')) {
                    getNextAppUserList();
                } else if (respData.entities.length == 0 && pageAction == 'forward') {
                    if (pageNo >= 2) {
                        getPrevAppUserList();
                    } else if (pageNo == 1) {
                        getNextAppUserList();
                    }
                } else {
                    $('tbody').html('');
                    var selectOptions = '';

                    var appUsersListOrder = 0;
                    $(respData.entities).each(function () {
                        appUsersListOrder = appUsersListOrder + 1;

                        var username = this.username;
                        var created = format(this.created);
                        var notification_display_style = '';
                        if (this.notification_display_style == 0) {
                            notification_display_style = $.i18n.prop('app_users_text_notification_display_style_summary');
                        } else if (this.notification_display_style == 1) {
                            notification_display_style = $.i18n.prop('app_users_text_notification_display_style_detail');
                        } else {
                            notification_display_style = '--'
                        }
                        var nickname = this.nickname;
                        if (nickname == undefined) {
                            nickname = '--';
                        }
                        var notification_no_disturbing = this.notification_no_disturbing;
                        var notification_no_disturbing_time = '--';
                        if (this.notification_no_disturbing) {
                            notification_no_disturbing = $.i18n.prop('app_users_text_notification_no_disturbing_open');
                            notification_no_disturbing_time = this.notification_no_disturbing_start + ':00' + '--' + this.notification_no_disturbing_end + ':00';
                        } else if (!this.notification_no_disturbing) {
                            notification_no_disturbing = $.i18n.prop('app_users_text_notification_no_disturbing_close');
                        } else {
                            notification_no_disturbing = '--';
                        }
                        var notifier_name = this.notifier_name;
                        if (notifier_name == undefined) {
                            notifier_name = '--';
                        }
                        selectOptions += '<tr>' +
                            '<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="' + username + '" />&nbsp;&nbsp;&nbsp;</label></td>' +
                            '<td class="text-center">' + username + '</td>' +
                            '<input type="hidden" id="hidden_notification_display_style_' + appUsersListOrder + '" value="' + this.notification_display_style + '">' +
                            '<td class="text-center" id="notification_display_style_' + appUsersListOrder + '">' + notification_display_style + '</td>' +
                            '<td class="text-center">' + nickname + '</td>' +
                            '<input type="hidden" id="hidden_notification_no_disturbing_' + appUsersListOrder + '" value="' + this.notification_no_disturbing + '">' +
                            '<td class="text-center" id="notification_no_disturbing_' + appUsersListOrder + '">' + notification_no_disturbing + '</td>' +
                            '<td class="text-center">' + notification_no_disturbing_time + '</td>' +
                            '<td class="text-center">' + notifier_name + '</td>' +
                            '<td class="text-center">' + created + '</td>' +
                            '<td class="text-center">' +
                            '<ul class="nav-pills" style="list-style-type:none">' +
                            '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="app_users_selections_operation_' + appUsersListOrder + '">' + $.i18n.prop('app_users_selections_operation') + '</span><b class="caret"></b></a>' +
                            '<ul class="dropdown-menu">' +
                            '<li data-filter-camera-type="all"><a href="javascript:void(0);" onclick="EasemobCommon.disPatcher.toPageAppUserContacts(\'' + username + '\')"><span id="app_users_selections_contacts_' + appUsersListOrder + '">' + $.i18n.prop('app_users_selections_contacts') + '</span></a></li>' +
                            '<li data-filter-camera-type="Zed"><a  href="javascript:void(0);" onclick="showUpdateIMUserInfoWindow(\'' + username + '\')"><span id="app_users_selections_modify_' + appUsersListOrder + '">' + $.i18n.prop('app_users_selections_modify') + '</span></a></li>' +
                            '<li data-filter-camera-type="Zed"><a href="javascript:void(0);" onclick="deleteAppUser(\'' + username + '\')"><span id="app_users_selections_delete_' + appUsersListOrder + '">' + $.i18n.prop("app_users_selections_delete") + '</span></a></li>' +
                            '<li data-filter-camera-type="Alpha"><a href="#passwordMondify" id="passwdMod${status.index }" onclick="setUsername(\'' + username + '\');" data-toggle="modal" role="button"><span id="app_users_selections_resetpassword_' + appUsersListOrder + '">' + $.i18n.prop('app_users_selections_resetpassword') + '</span></a></li>' +
                            '<li data-filter-camera-type="Zed"><a href="javascript:void(0);" onclick="sendMessageOneUser(\'' + username + '\')"><span id="app_users_selections_sendMessages_' + appUsersListOrder + '">' + $.i18n.prop('app_users_selections_sendMessages') + '</span></a></li>' +
                            '</ul>' +
                            '</li>' +
                            '</ul>' +
                            '</td>' +
                            '</tr>';
                    });

                    $('#appUsersListOrder').val(appUsersListOrder);

                    $('#tr_loading').remove();
                    $('#appUserBody').append(selectOptions);
                }
                var tbody = document.getElementsByTagName("tbody")[0];
                if (!tbody.hasChildNodes()) {
                    var option = '<tr><td class="text-center" colspan="9"><span id="app_users_table_nodata">' + $.i18n.prop('table_data_nodata') + '</span></td></tr>';
                    $('#tr_loading').remove();
                    $('#appUserBody').append(option);
                    var pageLi = $('#paginau').find('li');
                    for (var i = 0; i < pageLi.length; i++) {
                        $(pageLi[i]).hide();
                    }
                } else {
                    var ulB = '<ul>';
                    var ulE = '</ul>';
                    var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList();"><span id="app_users_table_nav_previous">' + $.i18n.prop('app_users_table_nav_previous') + '</span></a> </li>';
                    var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList();"><span id="app_users_table_nav_next">' + $.i18n.prop('app_users_table_nav_next') + '</span></a> </li>';
                    $('#paginau').html('');

                    // 首页
                    if (pageNo == 1) {
                        if (respData.cursor == null) {
                            $('#paginau').append(ulB + ulE);
                        } else {
                            if (pageAction == 'no') {
                                $('#paginau1').append(ulB + textOp2 + ulE);
                            } else {
                                $('#paginau').append(ulB + textOp2 + ulE);
                            }
                        }
                        // 尾页
                    } else if (cursors.length != 0 && respData.cursor == null) {
                        $('#paginau').append(ulB + textOp1 + ulE);
                    } else {
                        $('#paginau').append(ulB + textOp1 + textOp2 + ulE);
                    }
                }
            }
        });
    }
}

// 搜索IM用户
function searchAppIMUser() {
    var usernameToSearch = $('#userInbox').val();
    if (usernameToSearch == '' || usernameToSearch == null) {
        layer.msg($.i18n.prop('app_users_text_search_box_placeholder'), 3, 5);
        return;
    }

    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {

        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users/' + usernameToSearch,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('tbody').html('');
                var option = '<tr><td class="text-center" colspan="9" id="app_users_message_alerr_nouser">' + $.i18n.prop('app_users_message_alerr_nouser') + '</td></tr>';
                $('#appUserBody').append(option);
                $('#paginau').hide();
            },
            success: function (respData, textStatus, jqXHR) {
                $('tbody').html('');
                $(respData.entities).each(function () {
                    var username = this.username;
                    var created = format(this.created);
                    var notification_display_style = '';
                    if (this.notification_display_style == 0) {
                        notification_display_style = $.i18n.prop('app_users_search_label_messageType_summary');
                    } else if (this.notification_display_style == 1) {
                        notification_display_style = $.i18n.prop('app_users_search_label_messageType_detail');
                    }
                    var nickname = this.nickname;
                    if (nickname == undefined) {
                        nickname = '--';
                    }
                    var notification_no_disturbing = this.notification_no_disturbing;
                    var notification_no_disturbing_time = '--';
                    if (this.notification_no_disturbing) {
                        notification_no_disturbing = $.i18n.prop('app_users_search_label_mute_open');
                        notification_no_disturbing_time = this.notification_no_disturbing_start + ':00' + '--' + this.notification_no_disturbing_end + ':00';
                    } else {
                        notification_no_disturbing = $.i18n.prop('app_users_search_label_mute_close');
                    }

                    var notifier_name = this.notifier_name;
                    if (notifier_name == undefined) {
                        notifier_name = '--';
                    }
                    var selectOptions = '<tr>' +
                        '<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="' + username + '" />&nbsp;&nbsp;&nbsp;</label></td>' +
                        '<td class="text-center">' + username + '</td>' +
                        '<input type="hidden" id="hidden_search_notification_display_style" value="' + this.notification_display_style + '">' +
                        '<input type="hidden" id="hidden_search_notification_no_disturbing" value="' + this.notification_no_disturbing + '">' +
                        '<td class="text-center" id="search_notification_display_style">' + notification_display_style + '</td>' +
                        '<td class="text-center">' + nickname + '</td>' +
                        '<td class="text-center" id="search_notification_no_disturbing">' + notification_no_disturbing + '</td>' +
                        '<td class="text-center">' + notification_no_disturbing_time + '</td>' +
                        '<td class="text-center">' + notifier_name + '</td>' +
                        '<td class="text-center">' + created + '</td>' +
                        '<td class="text-center">' +
                        '<ul class="text-center" class="nav-pills" style="list-style-type:none">' +
                        '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="app_users_search_selections_operation">' + $.i18n.prop('app_users_search_selections_operation') + '</span><b class="caret"></b></a>' +
                        '<ul class="dropdown-menu">' +
                        '<li data-filter-camera-type="all"><a href="javascript:void(0);" onclick="EasemobCommon.disPatcher.toPageAppUserContacts(\'' + username + '\')"><span id="app_users_search_selections_contacts">' + $.i18n.prop('app_users_search_selections_contacts') + '</span></a></li>' +
                        '<li data-filter-camera-type="Zed"><a href="javascript:void(0);" onclick="showUpdateIMUserInfoWindow(\'' + username + '\')"><span id="app_users_search_selections_modify">' + $.i18n.prop('app_users_search_selections_modify') + '</span></a></li>' +
                        '<li data-filter-camera-type="Zed"><a href="javascript:void(0);" onclick="deleteAppUser(\'' + username + '\')"><span id="app_users_search_selections_delete">' + $.i18n.prop('app_users_search_selections_delete') + '</span></a></li>' +
                        '<li data-filter-camera-type="Alpha"><a href="#passwordMondify" id="passwdMod${status.index }" onclick="setUsername(\'' + username + '\');" data-toggle="modal" role="button"><span id="app_users_search_selections_resetpassword">' + $.i18n.prop('app_users_search_selections_resetpassword') + '</span></a></li>' +
                        '<li data-filter-camera-type="Zed"><a href="javascript:void(0);" onclick="sendMessageOneUser(\'' + username + '\')"><span id="app_users_search_selections_sendMessages">' + $.i18n.prop('app_users_search_selections_sendMessages') + '</span></a></li>' +
                        '</ul>' +
                        '</li>' +
                        '</ul>' +
                        '</td>' +
                        '</tr>';
                    $('#appUserBody').append(selectOptions);
                    $('#paginau').hide();
                });
            }
        });
    }
}


// 重置app用户密码
function updateAppUserPassword() {
    var username = $('#usernameMondify').val();
    var orgName = getOrgname();
    var accessToken = getAccessToken();
    var appName = $('#appNameHide').val();

    var pwdModifyObj = $('#pwdMondify');
    var pwdModifyVal = pwdModifyObj.val();
    var pwdModifyTwoObj = $('#pwdMondifytwo');
    var pwdModifyTwoVal = pwdModifyTwoObj.val();

    var passwordReg = /^[0-9a-zA-Z]{1,100}$/;
    if (pwdModifyVal == '') {
        pwdModifyObj.focus();
        $('#pwdMondifySpan').html($.i18n.prop('app_users_passwordModify_label_newpassword_placeholder'));
    } else if (!passwordReg.test(pwdModifyVal)) {
        pwdModifyObj.focus();
        $('#pwdMondifySpan').html($.i18n.prop('app_users_passwordModify_label_newpassword_placeholder'));
    } else {
        $('#pwdMondifySpan').html('');

        if (pwdModifyTwoVal == '') {
            pwdModifyTwoObj.focus();
            $('#pwdMondifytwoSpan').html($.i18n.prop('app_users_passwordModify_label_confirmnewpassword'));
        } else if (pwdModifyTwoVal != pwdModifyVal) {
            pwdModifyTwoObj.focus();
            $('#pwdMondifytwoSpan').html($.i18n.prop('app_users_passwordModify_label_notmatch'));
        } else {
            $('#pwdMondifySpan').text('');
            $('#pwdMondifytwoSpan').text('');

            var requestData = {
                newpassword: pwdModifyVal
            };
            var layerNum = layer.load($.i18n.prop('app_users_passwordModify_layer_pending'));
            $.ajax({
                url: baseUrl + '/' + orgName + '/' + appName + '/users/' + username + '/password',
                type: 'POST',
                data: JSON.stringify(requestData),
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                success: function (respData) {
                    layer.close(layerNum);
                    layer.msg($.i18n.prop('app_users_passwordModify_layer_saved'), 3, 1);
                    $('#pwdMondifySpan').text('');
                    $('#pwdMondifytwoSpan').text('');
                    $('#pwdMondify').val('');
                    $('#pwdMondifytwo').val('');

                    $('#modifyImUserPasswordBtn').click();
                },
                error: function (data) {
                    layer.close(layerNum);
                    layer.msg($.i18n.prop('app_users_passwordModify_layer_saveerror'), 3, 5);
                }
            });
        }
    }
}

// 删除app下的用户
function deleteAppUser(username) {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = $.cookie('appName');

    var confirmOk = $.i18n.prop('confirm_ok');
    var confirmCancel = $.i18n.prop('confirm_cancel');
    Modal.confirm({
            msg: $.i18n.prop('app_users_confirm_delete_user') + '<br/><font color="red">' + $.i18n.prop('app_users_confirm_delete_userTips') + '</font>',
            title: "",
            btnok: confirmOk,
            btncl: confirmCancel
    }).on( function () {
        var layerNum = layer.load($.i18n.prop('app_users_delete_layer_user'));
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users/' + username,
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function () {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_users_delete_alert_deleteError'), 3, 5);
            },
            success: function (respData) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_users_delete_alert_deleted'), 3, 1);
                getAppUserList('no');
            }
        });
    });
}


// 批量删除app下的用户
function deleteAppUsersBatch() {
    var checkbox = document.getElementsByName("checkbox");
    var num = 0;
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            num++;
        }
    }
    if (num > 0) {
        var confirmOk = $.i18n.prop('confirm_ok');
        var confirmCancel = $.i18n.prop('confirm_cancel');
        Modal.confirm({
            msg: $.i18n.prop('app_users_confirm_delete_user') + '<br/><font color="red">' + $.i18n.prop('app_users_confirm_delete_userTips') + '</font>',
            title: "",
            btnok: confirmOk,
            btncl: confirmCancel
        }).on( function () {
            var layerNum = layer.load($.i18n.prop('app_users_delete_layer_user'));
            var success = 0;
            var fail = 0;
            for (var j = 0; j < checkbox.length; j++) {
                if (checkbox[j].checked) {
                    if (deleteAppUsers(checkbox[j].value)) {
                        success++;
                    } else {
                        fail++;
                    }
                }
            }
            layer.close(layerNum);
            layer.msg($.i18n.prop('app_users_delete_alert_deleteNoteDoneHalfOne') + ' ' + success + ' ' + $.i18n.prop('app_users_delete_alert_deleteNoteDoneHalfTwo') + ' ' + fail + ' ' + $.i18n.prop('app_users_delete_alert_deleteNoteDoneHalfThree'), 1, 1);
            getAppUserList();
        });
    } else {
        layer.msg($.i18n.prop('app_users_alert_deleteNoteItem'), 3, 5);
    }
}


// 弹出发送消息
function showSendMessageWindowForIMUsers() {
    var checkbox = document.getElementsByName("checkbox");
    var num = 0;
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            num++;
        }
    }

    if (num > 0) {
        var users = [];
        for (var j = 0; j < checkbox.length; j++) {
            if (checkbox[j].checked) {
                users.push(checkbox[j].value);
            }
        }
        $('#usernameMessage').val(users);
        $('#appNameMessage').val($.cookie('appName'));
        $('#messegeContent').val('');
        document.getElementById('messegeContent').style.display = "block";
        $('#img1').remove();
        $('#share-secret').val('');
        $('#file').val('');
        $('#f_file').val('');
        $('#app_users_alert_upload_picture_waiting').text($.i18n.prop('app_users_alert_upload_picture_waiting'));
        $('#sendMessageA').click();
    } else {
        layer.msg($.i18n.prop('app_users_alert_deleteNoteItem'), 3, 5);
    }
}

//单个消息发送
function sendMessageOneUser(users) {
    $('#usernameMessage').val(users);
    $('#appNameMessage').val($.cookie('appName'));
    $('#messegeContent').val('');
    document.getElementById('messegeContent').style.display = "block";
    $('#img1').remove();
    $('#share-secret').val('');
    $('#file').val('');
    $('#f_file').val('');
    $('#sendMessageA').click();
}

//发送消息
function sendUserMessage1() {
    var users = $('#usernameMessage').val();
    var appName = $('#appNameMessage').val();
    var orgName = getOrgname();
    var accessToken = getAccessToken();
    var messageContent = $('#messegeContent').val().trim();

    var target = users.split(',');
    if (messageContent == '') {
        layer.msg($.i18n.prop('app_users_sendMessage_label_nomsg'), 3, 5);
    } else {
        var requestData = {
            "target_type": "users",
            "target": target,

            "msg": {
                "type": "txt",
                "msg": messageContent
            }
        };
        var layerNum = layer.load($.i18n.prop('app_users_sendMessage_layer_pending'));
        $.ajax({
            url: baseUrl + '/' + orgName + "/" + appName + '/messages',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestData),
            error: function (respData) {
                layer.close(layerNum);
            },
            success: function (respData) {
                layer.close(layerNum);
                $('#closeButn').click();
            }
        });
    }

}

//发送消息
function sendUserMessage() {
    var users = $('#usernameMessage').val();
    var appName = $('#appNameMessage').val();
    var orgName = getOrgname();
    var accessToken = getAccessToken();
    var messageContent = $('#messegeContent').val().trim();
    var target = users.split(',');
    if (messageContent == '') {
        layer.msg($.i18n.prop('app_users_sendMessage_label_nomsg'), 3, 5);
    } else {
        var requestData = {
            "target_type": "users",
            "target": target,

            "msg": {
                "type": "txt",
                "msg": messageContent
            }
        };
        var layerNum = layer.load($.i18n.prop('app_users_sendMessage_layer_pending'));
        $.ajax({
            url: baseUrl + '/' + orgName + "/" + appName + '/messages',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestData),
            error: function (respData) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_users_sendMessage_alert_failed'), 3, 5);
            },
            success: function (respData) {
                layer.close(layerNum);
                $('#closeButn').click();
                layer.msg($.i18n.prop('app_users_sendMessage_alert_succ'), 3, 1);
            }
        });
    }

}
//发送图片
function sendUserImgMessage() {
    if ($('#sndBtn').attr('disabled') == 'disabled') {
        return;
    }

    var shareSecret = $('#share-secret').val();
    if (shareSecret == '' || shareSecret == null) {
        layer.msg($.i18n.prop('app_users_sendMessage_selectPicture'), 3, 5);
    } else {
        var users = $('#usernameMessage').val();
        var appName = $('#appNameMessage').val();
        var orgName = getOrgname();
        var accessToken = getAccessToken();
        var target = users.split(',');
        var str = $('#share-secret').val().split(',');
        var requestData = {
            "target_type": "users",
            "target": target,
            "msg": {
                "type": "img", "filename": str[0], "secret": str[1], "url": $('#imgUuid').val()
            }
        };
        var layerContent = layer.load($.i18n.prop('app_users_sendMessage_layer_pending'));
        $.ajax({
            url: baseUrl + '/' + orgName + "/" + appName + '/messages',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestData),
            error: function (respData) {
                layer.close(layerContent);
                layer.msg($.i18n.prop('app_users_sendMessage_alert_failed'), 3, 5);
            },
            success: function (respData) {
                layer.close(layerContent);
                $('#closeButn').click();
                layer.msg($.i18n.prop('app_users_sendMessage_alert_succ'), 3, 1);
                $('#app_users_alert_upload_picture_waiting').text($.i18n.prop('app_users_sendMessage_layer_pending'));
                $('#img2').attr("src", "assets/img/140144.jpg");
            }
        });
    }

}


//获取用户好友列表
function getAppIMUserContactsList(owner_username) {
    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');

    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="3"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span id="app_users_contacts_table_loading">正在读取数据...</span></td></tr>';
        $('#appIMBody').empty();
        $('#appIMBody').append(loading);
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users/' + owner_username + '/contacts/users',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                $('tbody').html('');
                var i = 0;
                var selectOptions = '';
                var appIMUserContactsOrder = 0;
                $(respData.data).each(function () {
                    appIMUserContactsOrder += 1;
                    selectOptions += '<tr>' +
                        '<td style="visibility:visible;"><input type="checkbox" value="fff"  style="width:100px; height:20px;border:1px solid #F00;"/>' + (i + 1) + '</td>' +
                        '<td class="text-center">' + respData.data[i] + '</td>' +
                        '<td class="text-center">' +
                        '<ul class="text-center" class="nav-pills" style="list-style-type:none">' +
                        '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="app_users_contacts_table_operation_' + appIMUserContactsOrder + '">' + $.i18n.prop('app_users_contacts_table_operation') + '</span><b class="caret"></b></a>' +
                        '<ul class="dropdown-menu" style="left:150px;">' +
                        '<li><a href="javascript:void(0);" onclick="deleteAppIMFriend(\'' + owner_username + '\',\'' + respData.data[i] + '\')"><span id="app_users_contacts_table_disconn_' + appIMUserContactsOrder + '">' + $.i18n.prop('app_users_contacts_table_disconn') + '</span></a></li>' +
                        '</ul>' +
                        '</li>' +
                        '</ul>' +
                        '</td>' +
                        '</tr>';
                    i++;
                });

                $('#appIMUserContactsOrder').val(appIMUserContactsOrder + '');

                $('#tr_loading').remove();
                $('#appIMBody').append(selectOptions);
                var tbody = document.getElementsByTagName("tbody")[0];
                if (!tbody.hasChildNodes()) {
                    var option = '<tr><td class="text-center" colspan="3"><span id="app_users_contacts_table_nodata">' + $.i18n.prop('table_data_nodata') + '</span></td></tr>';
                    $('#appIMBody').append(option);
                    var pageLi = $('#paginau').find('li');
                    for (var i = 0; i < pageLi.length; i++) {
                        $(pageLi[i]).hide();
                    }
                }
            }
        });
    }
}


//删除某个好友
function deleteAppIMFriend(owner_username, friend_username) {
    //获取token
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    var accessToken = getAccessToken();

    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {

        var confirmOk = $.i18n.prop('confirm_ok');
        var confirmCancel = $.i18n.prop('confirm_cancel');
        Modal.confirm({
            msg: $.i18n.prop('app_users_contacts_delete_confirm'),
            title: "",
            btnok: confirmOk,
            btncl: confirmCancel
        }).on( function () {
            $.ajax({
                url: baseUrl + '/' + orgName + '/' + appName + '/users/' + owner_username + '/contacts/users/' + friend_username,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    layer.msg($.i18n.prop('app_users_contacts_delete_fail'), 2, 5);
                },
                success: function (respData, textStatus, jqXHR) {
                    layer.msg($.i18n.prop('app_users_contacts_delete_succ'), 2, 5);
                    getAppIMUserContactsList(owner_username);
                }
            });
        });
    }

}

//弹出添加好友页面
function showAddIMUserContactWindow() {
    $('#usernameFriend').val(owner_username);
    $('#appNameFriend').val($.cookie('appName'));
    $('#friendUsername').val('');
    $('#showAddFriend').click();
}

//添加好友
function doAddIMUserContact() {
    var orgName = getOrgname();
    var accessToken = getAccessToken();
    var owner_username = $('#usernameFriend').val();
    var appName = $('#appNameFriend').val();
    var friend_username = $('#friendUsername').val();
    if (friend_username == '') {
        layer.msg($.i18n.prop('app_users_contacts_add_alert_needusername'), 2, 5);
    } else {
        var layerNum = layer.load($.i18n.prop('app_users_contacts_add_layer_pending'));
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users/' + friend_username,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
                layer.close(layerNum);
                layer.msg($.i18n.prop('app_users_contacts_add_note_nouser'), 3, 5);
            },
            success: function (respData, textStatus, jqXHR) {
                var layerNum = layer.load($.i18n.prop('app_users_contacts_add_layer_pending'));
                $.ajax({
                    url: baseUrl + '/' + orgName + '/' + appName + '/users/' + owner_username + '/contacts/users/' + friend_username,
                    type: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'application/json'
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    },
                    success: function (respData, textStatus, jqXHR) {
                        layer.close(layerNum);
                        layer.msg($.i18n.prop('app_users_contacts_add_note_addContactDone'), 3, 1);

                        $('#closeButn').click();
                        getAppIMUserContactsList(owner_username);
                    }
                });
            }
        });


    }

}


// 好友分页条更新
function updateIMPageStatus(owner_username) {
    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users/' + owner_username + '/contacts/users?limit=1000',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                total = respData.entities.length;
                var totalPage = (total % 10 == 0) ? (parseInt(total / 10)) : (parseInt(total / 10) + 1);
                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList()">' + $.i18n.prop('app_users_table_tab_previous') + '</a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList()">' + $.i18n.prop('app_users_table_tab_next') + '</a> </li>';
                $('#paginau').html('');
                // 首页
                if (pageNo == 1) {
                    if (totalPage == 1) {
                        $('#paginau').append(ulB + ulE);
                    } else {
                        $('#paginau').append(ulB + textOp2 + ulE);
                    }
                    // 尾页
                } else if (totalPage == pageNo) {
                    $('#paginau').append(ulB + textOp1 + ulE);
                } else {
                    $('#paginau').append(ulB + textOp1 + textOp2 + ulE);
                }
            }
        });
    }
}


//弹出修改信息框
function showUpdateIMUserInfoWindow(username) {
    // 获取token
    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');

    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users/' + username,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                $(respData.entities).each(function () {
                    var username = this.username;
                    var notification_display_style = this.notification_display_style;
                    var nickname = this.nickname;
                    var notification_no_disturbing = this.notification_no_disturbing;
                    var notification_no_disturbing_start = this.notification_no_disturbing_start;
                    var notification_no_disturbing_end = this.notification_no_disturbing_end;
                    $('#username').text(username);
                    document.getElementById('messageType_0').checked = false;
                    document.getElementById('messageType_1').checked = false;
                    if (notification_display_style == 0) {
                        document.getElementById('messageType_0').checked = 'checked';
                    } else if (notification_display_style == 1) {
                        document.getElementById('messageType_1').checked = 'checked';
                    }
                    $('#nickname').val(nickname);
                    document.getElementById('notification_true').checked = false;
                    document.getElementById('notification_false').checked = false;
                    if (notification_no_disturbing) {
                        document.getElementById('notification_true').checked = 'checked';
                        document.getElementById('notification_time_div').style.display = "block";
                        $('#notification_starttime').val(notification_no_disturbing_start);
                        $('#notification_endtime').val(notification_no_disturbing_end);
                    } else if (!notification_no_disturbing) {
                        document.getElementById('notification_false').checked = 'checked';
                        document.getElementById('notification_time_div').style.display = "none";
                        $('#notification_starttime').val('');
                        $('#notification_endtime').val('');
                    }
                    $('#showUpdateInfoA').click();
                });
            }
        });
    }
}

//修改信息
function doUpdateIMUserInfo() {
    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    var username = $('#username').text();

    var notification_display_style;
    if (document.getElementById('messageType_0').checked) {
        notification_display_style = 0;
    } else if (document.getElementById('messageType_1').checked) {
        notification_display_style = 1;
    } else {
        notification_display_style = '';
    }
    var nickname = $('#nickname').val();
    var notification_no_disturbing;
    var notification_no_disturbing_start;
    var notification_no_disturbing_end;
    if (document.getElementById('notification_true').checked) {
        notification_no_disturbing = true;
        notification_no_disturbing_start = $('#notification_starttime').val();
        notification_no_disturbing_end = $('#notification_endtime').val();
    } else if (document.getElementById('notification_false').checked) {
        notification_no_disturbing = false;
        notification_no_disturbing_start = '';
        notification_no_disturbing_end = '';
    } else {

    }
    var flag = true;
    if (nickname.length > 20) {
        flag = false;
    }

    if (document.getElementById('notification_true').checked) {
        var numReg = /^[0-9]*$/;
        if (numReg.test(notification_no_disturbing_start) && numReg.test(notification_no_disturbing_end)) {

            notification_no_disturbing_end = parseInt(notification_no_disturbing_end);
            notification_no_disturbing_start = parseInt(notification_no_disturbing_start);

            if (notification_no_disturbing_end >= 0 && notification_no_disturbing_end <= 24 && notification_no_disturbing_start >= 0 && notification_no_disturbing_start <= 24) {
                var requestData = {
                    notification_display_style: notification_display_style,
                    nickname: nickname,
                    notification_no_disturbing: notification_no_disturbing,
                    notification_no_disturbing_start: notification_no_disturbing_start,
                    notification_no_disturbing_end: notification_no_disturbing_end
                };
                var layerNum = layer.load($.i18n.prop('app_users_infoModify_layer_content'));
                if (flag) {
                    $.ajax({
                        url: baseUrl + '/' + orgName + '/' + appName + '/users/' + username,
                        type: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(requestData),
                        error: function (jqXHR, textStatus, errorThrown) {
                            layer.close(layerNum);
                            layer.msg($.i18n.prop('app_users_infoModify_layer_saveerror'), 3, 5);
                        },
                        success: function (respData, textStatus, jqXHR) {
                            layer.close(layerNum);
                            layer.msg($.i18n.prop('app_users_infoModify_layer_saved'), 3, 1);
                            $('#infoCloseButn').click();
                            getAppUserList('no');
                        }
                    });
                } else {
                    layer.msg($.i18n.prop('app_users_infoModify_layer_nicknameError'), 3, 5);
                }
            } else {
                layer.msg($.i18n.prop('app_users_infoModify_layer_periodError'), 3, 5);
            }

        } else {
            layer.msg($.i18n.prop('app_users_infoModify_layer_periodError'), 3, 5);
        }

    } else if (!document.getElementById('notification_true').checked) {
        var requestData = {
            notification_display_style: notification_display_style,
            nickname: nickname,
            notification_no_disturbing: notification_no_disturbing,
            notification_no_disturbing_start: notification_no_disturbing_start,
            notification_no_disturbing_end: notification_no_disturbing_end
        };
        if (flag) {
            $.ajax({
                url: baseUrl + '/' + orgName + '/' + appName + '/users/' + username,
                type: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(requestData),
                error: function (jqXHR, textStatus, errorThrown) {
                    layer.msg($.i18n.prop('app_users_infoModify_layer_saveerror'), 3, 5);
                },
                success: function (respData, textStatus, jqXHR) {
                    layer.msg($.i18n.prop('app_users_infoModify_layer_saved'), 3, 1);
                    $('#infoCloseButn').click();
                    getAppUserList('no');
                }
            });
        } else {
            layer.msg($.i18n.prop('app_users_infoModify_layer_nicknameError'), 3, 5);
        }
    }
}


// 上一页数据
function getPrevAppUserList() {
    getAppUserList('forward');
}
// 下一页数据
function getNextAppUserList() {
    getAppUserList('next');
}

// 去除字符串中所有空格
function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}

function check() {
    if (count == 0) {
        count++;
        return true;
    } else {
        return false;
    }
}
function preSaveNewIMUser() {
    if (check()) {
        count = 0;
        saveNewIMUser();
    }
}


// 图片上传
function uploadImagesForSendMsgtoUser() {
    var imagesSuffixes = ['png', 'jpg', 'bmp', 'gif', 'jpeg'];
    var img = $('#file').val().substr($('#file').val().lastIndexOf('.') + 1).toLowerCase();
    if (imagesSuffixes.indexOf(img) > -1) {
        var accessToken = getAccessToken();
        var orgName = getOrgname();
        var appName = $.cookie('appName');

        $('#app_users_alert_upload_picture_waiting').text($.i18n.prop('app_users_alert_upload_picture_pending'));

        var ajax_option = {
            url: baseUrl + '/' + orgName + '/' + appName + '/chatfiles',
            headers: {
                'Accept': 'application/json',
                'restrict-access': true,
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (respData) {
                $('#sndBtn').removeAttr('disabled');
                $('#app_users_alert_upload_picture_waiting').text($.i18n.prop('app_users_alert_upload_picture_saved'));
                var str = $('#file').val() + "," + respData.entities[0]['share-secret'];
                $('#share-secret').val(str);
                $('#imgUuid').val(baseUrl + '/' + orgName + '/' + appName + '/chatfiles/' + respData.entities[0].uuid);
            },
            error: function (respData) {
                $('#app_users_alert_upload_picture_waiting').text($.i18n.prop('app_users_alert_upload_picture_failure'));
                $('#sndBtn').attr('disabled', 'true');
            }
        };

        $('#myForm').ajaxSubmit(ajax_option);

    } else {
        layer.msg($.i18n.prop('app_users_alert_upload_picture_wrongtype'), 3, 5);
        $('#file').val('')
    }
}

// 清空修改
function clearFromUserPasswordModify() {
    $('#pwdMondifySpan').text('');
    $('#pwdMondifytwoSpan').text('');
}


//发送消息判断
function sendMessage() {
    var waiting = $.i18n.prop('app_users_alert_upload_picture_waiting');
    var uploadResSpan = $('#app_users_alert_upload_picture_waiting').text();
    var messageContent = $('#messegeContent').val();
    if (uploadResSpan == waiting && messageContent == '') {
        layer.msg($.i18n.prop('app_users_alert_notContent_note'), 3, 5);
    } else if (uploadResSpan != waiting && messageContent == '') {
        sendUserImgMessage();
    } else if (uploadResSpan == waiting && messageContent != '') {
        sendUserMessage();
    } else if (uploadResSpan != waiting && messageContent != '') {
        sendUserMessage1();
        sendUserImgMessage();
    }
}

//免打扰时段显示隐藏
function showTimeDiv(num) {
    if (num) {
        document.getElementById('notification_time_div').style.display = 'block';
    } else {
        document.getElementById('notification_time_div').style.display = 'none';
    }
}


function clearFormUpdateIMUserInfo() {
    $('#appNameInfo').val('');
    $('#nickname').val('');
    $('#notification_starttime').val('');
    $('#notification_endtime').val('');
}

function checkAll() {
    var isCheckAll = document.getElementById('checkAll');
    var checkbox = document.getElementsByName('checkbox');
    if (isCheckAll.checked) {
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = true;
        }
    } else {
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = false;
        }
    }
}
