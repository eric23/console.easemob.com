/**
 * Created by kenshinn on 15-6-10.
 */


//群组发送消息
function sendUserMessages() {
    var users = $('#usernameMessage').val();
    var appName = $('#appNameMessage').val();
    var orgName = getOrgname();
    var accessToken = getAccessToken();
    var messageContent = $('#messegeContent').val().trim();
    var target = users.split(',');
    if (messageContent == '') {
        layer.msg($.i18n.prop('app_chatgroups_form_sendMsg_contentEmpty'), 3, 5);
    } else {
        var requestData = {
            "target_type": "chatgroups",
            "target": target,

            "msg": {
                "type": "txt",
                "msg": messageContent
            }
        };
        var layerNum = layer.load($.i18n.prop('app_chatgroups_form_sendMsg_pending'));
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
//群组发送图片
function sendUserImgMessages() {
    if ($('#share-secret').val() == '' || $('#share-secret').val() == null) {
        layer.msg($.i18n.prop('app_chatgroups_sendMsg_label_selectPicture'), 3, 5);
    } else {
        var users = $('#usernameMessage').val();
        var appName = $('#appNameMessage').val();
        var orgName = getOrgname();
        var accessToken = getAccessToken();
        var target = users.split(',');
        var str = $('#share-secret').val().split(',');
        var requestData = {
            "target_type": "chatgroups",
            "target": target,
            "msg": {
                "type": "img", "filename": str[0], "secret": str[1], "url": $('#imgUuid').val()
            }
        };
        var layerNum = layer.load($.i18n.prop('app_chatgroups_sendMsg_layer_sending'));
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
                layer.msg($.i18n.prop('app_chatgroups_sendMsg_label_sendError'), 3, 5);
            },
            success: function (respData) {
                layer.close(layerNum);
                $('#closeButn').click();
                $('#app_chatgroups_sendMsg_label_wait').text($.i18n.prop('app_chatgroups_sendMsg_label_wait'));
                layer.msg($.i18n.prop('app_chatgroups_sendMsg_label_sent'), 3, 1);
            }
        });
    }
}


