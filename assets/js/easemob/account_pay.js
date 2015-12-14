// common function start
/**
 * @method ifPage
 * @param pathname {string} /accout_overview.html
 * @return {boolean} 参数
 */
function ifPage (pathname) {
	return true;
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}     

/**
 * 金额格式化
 * @method fmoney
 */
function fmoney(s, n)   
{   
   n = n > 0 && n <= 20 ? n : 2;   
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
   var l = s.split(".")[0].split("").reverse(),   
   r = s.split(".")[1];   
   t = "";   
   for(i = 0; i < l.length; i ++ )   
   {   
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
   }   
   return t.split("").reverse().join("") + "." + r;   
} 

// common function stop

/**
 * @author 小洪
 * @data 2015-12-8
 * @class ChartsPay
 * @constructor
 * @param opt {object} 参数
 */

function ChartsPay(opt) {
	if (!(this instanceof ChartsPay)) {
		return new ChartsPay(opt);
	}

	//金额节点
	this.account_ele = opt.account_ele;
	//趋势图节点
	this.chart_linear_ele = opt.chart_linear_ele;

	//cookie记录
	this.account_info = null;

}

ChartsPay.prototype = {
	/**
	 * 初始化
	 * @method init
	 */
	init: function () {


		var accessToken = $.cookie('access_token');
		///billing/account/get
		
		//我的帐户显示剩余金额 
		this.getAccount();

		//趋势图
		this.getCharsData();
	},
	/**
	 * 异步请求数据
	 * @method ajax
	 * @param url {String} 请球地址
	 * @param type {String} get || post
	 * @param data {Object} {name:name,age: age}
	 * @param callback {Function} 
	 */

	ajax: function (url, type, data, callback) {
		var that = this;
		type = type || 'get';
		var accessToken = $.cookie('access_token');
		$.ajax({
            url: url,
            type: type,
            data: data,
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer '+ accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            success: function (respData, textStatus, jqXHR) {
            	callback(respData,that);
            }
        });
	},
	/**
	 * 获取剩余金额数据
	 * @method getAccount
	 */
	getAccount: function () {
		var data = {};
		this.ajax('/billing/account/get','get', data, this.setAccountRander);
	},
	/**
	 * 设直渲染
	 * @method setAccountRander
	 * @param msg {Object}
	 */
	setAccountRander: function (msg,that) {
		var string_cookie = JSON.stringify(msg.data);
		$.cookie('account_info',string_cookie);
		that.account_ele.text('￥'+msg.data.accumInvAmount);
	},
	/**
	 * 获取图表数据
	 * @method getCharsData
	 */
	getCharsData: function () {
		var data = {};
		this.ajax('/billing/transaction/overview','get', data, this.setCharsRander);
	},
	/**
	 * 渲染highcharts
	 * @method setCharsRander
	 * @param msg {Object}
	 */
	setCharsRander: function (msg) {

		var chart_x_arr = [];
		var chart_y_arr = [];

		$.each(msg.data,function (k, v) {
			chart_x_arr[k] = v.amount;
			chart_y_arr[k] = v.month;
		});

		var highcharts_object = {
	        chart: {
	            type: 'line'
	        },
	        title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },
	        xAxis: {
	            //categories: ['2014-09', '2014-11', '2015-01', '2015-03', '2015-05'],
	            categories: chart_y_arr,
	            gridLineColor: '#bbb',
	      		gridLineWidth: 1,
	            gridLineDashStyle:'ShortDot'
	        },
	        legend: {
	        	enabled: false
	        },
	        yAxis: {
	            title: {
	                text: ''
	            },
	            gridLineColor: '#bbb',
	      		gridLineWidth: 2,
	            gridLineDashStyle:'ShortDot',
	            labels : { 
	                formatter : function ( ) { 
	                    return fmoney(this.value,2);
	                } 
	            } 
	        },
	        tooltip: {
	            enabled: true,
	            formatter: function() {
	                return '<b>'+ this.series.name +'</b><br/>'+this.x +': '+ fmoney(this.y,2);;
	            }
	        },
	        series: [{
	            name: '',
	           // data: [250000000, 350000000, 430000000, 250300000, 1000000000]
	            data: chart_x_arr
	        }]
	    }
		$('#chart_linear').highcharts(highcharts_object);
	}
};

