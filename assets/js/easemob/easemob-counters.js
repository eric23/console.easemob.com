/**
 * Created by kenshinn on 15-6-2.
 */

var orgName = $.cookie('orgName');

//初始开始时间段
//记录当前时间
var nowTime;
var nowTimeSec;

// 日期输入框处理
var DatePikerHandler = function () {
    return {
        fillDatePikerInput: function () {
            //记录计算过后的时间
            var startTime;

            //计算当前时间
            var type = "Y-M-D";
            var type1 = "Y-M-D h:m";
            //获取年-月-日
            var myDate = new Date();
            //年份：如2013
            Y = myDate.getFullYear();
            //月份：如06
            M = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
            //日：如15
            D = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
            nowTime = type.replace("Y", Y).replace("M", M).replace("D", D);

            h = myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours();
            m = myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes();
            //s = myDate.getSeconds() < 10 ? "0" + myDate.getSeconds() : myDate.getSeconds();
            nowTimeSec = type1.replace("Y", Y).replace("M", M).replace("D", D).replace("h", h).replace("m", m);

            //计算前7天时间
            if (D - 6 <= 0) {
                startTime = new Date(Y, M - 1, D - 6).format('yyyy-MM-dd');
            } else {
                startTime = new Date(Y, M - 1, D - 6).format('yyyy-MM-dd');
            }

            this.setPickerStartDate(startTime);
            this.setPickerEndDate(nowTime);
            $('#pickerEndDateHide').val(nowTimeSec);
        },

        showDatePiker: function () {
            var pickerDateLanguageVal = $('#pickerDateLanguage').val();
            if (pickerDateLanguageVal == 'en') {
                $('#pickerStartDateEn').show();
                $('#pickerEndDateEn').show();
                $('#pickerStartDateZh').hide();
                $('#pickerEndDateZh').hide();
            } else {
                $('#pickerStartDateEn').hide();
                $('#pickerEndDateEn').hide();
                $('#pickerStartDateZh').show();
                $('#pickerEndDateZh').show();
            }
        },

        getPickerStartDate: function () {
            var pickerDateLanguageObj = $('#pickerDateLanguage').val();
            if (pickerDateLanguageObj == 'zh') {
                return $('#pickerStartDateZh').val();
            } else {
                return $('#pickerStartDateEn').val();
            }
        },

        getPickerEndDate: function () {
            var pickerDateLanguageObj = $('#pickerDateLanguage').val();
            if (pickerDateLanguageObj == 'zh') {
                return $('#pickerEndDateZh').val();
            } else {
                return $('#pickerEndDateEn').val();
            }
        },

        setPickerStartDate: function (timeValue) {
            $('#pickerStartDateEn').val(timeValue);
            $('#pickerStartDateZh').val(timeValue);
        },

        setPickerEndDate: function (timeValue) {
            $('#pickerEndDateZh').val(timeValue);
            $('#pickerEndDateEn').val(timeValue);
        }
    };
}();


// 统计图表处理
var StatisticsChartsHandler = function () {
    return {
        drawChart: function (labels, datas) {
            var data = {
                labels: labels,
                datasets: [
                    {
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",

                        data: datas
                    }
                ]
            };

            // 渲染
            var options = {
                scaleOverlay: true,
                scaleOverride: false,
                scaleSteps: null,
                scaleStepWidth: null,
                scaleStartValue: null,
                scaleLineColor: "rgba(0,0,0,.1)",
                scaleLineWidth: 2,
                scaleShowLabels: true,
                scaleLabel: "<%=value%>",
                scaleFontFamily: "'Arial'",
                scaleFontSize: 12,
                scaleFontStyle: "normal",
                scaleFontColor: "#666",
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                bezierCurve: false,
                pointDot: true,
                pointDotRadius: 3,
                pointDotStrokeWidth: 1,
                datasetStroke: true,
                datasetStrokeWidth: 2,
                datasetFill: true,
                animation: true,
                animationSteps: 60,
                animationEasing: "easeOutQuart",
                onAnimationComplete: null,
                responsive: true
            };

            $('#counters').html('');
            $('#counters').append('<canvas id="countersCharts" width="1200%" height="400"></canvas>');
            var countersChartsCtx = $("#countersCharts").get(0).getContext("2d");
            new Chart(countersChartsCtx).Line(data, options);
        }
    };
}();