// 获取app群组列表
function getAppChatgroups(pageAction) {

    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if ('next' == pageAction) {
            pageNo += 1;
        } else if ('forward' == pageAction) {
            pageNo -= 1;
        }

        var tmp = '';
        if (typeof(pageAction) != 'undefined' && pageAction != '' && cursors[pageNo] != '') {
            tmp = '&cursor=' + cursors[pageNo];
        }
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="6"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span id="app_chatgroups_table_loading">' + $.i18n.prop('app_chatgroups_table_loading') + '</span></td></tr>';
        $('#appChatroomBody').empty();
        $('#appChatroomBody').append(loading);
        $.ajax({
            url: baseUrl + '/' + orgName + "/" + appName + '/chatgroups?limit=10' + tmp,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (respData) {

            },
            success: function (respData) {

                $('tbody').html('');
                var statusOrder = 0;

                $(respData.data).each(function () {
                    statusOrder += 1;

                    var groupid = $.trim(this.groupid);
                    var groupname = $.trim(this.groupname);
                    if (groupname == '' || groupname == null) {
                        groupname = '--';
                    }
                    var groupOwner = $.trim(this.owner);
                    groupOwner = groupOwner.substring(groupOwner.indexOf('_') + 1);
                    if (groupOwner == '' || groupOwner == null) {
                        groupOwner = '--';
                    }
                    var groupMembers = $.trim(this.affiliations);
                    if (groupOwner == '' || groupMembers == null) {
                        groupMembers = '--';
                    }

                    var selectOptions = '<tr>' +
                        '<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="' + groupid + '" />&nbsp;&nbsp;&nbsp;</label></td>' +
                        '<td class="text-center" width="222px" style="word-break:break-all">' + groupid + '</td>' +
                        '<td class="text-center" width="222px" style="word-break:break-all">' + groupOwner + '</td>' +
                        '<td class="text-center" width="222px" style="word-break:break-all">' + groupMembers + '</td>' +
                        '<td class="text-center" width="666px" style="word-break:break-all">' + groupname + '</td>' +
                        '<td class="text-center">' +
                        '<ul class="text-center" class="nav-pills" style="list-style-type:none">' +
                        '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="app_chatgroups_table_selection_operation_' + statusOrder + '">' + $.i18n.prop('app_chatgroups_table_selection_operation') + '</span><b class="caret"></b></a>' +
                        '<ul class="dropdown-menu">' +
                        '<li data-filter-camera-type="all"><a href="javascript:void(0);" onclick="EasemobCommon.disPatcher.toPageAppChatGroupUsers(\'' + groupid + '\')"><span id="app_chatgroups_table_operation_members_' + statusOrder + '">' + $.i18n.prop('app_chatgroups_table_operation_members') + '</span></a></li>' +
                        '<li data-filter-camera-type="Alpha"><a href="javascript:void(0);" onclick="deleteAppChatroom(\'' + groupid + '\')"><span id="app_chatgroups_table_operation_delete_' + statusOrder + '">' + $.i18n.prop('app_chatgroups_table_operation_delete') + '</span></a></li>' +
                        '<li data-filter-camera-type="Zed"><a href="javascript:void(0);" onclick="sendMessgeOne(\'' + groupid + '\')"><span id="app_chatgroups_table_operation_sendmessage_' + statusOrder + '">' + $.i18n.prop('app_chatgroups_table_operation_sendmessage') + '</span></a></li>' +
                        '</ul>' +
                        '</li>' +
                        '</ul>' +
                        '</td>' +
                        '</tr>';
                    $('#tr_loading').remove();
                    $('#appChatroomBody').append(selectOptions);
                });

                $('#statusOrder').val(statusOrder);

                var tbody = document.getElementsByTagName("tbody")[0];
                if (!tbody.hasChildNodes()) {
                    var option = '<tr><td class="text-center" colspan="6"><span id="app_chatgroups_table_data_nodata">' + $.i18n.prop('table_data_nodata') + '</span></td></tr>';
                    $('#appChatroomBody').append(option);
                    var pageLi = $('#pagina').find('li');
                    for (var i = 0; i < pageLi.length; i++) {
                        $(pageLi[i]).hide();
                    }
                }

                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getAppChatgroups(\'forward\')"><span id="app_chatgroups_table_nav_previous">' + $.i18n.prop('app_chatgroups_table_nav_previous') + '</span></a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getAppChatgroups(\'next\')"><span id="app_chatgroups_table_nav_next">' + $.i18n.prop('app_chatgroups_table_nav_next') + '</span></a> </li>';
                $('#paginau').html('');
                var hasNext = (respData.cursor != undefined);
                cursors[pageNo + 1] = respData.cursor;
                if (pageNo == 1) {
                    if (hasNext) {
                        $('#paginau').append(ulB + textOp2 + ulE);
                    } else {
                        $('#paginau').append(ulB + ulE);
                    }
                } else {
                    if (hasNext) {
                        $('#paginau').append(ulB + textOp1 + textOp2 + ulE);
                    } else {
                        $('#paginau').append(ulB + textOp1 + ulE);
                    }
                }
            }
        });
    }
}