/**
 * 充值记录页面
 * @method RechargeRecord
 */
function RechargeRecord(opt) {
	if (!(this instanceof RechargeRecord)) {
		return new RechargeRecord(opt);
	}
	this.start_time_ele = opt.start_time_ele;
	this.end_time_ele = opt.end_time_ele;

	this.select_ele = opt.select_ele;

	this.app_list_body_ele = opt.app_list_body_ele;

	//判断是充值还是消费
	this.flag = opt.flag;

}

RechargeRecord.prototype = {
	/**
	 * 初始化
	 * @method dateInitEvent
	 */
	init: function () {
		//初始化日历组件
		this.dateInitEvent();
		//查询日期
		this.selectDate();
	},
	/**
	 * 异步请求数据
	 * @method ajax
	 * @param url {String} 请球地址
	 * @param type {String} get || post
	 * @param data {Object} {name:name,age: age}
	 * @param callback {Function} 
	 */

	ajax: function (url, type, data, callback) {
		var that = this;
		type = type || 'get';
		var accessToken = $.cookie('access_token');
		$.ajax({
            url: url,
            type: type,
            data: data,
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer '+ accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            success: function (respData, textStatus, jqXHR) {
            	callback(respData,that);
            }
        });
	},

	/**
	 * 当两个日期为空的时候
	 * @method isDateNull
	 */
	setDateStartEnd: function () {

		var that = this;

		//设置日期
		var SetDate = {
			init: function (opt) {

				this.data = {};
				this.account_info = JSON.parse($.cookie('account_info'));
				this.end = '';
				this.start = '';

				this.self = opt.self;
				this.start_ele = opt.start_ele;
				this.end_ele = opt.end_ele;

				this.data.accountId = this.account_info.id;
				//页数
				this.data.pageNo = 1;
				//分页尺寸
				this.data.pageSize = 100;

				this.isDefaultNullVal();



			},
			isDefaultNullVal: function () {
				if (this.self.end_time_ele.val() == '') {

				 	this.end = this.self.setTimestamp(new Date().Format("yyyy-MM-dd"));
				 	//转换成日期
				 	this.end = new Date((this.end)*1000).Format("yyyy-MM-dd");
				 	this.self.end_time_ele.val(this.end);

				} else {
				 	this.end = this.self.end_time_ele.val();
				}

				if (this.self.start_time_ele.val() == '') {

					this.start = this.self.setTimestamp(new Date().Format("yyyy-MM-dd"));
					// this.start = start;

				 	//计算昨天的时间
				 	this.start = new Date((this.start-86400)*1000).Format("yyyy-MM-dd");

				 	this.self.start_time_ele.val(this.start);

				 } else {
				 	this.start = this.self.start_time_ele.val();
				 }

	 			//结束时间
				this.data.endDate = this.end;

				//开始时间
				this.data.startDate = this.start;

				this.rander();

			},
			rander: function () {
				this.self.ajax('/billing/transaction/recharges', 'get', this.data, this.self.setRanderTable);
			}

		};

		//启动
		SetDate.init({
			start_ele: that.start_time_ele,
			end_ele: that.end_time_ele,
			self: that
		});
	
	},
	/**
	 * 查询日期
	 * @method selectDate
	 */
	selectDate: function () {
		var that = this;
		//页面刷新默认
		that.setDateStartEnd();
		//鼠标点击查询
		this.select_ele.off('click').on('click', function (e) {
			e.stopPropagation();

			that.setDateStartEnd();
			
			return false;
		});		

	},
	/**
	 * 换算时间截
	 * @method setTimestamp
	 * @param date_data {Number}
	 * @return timestamp {Number}
	 */
	setTimestamp: function (date_data) {

		var date = new Date(date_data);
		var timestamp = date.getTime()/1000;

		return timestamp;
	},
	/**
	 * 渲染表格
	 * @method setRanderTable
	 * @param msg {Object}
	 * @param that {Object}
	 */
	setRanderTable: function (msg, that) {

		//渲染tboby
		var SetTbody = {
			init: function (msg) {
				this.data = msg;
				this.tr_start = '';
				//执行渲染
				this.rander();
			},
			rander: function () {
				var self = this;
				$.each(this.data, function (k, v) {
					self.tr_start += '<tr>';
					self.tr_start += '<td>' + v.id + '</td>';
					self.tr_start += '<td>' + v.lstUpdTime	 + '</td>';
					self.tr_start += '<td>' + v.amount	 + '</td>';
					self.tr_start += '<td>' + v.type +'</td>';
					self.tr_start += '</tr>';
				});

				that.app_list_body_ele.html(self.tr_start);
			}
		}

		SetTbody.init(msg.data);
	},

	/**
	 * 初始化日历组件
	 * @method dateInitEvent
	 */
	dateInitEvent: function () {
		var that = this;
		//开始时间
		this.start_time_ele.off().on('focus', function (e) {
			e.stopPropagation();
			WdatePicker({maxDate:'#F{$dp.$D(\'d4312\')||\'2020-10-01\'}'});
			return false;
		});
		//结束时间
		this.end_time_ele.off().on('focus', function (e) {

			e.stopPropagation();

			WdatePicker({minDate:'#F{$dp.$D(\'d4311\')}',maxDate:new Date().Format('yyyy-MM-dd')});

			return false;

		});
	}
}

