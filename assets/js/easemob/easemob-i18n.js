/**
 * Created by kenshinn on 15-6-16.
 */

var I18NPropsLoader = function(){

    var resourceFilePrefix = 'easemob-i18n';
    var resourceFilePath = '/assets/resources/';
    var resourcePropertiesMode = 'map';

    return {
        getPageName: function(){
            var pathname = window.location.pathname;
            var r = (pathname.match(/\/([^\/?#]+)$/i) || [,''])[1];
            if (r != null) {
                return r.split('.html')[0];
            }

            return null;
        },

        getNavigatorLanguage: function() {
            var language = navigator.userLanguage ? navigator.userLanguage : navigator.language;
            var localeInfo = getLocaleInfo();

            var pickerDateLanguageObj = $('#pickerDateLanguage');
            if(localeInfo) {
                pickerDateLanguageObj.val(localeInfo);
                return localeInfo;
            } else {
                if (language.indexOf('zh') > -1) {
                    localeInfo = 'zh';
                } else {
                    localeInfo = 'en';
                }
            }

            pickerDateLanguageObj.val(localeInfo);
            return localeInfo;
        },

        loadPropertiesByPage: function(pageName){
            switch(pageName){
                case 'app_chatgroups':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppChatgroups();
                    break;
                case 'app_chatgroup_users':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppChatgroupsUsers();
                    break;
                case 'org_admin_passwd':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAdminHomePassword();
                    break;
                case 'org_admin_list':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAdminList();
                    break;
                case 'org_admin_create':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAdminCreate();
                    break;
                case 'org_admin_home':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAdminHome();
                    break;
                case 'index_resetpw_success':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageResetpwSuccess();
                    break;
                case 'index_resetpw_input':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageResetpwInput();
                    break;
                case 'index_resetpw_failure':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageResetpwFailure();
                    break;
                case 'index_regist_org_success':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageRegisterOrgSuccess();
                    break;
                case 'index':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageIndexLogin();
                    break;
                case 'index_register':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageIndexRegister();
                    break;
                case 'index_forgotpwd':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageIndexForgotPwd();
                    break;
                case 'index_confirm_success':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageConfirmSuccess();
                    break;
                case 'index_confirm_failure':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageConfirmFailure();
                    break;
                case 'app_user_create':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppUsersCreate();
                    break;
                case 'app_list':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppList();
                    break;
                case 'app_info':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppProfile();
                    break;
                case 'app_user_contacts':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppUsersContacts();
                    break;
                case 'app_counters':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppCounters();
                    break;
                case 'app_create':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppCreate();
                    break;
                case 'app_users':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppUsers();
                    break;
                case 'app_notifiers':
                    this.loadPropertiesCommon();
                    this.loadPropertiesForPageAppNotifiers();
                    break;
            }
        },

        // load resources used in every page
        loadPropertiesCommon: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language: this.getNavigatorLanguage(),
                callback: function () {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#nav_index').text($.i18n.prop('nav_index'));
                    $('#nav_doc').text($.i18n.prop('nav_doc'));
                    $('#nav_help').text($.i18n.prop('nav_help'));
                    $('#nav_community').text($.i18n.prop('nav_community'));
                    $('#nav_download').text($.i18n.prop('nav_download'));
                    $('#nav_account').text($.i18n.prop('nav_account'));
                    $('#nav_signout').text($.i18n.prop('nav_signout'));
                    $('#nav_welcome').text($.i18n.prop('nav_welcome'));
                    $('#second_nav_myapp').text($.i18n.prop('second_nav_myapp'));
                    $('#third_nav_appprofile').text($.i18n.prop('third_nav_appprofile'));
                    $('#third_nav_imusers').text($.i18n.prop('third_nav_imusers'));
                    $('#third_nav_chatgroups').text($.i18n.prop('third_nav_chatgroups'));
                    $('#third_nav_notifier').text($.i18n.prop('third_nav_notifier'));
                    $('#third_nav_counter').text($.i18n.prop('third_nav_counter'));
                }
            });
        },

        // load resources used in index.html page
        loadPropertiesForPageIndexLogin: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_index').attr('src', $.i18n.prop('logo_index'));
                    $('#index_span_login').text($.i18n.prop('index_span_login'));
                    $('#index_span_title_imcloud').text($.i18n.prop('index_span_title_imcloud'));
                    $('#index_span_title_kefu').text($.i18n.prop('index_span_title_kefu'));
                    $('#index_span_imcloud_nobody').text($.i18n.prop('index_span_imcloud_nobody'));
                    $('#index_span_imcloud_gotoregister').text($.i18n.prop('index_span_imcloud_gotoregister'));

                    $('#index_span_register').text($.i18n.prop('index_span_register'));
                    $('#index_login_username').text($.i18n.prop('index_login_username'));
                    $('#index_login_password').text($.i18n.prop('index_login_password'));
                    $('#index_login_rememberme').text($.i18n.prop('index_login_rememberme'));
                    $('#index_bnt_login').text($.i18n.prop('index_bnt_login'));
                    $('#index_input_username').text($.i18n.prop('index_input_username'));

                    $('#index_forgot_username').text($.i18n.prop('index_forgot_username'));
                    $('#index_forgot_btn_password').text($.i18n.prop('index_forgot_btn_password'));
                    $('#email').attr('placeholder', $.i18n.prop('index_forgot_username_placeHolder'));
                    $('#index_forgot_password_link').text($.i18n.prop('index_forgot_password_link'));
                    $('#index_bnt_backtologin').text($.i18n.prop('index_bnt_backtologin'));
                    $('#emailEMsg').text('');

                    $('#index_span_register_orgname').text($.i18n.prop('index_span_register_orgname'));
                    $('#regOrgName').attr('placeholder', $.i18n.prop('index_span_register_orgname_placeholder'));
                    $('#regOrgNameSMsg').text($.i18n.prop('index_alert_register_regOrgName_regix'));
                    $('#index_span_register_userneme').text($.i18n.prop('index_span_register_userneme'));
                    $('#regUserName').attr('placeholder', $.i18n.prop('index_span_register_userneme_placeholder'));
                    $('#regUserNameSMsg').text($.i18n.prop('index_alert_register_regUserName_regix'));
                    $('#index_span_register_password').text($.i18n.prop('index_span_register_password'));
                    $('#regPassword').attr('placeholder', $.i18n.prop('index_span_register_password_placeholder'));
                    $('#index_span_register_tel').text($.i18n.prop('index_span_register_tel'));
                    $('#regTel').attr('placeholder', $.i18n.prop('index_span_register_tel_placeholder'));
                    $('#index_span_register_repassword').text($.i18n.prop('index_span_register_repassword'));
                    $('#regRePassword').attr('placeholder', $.i18n.prop('index_span_register_repassword_placeholder'));
                    $('#index_span_register_email').text($.i18n.prop('index_span_register_email'));
                    $('#regEmail').attr('placeholder', $.i18n.prop('index_span_register_email_placeholder'));
                    $('#index_span_register_company').text($.i18n.prop('index_span_register_company'));
                    $('#regCompanyName').attr('placeholder', $.i18n.prop('index_span_register_company_placeholder'));
                    $('#verifyCodeInput').attr('placeholder', $.i18n.prop('index_login_verifyCode'));
                    $('#index_login_verifyCodeFresh').text($.i18n.prop('index_login_verifyCodeFresh'));
                    $('#index_span_register_comeFromNote').text($.i18n.prop('index_span_register_comeFromNote'));
                    $('#index_span_register_comefromInternet').text($.i18n.prop('index_span_register_comefromInternet'));
                    $('#index_span_register_comefromFriends').text($.i18n.prop('index_span_register_comefromFriends'));
                    $('#index_span_register_comefromOfficial').text($.i18n.prop('index_span_register_comefromOfficial'));
                    $('#index_span_register_comefromExhibition').text($.i18n.prop('index_span_register_comefromExhibition'));
                    $('#index_span_register_comefromMedia').text($.i18n.prop('index_span_register_comefromMedia'));
                    $('#index_span_register_formSubBtn').text($.i18n.prop('index_span_register_formSubBtn'));
                    $('#index_span_register_agree').text($.i18n.prop('index_span_register_agree'));
                    $('#index_span_register_agree_service').text($.i18n.prop('index_span_register_agree_service'));
                    $('#index_span_register_agree_returntilogin').text($.i18n.prop('index_span_register_agree_returntilogin'));

                    var usernameEMsgVal = $('#usernameEMsg').text();
                    if(usernameEMsgVal != ''){
                        $('#usernameEMsg').text($.i18n.prop('index_alert_register_username_empty'));
                    }
                    var passwordEMsgVal = $('#passwordEMsg').text();
                    if(passwordEMsgVal != ''){
                        $('#passwordEMsg').text($.i18n.prop('index_alert_register_password_empty'));
                    }

                    var verifyCodeEMsgTag = $('#verifyCodeEMsgTag').val();
                    if(verifyCodeEMsgTag == 'notmatch'){
                        $('#verifyCodeEMsg').text($.i18n.prop('index_login_verifyCodeEMsg_notmatch'));
                    } else if(verifyCodeEMsgTag == 'empty'){
                        $('#verifyCodeEMsg').text($.i18n.prop('index_login_verifyCodeEMsg_empty'));
                    }
                }
            });
        },

        // load resources used in index_register.html page
        loadPropertiesForPageIndexRegister: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_index').attr('src', $.i18n.prop('logo_index'));
                    $('#index_span_login').text($.i18n.prop('index_span_login'));
                    $('#index_span_title_imcloud').text($.i18n.prop('index_span_title_imcloud'));
                    $('#index_span_title_kefu').text($.i18n.prop('index_span_title_kefu'));
                    $('#index_span_imcloud_somebody').text($.i18n.prop('index_span_imcloud_somebody'));
                    $('#index_span_imcloud_togologin').text($.i18n.prop('index_span_imcloud_togologin'));
                    $('#index_span_register').text($.i18n.prop('index_span_register'));
                    $('#index_login_username').text($.i18n.prop('index_login_username'));
                    $('#index_login_password').text($.i18n.prop('index_login_password'));
                    $('#index_login_rememberme').text($.i18n.prop('index_login_rememberme'));
                    $('#index_bnt_login').text($.i18n.prop('index_bnt_login'));
                    $('#index_input_username').text($.i18n.prop('index_input_username'));

                    $('#index_forgot_username').text($.i18n.prop('index_forgot_username'));
                    $('#index_forgot_btn_password').text($.i18n.prop('index_forgot_btn_password'));
                    $('#email').attr('placeholder', $.i18n.prop('index_forgot_username_placeHolder'));
                    $('#index_forgot_password_link').text($.i18n.prop('index_forgot_password_link'));
                    $('#index_bnt_backtologin').text($.i18n.prop('index_bnt_backtologin'));
                    $('#emailEMsg').text('');

                    $('#index_span_register_orgname').text($.i18n.prop('index_span_register_orgname'));
                    $('#regOrgName').attr('placeholder', $.i18n.prop('index_span_register_orgname_placeholder'));
                    $('#regOrgNameSMsg').text($.i18n.prop('index_alert_register_regOrgName_regix'));
                    $('#index_span_register_userneme').text($.i18n.prop('index_span_register_userneme'));
                    $('#regUserName').attr('placeholder', $.i18n.prop('index_span_register_userneme_placeholder'));
                    $('#regUserNameSMsg').text($.i18n.prop('index_alert_register_regUserName_regix'));
                    $('#index_span_register_password').text($.i18n.prop('index_span_register_password'));
                    $('#regPassword').attr('placeholder', $.i18n.prop('index_span_register_password_placeholder'));
                    $('#index_span_register_tel').text($.i18n.prop('index_span_register_tel'));
                    $('#regTel').attr('placeholder', $.i18n.prop('index_span_register_tel_placeholder'));
                    $('#index_span_register_repassword').text($.i18n.prop('index_span_register_repassword'));
                    $('#regRePassword').attr('placeholder', $.i18n.prop('index_span_register_repassword_placeholder'));
                    $('#index_span_register_email').text($.i18n.prop('index_span_register_email'));
                    $('#regEmail').attr('placeholder', $.i18n.prop('index_span_register_email_placeholder'));
                    $('#index_span_register_company').text($.i18n.prop('index_span_register_company'));
                    $('#regCompanyName').attr('placeholder', $.i18n.prop('index_span_register_company_placeholder'));
                    $('#index_span_register_comeFromNote').text($.i18n.prop('index_span_register_comeFromNote'));
                    $('#index_span_register_comefromInternet').text($.i18n.prop('index_span_register_comefromInternet'));
                    $('#index_span_register_comefromFriends').text($.i18n.prop('index_span_register_comefromFriends'));
                    $('#index_span_register_comefromOfficial').text($.i18n.prop('index_span_register_comefromOfficial'));
                    $('#index_span_register_comefromExhibition').text($.i18n.prop('index_span_register_comefromExhibition'));
                    $('#index_span_register_comefromMedia').text($.i18n.prop('index_span_register_comefromMedia'));
                    $('#index_span_register_formSubBtn').text($.i18n.prop('index_span_register_formSubBtn'));
                    $('#index_span_register_agree').text($.i18n.prop('index_span_register_agree'));
                    $('#index_span_register_agree_service').text($.i18n.prop('index_span_register_agree_service'));
                    $('#index_span_register_agree_returntilogin').text($.i18n.prop('index_span_register_agree_returntilogin'));

                    var usernameEMsgVal = $('#usernameEMsg').text();
                    if(usernameEMsgVal != ''){
                        $('#usernameEMsg').text($.i18n.prop('index_alert_register_username_empty'));
                    }
                    var passwordEMsgVal = $('#passwordEMsg').text();
                    if(passwordEMsgVal != ''){
                        $('#passwordEMsg').text($.i18n.prop('index_alert_register_password_empty'));
                    }

                    var regOrgNameEMsgHidden = $('#regOrgNameEMsgHidden').val();
                    if ('illegal' == regOrgNameEMsgHidden) {
                        $('#regOrgNameEMsg').text($.i18n.prop('index_alert_register_regOrgName_regix'));
                    }
                    var regUserNameEMsgHidden = $('#regUserNameEMsgHidden').val();
                    if ('illegal' == regUserNameEMsgHidden) {
                        $('#regUserNameEMsg').text($.i18n.prop('index_alert_register_regUserName_regix'));
                    }
                    var regPasswordEMsgHidden = $('#regPasswordEMsgHidden').val();
                    if ('illegal' == regPasswordEMsgHidden) {
                        $('#regPasswordEMsg').text($.i18n.prop('index_alert_register_regPassword_regix'));
                    }
                    var regRePasswordEMsgHidden = $('#regRePasswordEMsgHidden').val();
                    if ('illegal' == regRePasswordEMsgHidden) {
                        $('#regRePasswordEMsg').text($.i18n.prop('index_alert_register_regRePassword_regix'));
                    }
                    var regEmailEMsgHidden = $('#regEmailEMsgHidden').val();
                    if ('illegal' == regEmailEMsgHidden) {
                        $('#regEmailEMsg').text($.i18n.prop('index_alert_register_regEmail_regix'));
                    }
                    var regCompanyNameEMsgHidden = $('#regCompanyNameEMsgHidden').val();
                    if ('illegal' == regCompanyNameEMsgHidden) {
                        $('#regCompanyNameEMsg').text($.i18n.prop('index_alert_register_regCompanyName_empty'));
                    }
                    var regTelEMsgHidden = $('#regTelEMsgHidden').val();
                    if ('illegal' == regTelEMsgHidden) {
                        $('#regTelEMsg').text($.i18n.prop('index_alert_register_regTel_regix'));
                    }
                    var comeFromEMsgHidden = $('#comeFromEMsgHidden').val();
                    if ('illegal' == comeFromEMsgHidden) {
                        $('#comeFromEMsg').text($.i18n.prop('index_alert_register_comeFromEMsg'));
                    }
                    var agreeCBoxEMsgHidden = $('#agreeCBoxEMsgHidden').val();
                    if ('illegal' == agreeCBoxEMsgHidden) {
                        $('#agreeCBoxEMsg').text($.i18n.prop('index_alert_register_agreeCBox'));
                    }
                }
            });
        },

        // load resources used in index_forgotpwd.html page
        loadPropertiesForPageIndexForgotPwd: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_index').attr('src', $.i18n.prop('logo_index'));
                    $('#index_span_login').text($.i18n.prop('index_span_login'));
                    $('#index_span_title_imcloud').text($.i18n.prop('index_span_title_imcloud'));
                    $('#index_span_title_kefu').text($.i18n.prop('index_span_title_kefu'));

                    $('#index_span_register').text($.i18n.prop('index_span_register'));
                    $('#index_login_username').text($.i18n.prop('index_login_username'));
                    $('#index_login_password').text($.i18n.prop('index_login_password'));
                    $('#index_login_rememberme').text($.i18n.prop('index_login_rememberme'));
                    $('#index_bnt_login').text($.i18n.prop('index_bnt_login'));
                    $('#index_input_username').text($.i18n.prop('index_input_username'));

                    $('#index_forgot_username').text($.i18n.prop('index_forgot_username'));
                    $('#index_forgot_btn_password').text($.i18n.prop('index_forgot_btn_password'));
                    $('#email').attr('placeholder', $.i18n.prop('index_forgot_username_placeHolder'));
                    $('#index_forgot_password_link').text($.i18n.prop('index_forgot_password_link'));
                    $('#index_bnt_backtologin').text($.i18n.prop('index_bnt_backtologin'));
                    $('#emailEMsg').text('');

                    $('#index_span_register_orgname').text($.i18n.prop('index_span_register_orgname'));
                    $('#regOrgName').attr('placeholder', $.i18n.prop('index_span_register_orgname_placeholder'));
                    $('#regOrgNameSMsg').text($.i18n.prop('index_alert_register_regOrgName_regix'));
                    $('#index_span_register_userneme').text($.i18n.prop('index_span_register_userneme'));
                    $('#regUserName').attr('placeholder', $.i18n.prop('index_span_register_userneme_placeholder'));
                    $('#regUserNameSMsg').text($.i18n.prop('index_alert_register_regUserName_regix'));
                    $('#index_span_register_password').text($.i18n.prop('index_span_register_password'));
                    $('#regPassword').attr('placeholder', $.i18n.prop('index_span_register_password_placeholder'));
                    $('#index_span_register_tel').text($.i18n.prop('index_span_register_tel'));
                    $('#regTel').attr('placeholder', $.i18n.prop('index_span_register_tel_placeholder'));
                    $('#index_span_register_repassword').text($.i18n.prop('index_span_register_repassword'));
                    $('#regRePassword').attr('placeholder', $.i18n.prop('index_span_register_repassword_placeholder'));
                    $('#index_span_register_email').text($.i18n.prop('index_span_register_email'));
                    $('#regEmail').attr('placeholder', $.i18n.prop('index_span_register_email_placeholder'));
                    $('#index_span_register_company').text($.i18n.prop('index_span_register_company'));
                    $('#regCompanyName').attr('placeholder', $.i18n.prop('index_span_register_company_placeholder'));
                    $('#index_span_register_comeFromNote').text($.i18n.prop('index_span_register_comeFromNote'));
                    $('#index_span_register_comefromInternet').text($.i18n.prop('index_span_register_comefromInternet'));
                    $('#index_span_register_comefromFriends').text($.i18n.prop('index_span_register_comefromFriends'));
                    $('#index_span_register_comefromOfficial').text($.i18n.prop('index_span_register_comefromOfficial'));
                    $('#index_span_register_comefromExhibition').text($.i18n.prop('index_span_register_comefromExhibition'));
                    $('#index_span_register_comefromMedia').text($.i18n.prop('index_span_register_comefromMedia'));
                    $('#index_span_register_formSubBtn').text($.i18n.prop('index_span_register_formSubBtn'));
                    $('#index_span_register_agree').text($.i18n.prop('index_span_register_agree'));
                    $('#index_span_register_agree_service').text($.i18n.prop('index_span_register_agree_service'));
                    $('#index_span_register_agree_returntilogin').text($.i18n.prop('index_span_register_agree_returntilogin'));

                    var usernameEMsgVal = $('#usernameEMsg').text();
                    if(usernameEMsgVal != ''){
                        $('#usernameEMsg').text($.i18n.prop('index_alert_register_username_empty'));
                    }
                    var passwordEMsgVal = $('#passwordEMsg').text();
                    if(passwordEMsgVal != ''){
                        $('#passwordEMsg').text($.i18n.prop('index_alert_register_password_empty'));
                    }
                }
            });
        },

        // load resources used in org_admin_create.html page
        loadPropertiesForPageAdminCreate: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#admin_create_second_nav_orgInfo').text($.i18n.prop('admin_create_second_nav_orgInfo'));
                    $('#admin_create_third_nav_addOrgAdmin').text($.i18n.prop('admin_create_third_nav_addOrgAdmin'));
                    $('#admin_create_second_nav_addOrgAdmin').text($.i18n.prop('admin_create_second_nav_addOrgAdmin'));
                    $('#admin_create_confirm').text($.i18n.prop('admin_create_confirm'));
                    $('#admin_create_backtolist').text($.i18n.prop('admin_create_backtolist'));
                    $('#admin_create_adminCompanyOMsg').text($.i18n.prop('admin_create_adminCompanyOMsg'));
                    $('#admin_create_adminCompanyEMsg').text($.i18n.prop('admin_create_adminCompanyEMsg'));
                    $('#admin_create_adminCompanyMsg').text($.i18n.prop('admin_create_adminCompanyMsg'));
                    $('#admin_create_form_adminCompany').text($.i18n.prop('admin_create_form_adminCompany'));
                    $('#admin_create_adminTelOMsg').text($.i18n.prop('admin_create_adminTelOMsg'));
                    $('#admin_create_adminTelEMsg').text($.i18n.prop('admin_create_adminTelEMsg'));
                    $('#admin_create_adminTelMsg').text($.i18n.prop('admin_create_adminTelMsg'));
                    $('#admin_create_form_adminTel').text($.i18n.prop('admin_create_form_adminTel'));
                    $('#admin_create_adminEmailOMsg').text($.i18n.prop('admin_create_adminEmailOMsg'));
                    $('#admin_create_adminEmailEEMsg').text($.i18n.prop('admin_create_adminEmailEEMsg'));
                    $('#admin_create_adminEmailEMsg').text($.i18n.prop('admin_create_adminEmailEMsg'));
                    $('#admin_create_adminEmailMsg').text($.i18n.prop('admin_create_adminEmailMsg'));
                    $('#admin_create_form_email').text($.i18n.prop('admin_create_form_email'));
                    $('#admin_create_adminRePasswordOMsg').text($.i18n.prop('admin_create_adminRePasswordOMsg'));
                    $('#admin_create_adminRePasswordEMsg').text($.i18n.prop('admin_create_adminRePasswordEMsg'));
                    $('#admin_create_adminRePasswordMsg').text($.i18n.prop('admin_create_adminRePasswordMsg'));
                    $('#admin_create_form_repassword').text($.i18n.prop('admin_create_form_repassword'));
                    $('#admin_create_adminPasswordOMsg').text($.i18n.prop('admin_create_adminPasswordOMsg'));
                    $('#admin_create_adminPasswordMsg').text($.i18n.prop('admin_create_adminPasswordMsg'));
                    $('#admin_create_adminPasswordEMatchMsg').text($.i18n.prop('admin_create_adminPasswordEMatchMsg'));
                    $('#admin_create_form_password').text($.i18n.prop('admin_create_form_password'));
                    $('#admin_create_adminUserNameOMsg').text($.i18n.prop('admin_create_adminUserNameOMsg'));
                    $('#admin_create_adminUserNameEEMsg').text($.i18n.prop('admin_create_adminUserNameEEMsg'));
                    $('#admin_create_adminUserNameEMsg').text($.i18n.prop('admin_create_adminUserNameEMsg'));
                    $('#admin_create_adminUserNameMsg').text($.i18n.prop('admin_create_adminUserNameMsg'));
                    $('#admin_create_form_username').text($.i18n.prop('admin_create_form_username'));
                }
            });
        },

        // load resources used in org_admin_home.html page
        loadPropertiesForPageAdminHome: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#admin_home_second_nav_accountInfo').text($.i18n.prop('admin_home_second_nav_accountInfo'));
                    $('#admin_home_second_nav_btn_accountInfo').text($.i18n.prop('admin_home_second_nav_btn_accountInfo'));
                    $('#admin_home_second_nav_resetpassword').text($.i18n.prop('admin_home_second_nav_resetpassword'));
                    $('#admin_home_login_account').text($.i18n.prop('admin_home_login_account'));
                    $('#admin_home_login_email').text($.i18n.prop('admin_home_login_email'));
                    $('#admin_home_login_companyName').text($.i18n.prop('admin_home_login_companyName'));
                    $('#admin_home_login_telephone').text($.i18n.prop('admin_home_login_telephone'));
                    $('#admin_home_cancel').text($.i18n.prop('admin_home_cancel'));
                    $('#admin_home_save').text($.i18n.prop('admin_home_save'));
                    $('#admin_home_update').text($.i18n.prop('admin_home_update'));

                    var companyNameInputMsgHidden = $('#companyNameInputMsgHidden').val();
                    if ('illegal' == companyNameInputMsgHidden) {
                        $('#companyNameInputMsg').text($.i18n.prop('admin_create_form_companyIllegal'));
                    }

                    var telephoneInputMsgHidden = $('#telephoneInputMsgHidden').val();
                    if ('illegal' == telephoneInputMsgHidden) {
                        $('#telephoneInputMsg').text($.i18n.prop('admin_create_form_telephoneIllegal'));
                    }
                }
            });
        },

        // load resources used in admin_home_password.html page
        loadPropertiesForPageAdminHomePassword: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#admin_home_password_second_nav_accountInfo').text($.i18n.prop('admin_home_password_second_nav_accountInfo'));
                    $('#admin_home_password_second_nav_btn_accountInfo').text($.i18n.prop('admin_home_password_second_nav_btn_accountInfo'));
                    $('#admin_home_password_second_nav_resetpassword').text($.i18n.prop('admin_home_password_second_nav_resetpassword'));
                    $('#admin_home_password_form_oldpassword').text($.i18n.prop('admin_home_password_form_oldpassword'));
                    $('#admin_home_password_form_newpassword').text($.i18n.prop('admin_home_password_form_newpassword'));
                    $('#admin_home_password_form_renewpassword').text($.i18n.prop('admin_home_password_form_renewpassword'));
                    $('#admin_home_password_form_back').text($.i18n.prop('admin_home_password_form_back'));
                    $('#admin_home_password_form_confirm').text($.i18n.prop('admin_home_password_form_confirm'));

                    var oldpasswordHidden = $('#oldpasswordHidden').val();
                    if('passwordEmpty' == oldpasswordHidden) {
                        $('#oldpasswordEMsg').text($.i18n.prop('admin_home_password_form_passwordEmpty'));
                    }
                    if('oldPasswordInCorrect' == oldpasswordHidden) {
                        $('#oldpasswordEMsg').text($.i18n.prop('admin_home_password_form_oldPasswordInCorrect'));
                    }
                    var newpasswordHidden = $('#newpasswordHidden').val();
                    if('newPasswordEmpty' == newpasswordHidden) {
                        $('#newpasswordEMsg').text($.i18n.prop('admin_home_password_form_newPasswordEmpty'));
                    }
                    if('newPasswordIllegal' == newpasswordHidden) {
                        $('#newpasswordEMsg').text($.i18n.prop('admin_home_password_form_newPasswordIllegal'));
                    }

                    var renewpasswordHidden = $('#renewpasswordHidden').val();
                    if('passwordNotMatch' == renewpasswordHidden) {
                        $('#renewpasswordEMsg').text($.i18n.prop('admin_home_password_form_passwordNotMatch'));
                    }
                }
            });
        },

        // load resources used in org_admin_list.html page
        loadPropertiesForPageAdminList: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#second_nav_myapp').text($.i18n.prop('second_nav_myapp'));
                    $('#second_nav_orgInfo').text($.i18n.prop('second_nav_orgInfo'));
                    $('#second_nav_orgAdminList').text($.i18n.prop('second_nav_orgAdminList'));
                    $('#admin_list_second_nav_addOrgAdmin').text($.i18n.prop('admin_list_second_nav_addOrgAdmin'));
                    $('#admin_list_table_username').text($.i18n.prop('admin_list_table_username'));
                    $('#admin_list_table_email').text($.i18n.prop('admin_list_table_email'));
                    $('#admin_list_table_company').text($.i18n.prop('admin_list_table_company'));
                    $('#admin_list_table_telephone').text($.i18n.prop('admin_list_table_telephone'));
                    $('#admin_list_table_accountstatus').text($.i18n.prop('admin_list_table_accountstatus'));
                    $('#admin_list_table_operation').text($.i18n.prop('admin_list_table_operation'));
                    $('#admin_list_table_loading').text($.i18n.prop('admin_list_table_loading'));

                    var orgAdminListOrder = parseInt($('#orgAdminListOrder').val());
                    for(var i=1; i<=orgAdminListOrder; i++) {
                        $('#admin_list_table_operation_' + i).text($.i18n.prop('admin_list_table_operation'));
                        $('#admin_list_table_remove_' + i).text($.i18n.prop('admin_list_table_remove'));

                        var adminListConfirmed = $('#adminListConfirmed_' + i);
                        var adminListConfirmedVal = adminListConfirmed.val();

                        var confirmedStr = (adminListConfirmedVal == 'true') ? $.i18n.prop('admin_list_table_confirmed') : $.i18n.prop('admin_list_table_unConfirmed');
                        $('#adminListConfirmedStr_' + i).text(confirmedStr);

                        var isCurrentUser = adminListConfirmed.attr('isCurrentUser');
                        if(isCurrentUser == 'true') {
                            $('#adminListConfirmedStrOps_' + i).text($.i18n.prop('admin_list_table_currentUser_disable'));
                        }
                    }
                }
            });
        },

        // load resources used in app_chatgroups_users.html page
        loadPropertiesForPageAppChatgroupsUsers: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#second_nav_chatgroups').text($.i18n.prop('second_nav_chatgroups'));
                    $('#second_nav_chatgroupmembers').text($.i18n.prop('second_nav_chatgroupmembers'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#app_chatgroups_btn_addmembers').text($.i18n.prop('app_chatgroups_btn_addmembers'));
                    $('#app_chatgroups_users_table_members').text($.i18n.prop('app_chatgroups_users_table_members'));
                    $('#app_chatgroups_users_table_operation').text($.i18n.prop('app_chatgroups_users_table_operation'));
                    $('#app_chatgroups_users_table_selection_operation').text($.i18n.prop('app_chatgroups_users_table_selection_operation'));
                    $('#app_chatgroups_users_table_operation_members').text($.i18n.prop('app_chatgroups_users_Table_operation_members'));
                    $('#app_chatgroups_users_table_operation_delete').text($.i18n.prop('app_chatgroups_users_table_operation_delete'));
                    $('#app_chatgroups_users_table_operation_sendmessage').text($.i18n.prop('app_chatgroups_users_table_operation_sendmessage'));
                    $('#app_chatgroups_users_table_disable').text($.i18n.prop('app_chatgroups_users_table_disable'));
                    $('#app_chatgroups_users_table_nodata').text($.i18n.prop('table_data_nodata'));

                    var newMemberEMsgTag = $('#newMemberEMsgTag').val();
                    if (newMemberEMsgTag == 'overLoad') {
                        $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_table_overLoad'));
                    } else if(newMemberEMsgTag == 'user_invalid') {
                        $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_user_invalid'));
                    } else if(newMemberEMsgTag == 'user_notfoud') {
                        $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_user_notfoud'));
                    } else if(newMemberEMsgTag == 'owner_duplicate') {
                        $('#newmemberEMsg').text($.i18n.prop('app_chatgroups_add_alert_owner_duplicate'));
                    }

                    var groupMembersOrder = parseInt($('#groupMembersOrder').val());
                    for(var i=1; i<=groupMembersOrder; i++) {
                        $('#app_chatgroups_users_table_selection_operation_' + i).text($.i18n.prop('app_chatgroups_users_table_selection_operation'));
                        $('#app_chatgroups_users_table_selection_remove_' + i).text($.i18n.prop('app_chatgroups_users_table_selection_remove'));
                    }

                    $('#newmember').attr('placeholder', $.i18n.prop('app_chatgroups_btn_newmember_placeholder'));
                }
            });
        },

        // load resources used in app_chatgroups.html page
        loadPropertiesForPageAppChatgroups: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#second_nav_chatgroups').text($.i18n.prop('second_nav_chatgroups'));
                    $('#second_nav_chatgroupmembers').text($.i18n.prop('second_nav_chatgroupmembers'));
                    $('#app_chatgroups_btn_addchatgroup').text($.i18n.prop('app_chatgroups_btn_addchatgroup'));
                    $('#app_chatgroups_btn_deleteBatch').text($.i18n.prop('app_chatgroups_btn_deleteBatch'));
                    $('#app_chatgroups_btn_sendMsg').text($.i18n.prop('app_chatgroups_btn_sendMsg'));
                    $('#app_chatgroups_btn_search').text($.i18n.prop('app_chatgroups_btn_search'));
                    $('#groupid').attr('placeholder', $.i18n.prop('app_chatgroups_btn_search_placeholder'));
                    $('#app_chatgroups_table_checkall').text($.i18n.prop('app_chatgroups_table_checkall'));
                    $('#app_chatgroups_table_groupid').text($.i18n.prop('app_chatgroups_table_groupid'));
                    $('#app_chatgroups_table_groupOnwer').text($.i18n.prop('app_chatgroups_table_groupOnwer'));
                    $('#app_chatgroups_table_groupMembers').text($.i18n.prop('app_chatgroups_table_groupMembers'));
                    $('#app_chatgroups_table_groupname').text($.i18n.prop('app_chatgroups_table_groupname'));
                    $('#app_chatgroups_table_operation').text($.i18n.prop('app_chatgroups_table_operation'));
                    $('#app_chatgroups_search_table_loading').text($.i18n.prop('app_chatgroups_table_loading'));
                    $('#app_chatgroups_table_data_nodata').text($.i18n.prop('table_data_nodata'));
                    $('#app_chatgroups_btn_search_alert').text($.i18n.prop('app_chatgroups_btn_search_alert'));

                    var statusOrder = parseInt($('#statusOrder').val());
                    for(var i=1; i<=statusOrder; i++) {
                        $('#app_chatgroups_table_selection_operation_' + i).text($.i18n.prop('app_chatgroups_table_selection_operation'));
                        $('#app_chatgroups_table_operation_members_' + i).text($.i18n.prop('app_chatgroups_table_operation_members'));
                        $('#app_chatgroups_table_operation_delete_' + i).text($.i18n.prop('app_chatgroups_table_operation_delete'));
                        $('#app_chatgroups_table_operation_sendmessage_' + i).text($.i18n.prop('app_chatgroups_table_operation_sendmessage'));
                    }

                    $('#app_chatgroups_table_nav_previous').text($.i18n.prop('app_chatgroups_table_nav_previous'));
                    $('#app_chatgroups_table_nav_next').text($.i18n.prop('app_chatgroups_table_nav_next'));

                    $('#app_chatgroups_form_add_title').text($.i18n.prop('app_chatgroups_form_add_title'));
                    $('#app_chatgroups_form_add_groupName').text($.i18n.prop('app_chatgroups_form_add_groupName'));
                    $('#app_chatgroups_form_add_groupDesc').text($.i18n.prop('app_chatgroups_form_add_groupDesc'));
                    $('#app_chatgroups_form_add_private').text($.i18n.prop('app_chatgroups_form_add_private'));
                    $('#app_chatgroups_form_add_public').text($.i18n.prop('app_chatgroups_form_add_public'));
                    $('#app_chatgroups_form_add_unApproval').text($.i18n.prop('app_chatgroups_form_add_unApproval'));
                    $('#app_chatgroups_form_add_approval').text($.i18n.prop('app_chatgroups_form_add_approval'));
                    $('#app_chatgroups_form_add_maxusers').text($.i18n.prop('app_chatgroups_form_add_maxusers'));
                    $('#app_chatgroups_form_add_groupOwner').text($.i18n.prop('app_chatgroups_form_add_groupOwner'));
                    $('#app_chatgroups_form_add_BtnAdd').text($.i18n.prop('app_chatgroups_form_add_BtnAdd'));
                    $('#app_chatgroups_form_add_BtnCancel').text($.i18n.prop('app_chatgroups_form_add_BtnCancel'));
                    $('#groupName').attr('placeholder', $.i18n.prop('app_chatgroups_form_add_groupName_placeholder'));
                    $('#groupDesc').attr('placeholder', $.i18n.prop('app_chatgroups_form_add_groupDesc_placeholder'));
                    $('#maxusers').attr('placeholder', $.i18n.prop('app_chatgroups_form_add_maxusers_placeholder'));
                    $('#groupOwner').attr('placeholder', $.i18n.prop('app_chatgroups_form_add_groupOwner_placeholder'));
                    $('#app_chatgroups_form_label_isPublic').text($.i18n.prop('app_chatgroups_form_label_isPublic'));
                    $('#app_chatgroups_form_label_isApprovals').text($.i18n.prop('app_chatgroups_form_label_isApprovals'));
                    $('#app_chatgroups_form_sendMsg_title').text($.i18n.prop('app_chatgroups_form_sendMsg_title'));
                    $('#app_chatgroups_sendMsg_label_selectPicture').text($.i18n.prop('app_chatgroups_sendMsg_label_selectPicture'));
                    $('#app_chatgroups_sendMsg_label_wait').text($.i18n.prop('app_chatgroups_sendMsg_label_wait'));
                    $('#app_chatgroups_sendMsg_label_input').text($.i18n.prop('app_chatgroups_sendMsg_label_input'));
                    $('#app_chatgroups_sendMsg_btn_send').text($.i18n.prop('app_chatgroups_sendMsg_btn_send'));
                    $('#app_chatgroups_sendMsg_btn_cancel').text($.i18n.prop('app_chatgroups_sendMsg_btn_cancel'));
                    $('#app_chatgroups_btn_addmembers').text($.i18n.prop('app_chatgroups_btn_addmembers'));
                    $('#app_chatgroups_users_table_members').text($.i18n.prop('app_chatgroups_users_table_members'));
                    $('#app_chatgroups_users_table_operation').text($.i18n.prop('app_chatgroups_users_table_operation'));
                    $('#app_chatgroups_label_tips').text($.i18n.prop('app_chatgroups_label_tips'));

                    $('#app_chatgroups_sendMsg_selectPicture_btn').attr('value', $.i18n.prop('app_chatgroups_sendMsg_selectPicture_btn'));
                }
            });
        },

        // load resources used in app_counters.html page
        loadPropertiesForPageAppCounters: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#app_collection_counters_tab_user').text($.i18n.prop('app_collection_counters_tab_user'));
                    $('#app_collection_counters_tab_chatmessages').text($.i18n.prop('app_collection_counters_tab_chatmessages'));
                    $('#app_collection_counters_tab_chatgroups').text($.i18n.prop('app_collection_counters_tab_chatgroups'));
                    $('#app_collection_counters_text_dataType').text($.i18n.prop('app_collection_counters_text_dataType'));
                    $('#app_collection_counters_chatType_imusers').text($.i18n.prop('app_collection_counters_chatType_imusers'));
                    $('#app_collection_counters_chatType_dailyActiveUser').text($.i18n.prop('app_collection_counters_chatType_dailyActiveUser'));
                    $('#app_collection_counters_chatType_dailyNewActiveUser').text($.i18n.prop('app_collection_counters_chatType_dailyNewActiveUser'));
                    $('#app_collection_counters_chatType_dailySendMsgUser').text($.i18n.prop('app_collection_counters_chatType_dailySendMsgUser'));
                    $('#app_collection_counters_text_dateInterval').text($.i18n.prop('app_collection_counters_text_dateInterval'));
                    $('#app_collection_counters_text_dateIntervalFrom').text($.i18n.prop('app_collection_counters_text_dateIntervalFrom'));
                    $('#app_collection_counters_text_dateIntervalTo').text($.i18n.prop('app_collection_counters_text_dateIntervalTo'));
                    $('#app_collection_counters_text_quickSearch').text($.i18n.prop('app_collection_counters_text_quickSearch'));
                    $('#app_collection_counters_text_quickSearchOneDay').text($.i18n.prop('app_collection_counters_text_quickSearchOneDay'));
                    $('#app_collection_counters_text_quickSearchSevenDays').text($.i18n.prop('app_collection_counters_text_quickSearchSevenDays'));
                    $('#countersSearchBtn').val($.i18n.prop('app_collection_counters_text_searchBtn'));

                    var chartTitleType = $('#chartTitleType').val();
                    var chartTitle = $('#chartTitle');

                    var tabUsersClass = $('#tabUsers').parent().attr('class');
                    if(tabUsersClass == 'active') {
                        chartTitle.text($.i18n.prop('app_collection_counters_chartTileUsers'));
                    }
                    var tabChatmessagesClass = $('#tabChatmessages').parent().attr('class');
                    if(tabChatmessagesClass == 'active') {
                        //chartTitle.text($.i18n.prop('app_collection_counters_chartTileChatmessages'));
                        chartTitle.text($.i18n.prop('app_collection_counters_chartTileChatmessages_chat_incoming'));
                    }

                    var drawCountersChartsType = $('#drawCountersChartsType').val();

                    switch(drawCountersChartsType){
                        case 'daily_active_users':
                            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyActiveUser'));
                            break;
                        case 'daily_chat_users':
                            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyChatUser'));
                            break;
                        case 'daily_new_active_users':
                            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyNewActiveUser'));
                            break;
                        case 'msg_outgoing_chat':
                            $('#chatmessagsChartSelector_msg_outgoing_chat').text($.i18n.prop('app_collection_counters_chatType_chat_incoming'));
                            $('#chatmessagsChartSelector_msg_outgoing_groupchat').text($.i18n.prop('app_collection_counters_chatType_groupchat_incoming'));
                            break;
                        case 'msg_outgoing_groupchat':
                            $('#chatmessagsChartSelector_msg_outgoing_groupchat').text($.i18n.prop('app_collection_counters_chatType_groupchat_incoming'));
                            $('#chatmessagsChartSelector_msg_outgoing_chat').text($.i18n.prop('app_collection_counters_chatType_chat_incoming'));
                            break;
                    }

                    DatePikerHandler.showDatePiker();
                }
            });
        },

        // load resources used in app_create.html page
        loadPropertiesForPageAppCreate: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#second_nav_createApp').text($.i18n.prop('second_nav_createApp'));
                    $('#app_create_form_appName').text($.i18n.prop('app_create_form_appName'));
                    $('#app_create_form_appNameMsg').text($.i18n.prop('app_create_form_appNameMsg'));
                    $('#app_create_form_productName').text($.i18n.prop('app_create_form_productName'));
                    $('#app_create_form_productNameMsg').text($.i18n.prop('app_create_form_productNameMsg'));
                    $('#app_create_form_registrationModel').text($.i18n.prop('app_create_form_registrationModel'));

                    var allow_open_registrationOpen = $('#allow_open_registrationOpen');
                    var allow_open_registrationAuth = $('#allow_open_registrationAuth');
                    var localeInfo = I18NPropsLoader.getNavigatorLanguage();
                    if (allow_open_registrationOpen.attr('checked') == 'checked') {
                        if(localeInfo == 'en') {
                            $('#allowOpenMsg').css('margin-right', '33%');
                        } else {
                            $('#allowOpenMsg').css('margin-right', '45.5%');
                        }
                        $('#allowOpenMsg').text($.i18n.prop('app_create_form_registrationModel_allowOpenMsgOpen'));
                    }
                    if (allow_open_registrationAuth.attr('checked') == 'checked') {
                        if(localeInfo == 'en') {
                            $('#allowOpenMsg').css('margin-right', '22.5%');
                        } else {
                            $('#allowOpenMsg').css('margin-right', '39.5%');
                        }
                        $('#allowOpenMsg').text($.i18n.prop('app_create_form_registrationModel_allowOpenMsgAuth'));
                    }

                    $('#app_create_form_registrationModel_open').text($.i18n.prop('app_create_form_registrationModel_open'));
                    $('#app_create_form_registrationModel_auth').text($.i18n.prop('app_create_form_registrationModel_auth'));
                    $('#app_create_form_appDesc').text($.i18n.prop('app_create_form_appDesc'));
                    $('#app_create_form_appDescMsg').text($.i18n.prop('app_create_form_appDescMsg'));
                    $('#app_create_form_backlist').text($.i18n.prop('app_create_form_backlist'));
                    $('#app_create_form_confirm').text($.i18n.prop('app_create_form_confirm'));
                }
            });
        }
        ,

        // load resources used in app_list.html page
        loadPropertiesForPageAppList: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#second_nav_myapp').text($.i18n.prop('second_nav_myapp'));
                    $('#second_nav_createapp').text($.i18n.prop('second_nav_createapp'));
                    $('#second_nav_appname').text($.i18n.prop('second_nav_appname'));
                    $('#second_nav_appstatus').text($.i18n.prop('second_nav_appstatus'));
                    $('#app_list_apps_loading').text($.i18n.prop('app_list_apps_loading'));
                    $('#applist_table_nodata').text($.i18n.prop('table_data_nodata'));
                    var statusOrder = parseInt($('#statusOrder').val());
                    for(var i=1; i<=statusOrder; i++) {
                        $('#app_list_appstatus_content_' + i).text($.i18n.prop('app_list_appstatus_content'));
                    }
                }
            });
        },

        // load resources used in app_notifiers.html page
        loadPropertiesForPageAppNotifiers: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#nameIOS').attr('placeholder' ,$.i18n.prop('app_notifiers_formIOS_name_placeholder'));
                    $('#passphraseIOS').attr('placeholder' ,$.i18n.prop('app_notifiers_formIOS_passphrase_placeholder'));
                    $('#app_notifiers_tableAndroid_title').text($.i18n.prop('app_notifiers_tableAndroid_title'));
                    $('#app_notifiers_tableIOS_title').text($.i18n.prop('app_notifiers_tableIOS_title'));
                    $('#app_notifiers_tableIOS_th_notifierName').text($.i18n.prop('app_notifiers_tableIOS_th_notifierName'));
                    $('#app_notifiers_tableIOS_th_notifierType').text($.i18n.prop('app_notifiers_tableIOS_th_notifierType'));
                    $('#app_notifiers_tableIOS_th_created').text($.i18n.prop('app_notifiers_tableIOS_th_created'));
                    $('#app_notifiers_tableIOS_th_modified').text($.i18n.prop('app_notifiers_tableIOS_th_modified'));
                    $('#app_notifiers_tableIOS_th_operation').text($.i18n.prop('app_notifiers_tableIOS_th_operation'));
                    $('#app_notifiers_href_makeNotifier').text($.i18n.prop('app_notifiers_href_makeNotifier'));
                    $('#app_notifiers_formIOS_addNewNotifier').text($.i18n.prop('app_notifiers_formIOS_addNewNotifier'));
                    $('#app_notifiers_formIOS_notifierName').text($.i18n.prop('app_notifiers_formIOS_notifierName'));
                    $('#app_notifiers_formIOS_notifier').text($.i18n.prop('app_notifiers_formIOS_notifier'));
                    $('#app_notifiers_formIOS_button').attr('value' ,$.i18n.prop('app_notifiers_formIOS_button_value'));
                    $('#app_notifiers_formIOS_button_upload').attr('value' ,$.i18n.prop('app_notifiers_formIOS_button_upload_value'));
                    $('#app_notifiers_formIOS_notifierPassword').text($.i18n.prop('app_notifiers_formIOS_notifierPassword'));
                    $('#app_notifiers_formIOS_notifierType').text($.i18n.prop('app_notifiers_formIOS_notifierType'));
                    $('#app_notifiers_formIOS_notifierType_dev').text($.i18n.prop('app_notifiers_formIOS_notifierType_dev'));
                    $('#app_notifiers_formIOS_notifierType_product').text($.i18n.prop('app_notifiers_formIOS_notifierType_product'));

                    $('#app_notifiers_tableAndroid_notifier_nav_previous').text($.i18n.prop('app_notifiers_tableAndroid_notifier_nav_previous'));
                    $('#app_notifiers_tableAndroid_notifier_nav_next').text($.i18n.prop('app_notifiers_tableAndroid_notifier_nav_next'));
                    $('#app_notifiers_tableAndroid_notifier_nodata').text($.i18n.prop('app_notifiers_tableAndroid_notifier_nodata'));
                    var androidCertificatesOrder = parseInt($('#androidCertificatesOrder').val());
                    for(var i=1; i<=androidCertificatesOrder; i++) {
                        $('#app_notifiers_tableAndroid_notifier_delete_' + i).text($.i18n.prop('app_notifiers_tableAndroid_notifier_delete'));

                        var app_notifiers_tableAndroid_notifier_environment_type = $('#app_notifiers_tableAndroid_notifier_environment_type_' + i).val();
                        if(app_notifiers_tableAndroid_notifier_environment_type == 'DEVELOPMENT') {
                            $('#app_notifiers_tableAndroid_notifier_environment_' + i).text($.i18n.prop('app_notifiers_tableAndroid_notifier_dev'));
                        } else if(app_notifiers_tableAndroid_notifier_environment_type == 'PRODUCTION'){
                            $('#app_notifiers_tableAndroid_notifier_environment_' + i).text($.i18n.prop('app_notifiers_tableAndroid_notifier_production'));
                        }
                    }


                    $('#app_notifiers_tableIOS_notifier_nav_previous').text($.i18n.prop('app_notifiers_tableIOS_notifier_nav_previous'));
                    $('#app_notifiers_tableIOS_notifier_nav_next').text($.i18n.prop('app_notifiers_tableIOS_notifier_nav_next'));
                    $('#table_data_nodata_ios').text($.i18n.prop('table_data_nodata'));
                    var iosCertificatesOrder = parseInt($('#iosCertificatesOrder').val());
                    for(var i=1; i<=iosCertificatesOrder; i++) {
                        $('#app_notifiers_tableIOS_notifier_delete_' + i).text($.i18n.prop('app_notifiers_tableIOS_notifier_delete'));

                        var app_notifiers_tableIOS_notifier_environment_type = $('#app_notifiers_tableIOS_notifier_environment_type_' + i).val();
                        if(app_notifiers_tableIOS_notifier_environment_type == 'DEVELOPMENT') {
                            $('#app_notifiers_tableIOS_notifier_environment_' + i).text($.i18n.prop('app_notifiers_tableIOS_notifier_dev'));
                        } else if(app_notifiers_tableIOS_notifier_environment_type == 'PRODUCTION'){
                            $('#app_notifiers_tableIOS_notifier_environment_' + i).text($.i18n.prop('app_notifiers_tableIOS_notifier_production'));
                        }
                    }

                    $('#app_notifiers_tableAndroid_th_notifierName').text($.i18n.prop('app_notifiers_tableAndroid_th_notifierName'));
                    $('#app_notifiers_tableAndroid_th_notifierType').text($.i18n.prop('app_notifiers_tableAndroid_th_notifierType'));
                    $('#app_notifiers_tableAndroid_th_notifierPassword').text($.i18n.prop('app_notifiers_tableAndroid_th_notifierPassword'));
                    $('#app_notifiers_tableAndroid_th_created').text($.i18n.prop('app_notifiers_tableAndroid_th_created'));
                    $('#app_notifiers_tableAndroid_th_modified').text($.i18n.prop('app_notifiers_tableAndroid_th_modified'));
                    $('#app_notifiers_tableAndroid_th_operation').text($.i18n.prop('app_notifiers_tableAndroid_th_operation'));
                    $('#nameAndroid').attr('placeholder' ,$.i18n.prop('app_notifiers_formAndroid_name_placeholder'));
                    $('#certificateAndroid').attr('placeholder' ,$.i18n.prop('app_notifiers_formAndroid_passphrase_placeholder'));
                    $('#app_notifiers_formAndroid_addNewNotifier').text($.i18n.prop('app_notifiers_formAndroid_addNewNotifier'));
                    $('#app_notifiers_formAndroid_notifierName').text($.i18n.prop('app_notifiers_formAndroid_notifierName'));
                    $('#app_notifiers_formAndroid_notifier').text($.i18n.prop('app_notifiers_formAndroid_notifier'));
                    $('#app_notifiers_formAndroid_button').attr('value' ,$.i18n.prop('app_notifiers_formAndroid_button_value'));
                    $('#app_notifiers_formAndroid_button_upload').attr('value' ,$.i18n.prop('app_notifiers_formAndroid_button_upload_value'));
                    $('#app_notifiers_formAndroid_notifierPassword').text($.i18n.prop('app_notifiers_formAndroid_notifierPassword'));
                    $('#app_notifiers_formAndroid_notifierType').text($.i18n.prop('app_notifiers_formAndroid_notifierType'));
                    $('#app_notifiers_formAndroid_notifierType_dev').text($.i18n.prop('app_notifiers_formAndroid_notifierType_dev'));
                    $('#app_notifiers_formAndroid_notifierType_product').text($.i18n.prop('app_notifiers_formAndroid_notifierType_product'));
                }
            });
        },

        // load resources used in app_info.html page
        loadPropertiesForPageAppProfile: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));

                    var tag = $('#allowOpenHdd').val();
                    if (tag == '0') {
                        $('#allowOpen').text($.i18n.prop('app_profile_text_registrationModel_open'));
                    } else {
                        $('#allowOpen').text($.i18n.prop('app_profile_text_registrationModel_auth'));
                    }

                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#app_profile_text_appkey').text($.i18n.prop('app_profile_text_appkey'));
                    $('#app_profile_text_created').text($.i18n.prop('app_profile_text_created'));
                    $('#app_profile_text_modified').text($.i18n.prop('app_profile_text_modified'));
                    $('#app_profile_text_model').text($.i18n.prop('app_profile_text_model'));
                    $('#app_profile_btn_change').text($.i18n.prop('app_profile_btn_change'));
                    $('#app_profile_btn_update').text($.i18n.prop('app_profile_btn_update'));
                    $('#app_profile_text_total_registered_users').text($.i18n.prop('app_profile_text_total_registered_users'));
                    $('#app_profile_text_thumbnail_height').text($.i18n.prop('app_profile_text_thumbnail_height'));
                    $('#app_profile_text_thumbnail_width').text($.i18n.prop('app_profile_text_thumbnail_width'));
                    $('#app_profile_text_thumbnail').text($.i18n.prop('app_profile_text_thumbnail'));
                    $('#app_profile_text_quickIntegration').text($.i18n.prop('app_profile_text_quickIntegration'));
                    $('#app_profile_text_android').text($.i18n.prop('app_profile_text_android'));
                    $('#app_profile_text_ios').text($.i18n.prop('app_profile_text_ios'));
                    $('#app_profile_text_modifyThumbnail').text($.i18n.prop('app_profile_text_modifyThumbnail'));
                    $('#app_profile_form_thumbnail_height').text($.i18n.prop('app_profile_form_thumbnail_height'));
                    $('#app_profile_form_thumbnail_width').text($.i18n.prop('app_profile_form_thumbnail_width'));
                    $('#app_profile_text_thumbnail_confirm').text($.i18n.prop('app_profile_text_thumbnail_confirm'));
                    $('#app_profile_text_thumbnail_cancel').text($.i18n.prop('app_profile_text_thumbnail_cancel'));
                }
            });
        },

        // load resources used in app_users.html page
        loadPropertiesForPageAppUsers: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#app_users_fourth_nav_deleteImUserBatch').text($.i18n.prop('app_users_fourth_nav_deleteImUserBatch'));
                    $('#app_users_fourth_nav_registImUser').text($.i18n.prop('app_users_fourth_nav_registImUser'));
                    $('#app_users_fourth_nav_sendMsg').text($.i18n.prop('app_users_fourth_nav_sendMsg'));
                    $('#app_users_fourth_nav_modify').text($.i18n.prop('app_users_fourth_nav_modify'));
                    $('#app_users_fourth_nav_search').text($.i18n.prop('app_users_fourth_nav_search'));
                    $('#app_users_th_checkAll').text($.i18n.prop('app_users_th_checkAll'));
                    $('#app_users_th_username').text($.i18n.prop('app_users_th_username'));
                    $('#app_users_th_notification').text($.i18n.prop('app_users_th_notification'));
                    $('#app_users_th_nickname').text($.i18n.prop('app_users_th_nickname'));
                    $('#app_users_th_muteType').text($.i18n.prop('app_users_th_muteType'));
                    $('#app_users_th_mutePeriod').text($.i18n.prop('app_users_th_mutePeriod'));
                    $('#app_users_th_notifiername').text($.i18n.prop('app_users_th_notifiername'));
                    $('#app_users_th_created').text($.i18n.prop('app_users_th_created'));
                    $('#app_users_th_operation').text($.i18n.prop('app_users_th_operation'));

                    var appUsersListOrder = parseInt($('#appUsersListOrder').val());
                    for(var i=1; i<=appUsersListOrder; i++) {
                        $('#app_users_selections_operation_' + i).text($.i18n.prop('app_users_selections_operation'));
                        $('#app_users_selections_contacts_' + i).text($.i18n.prop('app_users_selections_contacts'));
                        $('#app_users_selections_resetpassword_' + i).text($.i18n.prop('app_users_selections_resetpassword'));
                        $('#app_users_selections_modify_' + i).text($.i18n.prop('app_users_selections_modify'));
                        $('#app_users_selections_delete_' + i).text($.i18n.prop('app_users_selections_delete'));
                        $('#app_users_selections_sendMessages_' + i).text($.i18n.prop('app_users_selections_sendMessages'));
                        var hidden_notification_display_style = $('#hidden_notification_display_style_' + i).val();
                        if(hidden_notification_display_style == 0){
                            $('#notification_display_style_' + i).text($.i18n.prop('app_users_text_notification_display_style_summary'));
                        }else if(hidden_notification_display_style == 1){
                            $('#notification_display_style_' + i).text($.i18n.prop('app_users_text_notification_display_style_detail'));
                        } else {
                            $('#notification_display_style_' + i).text('---');
                        }

                        var hidden_notification_no_disturbing = $('#hidden_notification_no_disturbing_' + i).val();
                        if(hidden_notification_no_disturbing == 'true') {
                            $('#notification_no_disturbing_' + i).text($.i18n.prop('app_users_text_notification_no_disturbing_open'));
                        } else if(hidden_notification_no_disturbing == 'false'){
                            $('#notification_no_disturbing_' + i).text($.i18n.prop('app_users_text_notification_no_disturbing_close'));
                        } else {
                            $('#notification_no_disturbing_' + i).text('---');
                        }
                    }

                    // for search results
                    var hidden_search_notification_display_style = $('#hidden_search_notification_display_style').val();
                    if(hidden_search_notification_display_style == 0){
                        $('#search_notification_display_style').text($.i18n.prop('app_users_text_notification_display_style_summary'));
                    }else if(hidden_search_notification_display_style == 1){
                        $('#search_notification_display_style').text($.i18n.prop('app_users_text_notification_display_style_detail'));
                    } else {
                        $('#search_notification_display_style').text('---');
                    }

                    var hidden_search_notification_no_disturbing = $('#hidden_search_notification_no_disturbing').val();
                    if(hidden_search_notification_no_disturbing == 'true') {
                        $('#search_notification_no_disturbing').text($.i18n.prop('app_users_text_notification_no_disturbing_open'));
                    } else if(hidden_search_notification_no_disturbing == 'false'){
                        $('#search_notification_no_disturbing').text($.i18n.prop('app_users_text_notification_no_disturbing_close'));
                    } else {
                        $('#search_notification_no_disturbing').text('---');
                    }

                    $('#app_users_search_selections_operation').text($.i18n.prop('app_users_search_selections_operation'));
                    $('#app_users_search_selections_contacts').text($.i18n.prop('app_users_search_selections_contacts'));
                    $('#app_users_search_selections_resetpassword').text($.i18n.prop('app_users_search_selections_resetpassword'));
                    $('#app_users_search_selections_modify').text($.i18n.prop('app_users_search_selections_modify'));
                    $('#app_users_search_selections_delete').text($.i18n.prop('app_users_search_selections_delete'));
                    $('#app_users_search_selections_sendMessages').text($.i18n.prop('app_users_search_selections_sendMessages'));

                    $('#userInbox').attr('placeholder', $.i18n.prop('app_users_text_search_box_placeholder'));
                    $('#app_users_passwordModify_title').text($.i18n.prop('app_users_passwordModify_title'));
                    $('#app_users_infoModify_title').text($.i18n.prop('app_users_infoModify_title'));
                    $('#app_users_infoModify_form_label_username').text($.i18n.prop('app_users_infoModify_form_label_username'));
                    $('#app_users_infoModify_form_label_messageType').text($.i18n.prop('app_users_infoModify_form_label_messageType'));
                    $('#app_users_infoModify_form_label_messageType_summary').text($.i18n.prop('app_users_infoModify_form_label_messageType_summary'));
                    $('#app_users_infoModify_form_label_messageType_detail').text($.i18n.prop('app_users_infoModify_form_label_messageType_detail'));
                    $('#app_users_infoModify_form_label_mute').text($.i18n.prop('app_users_infoModify_form_label_mute'));
                    $('#app_users_infoModify_form_label_nickname').text($.i18n.prop('app_users_infoModify_form_label_nickname'));
                    $('#app_users_infoModify_form_label_mute_open').text($.i18n.prop('app_users_infoModify_form_label_mute_open'));
                    $('#app_users_infoModify_form_label_mute_close').text($.i18n.prop('app_users_infoModify_form_label_mute_close'));
                    $('#app_users_infoModify_form_label_mute_period').text($.i18n.prop('app_users_infoModify_form_label_mute_period'));
                    $('#app_users_infoModify_form_confirm').text($.i18n.prop('app_users_infoModify_form_confirm'));
                    $('#app_users_infoModify_form_cancel').text($.i18n.prop('app_users_infoModify_form_cancel'));
                    $('#app_users_infoModify_layer_saved').text($.i18n.prop('app_users_infoModify_layer_saved'));
                    $('#app_users_infoModify_layer_content').text($.i18n.prop('app_users_infoModify_layer_content'));
                    $('#app_users_infoModify_layer_saveerror').text($.i18n.prop('app_users_infoModify_layer_saveerror'));
                    $('#app_users_infoModify_layer_nicknameError').text($.i18n.prop('app_users_infoModify_layer_nicknameError'));
                    $('#app_users_infoModify_layer_periodError').text($.i18n.prop('app_users_infoModify_layer_periodError'));
                    $('#app_users_table_tab_previous').text($.i18n.prop('app_users_table_tab_previous'));
                    $('#app_users_table_tab_next').text($.i18n.prop('app_users_table_tab_next'));
                    $('#app_users_table_nav_previous').text($.i18n.prop('app_users_table_nav_previous'));
                    $('#app_users_table_nav_next').text($.i18n.prop('app_users_table_nav_next'));
                    $('#app_users_table_nodata').text($.i18n.prop('table_data_nodata'));
                    $('#app_users_confirm_delete_user').text($.i18n.prop('app_users_confirm_delete_user'));
                    $('#app_users_delete_layer_user').text($.i18n.prop('app_users_delete_layer_user'));
                    $('#app_users_delete_alert_deleted').text($.i18n.prop('app_users_delete_alert_deleted'));
                    $('#app_users_delete_alert_deleteError').text($.i18n.prop('app_users_delete_alert_deleteError'));
                    $('#app_users_alert_deleteNoteItem').text($.i18n.prop('app_users_alert_deleteNoteItem'));
                    $('#app_users_delete_alert_deleteNoteDone').text($.i18n.prop('app_users_delete_alert_deleteNoteDone'));
                    $('#app_users_passwordModify_label_newpassword').text($.i18n.prop('app_users_passwordModify_label_newpassword'));
                    $('#pwdMondify').attr('placeholder', $.i18n.prop('app_users_passwordModify_label_newpassword_placeholder'));
                    $('#pwdMondifytwo').attr('placeholder', $.i18n.prop('app_users_passwordModify_label_confirm_newpassword_placeholder'));
                    $('#app_users_passwordModify_label_confirmnewpassword').text($.i18n.prop('app_users_passwordModify_label_confirmnewpassword'));
                    $('#app_users_passwordModify_label_confirmnewpasswordplaceholder').text($.i18n.prop('app_users_passwordModify_label_confirmnewpasswordplaceholder'));
                    $('#app_users_passwordModify_label_confirm').text($.i18n.prop('app_users_passwordModify_label_confirm'));
                    $('#app_users_passwordModify_label_cancel').text($.i18n.prop('app_users_passwordModify_label_cancel'));
                    $('#app_users_sendMessage_title').text($.i18n.prop('app_users_sendMessage_title'));
                    $('#app_users_sendMessage_note').text($.i18n.prop('app_users_sendMessage_note'));
                    $('#app_users_sendMessage_selectPicture').text($.i18n.prop('app_users_sendMessage_selectPicture'));
                    $('#app_users_alert_upload_picture_waiting').text($.i18n.prop('app_users_alert_upload_picture_waiting'));

                    $('#app_users_sendMessage_selectPicture_btn').attr('value', $.i18n.prop('app_users_sendMessage_selectPicture_btn'));
                    $('#app_users_alert_sendMessage_confirm').text($.i18n.prop('app_users_alert_sendMessage_confirm'));
                    $('#app_users_alert_upload_messageContent').text($.i18n.prop('app_users_alert_upload_messageContent'));
                    $('#app_users_alert_sendMessage_cancel').text($.i18n.prop('app_users_alert_sendMessage_cancel'));
                    $('#app_users_alert_sendMessage_messageContent').text($.i18n.prop('app_users_alert_sendMessage_messageContent'));

                    $('#app_users_message_alerr_nouser').text($.i18n.prop('app_users_message_alerr_nouser'));
                }
            });
        },

        // load resources used in app_user_contacts.html page
        loadPropertiesForPageAppUsersContacts: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#second_nav_imusers').text($.i18n.prop('second_nav_imusers'));
                    $('#second_nav_contacts').text($.i18n.prop('second_nav_contacts'));
                    $('#app_users_contacts_bnt_addNewContacts').text($.i18n.prop('app_users_contacts_bnt_addNewContacts'));
                    $('#app_users_contacts_table_username').text($.i18n.prop('app_users_contacts_table_username'));
                    $('#app_users_contacts_text_addNewContacts').text($.i18n.prop('app_users_contacts_text_addNewContacts'));
                    $('#app_users_contacts_text_contactsName').text($.i18n.prop('app_users_contacts_text_contactsName'));
                    $('#app_users_contacts_bnt_add').text($.i18n.prop('app_users_contacts_bnt_add'));
                    $('#app_users_contacts_bnt_cancel').text($.i18n.prop('app_users_contacts_bnt_cancel'));
                    $('#app_users_contacts_table_loading').text($.i18n.prop('app_users_contacts_table_loading'));
                    $('#app_users_contacts_table_operation').text($.i18n.prop('app_users_contacts_table_operation'));

                    var appIMUserContactsOrder = parseInt($('#appIMUserContactsOrder').val());
                    for(var i=1; i<=appIMUserContactsOrder; i++) {
                        $('#app_users_contacts_table_operation_' + i).text($.i18n.prop('app_users_contacts_table_operation'));
                        $('#app_users_contacts_table_disconn_' + i).text($.i18n.prop('app_users_contacts_table_disconn'));
                    }
                    $('#app_users_contacts_table_nodata').text($.i18n.prop('table_data_nodata'));
                }
            });
        },

        // load resources used in app_user_create.html page
        loadPropertiesForPageAppUsersCreate: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#bigdataEntry').text($.i18n.prop('bigdataEntry'));
                    $('#logo_home').attr('src', $.i18n.prop('logo_home'));
                    $('#left_nav_myapp').text($.i18n.prop('left_nav_myapp'));
                    $('#left_nav_userInfo').text($.i18n.prop('left_nav_userInfo'));
                    $('#left_nav_orgInfo').text($.i18n.prop('left_nav_orgInfo'));
                    $('#second_nav_imuser').text($.i18n.prop('second_nav_imuser'));
                    $('#second_nav_create_imuser').text($.i18n.prop('second_nav_create_imuser'));
                    $('#app_users_create_form_password').text($.i18n.prop('app_users_create_form_password'));
                    $('#app_users_create_form_username').text($.i18n.prop('app_users_create_form_username'));
                    $('#app_users_create_form_backlist').text($.i18n.prop('app_users_create_form_backlist'));
                    $('#app_users_create_form_confirmPassword').text($.i18n.prop('app_users_create_form_confirmPassword'));
                    $('#app_users_create_form_confirm').text($.i18n.prop('app_users_create_form_confirm'));

                    var imUsernameMsgType = $('#imUsernameMsgType').val();
                    var imUsernameMsgObj = $('#imUsernameMsg');
                    if(imUsernameMsgType == 'empty') {
                        imUsernameMsgObj.text($.i18n.prop('app_users_form_username_error_empty'));
                    } else if(imUsernameMsgType == 'illegal') {
                        imUsernameMsgObj.text($.i18n.prop('app_users_form_username_error_illegal'));
                    }

                    var passwordMsgType = $('#passwordMsgType').val();
                    if(passwordMsgType == 'error') {
                        $('#passwordMsg').text($.i18n.prop('app_users_form_password_error'));
                    }

                    var confirmPasswordMsgType = $('#confirmPasswordMsgType').val();
                    if(confirmPasswordMsgType == 'notmatch') {
                        $('#confirmPasswordMsg').text($.i18n.prop('app_users_form_confirm_password_error_notmatch'));
                    }
                }
            });
        },

        // load resources used in index_confirm_failure.html page
        loadPropertiesForPageConfirmFailure: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#confirm_failure_alert').text($.i18n.prop('confirm_failure_alert'));
                    $('#confirm_failure_toSignIn').text($.i18n.prop('confirm_failure_toSignIn'));
                }
            });
        },

        // load resources used in index_confirm_success.html page
        loadPropertiesForPageConfirmSuccess: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#confirm_success_alert').text($.i18n.prop('confirm_success_alert'));
                    $('#confirm_failure_toSignIn').text($.i18n.prop('confirm_failure_toSignIn'));
                }
            });
        },

        // load resources used in index_regist_org_success.html page
        loadPropertiesForPageRegisterOrgSuccess: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#regist_org_success_alert').text($.i18n.prop('regist_org_success_alert'));
                    $('#regist_org_success_backtoindex').text($.i18n.prop('regist_org_success_backtoindex'));
                }
            });
        },

        // load resources used in index_resetpw_failure.html page
        loadPropertiesForPageResetpwFailure: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#resetpw_failure_alert').text($.i18n.prop('resetpw_failure_alert'));
                    $('#resetpw_failure_toSignIn').text($.i18n.prop('resetpw_failure_toSignIn'));
                }
            });
        },

        // load resources used in index_resetpw_input.html page
        loadPropertiesForPageResetpwInput: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#resetpw_input_text_setNewPassword').text($.i18n.prop('resetpw_input_text_setNewPassword'));
                    $('#resetpw_input_form_confirm').text($.i18n.prop('resetpw_input_form_confirm'));
                    $('#resetpw_input_form_cancel').text($.i18n.prop('resetpw_input_form_cancel'));
                    $('#password1').attr('placeholder', $.i18n.prop('resetpw_input_form_password1_placeholder'));
                    $('#password2').attr('placeholder', $.i18n.prop('resetpw_input_form_password2_placeholder'));
                }
            });
        },

        // load resources used in index_resetpw_success.html page
        loadPropertiesForPageResetpwSuccess: function(){
            $.i18n.properties({
                name: resourceFilePrefix,
                path: resourceFilePath,
                mode: resourcePropertiesMode,
                language : this.getNavigatorLanguage(),
                callback : function() {
                    $('#page_title').text($.i18n.prop('page_title'));
                    $('#resetpw_success_alert').text($.i18n.prop('resetpw_success_alert'));
                    $('#resetpw_success_toSignIn').text($.i18n.prop('resetpw_success_toSignIn'));
                }
            });
        }
    }
}();