// 搜索app群组
function searchAppChatgroupById(groupid, pageAction) {
    $('#paginau').html('');
    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if ('forward' == pageAction) {
            pageNo += 1;
        } else if ('next' == pageAction) {
            pageNo -= 1;
        }
        var loading = '<tr id="tr_loading"><td class="text-center" colspan="6"><img src ="/assets/img/loading.gif">&nbsp;&nbsp;&nbsp;<span id="app_chatgroups_search_table_loading"></span>' + $.i18n.prop('app_chatgroups_table_loading') + '</td></tr>';
        $('#appChatroomBody').empty();
        $('#appChatroomBody').append(loading);
        $.ajax({
            url: baseUrl + '/' + orgName + "/" + appName + '/chatgroups/' + groupid,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (respData) {
                var error = jQuery.parseJSON(respData.responseText).error;
                $('tbody').html('');
                if ('service_resource_not_found' == error || 'illegal_argument' == error) {
                    var option = '<tr><td class="text-center" colspan="6"><span id="app_chatgroups_btn_search_alert">' + $.i18n.prop('app_chatgroups_btn_search_alert') + '</span></td></tr>';
                    $('#appChatroomBody').append(option);
                }
            },
            success: function (respData) {
                if (pageAction != 'forward') {
                    cursors[pageNo + 1] = respData.cursor;
                } else {
                    cursors[pageNo + 1] = null;
                }
                $('tbody').html('');
                var groupid = respData.data[0].id;
                var groupname = respData.data[0].name;
                var errors = respData.data[0].error;
                if (errors != null) {
                    var option = '<tr><td class="text-center" colspan="6"><span id="app_chatgroups_btn_search_alert">' + $.i18n.prop('app_chatgroups_btn_search_alert') + '</span></td></tr>';
                    $('#appChatroomBody').append(option);
                    return;
                }
                if (groupname == '' || groupname == null) {
                    groupname = '--';
                }
                var affiliations = respData.data[0].affiliations;
                var groupOwner = '--';
                $(affiliations).each(function () {
                    if(typeof (this.owner) != 'undefined') {
                        groupOwner = this.owner;
                    }
                });

                var groupMembers = $.trim(respData.data[0].affiliations_count);
                if (groupOwner == '' || groupMembers == null) {
                    groupMembers = '--';
                }

                var selectOptions = '<tr>' +
                    '<td class="text-center"><label><input style="opacity:1;" name="checkbox" type="checkbox" value="' + groupid + '" />&nbsp;&nbsp;&nbsp;</label></td>' +
                    '<td class="text-center">' + groupid + '</td>' +
                    '<td class="text-center">' + groupOwner + '</td>' +
                    '<td class="text-center">' + groupMembers + '</td>' +
                    '<td class="text-center">' + groupname + '</td>' +
                    '<td class="text-center">' +
                    '<ul class="text-center" class="nav-pills" style="list-style-type:none">' +
                    '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="app_chatgroups_table_operation">' + $.i18n.prop('app_chatgroups_table_operation') + '</span><b class="caret"></b></a>' +
                    '<ul class="dropdown-menu">' +
                    '<li data-filter-camera-type="all"><a href="javascript:void(0);" onclick="EasemobCommon.disPatcher.toPageAppChatGroupUsers(\'' + groupid + '\')"><span id="app_chatgroups_table_operation_members">' + $.i18n.prop('app_chatgroups_table_operation_members') + '</span></a></li>' +
                    '<li data-filter-camera-type="Alpha"><a href="javascript:void(0);" onclick="deleteAppChatroom(\'' + groupid + '\')"><span id="app_chatgroups_table_operation_delete">' + $.i18n.prop('app_chatgroups_table_operation_delete') + '</span></a></li>' +
                    '<li data-filter-camera-type="Zed"><a href="javascript:void(0);" onclick="sendMessgeOne(\'' + groupid + '\')"><span id="app_chatgroups_table_operation_sendmessage">' + $.i18n.prop('app_chatgroups_table_operation_sendmessage') + '</span></a></li>' +
                    '</ul>' +
                    '</li>' +
                    '</ul>' +
                    '</td>' +
                    '</tr>';

                $('#tr_loading').remove();
                $('#appChatroomBody').append(selectOptions);
            }
        });
    }

}