/**
 * 消费记录页面
 * @method RechargeOfRecord
 */
function RechargeOfRecord(opt) {
	if (!(this instanceof RechargeOfRecord)) {
		return new RechargeOfRecord(opt);
	}


	this.start_time_ele = opt.start_time_ele;
	this.end_time_ele = opt.end_time_ele;

	this.select_ele = opt.select_ele;

	this.app_list_body_ele = opt.app_list_body_ele;

	this.getUrl = opt.getUrl;

	//判断是充值还是消费
	this.flag = opt.flag;


	if (this.flag == 'recharge') {
		this.flag_name = '支付宝';
	} else if (this.flag == 'consumption') {
		//todo:中英文硬编码
		if ($('#nav_index').text() == '首页') {
			this.flag_name = '消费';
	    } else {
			this.flag_name = 'consumption';
	    }

	}

}

RechargeOfRecord.prototype = {
	/**
	 * 初始化
	 * @method dateInitEvent
	 */
	init: function () {
		//初始化日历组件
		this.dateInitEvent();
		//查询日期
		this.selectDate();
	},
	/**
	 * 异步请求数据
	 * @method ajax
	 * @param url {String} 请球地址
	 * @param type {String} get || post
	 * @param data {Object} {name:name,age: age}
	 * @param callback {Function} 
	 */

	ajax: function (url, type, data, callback) {
		var that = this;
		type = type || 'get';
		var accessToken = $.cookie('access_token');
		$.ajax({
            url: url,
            type: type,
            data: data,
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer '+ accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            success: function (respData, textStatus, jqXHR) {
            	callback(respData,that);
            }
        });
	},

	/**
	 * 当两个日期为空的时候
	 * @method isDateNull
	 */
	setDateStartEnd: function () {

		var that = this;

		//设置日期
		var SetDate = {
			init: function (opt) {

				this.data = {};
				this.account_info = JSON.parse($.cookie('account_info'));
				this.end = '';
				this.start = '';

				this.self = opt.self;
				this.start_ele = opt.start_ele;
				this.end_ele = opt.end_ele;

				this.data.accountId = this.account_info.id;
				//页数
				this.data.pageNo = 1;
				//分页尺寸
				this.data.pageSize = 100;

				this.isDefaultNullVal();



			},
			isDefaultNullVal: function () {
				if (this.self.end_time_ele.val() == '') {

				 	this.end = this.self.setTimestamp(new Date().Format("yyyy-MM-dd"));
				 	//转换成日期
				 	this.end = new Date((this.end)*1000).Format("yyyy-MM-dd");
				 	this.self.end_time_ele.val(this.end);

				} else {
				 	this.end = this.self.end_time_ele.val();
				}

				if (this.self.start_time_ele.val() == '') {

					this.start = this.self.setTimestamp(new Date().Format("yyyy-MM-dd"));
					// this.start = start;

				 	//计算昨天的时间
				 	this.start = new Date((this.start-86400)*1000).Format("yyyy-MM-dd");

				 	this.self.start_time_ele.val(this.start);

				 } else {
				 	this.start = this.self.start_time_ele.val();
				 }

	 			//结束时间
				this.data.endDate = this.end;

				//开始时间
				this.data.startDate = this.start;

				this.rander();

			},
			rander: function () {
				this.self.ajax(this.self.getUrl, 'get', this.data, this.self.setRanderTable);
			}

		};

		//启动
		SetDate.init({
			start_ele: that.start_time_ele,
			end_ele: that.end_time_ele,
			self: that
		});
	
	},
	/**
	 * 查询日期
	 * @method selectDate
	 */
	selectDate: function () {
		var that = this;
		//页面刷新默认
		that.setDateStartEnd();
		//鼠标点击查询
		this.select_ele.off('click').on('click', function (e) {
			e.stopPropagation();

			that.setDateStartEnd();
			
			return false;
		});		

	},
	/**
	 * 换算时间截
	 * @method setTimestamp
	 * @param date_data {Number}
	 * @return timestamp {Number}
	 */
	setTimestamp: function (date_data) {

		var date = new Date(date_data);
		var timestamp = date.getTime()/1000;

		return timestamp;
	},
	/**
	 * 渲染表格
	 * @method setRanderTable
	 * @param msg {Object}
	 * @param that {Object}
	 */
	setRanderTable: function (msg, that) {

		console.log(msg,'msg,msg');

		//渲染tboby
		var SetTbody = {
			init: function (msg) {
				this.data = msg;
				this.tr_start = '';
				//执行渲染
				this.rander();

				
			},
			rander: function () {
				var self = this;
				$.each(this.data, function (k, v) {
					self.tr_start += '<tr>';
					self.tr_start += '<td>' + v.id + '</td>';
					self.tr_start += '<td>' + v.lstUpdTime	 + '</td>';
					self.tr_start += '<td>' + v.amount	 + '</td>';
					self.tr_start += '<td>'+ that.flag_name +'</td>';
					//self.tr_start += '<td>'+ v.type +'</td>';
					self.tr_start += '</tr>';
				});

				that.app_list_body_ele.html(self.tr_start);
			}
		}

		SetTbody.init(msg.data);
	},

	/**
	 * 初始化日历组件
	 * @method dateInitEvent
	 */
	dateInitEvent: function () {
		var that = this;
		//开始时间
		this.start_time_ele.off().on('focus', function (e) {
			e.stopPropagation();
			WdatePicker({maxDate:'#F{$dp.$D(\'d4312\')||\'2020-10-01\'}'});
			return false;
		});
		//结束时间
		this.end_time_ele.off().on('focus', function (e) {

			e.stopPropagation();

			WdatePicker({minDate:'#F{$dp.$D(\'d4311\')}',maxDate:new Date().Format('yyyy-MM-dd')});

			return false;

		});
	}
}