function getCounterNameFromHtml() {
    var queryStr = {};

    var counterName = '';
    var restStr = '';
    var counterType = $('#drawCountersChartsType').val();

    switch (counterType) {
        case 'register_users':
            counterName = 'application.collection.users';
            break;
        case 'daily_active_users':
            counterName = 'daily_active_user';
            break;
        case 'daily_chat_users':
            counterName = 'daily_chat_user';
            break;
        case 'daily_new_active_users':
            counterName = 'daily_new_user';
            break;
        case 'msg_outgoing_chat':
            counterName = 'application.collection.chatmessages';
            restStr = '&direction=outgoing&chat_type=chat';
            break;
        case 'msg_outgoing_groupchat':
            counterName = 'application.collection.chatmessages';
            restStr = '&direction=outgoing&chat_type=groupchat';
            break;
        case 'msg_offline_chat':
            counterName = 'application.collection.chatmessages';
            //restStr = '&direction=offline&chat_type=chat';
            break;
        case 'msg_offline_groupchat':
            counterName = 'application.collection.chatmessages';
            //restStr = '&direction=offline&chat_type=groupchat';
            break;
        default:
            counterName = '';
            break;
    }

    queryStr.counterName = counterName;
    queryStr.restStr = restStr;

    return queryStr;
}

/**
 * Search data fro one-day or seven-day
 *
 * @param period
 */
function drawCountersCharts(period, event) {
    var textStartTime = DatePikerHandler.getPickerStartDate();
    var textEndTime = DatePikerHandler.getPickerEndDate();

    if (textStartTime > textEndTime || textStartTime == textEndTime) {
        layer.msg($.i18n.prop('app_collection_counters_searchAlert_startLessThanEnd'), 3, 5);
        return;
    } else if (textEndTime > nowTime) {
        layer.msg($.i18n.prop('app_collection_counters_searchAlert_endMustLessThanToday'), 3, 5);
        return;
    }

    var resolution = 'day';
    var type = "Y-M-D";
    var endTime = type.replace("Y", Y).replace("M", M).replace("D", D);

    var startTime = DatePikerHandler.getPickerStartDate();
    if (period == "oneday") {
        //计算当前时间
        startTime = new Date(Y, M - 1, D - 1).format('yyyy-MM-dd');
        resolution = 'six_hour';
    } else if (period == "sevendays") {
        //计算当前时间
        startTime = new Date(Y, M - 1, D - 6).format('yyyy-MM-dd');
    }

    if(event != 'selectorChange') {
        DatePikerHandler.setPickerStartDate(startTime);
        DatePikerHandler.setPickerEndDate(endTime);
    }

    var queryStr = getCounterNameFromHtml();

    var startTimeStr = DatePikerHandler.getPickerStartDate();
    var endTimeSecStr = $("#pickerEndDateHide").val();

    //开始时间
    var dt = Date.parse(startTimeStr.replace(/-/g, "/"));
    var startTimeS = new Date(dt);
    var startTimeTime = startTimeS.getTime();
    //结束时间(毫秒)
    var dt1Sec = Date.parse(endTimeSecStr.replace(/-/g, "/"));
    var endTimeSec = new Date(dt1Sec);
    var endTimeTimeSec = endTimeSec.getTime();

    var chartDatas = applyCountersData(queryStr.counterName, resolution, startTimeTime, endTimeTimeSec, queryStr.restStr);
    StatisticsChartsHandler.drawChart(chartDatas.labels, chartDatas.datas);
}

/**
 * Search counter data as time period
 */