// 获取群组成员列表
function getAppChatgroupUser(groupid, pageAction) {
    $('#paginau').html('');
    var accessToken = getAccessToken();
    var cuser = getCuser();
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        if ('forward' == pageAction) {
            pageNo += 1;
        } else if ('next' == pageAction) {
            pageNo -= 1;
        }

        var tmp = '';
        if (typeof(pageAction) != 'undefined' && pageAction != '') {
            tmp = '&cursor=' + cursors[pageNo];
        }
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/chatgroups/' + groupid + '/users',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (respData) {
            },
            success: function (respData) {
                if (pageAction != 'forward') {
                    cursors[pageNo + 1] = respData.cursor;
                } else {
                    cursors[pageNo + 1] = null;
                }
                if (respData.entities.length == 0 && pageAction == 'no') {
                    getAppChatgroupUser(groupid, 'forward');
                } else {
                    $('#showUsername').text(cuser)
                    $('tbody').html('');
                    groupMembersOrder = 0;
                    $(respData.data).each(function () {
                        groupMembersOrder = groupMembersOrder + 1;
                        var members = this.member;
                        var owner = this.owner;
                        if (owner != undefined) {
                            $.cookie('owner', owner);

                            var selectOptions =
                                '<tr>' +
                                '<td class="text-center" style="color:#FF0000;"><i class="icon-user"></i>&nbsp;' + owner + '</td>' +
                                '<td class="text-center"><span id="app_chatgroups_users_table_disable">' + $.i18n.prop('app_chatgroups_users_table_disable') + '</span></td>' +
                                '</tr>';

                            $('#appIMBody').append(selectOptions);
                        }


                        if (members != undefined) {
                            var selectOptions = '<tr>' +
                                '<td class="text-center">' + members + '</td>' +
                                '<td class="text-center">' +
                                '<ul class="text-center" class="nav-pills" style="list-style-type:none">' +
                                '<li class="dropdown all-camera-dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="app_chatgroups_users_table_selection_operation_' + groupMembersOrder + '">' + $.i18n.prop('app_chatgroups_users_table_selection_operation') + '</span><b class="caret"></b></a>' +
                                '<ul class="dropdown-menu" style="left:200px">' +
                                '<li><a href="javascript:void(0);" onclick="deleteAppChatgroupUsers(\'' + groupid + '\',\'' + members + '\')"><span id="app_chatgroups_users_table_selection_remove_' + groupMembersOrder + '">' + $.i18n.prop('app_chatgroups_users_table_selection_remove') + '</span></a></li>' +
                                '</ul>' +
                                '</li>' +
                                '</ul>' +
                                '</td>' +
                                '</tr>';
                            $('#appIMBody').append(selectOptions);
                        }
                    });

                    $('#groupMembersOrder').val(groupMembersOrder);
                }
                var tbody = document.getElementsByTagName("tbody")[0];
                if (!tbody.hasChildNodes()) {
                    var option = '<tr><td class="text-center" colspan="3"><span id="app_chatgroups_users_table_nodata">' + $.i18n.prop('table_data_nodata') + '</span></td></tr>';
                    $('#appIMBody').append(option);
                    var pageLi = $('#pagina').find('li');
                    for (var i = 0; i < pageLi.length; i++) {
                        $(pageLi[i]).hide();
                    }
                }

            }
        });
    }

}
// 删除app下的群组
function deleteAppChatroom(groupuuid) {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = $.cookie('appName');

    var confirmOk = $.i18n.prop('confirm_ok');
    var confirmCancel = $.i18n.prop('confirm_cancel');
    Modal.confirm({
        msg: $.i18n.prop('app_chatgroups_delete_confirm'),
        title: "",
        btnok: confirmOk,
        btncl: confirmCancel
    }).on(function () {
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/chatgroups/' + groupuuid,
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function () {
                layer.msg($.i18n.prop('app_chatgroups_delete_failed'), 3, 5);
            },
            success: function (respData) {
                layer.msg($.i18n.prop('app_chatgroups_delete_succ'), 3, 1);

                getAppChatgroups();
            }
        });
    });
}