/**
 * 马上充值页面
 * @method ImmediatelyRecharge
 */
function ImmediatelyRecharge(opt) {
	if (!(this instanceof ImmediatelyRecharge)) {
		return new ImmediatelyRecharge(opt);
	}

	this.input_ele = opt.input_ele;
	this.next_btn_ele = opt.next_btn_ele;
	this.num_length = 0;
	this.text_info_error_ele = opt.text_info_error_ele;

	//internalOrderNo
	this.internalOrderNo = '';
}

ImmediatelyRecharge.prototype = {
	/**
	 * 初始化
	 * @method init
	 */
	init: function () {
		this.addEvent();
	},	
	/**
	 * 异步请求数据
	 * @method ajax
	 * @param url {String} 请球地址
	 * @param type {String} get || post
	 * @param data {Object} {name:name,age: age}
	 * @param callback {Function} 
	 */

	ajax: function (url, type, data, callback) {
		var that = this;
		type = type || 'get';
		var accessToken = $.cookie('access_token');
		$.ajax({
            url: url,
            type: type,
            data: data,
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer '+ accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            success: function (respData, textStatus, jqXHR) {
            	callback(respData,that);
            }
        });
	},
    /**
     * 清空非小数部份
     * @method clearNoNum
     */
    clearNoNum: function (str) {
    	var is_price_re = /^([1-9][0-9]*)?[0-9]\.[0-9]{2}$/;

    	if (is_price_re.test(str)) {
    		return true;
    	} else {
    		return false;
    	}
    },

    /**
     * 支付结果确认
     * @resultPay
     */
    resultPay: function (msg,that) {
    	//获取这个链接跳转

    	var is_sucess = 'ok';
    	var message = '支付成功';
    	if (msg.status == 400) {
    		is_success = 'cancel';
    		message = msg.message;
    		if ($('#nav_index').text() == '首页') {

	    		is_ok_btn = '确认充值';
	    	} else {
	    		is_ok_btn = 'close';
	    	}
    	} else if (msg.status == 200) {
    		is_sucess = 'ok';
    		message = '支付成功';

    		if ($('#nav_index').text() == '首页') {
    			message = '支付成功';
	    		is_ok_btn = '确认充值';
	    	} else {
	    		is_ok_btn = 'close';
	    		message = 'Payment success';
	    	}

    	}
		var protocol_text = '<div class="bigdata_protocol">' +
		        '<div class="bigdata_protocol_hd">'+
		            '<div i="title" class="bigdata_logo ">'+
		            	''+
		            '</div>'+
		        '</div>'+
		        '<div class="bigdata_protocol_bd">'+
		            '<div class="bigdata_protocol_content">'+

		           	message+

		        '</div>'+
		    '</div>'+
		    '<div class="bigdata_protocol_ft clearfix">'+
		        '<span data-id='+is_sucess+' class="bigdata_protocol_yes">'+is_ok_btn+'</span>'+
		    '</div>'+
		'</div>'; 


		var d = dialog({
            skin: 'bigdata_style',
            title: '',
            content: protocol_text,
            ok: function () {
                var dialog = this;
                // var that = this;
                // this.title('正在提交..');
                setTimeout(function () {
                    dialog.close().remove();
                    //跳转到充值记录
                    window.location.href="recharge_record.html";             

                }, 1000);

            },
            cancel: function () {
                return true;
            }
        });
        d.showModal();
    },

    /**
	 * 弹出层
	 * @method startStartRander
     */
    startStartRander: function (msg,that) {
    	

    	//todo:中英文切换
    	var i81n_message = '请在新打开的页面完成支付，付款完成后再关闭此窗口。';
    	var is_ok_btn = '确认';


    	var is_sucess = 'ok';
    	//var messsage = '请在新打开的页面完成支付，付款完成后再关闭此窗口。';
    	if (msg.status == 400) {
    		is_success = 'cancel';
    		message = msg.message;

    		if ($('#nav_index').text() == '首页') {
    			//message = '请在新打开的页面完成支付，付款完成后再关闭此窗口。';
	    		is_ok_btn = '确认充值';
	    	} else {
	    		is_ok_btn = 'Confirm recharge';
	    		//message = 'Please complete the payment in the newly opened page, and close the window after the payment is completed.';
	    	}
    	} else if (msg.status == 200) {
    		is_sucess = 'ok';
    		if ($('#nav_index').text() == '首页') {
    			message = '请在新打开的页面完成支付，付款完成后再关闭此窗口。';
	    		is_ok_btn = '确认充值';
	    	} else {
	    		is_ok_btn = 'Confirm recharge';
	    		message = 'Please complete the payment in the newly opened page, and close the window after the payment is completed.';
	    	}
    	}


    	that.internalOrderNo = msg.data.internalOrderNo;
    	var rechargeUrl = msg.data.rechargeUrl;



    	//获取这个链接跳转
		var protocol_text = '<div class="bigdata_protocol">' +
		        '<div class="bigdata_protocol_hd">'+
		            '<div i="title" class="bigdata_logo ">'+
		            	''+
		            '</div>'+
		        '</div>'+
		        '<div class="bigdata_protocol_bd">'+
		            '<div class="bigdata_protocol_content">'+

		           	message +

		        '</div>'+
		    '</div>'+
		    '<div class="bigdata_protocol_ft clearfix">'+
		        '<span data-id='+is_sucess+' class="bigdata_protocol_yes">'+is_ok_btn+'</span>'+
		    '</div>'+
		'</div>'; 


		var d = dialog({
            skin: 'bigdata_style',
            title: '',
            content: protocol_text,
            ok: function () {
                var dialog = this;
                // var that = this;
                // this.title('正在提交..');
                setTimeout(function () {
                    dialog.close().remove();

                    var data = {};
                    data.internalOrderNo = that.internalOrderNo;

                    that.ajax('/billing/transaction/queryrechargestatus', 'get', data, that.resultPay);

                }, 2000);

            },
            cancel: function () {
                return true;
            }
        });
        d.showModal();

        //跳转操作
		window.open(rechargeUrl,'_blank');

    },
    /**
	 * 开始充值
	 * @method startPay
     */
    startPay: function () {

    	var that = this;
    	var data = {};

    	//todo: 获取cookie

    	var account_info = $.cookie('account_info');
    	account_info = JSON.parse(account_info);

    	//todo: 获取 accountId
    	data.accountId = account_info.id;
    	//todo: 获取 amount

    	data.amount = that.input_ele.val();

    	//todo: 获取 returnUrl 目前写死的
    	data.returnUrl = 'easemob.com';

    	//todo: 发送ajax 
    	this.ajax('/billing/transaction/startrecharge', 'get', data,this.startStartRander);
			

    },
    /**
     * 填加事件
     * @method addEvent
     */
    addEvent: function () {
    	var that = this;

	
		this.next_btn_ele.off('click').on('click', function (e) {
			e.stopPropagation();

			var is_price = that.clearNoNum(that.input_ele.val());

			if (is_price) {
				//todo:输入边框边成绿色
				that.input_ele.css({'border-color':'green'});
				//todo:提示信息变绿
				that.text_info_error_ele.css({'color': 'green'});


				//todo:发ajax请求
				//todo:弹出层

				that.startPay();
			} else {
				//todo:输入边框变成红色
				that.input_ele.css({'border-color':'red'});
				//todo:提示信息变红
				that.text_info_error_ele.css({'color': 'red'});
			}

			return false;
		});
    }
};