function drawCountersChartsPeriodSearch() {

    $("input[name='chartsRadio1']").attr('checked', false);

    var textStartTime = DatePikerHandler.getPickerStartDate();
    var textEndTime = DatePikerHandler.getPickerEndDate();

    //开始时间
    var dt = Date.parse(textStartTime.replace(/-/g, "/"));
    var startTime = new Date(dt);
    var startTimeTime = startTime.getTime();

    //结束时间
    var dt1 = Date.parse(textEndTime.replace(/-/g, "/"));
    var endTime = new Date(dt1);
    var endTimeTime = endTime.getTime();
    var endTimeTimeSec = '';

    if (formatTimeDay(endTimeTime) == formatTimeDay(nowTimeSec)) {
        // 结束时间是当天
        var endTimeSecStr = $("#pickerEndDateHide").val();
        //结束时间(毫秒)
        var dt1Sec = Date.parse(endTimeSecStr.replace(/-/g, "/"));
        var endTimeSec = new Date(dt1Sec);
        endTimeTimeSec = endTimeSec.getTime();
    } else {
        // 结束时间当天最后一毫秒
        endTimeTimeSec = endTimeTime + 86399000;
    }

    var timeDifference = endTimeTime - startTimeTime;
    var days = Math.floor(timeDifference / (24 * 3600 * 1000));
    if (days > 30) {
        layer.msg($.i18n.prop('app_collection_counters_searchAlert_with30days'), 3, 5);
        return;
    } else if (days == 0) {
        layer.msg($.i18n.prop('app_collection_counters_searchAlert_startLessThanEnd'), 3, 5);
        return;
    } else if (textEndTime > nowTime) {
        layer.msg($.i18n.prop('app_collection_counters_searchAlert_endMustLessThanToday'), 3, 5);
        return;
    }

    var resolution = '';
    if (days == 1) {
        resolution = 'six_hour';
    } else {
        resolution = 'day';
    }

    var queryStr = getCounterNameFromHtml();
    var chartDatas = applyCountersData(queryStr.counterName, resolution, startTimeTime, endTimeTimeSec, queryStr.restStr);
    StatisticsChartsHandler.drawChart(chartDatas.labels, chartDatas.datas);
}


/**
 * Fetch data from api server
 *
 * @param counterName
 * @param resolution
 * @param startTimeTime
 * @param endTimeMilSec
 * @param restStr
 * @returns {{}}
 */