// 移除群组下的成员
function deleteAppChatgroupUsers(groupuuid, usersname) {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = $.cookie('appName');

    var confirmOk = $.i18n.prop('confirm_ok');
    var confirmCancel = $.i18n.prop('confirm_cancel');
    Modal.confirm({
        msg: $.i18n.prop('app_chatgroups_users_delete_confirm'),
        title: "",
        btnok: confirmOk,
        btncl: confirmCancel
    }).on(function () {
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/chatgroups/' + groupuuid + '/users/' + usersname,
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function () {
                layer.msg($.i18n.prop('app_chatgroups_delete_failed'), 3, 5);
            },
            success: function (respData) {
                layer.msg($.i18n.prop('app_chatgroups_users_delete_succ'), 3, 1);

                getAppChatgroupUser(groupuuid);
            }
        });
    });
}

// 添加群内成员
function addChatgroupMember(groupid, newmember) {
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    var accessToken = getAccessToken();
    if (newmember == '') {
        $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_user_invalid'));
        $('#newMemberEMsgTag').val('user_invalid');
    } else {
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users/' + newmember,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_user_notfoud'));
                $('#newMemberEMsgTag').val('user_notfoud');
            },
            success: function (respData, textStatus, jqXHR) {
                var owner = $.cookie('owner');
                if (newmember != owner) {
                    $.ajax({
                        url: baseUrl + '/' + orgName + '/' + appName + '/chatgroups/' + groupid + '/users/' + newmember,
                        type: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/json'
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                        },
                        success: function (respData, textStatus, jqXHR) {
                            layer.msg($.i18n.prop('app_chatgroups_add_succ'), 3, 1);
                            getAppChatgroupUser(groupid);
                        }
                    });
                } else {
                    $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_owner_duplicate'));
                    $('#newMemberEMsgTag').val('owner_duplicate');
                }
            }
        });
    }
}


// 添加群组
function createNewChatgroups(chatgroupName, chatgroupDesc, approval, publics, chatgroupOwner) {
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    var accessToken = getAccessToken();
    var maxusers = $('#maxusers').val();
    if (chatgroupName == '') {
        $('#groupnameSpan').text($.i18n.prop('app_chatgroups_add_alert_groupname_null'));
        return false;
    }
    $('#groupnameSpan').text('');

    if (chatgroupDesc == '') {
        $('#app_chatgroups_form_add_groupdescSpan').text($.i18n.prop('app_chatgroups_add_alert_groupdesc_null'));
        return false;
    }
    $('#groupnameSpan').text('');

    var maxusersReg = /^[0-9]+$/;
    if (maxusers == '') {
        $('#app_chatgroups_form_add_groupdescSpan').text('');
        $('#app_chatgroups_form_add_groupMaxuserSpan').text($.i18n.prop('app_chatgroups_add_alert_groupmaxusers_null'));
        return false;
    } else if (!(maxusersReg.test(maxusers) && parseInt(maxusers) >= 1)) {
        $('#app_chatgroups_form_add_groupMaxuserSpan').text($.i18n.prop('app_chatgroups_add_alert_groupmaxuser_duration'));
    } else if (chatgroupOwner == '') {
        $('#app_chatgroups_form_add_groupdescSpan').text('');
        $('#app_chatgroups_form_add_groupMaxuserSpan').text('');
        $('#app_chatgroups_form_add_groupOwnerSpan').text($.i18n.prop('app_chatgroups_add_alert_groupowner_null'));
        return false;
    } else {
        $('#groupnameSpan').text('');

        if(isIMUserExists(chatgroupOwner)) {
            $('#app_chatgroups_form_add_groupdescSpan').text('');
            $('#app_chatgroups_form_add_groupMaxuserSpan').text('');
            $('#app_chatgroups_form_add_groupOwnerSpan').text('');
            var cahtgroupData = {
                "groupname": chatgroupName,
                "desc": chatgroupDesc,
                "public": publics,
                "owner": chatgroupOwner,
                "maxusers": parseInt(maxusers)
            };
            if (publics == true) {
                cahtgroupData.approval = approval;
            }
            $.ajax({
                url: baseUrl + '/' + orgName + '/' + appName + '/chatgroups',
                type: 'POST',
                data: JSON.stringify(cahtgroupData),
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    layer.msg($.i18n.prop('app_chatgroups_add_fail'), 2, 5);
                },
                success: function (respData, textStatus, jqXHR) {
                    $('#app_chatgroups_form_add_groupOwnerSpan').text('');

                    layer.msg($.i18n.prop('app_chatgroups_add_succ'), 2, 1);

                    getAppChatgroups();
                    $('#addNewChatgroupWindowClose').click();
                    clearFormAddNewChatgroup();
                }
            });

            return true;
        } else {
            layer.msg($.i18n.prop('app_chatgroups_add_alert_user_notfoud'), 2, 5);
            BtnHandler.setBtnEnable();
        }
    }
}