/**
 * 入口代码
 */
$(document).ready(function () {
	if (window.location.pathname == '/accout_overview.html') {
		var charts_pay = new ChartsPay({
			account_ele: $('.account_pay'),
			chart_linear_ele: $('#chart_linear')
		});
		charts_pay.init();
	} else if (window.location.pathname == '/recharge_record.html') {
		var recharge_record = new RechargeRecord({
			start_time_ele: $('.starttime'),
			end_time_ele: $('.endtime'),
			select_ele: $('.seachBg_hd a'),
			app_list_body_ele: $('.table_data'),
			flag: 'recharge',
			getUrl: '/billing/transaction/recharges'
		});
		recharge_record.init();
	} else if (window.location.pathname == '/records_of_consumption.html') {

		var recharge_of_consumption = new RechargeOfRecord({
			start_time_ele: $('.starttime'),
			end_time_ele: $('.endtime'),
			select_ele: $('.seachBg_hd a'),
			app_list_body_ele: $('.table_data'),
			flag: 'consumption',
			getUrl: '/billing/transaction/transactions'

		});
		recharge_of_consumption.init();
	} else if (window.location.pathname == '/immediately_recharge.html') {
		var immediately_recharge = new ImmediatelyRecharge({
			input_ele: $('.input_price'),
			next_btn_ele: $('.imm_recharge_box .ft a'),
			text_info_error_ele: $('.imm_recharge_box .bd .item .text_info')
		});

		immediately_recharge.init();
	}

});