function applyCountersData(counterName, resolution, startTimeTime, endTimeMilSec, restStr) {
    var applyRequest = {
        orgName: $.cookie('orgName'),
        accessToken: $.cookie('access_token'),
        appName: $.cookie('appName'),
        start_time: '',
        end_time: '',
        pad: 'true',
        resolution: resolution
    };

    var chartData = {};
    var datas = [], labels = [];
    applyRequest.start_time = startTimeTime;
    applyRequest.end_time = endTimeMilSec;

    var tokenStr = applyRequest.accessToken;

    var requestData = {
        'grant_type': 'client_credentials',
        'client_id': '',
        'client_secret': ''
    };

    if (counterName == 'application.collection.chatmessages') {
        // fetch credentials for app
        $.ajax({
            url: baseUrl + '/' + applyRequest.orgName + '/' + applyRequest.appName + '/credentials',
            type: 'GET',
            async: false,
            headers: {
                'Authorization': 'Bearer ' + applyRequest.accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                requestData.client_id = respData.credentials.client_id;
                requestData.client_secret = respData.credentials.client_secret;
            }
        });

        // fetch apptoken
        $.ajax({
            url: baseUrl + '/' + applyRequest.orgName + '/' + applyRequest.appName + '/token',
            type: 'POST',
            async: false,
            data: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            },
            crossDomain: true,
            error: function (respData, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                tokenStr = respData.access_token;
            }
        });
    }

    // fetch counters
    $.ajax({
        url: baseUrl + '/' + applyRequest.orgName + '/' + applyRequest.appName + '/counters?counter=' + counterName
        + '&start_time=' + applyRequest.start_time + '&end_time=' + applyRequest.end_time + '&pad=' + applyRequest.pad
        + '&resolution=' + applyRequest.resolution + restStr,
        type: 'GET',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + tokenStr,
            'Content-Type': 'application/json'
        },
        success: function (respData, textStatus, jqXHR) {
            $.each(respData.counters, function () {
                if (this.values.length == 0) {
                    for (var i = 0; i < 10; i++) {
                        labels.push(0);
                        datas.push(0);
                    }
                }
                if (this.values.length == 1) {
                    labels.push(0);
                    datas.push(0);
                    $.each(this.values, function () {
                        if (applyRequest.resolution == 'six_hour') {
                            labels.push(formatTimeHour(this.timestamp));
                        } else {
                            labels.push(formatTimeDay(this.timestamp));
                        }
                        datas.push(this.value.toString());
                    });
                } else {
                    $.each(this.values, function () {
                        if (applyRequest.resolution == 'six_hour') {
                            labels.push(formatTimeHour(this.timestamp));
                        } else {
                            labels.push(formatTimeDay(this.timestamp));
                        }
                        datas.push(this.value.toString());
                    });
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            layer.msg($.i18n.prop('table_data_nodata'), 3, 5);
        }
    });

    chartData.labels = labels;
    chartData.datas = datas;

    return chartData;
}


function formatTimeDay(timeST) {
    var dat = new Date(timeST);
    return (dat.getFullYear()) + "-" + (dat.getMonth() + 1) + "-" + (dat.getDate());
}

function formatTimeHour(timeST) {
    var dat = new Date(timeST);
    return (dat.getFullYear()) + "-" + (dat.getMonth() + 1) + "-" + (dat.getDate()) + " " + (dat.getHours()) + ":00:00";
}

function applyCountersAndDraw(selector, event) {
    var counterType = $(selector).children("option:selected").val();
    var drawCountersChartsTypeObj = $('#drawCountersChartsType');
    drawCountersChartsTypeObj.val(counterType);

    //var drawCountersChartsType = drawCountersChartsTypeObj.val();
    var chartTitle = $('#chartTitle');
    switch (counterType) {
        case 'daily_active_users':
            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyActiveUser'));
            //chartTitle.text(chartTileDailyActiveUser);
            break;
        case 'daily_chat_users':
            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyChatUser'));
            //chartTitle.text(chartTileDailyChatUser);
            break;
        case 'daily_new_active_users':
            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyNewActiveUser'));
            //chartTitle.text(chartTileDailyNewActiveUser);
            break;
        case 'register_users':
            chartTitle.text($.i18n.prop('app_collection_counters_chartTileUsers'));
            //chartTitle.text(chartTileDailyNewActiveUser);
            break;
        case 'msg_outgoing_chat':
            chartTitle.text('单聊 - 上行消息');
            //chartTitle.text($.i18n.prop('app_collection_counters_chartTileUsers'));
            //chartTitle.text(chartTileDailyNewActiveUser);
            break;
        case 'msg_outgoing_groupchat':
            chartTitle.text('群聊 - 上行消息');
            //chartTitle.text($.i18n.prop('app_collection_counters_chartTileUsers'));
            //chartTitle.text(chartTileDailyNewActiveUser);
            break;
        default:
            break;
    }

    var period = $("input[name='chartsRadio1']:checked").val();
    drawCountersCharts(period, event);
}

function preDrawCountersCharts() {
    var peroid = $("input[name='chartsRadio1']:checked").val();
    drawCountersCharts(peroid, null);
}

function showUsersChartTab() {
    $('#tabUsers').parent().attr('class', 'active');
    $('#tabChatmessages').parent().removeAttr('class');

    $('#userChartSelector').show();
    $('#countersChartType').show();
    $('#chatmessagsChartSelector').hide();
    $('#chatgroupsChartSelector').hide();

    $('#drawCountersChartsType').val('register_users');

    var period = $("input[name='chartsRadio1']:checked").val();
    drawCountersCharts(period, null);

    // TODO
    var counterType = $('#userChartSelector').children("option:selected").val();
    var drawCountersChartsTypeObj = $('#drawCountersChartsType');
    drawCountersChartsTypeObj.val(counterType);

    var chartTitle = $('#chartTitle');
    switch (counterType) {
        case 'daily_active_users':
            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyActiveUser'));
            break;
        case 'daily_chat_users':
            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyChatUser'));
            break;
        case 'daily_new_active_users':
            chartTitle.text($.i18n.prop('app_collection_counters_chartTileDailyNewActiveUser'));
            break;
        case 'register_users':
            chartTitle.text($.i18n.prop('app_collection_counters_chartTileUsers'));
            break;
    }
}

function showChatmessagsChartTab() {
    $('#tabChatmessages').parent().attr('class', 'active');
    $('#tabUsers').parent().removeAttr('class');

    $('#countersChartType').show();
    $('#chatmessagsChartSelector').show();

    $('#userChartSelector').hide();
    $('#chatgroupsChartSelector').hide();

    $('#drawCountersChartsType').val('msg_outgoing_chat');

    var period = $("input[name='chartsRadio1']:checked").val();
    drawCountersCharts(period, null);
    var chartTitle = $('#chartTitle').text($.i18n.prop('app_collection_counters_chartTileChatmessages'));
}

//function showChatgroupsChartTab() {
//    $('#userChartSelector').hide();
//    $('#chatmessagsChartSelector').hide();
//    $('#chatgroupsChartSelector').show();
//    $('#drawCountersChartsType').val('');
//}