/**
 * Check IM user exists or not
 * @param username
 */
var isIMUserExists = function(username) {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    var result = false;
    $.ajax({
        url: baseUrl + '/' + orgName + '/' + appName + '/users/' + username,
        type: 'GET',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        error: function () {
            result = false;
        },
        success: function (respData) {
            result = true;
        }
    });

    return result;
};

// 批量删除app下的群组的Ajax
function deleteAppChatgroup(groupuuid) {
    var accessToken = getAccessToken();
    var orgName = getOrgname();
    var appName = $.cookie('appName');
    $.ajax({
        async: false,
        url: baseUrl + '/' + orgName + '/' + appName + '/chatgroups/' + groupuuid,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        error: function () {
        },
        success: function (respData) {
            layer.msg($.i18n.prop('app_chatgroups_delete_succ'), 3, 1);
        }
    });
}


// 批量删除群组
function deleteAppChatgroupsBatch() {
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
            msg: $.i18n.prop('app_chatgroups_delete_confirm'),
            title: "",
            btnok: confirmOk,
            btncl: confirmCancel
        }).on(function () {
            for (var i = 0; i < checkbox.length; i++) {
                if (checkbox[i].checked) {
                    deleteAppChatgroup(checkbox[i].value);
                }
            }
            EasemobCommon.disPatcher.refreshCurrentPage();
        });
    } else {
        layer.msg($.i18n.prop('app_chatgroups_delete_deleteNoteItem'), 3, 5);
    }
}


//单个消息发送
function sendMessgeOne(users) {

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

//弹出发送消息
function sendMessagesForChatgroups() {
    var checkbox = document.getElementsByName("checkbox");
    var num = 0;
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            num++;
        }
    }
    if (num > 0) {
        var users = new Array();
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
        $('#sendMessageA').click();
    } else {
        layer.msg($.i18n.prop('app_chatgroups_delete_deleteNoteItem'), 3, 5);
    }
}


function checkMaxusers() {
    var ii = 0;
    var maxusers = 0;
    $('#appIMBody').find("tr").each(function (i) {
        ii++;
    });

    var orgName = getOrgname();
    var appName = $.cookie('appName');
    var accessToken = getAccessToken();
    $.ajax({
        url: baseUrl + '/' + orgName + "/" + appName + '/chatgroups/' + groupid,
        type: 'GET',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        error: function (respData) {
        },
        success: function (respData) {
            maxusers = respData.data[0].maxusers;
        }
    });
    if (ii >= maxusers) {
        return false;
    } else {
        return true;
    }
}

function addChatgroupMemberPre() {
    var newmember = $('#newmember').val().trim();
    if (checkMaxusers()) {
        $('#newmemberEMsg').text('');
        addChatgroupMember(groupid, newmember)
    } else {
        $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_table_overLoad'));
        $('#newMemberEMsgTag').val('overLoad');
    }
}

//发送消息
function showSendMessagesWindowForChatgroups() {
    sendMessagesForChatgroups();
}

// 搜索群组
function searchChatgroup() {
    var groupidV = $('#groupid').val().trim();
    if (groupidV == '' || groupidV == null) {
        layer.msg($.i18n.prop('app_chatgroups_btn_search_placeholder'), 3, 5);
    } else {
        searchAppChatgroupById(groupidV);
    }
}


function checkAll() {
    var ischeck = document.getElementById('checkAll');
    var checkbox = document.getElementsByName('checkbox');
    if (ischeck.checked) {
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = true;
        }
    } else {
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = false;
        }
    }
}

//发送消息判断
function sendMessage() {
    var uploadResspan = $('#app_chatgroups_sendMsg_label_wait').text();
    var messageContent = $('#messegeContent').val();
    var pending = $.i18n.prop('app_chatgroups_sendMsg_label_wait');
    if (uploadResspan == pending && messageContent == '') {
        layer.msg($.i18n.prop('app_chatgroups_alert_notContent_note'), 3, 5);
    } else if (uploadResspan != pending && messageContent == '') {
        sendUserImgMessages();
    } else if (uploadResspan == pending && messageContent != '') {
        sendUserMessages();
    } else if (uploadResspan != pending && messageContent != '') {
        sendUserMessages();
        sendUserImgMessages();
    }
}

function isBtnClicked() {
    if (count == 0) {
        count++;
        return true;
    } else {
        count = 0;
        return false;
    }
}

//添加群组
var publics = true;
var approval = true;
function createNewChatgroupPre() {
    if (BtnHandler.isBtnEnable()) {
        var groupName = $("#groupName").val().trim();
        var groupDesc = $("#groupDesc").val().trim();
        var groupPublic = $('input:radio[name="isPublic"]:checked').val() == 'public';
        var groupApproval = $("input:radio[name='approval']:checked").val() == 'approval';
        var groupOwner = $("#groupOwner").val().trim();
        var maxusers = $("#maxusers").val().trim();
        createNewChatgroups(groupName, groupDesc, groupApproval, groupPublic, groupOwner);
        BtnHandler.setBtnEnable();
    }
}


function clearFormAddNewChatgroup() {
    $('#groupName').val('');
    $('#groupnameSpan').text('');
    $('#app_chatgroups_form_add_groupdescSpan').text('');
    $('#groupDesc').val('');
    $('#grouppulicSpan').text('');
    $('#app_chatgroups_form_add_groupApprovalSpan').text('');
    $('#app_chatgroups_form_add_groupMaxuserSpan').text('');
    $('#maxusers').val('');
    $('#groupOwner').val('');
    $('#app_chatgroups_form_add_groupOwnerSpan').text('');
}

function clearFormSendMessagesChatgroup() {
    $('#app_chatgroups_sendMsg_label_wait').text('');
    $('#messegeContent').text('');
    $('#messegeContent').text('');
}

//判断是否是公开群
function nums() {
    publics = true;
    $('#validation').show();
}
function numss() {
    publics = false;
    $('#validation').hide();
}

//判断是否需要验证
function approvalon() {
    approval = true;
}
function approvals() {
    approval = false;
}


function imgMessage() {
    var img = $('#file').val().substr($('#file').val().lastIndexOf('.') + 1);
    img = img.toLowerCase();
    if (img == 'jpg' || img == 'png' || img == 'bmp' || img == 'gif' || img == 'jpeg') {
        var accessToken = getAccessToken();
        var orgName = getOrgname();
        var appName = $.cookie('appName');

        $('#app_chatgroups_sendMsg_label_wait').text($.i18n.prop('app_chatgroups_sendMsg_label_uploading'));

        var ajax_option = {
            url: baseUrl + '/' + orgName + '/' + appName + '/chatfiles',
            headers: {
                'Accept': 'application/json',
                'restrict-access': true,
                'Accept-Encoding': 'gzip,deflate',
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (respData) {
                $('#app_chatgroups_sendMsg_label_wait').text($.i18n.prop('app_chatgroups_alert_upload_picture_saved'));
                var str = $('#file').val() + "," + respData.entities[0]['share-secret'];
                $('#share-secret').val(str);
                $('#imgUuid').val(baseUrl + '/' + orgName + '/' + appName + '/chatfiles/' + respData.entities[0].uuid);
            },
            error: function (respData) {
            }
        };

        $('#myForm').ajaxSubmit(ajax_option);
    } else {
        layer.msg($.i18n.prop('app_chatgroups_alert_upload_picture_wrongtype'), 3, 5);
    }

}
