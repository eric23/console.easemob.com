!(function () {

    var __modules__ = {};

    function require (id) {
        var mod = __modules__[id];
        var exports = 'exports';

        if (typeof mod === 'object') {
            return mod;
        }

        if (!mod[exports]) {
            mod[exports] = {};
            mod[exports] = mod.call(mod[exports], require, mod[exports], mod) || mod[exports];
        }

        return mod[exports];
    }

    function define (path, fn) {
        __modules__[path] = fn;
    }

    define('jquery', function () {
        return jQuery;
    });




    /*!
     * popupjs
     * Date: 2014-01-15
     * https://github.com/aui/popupjs
     * (c) 2009-2013 TangBin, http://www.planeArt.cn
     *
     * This is licensed under the GNU LGPL, version 2.1 or later.
     * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
     */
    define("popup", function (require) {

        var $ = require("jquery");

        var _count = 0;
        var _isIE6 = !('minWidth' in $('html')[0].style);
        var _isFixed = !_isIE6;


        function Popup () {

            this.destroyed = false;


            this.__popup = $('<div />')
                .attr({
                    tabindex: '-1'
                })
                .css({
                    display: 'none',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 'auto',
                    right: 'auto',
                    margin: 0,
                    padding: 0,
                    outline: 0,
                    border: '0 none',
                    background: 'transparent'
                })
                .html(this.innerHTML)
                .appendTo('body');


            this.__backdrop = $('<div />');


            // ä½¿ç”¨ HTMLElement ä½œä¸ºå¤–éƒ¨æŽ¥å£ä½¿ç”¨ï¼Œè€Œä¸æ˜¯ jquery å¯¹è±¡
            // ç»Ÿä¸€çš„æŽ¥å£åˆ©äºŽæœªæ¥ Popup ç§»æ¤åˆ°å…¶ä»– DOM åº“ä¸­
            this.node = this.__popup[0];
            this.backdrop = this.__backdrop[0];

            _count ++;
        }


        $.extend(Popup.prototype, {

            /**
             * åˆå§‹åŒ–å®Œæ¯•äº‹ä»¶ï¼Œåœ¨ show()ã€showModal() æ‰§è¡Œ
             * @name Popup.prototype.onshow
             * @event
             */

            /**
             * å…³é—­äº‹ä»¶ï¼Œåœ¨ close() æ‰§è¡Œ
             * @name Popup.prototype.onclose
             * @event
             */

            /**
             * é”€æ¯å‰äº‹ä»¶ï¼Œåœ¨ remove() å‰æ‰§è¡Œ
             * @name Popup.prototype.onbeforeremove
             * @event
             */

            /**
             * é”€æ¯äº‹ä»¶ï¼Œåœ¨ remove() æ‰§è¡Œ
             * @name Popup.prototype.onremove
             * @event
             */

            /**
             * é‡ç½®äº‹ä»¶ï¼Œåœ¨ reset() æ‰§è¡Œ
             * @name Popup.prototype.onreset
             * @event
             */

            /**
             * ç„¦ç‚¹äº‹ä»¶ï¼Œåœ¨ foucs() æ‰§è¡Œ
             * @name Popup.prototype.onfocus
             * @event
             */

            /**
             * å¤±ç„¦äº‹ä»¶ï¼Œåœ¨ blur() æ‰§è¡Œ
             * @name Popup.prototype.onblur
             * @event
             */

            /** æµ®å±‚ DOM ç´ èŠ‚ç‚¹ */
            node: null,

            /** é®ç½© DOM èŠ‚ç‚¹ */
            backdrop: null,

            /** æ˜¯å¦å¼€å¯å›ºå®šå®šä½ */
            fixed: false,

            /** åˆ¤æ–­å¯¹è¯æ¡†æ˜¯å¦åˆ é™¤ */
            destroyed: true,

            /** åˆ¤æ–­å¯¹è¯æ¡†æ˜¯å¦æ˜¾ç¤º */
            open: false,

            /** close è¿”å›žå€¼ */
            returnValue: '',

            /** æ˜¯å¦è‡ªåŠ¨èšç„¦ */
            autofocus: true,

            /** å¯¹é½æ–¹å¼ */
            align: 'bottom left',

            /** è®¾ç½®é®ç½©èƒŒæ™¯é¢œè‰² */
            backdropBackground: '#000',

            /** è®¾ç½®é®ç½©é€æ˜Žåº¦ */
            backdropOpacity: 0.7,

            /** å†…éƒ¨çš„ HTML å­—ç¬¦ä¸² */
            innerHTML: '',

            /** ç±»å */
            className: 'ui-popup',

            /**
             * æ˜¾ç¤ºæµ®å±‚
             * @param   {HTMLElement, Event}  æŒ‡å®šä½ç½®ï¼ˆå¯é€‰ï¼‰
             */
            show: function (anchor) {

                if (this.destroyed) {
                    return this;
                }

                var that = this;
                var popup = this.__popup;

                this.__activeElement = this.__getActive();

                this.open = true;
                this.follow = anchor || this.follow;


                if (!this.__ready) {

                    popup.addClass(this.className);

                    if (this.modal) {
                        this.__lock();
                    }


                    if (!popup.html()) {
                        popup.html(this.innerHTML);
                    }


                    if (!_isIE6) {
                        $(window).on('resize', this.__onresize = function () {
                            that.reset();
                        });
                    }


                    this.__ready = true;
                }


                popup
                    .addClass(this.className + '-show')
                    .attr('role', this.modal ? 'alertdialog' : 'dialog')
                    .css('position', this.fixed ? 'fixed' : 'absolute')
                    .show();

                this.__backdrop.show();




                this.reset().focus();
                this.__dispatchEvent('show');

                return this;
            },


            /** æ˜¾ç¤ºæ¨¡æ€æµ®å±‚ã€‚å‚æ•°å‚è§ show() */
            showModal: function () {
                this.modal = true;
                return this.show.apply(this, arguments);
            },


            /** å…³é—­æµ®å±‚ */
            close: function (result) {

                if (!this.destroyed && this.open) {

                    if (result !== undefined) {
                        this.returnValue = result;
                    }

                    this.__popup.hide().removeClass(this.className + '-show');
                    this.__backdrop.hide();
                    this.open = false;
                    this.blur();
                    this.__dispatchEvent('close');
                }

                return this;
            },


            /** é”€æ¯æµ®å±‚ */
            remove: function () {

                if (this.destroyed) {
                    return this;
                }

                this.__dispatchEvent('beforeremove');

                if (Popup.current === this) {
                    Popup.current = null;
                }

                this.__unlock();
                this.__popup.remove();
                this.__backdrop.remove();


                // æ¢å¤ç„¦ç‚¹ï¼Œç…§é¡¾é”®ç›˜æ“ä½œçš„ç”¨æˆ·
                this.blur();

                if (!_isIE6) {
                    $(window).off('resize', this.__onresize);
                }

                this.__dispatchEvent('remove');

                for (var i in this) {
                    delete this[i];
                }

                return this;
            },


            /** æ‰‹åŠ¨åˆ·æ–°ä½ç½® */
            reset: function () {

                var elem = this.follow;

                if (elem) {
                    this.__follow(elem);
                } else {
                    this.__center();
                }

                this.__dispatchEvent('reset');

                return this;
            },


            /** è®©æµ®å±‚èŽ·å–ç„¦ç‚¹ */
            focus: function () {

                var node = this.node;
                var current = Popup.current;

                if (current && current !== this) {
                    current.blur(false);
                }

                // æ£€æŸ¥ç„¦ç‚¹æ˜¯å¦åœ¨æµ®å±‚é‡Œé¢
                if (!$.contains(node, this.__getActive())) {
                    var autofocus = this.__popup.find('[autofocus]')[0];

                    if (!this._autofocus && autofocus) {
                        this._autofocus = true;
                    } else {
                        autofocus = node;
                    }

                    this.__focus(autofocus);
                }

                Popup.current = this;
                this.__popup.addClass(this.className + '-focus');
                this.__zIndex();
                this.__dispatchEvent('focus');

                return this;
            },


            /** è®©æµ®å±‚å¤±åŽ»ç„¦ç‚¹ã€‚å°†ç„¦ç‚¹é€€è¿˜ç»™ä¹‹å‰çš„å…ƒç´ ï¼Œç…§é¡¾è§†åŠ›éšœç¢ç”¨æˆ· */
            blur: function () {

                var activeElement = this.__activeElement;
                var isBlur = arguments[0];


                if (isBlur !== false) {
                    this.__focus(activeElement);
                }

                this._autofocus = false;
                this.__popup.removeClass(this.className + '-focus');
                this.__dispatchEvent('blur');

                return this;
            },


            /**
             * æ·»åŠ äº‹ä»¶
             * @param   {String}    äº‹ä»¶ç±»åž‹
             * @param   {Function}  ç›‘å¬å‡½æ•°
             */
            addEventListener: function (type, callback) {
                this.__getEventListener(type).push(callback);
                return this;
            },


            /**
             * åˆ é™¤äº‹ä»¶
             * @param   {String}    äº‹ä»¶ç±»åž‹
             * @param   {Function}  ç›‘å¬å‡½æ•°
             */
            removeEventListener: function (type, callback) {
                var listeners = this.__getEventListener(type);
                for (var i = 0; i < listeners.length; i ++) {
                    if (callback === listeners[i]) {
                        listeners.splice(i--, 1);
                    }
                }
                return this;
            },


            // èŽ·å–äº‹ä»¶ç¼“å­˜
            __getEventListener: function (type) {
                var listener = this.__listener;
                if (!listener) {
                    listener = this.__listener = {};
                }
                if (!listener[type]) {
                    listener[type] = [];
                }
                return listener[type];
            },


            // æ´¾å‘äº‹ä»¶
            __dispatchEvent: function (type) {
                var listeners = this.__getEventListener(type);

                if (this['on' + type]) {
                    this['on' + type]();
                }

                for (var i = 0; i < listeners.length; i ++) {
                    listeners[i].call(this);
                }
            },


            // å¯¹å…ƒç´ å®‰å…¨èšç„¦
            __focus: function (elem) {
                // é˜²æ­¢ iframe è·¨åŸŸæ— æƒé™æŠ¥é”™
                // é˜²æ­¢ IE ä¸å¯è§å…ƒç´ æŠ¥é”™
                try {
                    // ie11 bug: iframe é¡µé¢ç‚¹å‡»ä¼šè·³åˆ°é¡¶éƒ¨
                    if (this.autofocus && !/^iframe$/i.test(elem.nodeName)) {
                        elem.focus();
                    }
                } catch (e) {}
            },


            // èŽ·å–å½“å‰ç„¦ç‚¹çš„å…ƒç´
            __getActive: function () {
                try {// try: ie8~9, iframe #26
                    var activeElement = document.activeElement;
                    var contentDocument = activeElement.contentDocument;
                    var elem = contentDocument && contentDocument.activeElement || activeElement;
                    return elem;
                } catch (e) {}
            },


            // ç½®é¡¶æµ®å±‚
            __zIndex: function () {

                var index = Popup.zIndex ++;

                // è®¾ç½®å åŠ é«˜åº¦
                this.__popup.css('zIndex', index);
                this.__backdrop.css('zIndex', index - 1);
                this.zIndex = index;
            },


            // å±…ä¸­æµ®å±‚
            __center: function () {

                var popup = this.__popup;
                var $window = $(window);
                var $document = $(document);
                var fixed = this.fixed;
                var dl = fixed ? 0 : $document.scrollLeft();
                var dt = fixed ? 0 : $document.scrollTop();
                var ww = $window.width();
                var wh = $window.height();
                var ow = popup.width();
                var oh = popup.height();
                var left = (ww - ow) / 2 + dl;
                var top = (wh - oh) * 382 / 1000 + dt;// é»„é‡‘æ¯”ä¾‹
                var style = popup[0].style;


                style.left = Math.max(parseInt(left), dl) + 'px';
                style.top = Math.max(parseInt(top), dt) + 'px';
            },


            // æŒ‡å®šä½ç½® @param    {HTMLElement, Event}  anchor
            __follow: function (anchor) {

                var $elem = anchor.parentNode && $(anchor);
                var popup = this.__popup;


                if (this.__followSkin) {
                    popup.removeClass(this.__followSkin);
                }


                // éšè—å…ƒç´ ä¸å¯ç”¨
                if ($elem) {
                    var o = $elem.offset();
                    if (o.left * o.top < 0) {
                        return this.__center();
                    }
                }

                var that = this;
                var fixed = this.fixed;

                var $window = $(window);
                var $document = $(document);
                var winWidth = $window.width();
                var winHeight = $window.height();
                var docLeft =  $document.scrollLeft();
                var docTop = $document.scrollTop();


                var popupWidth = popup.width();
                var popupHeight = popup.height();
                var width = $elem ? $elem.outerWidth() : 0;
                var height = $elem ? $elem.outerHeight() : 0;
                var offset = this.__offset(anchor);
                var x = offset.left;
                var y = offset.top;
                var left =  fixed ? x - docLeft : x;
                var top = fixed ? y - docTop : y;


                var minLeft = fixed ? 0 : docLeft;
                var minTop = fixed ? 0 : docTop;
                var maxLeft = minLeft + winWidth - popupWidth;
                var maxTop = minTop + winHeight - popupHeight;


                var css = {};
                var align = this.align.split(' ');
                var className = this.className + '-';
                var reverse = {top: 'bottom', bottom: 'top', left: 'right', right: 'left'};
                var name = {top: 'top', bottom: 'top', left: 'left', right: 'left'};


                var temp = [{
                    top: top - popupHeight,
                    bottom: top + height,
                    left: left - popupWidth,
                    right: left + width
                }, {
                    top: top,
                    bottom: top - popupHeight + height,
                    left: left,
                    right: left - popupWidth + width
                }];


                var center = {
                    left: left + width / 2 - popupWidth / 2,
                    top: top + height / 2 - popupHeight / 2
                };


                var range = {
                    left: [minLeft, maxLeft],
                    top: [minTop, maxTop]
                };


                // è¶…å‡ºå¯è§†åŒºåŸŸé‡æ–°é€‚åº”ä½ç½®
                $.each(align, function (i, val) {

                    // è¶…å‡ºå³æˆ–ä¸‹è¾¹ç•Œï¼šä½¿ç”¨å·¦æˆ–è€…ä¸Šè¾¹å¯¹é½
                    if (temp[i][val] > range[name[val]][1]) {
                        val = align[i] = reverse[val];
                    }

                    // è¶…å‡ºå·¦æˆ–å³è¾¹ç•Œï¼šä½¿ç”¨å³æˆ–è€…ä¸‹è¾¹å¯¹é½
                    if (temp[i][val] < range[name[val]][0]) {
                        align[i] = reverse[val];
                    }

                });


                // ä¸€ä¸ªå‚æ•°çš„æƒ…å†µ
                if (!align[1]) {
                    name[align[1]] = name[align[0]] === 'left' ? 'top' : 'left';
                    temp[1][align[1]] = center[name[align[1]]];
                }

                className += align.join('-');

                that.__followSkin = className;


                if ($elem) {
                    popup.addClass(className);
                }


                css[name[align[0]]] = parseInt(temp[0][align[0]]);
                css[name[align[1]]] = parseInt(temp[1][align[1]]);
                popup.css(css);

            },


            // èŽ·å–å…ƒç´ ç›¸å¯¹äºŽé¡µé¢çš„ä½ç½®ï¼ˆåŒ…æ‹¬iframeå†…çš„å…ƒç´ ï¼‰
            // æš‚æ—¶ä¸æ”¯æŒä¸¤å±‚ä»¥ä¸Šçš„ iframe å¥—åµŒ
            __offset: function (anchor) {

                var isNode = anchor.parentNode;
                var offset = isNode ? $(anchor).offset() : {
                    left: anchor.pageX,
                    top: anchor.pageY
                };


                anchor = isNode ? anchor : anchor.target;
                var ownerDocument = anchor.ownerDocument;
                var defaultView = ownerDocument.defaultView || ownerDocument.parentWindow;

                if (defaultView == window) {// IE <= 8 åªèƒ½ä½¿ç”¨ä¸¤ä¸ªç­‰äºŽå·
                    return offset;
                }

                // {Element Ifarme}
                var frameElement = defaultView.frameElement;
                var $ownerDocument = $(ownerDocument);
                var docLeft =  $ownerDocument.scrollLeft();
                var docTop = $ownerDocument.scrollTop();
                var frameOffset = $(frameElement).offset();
                var frameLeft = frameOffset.left;
                var frameTop = frameOffset.top;

                return {
                    left: offset.left + frameLeft - docLeft,
                    top: offset.top + frameTop - docTop
                };
            },


            // è®¾ç½®å±é”é®ç½©
            __lock: function () {

                var that = this;
                var popup = this.__popup;
                var backdrop = this.__backdrop;
                var backdropCss = {
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    userSelect: 'none',
                    opacity: 0,
                    background: this.backdropBackground
                };


                popup.addClass(this.className + '-modal');


                // é¿å…é®ç½©ä¸èƒ½ç›–ä½ä¸Šä¸€æ¬¡çš„å¯¹è¯æ¡†
                // å¦‚æžœå½“å‰å¯¹è¯æ¡†æ˜¯ä¸Šä¸€ä¸ªå¯¹è¯æ¡†åˆ›å»ºï¼Œç‚¹å‡»çš„é‚£ä¸€çž¬é—´å®ƒä¼šå¢žé•¿ zIndex å€¼
                Popup.zIndex = Popup.zIndex + 2;
                this.__zIndex();


                if (!_isFixed) {
                    $.extend(backdropCss, {
                        position: 'absolute',
                        width: $(window).width() + 'px',
                        height: $(document).height() + 'px'
                    });
                }


                backdrop
                    .css(backdropCss)
                    .animate({opacity: this.backdropOpacity}, 150)
                    .insertAfter(popup)
                    // é”ä½æ¨¡æ€å¯¹è¯æ¡†çš„ tab ç®€å•åŠžæ³•
                    // ç”šè‡³å¯ä»¥é¿å…ç„¦ç‚¹è½å…¥å¯¹è¯æ¡†å¤–çš„ iframe ä¸­
                    .attr({tabindex: '0'})
                    .on('focus', function () {
                        that.focus();
                    });

            },


            // å¸è½½å±é”é®ç½©
            __unlock: function () {

                if (this.modal) {
                    this.__popup.removeClass(this.className + '-modal');
                    this.__backdrop.remove();
                    delete this.modal;
                }
            }

        });


        /** å½“å‰å åŠ é«˜åº¦ */
        Popup.zIndex = 1024;


        /** é¡¶å±‚æµ®å±‚çš„å®žä¾‹ */
        Popup.current = null;


        return Popup;

    });

    /*!
     * artDialog - é»˜è®¤é…ç½®
     */
    define("dialog-config", {

        /* -----å·²æ³¨é‡Šçš„é…ç½®ç»§æ‰¿è‡ª popup.jsï¼Œä»å¯ä»¥å†è¿™é‡Œé‡æ–°å®šä¹‰å®ƒ----- */

        // å¯¹é½æ–¹å¼
        //align: 'bottom left',

        // æ˜¯å¦å›ºå®šå®šä½
        //fixed: false,

        // å¯¹è¯æ¡†å åŠ é«˜åº¦å€¼(é‡è¦ï¼šæ­¤å€¼ä¸èƒ½è¶…è¿‡æµè§ˆå™¨æœ€å¤§é™åˆ¶)
        //zIndex: 1024,

        // è®¾ç½®é®ç½©èƒŒæ™¯é¢œè‰²
        //backdropBackground: '#000',

        // è®¾ç½®é®ç½©é€æ˜Žåº¦
        //backdropOpacity: 0.7,

        // æ¶ˆæ¯å†…å®¹
        content: '<span class="ui-dialog-loading">Loading..</span>',

        // æ ‡é¢˜
        title: '',

        // å¯¹è¯æ¡†çŠ¶æ€æ åŒºåŸŸ HTML ä»£ç 
        statusbar: '',

        // è‡ªå®šä¹‰æŒ‰é’®
        button: null,

        // ç¡®å®šæŒ‰é’®å›žè°ƒå‡½æ•°
        ok: null,

        // å–æ¶ˆæŒ‰é’®å›žè°ƒå‡½æ•°
        cancel: null,

        // ç¡®å®šæŒ‰é’®æ–‡æœ¬
        okValue: 'ok',

        // å–æ¶ˆæŒ‰é’®æ–‡æœ¬
        cancelValue: 'cancel',

        cancelDisplay: true,

        // å†…å®¹å®½åº¦
        width: '',

        // å†…å®¹é«˜åº¦
        height: '',

        // å†…å®¹ä¸Žè¾¹ç•Œå¡«å……è·ç¦»
        padding: '',

        // å¯¹è¯æ¡†è‡ªå®šä¹‰ className
        skin: '',

        // æ˜¯å¦æ”¯æŒå¿«æ·å…³é—­ï¼ˆç‚¹å‡»é®ç½©å±‚è‡ªåŠ¨å…³é—­ï¼‰
        quickClose: false,

        // css æ–‡ä»¶è·¯å¾„ï¼Œç•™ç©ºåˆ™ä¸ä¼šä½¿ç”¨ js è‡ªåŠ¨åŠ è½½æ ·å¼
        // æ³¨æ„ï¼šcss åªå…è®¸åŠ è½½ä¸€ä¸ª
        cssUri: '../css/ui-dialog.css',

        // æ¨¡æ¿ï¼ˆä½¿ç”¨ table è§£å†³ IE7 å®½åº¦è‡ªé€‚åº”çš„ BUGï¼‰
        // js ä½¿ç”¨ i="***" å±žæ€§è¯†åˆ«ç»“æž„ï¼Œå…¶ä½™çš„å‡å¯è‡ªå®šä¹‰
        innerHTML:
        '<div i="dialog" class="ui-dialog">'
        +       '<div class="ui-dialog-arrow-a"></div>'
        +       '<div class="ui-dialog-arrow-b"></div>'
        +       '<table class="ui-dialog-grid">'
        +           '<tr>'
        +               '<td i="header" class="ui-dialog-header">'
        +                   '<button i="close" class="ui-dialog-close">&#215;</button>'
        +                   '<div i="title" class="ui-dialog-title"></div>'
        +               '</td>'
        +           '</tr>'
        +           '<tr>'
        +               '<td i="body" class="ui-dialog-body">'
        +                   '<div i="content" class="ui-dialog-content"></div>'
        +               '</td>'
        +           '</tr>'
        +           '<tr>'
        +               '<td i="footer" class="ui-dialog-footer">'
        +                   '<div i="statusbar" class="ui-dialog-statusbar"></div>'
        +                   '<div i="button" class="ui-dialog-button"></div>'
        +               '</td>'
        +           '</tr>'
        +       '</table>'
        +'</div>'

    });

    /*!
     * artDialog
     * Date: 2014-06-29
     * https://github.com/aui/artDialog
     * (c) 2009-2013 TangBin, http://www.planeArt.cn
     *
     * This is licensed under the GNU LGPL, version 2.1 or later.
     * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
     */
    define("dialog", function (require) {

        var $ = require("jquery");
        var Popup = require("popup");
        var defaults = require("dialog-config");
        var css = defaults.cssUri;


// css loader: RequireJS & SeaJS
        if (css) {
            var fn = require[require.toUrl ? 'toUrl' : 'resolve'];
            if (fn) {
                css = fn(css);
                css = '<link rel="stylesheet" href="' + css + '" />';
                if ($('base')[0]) {
                    $('base').before(css);
                } else {
                    $('head').append(css);
                }
            }
        }


        var _count = 0;
        var _expando = new Date() - 0; // Data.now()
        var _isIE6 = !('minWidth' in $('html')[0].style);
        var _isMobile = 'createTouch' in document && !('onmousemove' in document)
            || /(iPhone|iPad|iPod)/i.test(navigator.userAgent);
        var _isFixed = !_isIE6 && !_isMobile;


        var artDialog = function (options, ok, cancel) {

            var originalOptions = options = options || {};


            if (typeof options === 'string' || options.nodeType === 1) {

                options = {content: options, fixed: !_isMobile};
            }


            options = $.extend(true, {}, artDialog.defaults, options);
            options._ = originalOptions;

            var id = options.id = options.id || _expando + _count;
            var api = artDialog.get(id);


            // å¦‚æžœå­˜åœ¨åŒåçš„å¯¹è¯æ¡†å¯¹è±¡ï¼Œåˆ™ç›´æŽ¥è¿”å›ž
            if (api) {
                return api.focus();
            }


            // ç›®å‰ä¸»æµç§»åŠ¨è®¾å¤‡å¯¹fixedæ”¯æŒä¸å¥½ï¼Œç¦ç”¨æ­¤ç‰¹æ€§
            if (!_isFixed) {
                options.fixed = false;
            }


            // å¿«æ·å…³é—­æ”¯æŒï¼šç‚¹å‡»å¯¹è¯æ¡†å¤–å¿«é€Ÿå…³é—­å¯¹è¯æ¡†
            if (options.quickClose) {
                options.modal = true;
                if (!originalOptions.backdropOpacity) {
                    options.backdropOpacity = 0;
                }
            }


            // æŒ‰é’®ç»„
            if (!$.isArray(options.button)) {
                options.button = [];
            }


            // å–æ¶ˆæŒ‰é’®
            if (cancel !== undefined) {
                options.cancel = cancel;
            }

            if (options.cancel) {
                options.button.push({
                    id: 'cancel',
                    value: options.cancelValue,
                    callback: options.cancel,
                    display: options.cancelDisplay
                });
            }


            // ç¡®å®šæŒ‰é’®
            if (ok !== undefined) {
                options.ok = ok;
            }

            if (options.ok) {
                options.button.push({
                    id: 'ok',
                    value: options.okValue,
                    callback: options.ok,
                    autofocus: true
                });
            }


            return artDialog.list[id] = new artDialog.create(options);
        };

        var popup = function () {};
        popup.prototype = Popup.prototype;
        var prototype = artDialog.prototype = new popup();

        artDialog.create = function (options) {
            var that = this;

            $.extend(this, new Popup());

            var $popup = $(this.node).html(options.innerHTML);

            this.options = options;
            this._popup = $popup;


            $.each(options, function (name, value) {
                if (typeof that[name] === 'function') {
                    that[name](value);
                } else {
                    that[name] = value;
                }
            });


            // æ›´æ–° zIndex å…¨å±€é…ç½®
            if (options.zIndex) {
                Popup.zIndex = options.zIndex;
            }


            // è®¾ç½® ARIA ä¿¡æ¯
            $popup.attr({
                'aria-labelledby': this._$('title')
                    .attr('id', 'title:' + this.id).attr('id'),
                'aria-describedby': this._$('content')
                    .attr('id', 'content:' + this.id).attr('id')
            });


            // å…³é—­æŒ‰é’®
            this._$('close')
                .css('display', this.cancel === false ? 'none' : '')
                .attr('title', this.cancelValue)
                .on('click', function (event) {
                    that._trigger('cancel');
                    event.preventDefault();
                });


            // æ·»åŠ è§†è§‰å‚æ•°
            this._$('dialog').addClass(this.skin);
            this._$('body').css('padding', this.padding);


            // æŒ‰é’®ç»„ç‚¹å‡»
            $popup.on('click', '[data-id]', function (event) {
                var $this = $(this);
                if (!$this.attr('disabled')) {// IE BUG
                    that._trigger($this.data('id'));
                }

                event.preventDefault();
            });


            // ç‚¹å‡»é®ç½©è‡ªåŠ¨å…³é—­å¯¹è¯æ¡†
            if (options.quickClose) {
                $(this.backdrop).on(
                    'onmousedown' in document ? 'mousedown' : 'click',
                    function () {
                        that._trigger('cancel');
                    });
            }


            // ESC å¿«æ·é”®å…³é—­å¯¹è¯æ¡†
            this._esc = function (event) {
                var target = event.target;
                var nodeName = target.nodeName;
                var rinput = /^input|textarea$/i;
                var isTop = Popup.current === that;
                var keyCode = event.keyCode;

                // é¿å…è¾“å…¥çŠ¶æ€ä¸­ ESC è¯¯æ“ä½œå…³é—­
                if (!isTop || rinput.test(nodeName) && target.type !== 'button') {
                    return;
                }

                if (keyCode === 27) {
                    that._trigger('cancel');
                }
            };

            $(document).on('keydown', this._esc);
            this.addEventListener('remove', function () {
                $(document).off('keydown', this._esc);
                delete artDialog.list[this.id];
            });


            _count ++;

            artDialog.oncreate(this);

            return this;
        };


        artDialog.create.prototype = prototype;



        $.extend(prototype, {

            /**
             * æ˜¾ç¤ºå¯¹è¯æ¡†
             * @name artDialog.prototype.show
             * @param   {HTMLElement Object, Event Object}  æŒ‡å®šä½ç½®ï¼ˆå¯é€‰ï¼‰
             */

            /**
             * æ˜¾ç¤ºå¯¹è¯æ¡†ï¼ˆæ¨¡æ€ï¼‰
             * @name artDialog.prototype.showModal
             * @param   {HTMLElement Object, Event Object}  æŒ‡å®šä½ç½®ï¼ˆå¯é€‰ï¼‰
             */

            /**
             * å…³é—­å¯¹è¯æ¡†
             * @name artDialog.prototype.close
             * @param   {String, Number}    è¿”å›žå€¼ï¼Œå¯è¢« onclose äº‹ä»¶æ”¶å–ï¼ˆå¯é€‰ï¼‰
             */

            /**
             * é”€æ¯å¯¹è¯æ¡†
             * @name artDialog.prototype.remove
             */

            /**
             * é‡ç½®å¯¹è¯æ¡†ä½ç½®
             * @name artDialog.prototype.reset
             */

            /**
             * è®©å¯¹è¯æ¡†èšç„¦ï¼ˆåŒæ—¶ç½®é¡¶ï¼‰
             * @name artDialog.prototype.focus
             */

            /**
             * è®©å¯¹è¯æ¡†å¤±ç„¦ï¼ˆåŒæ—¶ç½®é¡¶ï¼‰
             * @name artDialog.prototype.blur
             */

            /**
             * æ·»åŠ äº‹ä»¶
             * @param   {String}    äº‹ä»¶ç±»åž‹
             * @param   {Function}  ç›‘å¬å‡½æ•°
             * @name artDialog.prototype.addEventListener
             */

            /**
             * åˆ é™¤äº‹ä»¶
             * @param   {String}    äº‹ä»¶ç±»åž‹
             * @param   {Function}  ç›‘å¬å‡½æ•°
             * @name artDialog.prototype.removeEventListener
             */

            /**
             * å¯¹è¯æ¡†æ˜¾ç¤ºäº‹ä»¶ï¼Œåœ¨ show()ã€showModal() æ‰§è¡Œ
             * @name artDialog.prototype.onshow
             * @event
             */

            /**
             * å…³é—­äº‹ä»¶ï¼Œåœ¨ close() æ‰§è¡Œ
             * @name artDialog.prototype.onclose
             * @event
             */

            /**
             * é”€æ¯å‰äº‹ä»¶ï¼Œåœ¨ remove() å‰æ‰§è¡Œ
             * @name artDialog.prototype.onbeforeremove
             * @event
             */

            /**
             * é”€æ¯äº‹ä»¶ï¼Œåœ¨ remove() æ‰§è¡Œ
             * @name artDialog.prototype.onremove
             * @event
             */

            /**
             * é‡ç½®äº‹ä»¶ï¼Œåœ¨ reset() æ‰§è¡Œ
             * @name artDialog.prototype.onreset
             * @event
             */

            /**
             * ç„¦ç‚¹äº‹ä»¶ï¼Œåœ¨ foucs() æ‰§è¡Œ
             * @name artDialog.prototype.onfocus
             * @event
             */

            /**
             * å¤±ç„¦äº‹ä»¶ï¼Œåœ¨ blur() æ‰§è¡Œ
             * @name artDialog.prototype.onblur
             * @event
             */


            /**
             * è®¾ç½®å†…å®¹
             * @param    {String, HTMLElement}   å†…å®¹
             */
            content: function (html) {

                this._$('content').empty('')
                    [typeof html === 'object' ? 'append' : 'html'](html);

                return this.reset();
            },


            /**
             * è®¾ç½®æ ‡é¢˜
             * @param    {String}   æ ‡é¢˜å†…å®¹
             */
            title: function (text) {
                this._$('title').text(text);
                this._$('header')[text ? 'show' : 'hide']();
                return this;
            },


            /** è®¾ç½®å®½åº¦ */
            width: function (value) {
                this._$('content').css('width', value);
                return this.reset();
            },


            /** è®¾ç½®é«˜åº¦ */
            height: function (value) {
                this._$('content').css('height', value);
                return this.reset();
            },


            /**
             * è®¾ç½®æŒ‰é’®ç»„
             * @param   {Array, String}
             */
            button: function (args) {
                args = args || [];
                var that = this;
                var html = '';
                var number = 0;
                this.callbacks = {};



                if (typeof args === 'string') {
                    html = args;
                } else {
                    $.each(args, function (i, val) {

                        val.id = val.id || val.value;
                        that.callbacks[val.id] = val.callback;

                        var style = '';

                        if (val.display === false) {
                            style = ' style="display:none"';
                        } else {
                            number ++;
                        }

                        html +=
                            '<button'
                            + ' type="button"'
                            + ' data-id="' + val.id + '"'
                            + style
                            + (val.disabled ? ' disabled' : '')
                            + (val.autofocus ? ' autofocus class="ui-dialog-autofocus"' : '')
                            + '>'
                            +   val.value
                            + '</button>';

                    });
                }

                this._$('footer')[number ? 'show' : 'hide']();
                this._$('button').html(html);

                return this;
            },


            statusbar: function (html) {
                this._$('statusbar')
                    .html(html)[html ? 'show' : 'hide']();

                return this;
            },


            _$: function (i) {
                return this._popup.find('[i=' + i + ']');
            },


            // è§¦å‘æŒ‰é’®å›žè°ƒå‡½æ•°
            _trigger: function (id) {

                var fn = this.callbacks[id];

                return typeof fn !== 'function' || fn.call(this) !== false ?
                    this.close().remove() : this;
            }

        });



        artDialog.oncreate = $.noop;



        /** æœ€é¡¶å±‚çš„å¯¹è¯æ¡†API */
        artDialog.getCurrent = function () {
            return Popup.current;
        };



        /**
         * æ ¹æ® ID èŽ·å–æŸå¯¹è¯æ¡† API
         * @param    {String}    å¯¹è¯æ¡† ID
         * @return   {Object}    å¯¹è¯æ¡† API (å®žä¾‹)
         */
        artDialog.get = function (id) {
            return id === undefined
                ? artDialog.list
                : artDialog.list[id];
        };

        artDialog.list = {};



        /**
         * é»˜è®¤é…ç½®
         */
        artDialog.defaults = defaults;



        return artDialog;

    });




    /*!
     * drag.js
     * Date: 2013-12-06
     * (c) 2009-2013 TangBin, http://www.planeArt.cn
     *
     * This is licensed under the GNU LGPL, version 2.1 or later.
     * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
     */
    define("drag", function (require) {

        var $ = require("jquery");


        var $window = $(window);
        var $document = $(document);
        var isTouch = 'createTouch' in document;
        var html = document.documentElement;
        var isIE6 = !('minWidth' in html.style);
        var isLosecapture = !isIE6 && 'onlosecapture' in html;
        var isSetCapture = 'setCapture' in html;


        var types = {
            start: isTouch ? 'touchstart' : 'mousedown',
            over: isTouch ? 'touchmove' : 'mousemove',
            end: isTouch ? 'touchend' : 'mouseup'
        };


        var getEvent = isTouch ? function (event) {
            if (!event.touches) {
                event = event.originalEvent.touches.item(0);
            }
            return event;
        } : function (event) {
            return event;
        };


        var DragEvent = function () {
            this.start = $.proxy(this.start, this);
            this.over = $.proxy(this.over, this);
            this.end = $.proxy(this.end, this);
            this.onstart = this.onover = this.onend = $.noop;
        };

        DragEvent.types = types;

        DragEvent.prototype = {

            start: function (event) {
                event = this.startFix(event);

                $document
                    .on(types.over, this.over)
                    .on(types.end, this.end);

                this.onstart(event);
                return false;
            },

            over: function (event) {
                event = this.overFix(event);
                this.onover(event);
                return false;
            },

            end: function (event) {
                event = this.endFix(event);

                $document
                    .off(types.over, this.over)
                    .off(types.end, this.end);

                this.onend(event);
                return false;
            },

            startFix: function (event) {
                event = getEvent(event);

                this.target = $(event.target);
                this.selectstart = function () {
                    return false;
                };

                $document
                    .on('selectstart', this.selectstart)
                    .on('dblclick', this.end);

                if (isLosecapture) {
                    this.target.on('losecapture', this.end);
                } else {
                    $window.on('blur', this.end);
                }

                if (isSetCapture) {
                    this.target[0].setCapture();
                }

                return event;
            },

            overFix: function (event) {
                event = getEvent(event);
                return event;
            },

            endFix: function (event) {
                event = getEvent(event);

                $document
                    .off('selectstart', this.selectstart)
                    .off('dblclick', this.end);

                if (isLosecapture) {
                    this.target.off('losecapture', this.end);
                } else {
                    $window.off('blur', this.end);
                }

                if (isSetCapture) {
                    this.target[0].releaseCapture();
                }

                return event;
            }

        };


        /**
         * å¯åŠ¨æ‹–æ‹½
         * @param   {HTMLElement}   è¢«æ‹–æ‹½çš„å…ƒç´
         * @param   {Event} è§¦å‘æ‹–æ‹½çš„äº‹ä»¶å¯¹è±¡ã€‚å¯é€‰ï¼Œè‹¥æ— åˆ™ç›‘å¬ elem çš„æŒ‰ä¸‹äº‹ä»¶å¯åŠ¨
         */
        DragEvent.create = function (elem, event) {
            var $elem = $(elem);
            var dragEvent = new DragEvent();
            var startType = DragEvent.types.start;
            var noop = function () {};
            var className = elem.className
                    .replace(/^\s|\s.*/g, '') + '-drag-start';

            var minX;
            var minY;
            var maxX;
            var maxY;

            var api = {
                onstart: noop,
                onover: noop,
                onend: noop,
                off: function () {
                    $elem.off(startType, dragEvent.start);
                }
            };


            dragEvent.onstart = function (event) {
                var isFixed = $elem.css('position') === 'fixed';
                var dl = $document.scrollLeft();
                var dt = $document.scrollTop();
                var w = $elem.width();
                var h = $elem.height();

                minX = 0;
                minY = 0;
                maxX = isFixed ? $window.width() - w + minX : $document.width() - w;
                maxY = isFixed ? $window.height() - h + minY : $document.height() - h;

                var offset = $elem.offset();
                var left = this.startLeft = isFixed ? offset.left - dl : offset.left;
                var top = this.startTop = isFixed ? offset.top - dt  : offset.top;

                this.clientX = event.clientX;
                this.clientY = event.clientY;

                $elem.addClass(className);
                api.onstart.call(elem, event, left, top);
            };


            dragEvent.onover = function (event) {
                var left = event.clientX - this.clientX + this.startLeft;
                var top = event.clientY - this.clientY + this.startTop;
                var style = $elem[0].style;

                left = Math.max(minX, Math.min(maxX, left));
                top = Math.max(minY, Math.min(maxY, top));

                style.left = left + 'px';
                style.top = top + 'px';

                api.onover.call(elem, event, left, top);
            };


            dragEvent.onend = function (event) {
                var position = $elem.position();
                var left = position.left;
                var top = position.top;
                $elem.removeClass(className);
                api.onend.call(elem, event, left, top);
            };


            dragEvent.off = function () {
                $elem.off(startType, dragEvent.start);
            };


            if (event) {
                dragEvent.start(event);
            } else {
                $elem.on(startType, dragEvent.start);
            }

            return api;
        };

        return DragEvent;

    });

    /*!
     * artDialog-plus
     * Date: 2013-12-25
     * https://github.com/aui/artDialog
     * (c) 2009-2013 TangBin, http://www.planeArt.cn
     *
     * This is licensed under the GNU LGPL, version 2.1 or later.
     * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
     */
    define("dialog-plus", function (require) {

        var $ = require("jquery");
        var dialog = require("dialog");
        var drag = require("drag");

        dialog.oncreate = function (api) {

            var options = api.options;
            var originalOptions = options._;

            // é¡µé¢åœ°å€
            var url = options.url;
            // é¡µé¢åŠ è½½å®Œæ¯•çš„äº‹ä»¶
            var oniframeload = options.oniframeload;

            var $iframe;


            if (url) {
                this.padding = options.padding = 0;

                $iframe = $('<iframe />');

                $iframe.attr({
                    src: url,
                    name: api.id,
                    width: '100%',
                    height: '100%',
                    allowtransparency: 'yes',
                    frameborder: 'no',
                    scrolling: 'no'
                })
                    .on('load', function () {
                        var test;

                        try {
                            // è·¨åŸŸæµ‹è¯•
                            test = $iframe[0].contentWindow.frameElement;
                        } catch (e) {}

                        if (test) {

                            if (!options.width) {
                                api.width($iframe.contents().width());
                            }

                            if (!options.height) {
                                api.height($iframe.contents().height());
                            }
                        }

                        if (oniframeload) {
                            oniframeload.call(api);
                        }

                    });

                api.addEventListener('beforeremove', function () {

                    // é‡è¦ï¼éœ€è¦é‡ç½®iframeåœ°å€ï¼Œå¦åˆ™ä¸‹æ¬¡å‡ºçŽ°çš„å¯¹è¯æ¡†åœ¨IE6ã€7æ— æ³•èšç„¦input
                    // IEåˆ é™¤iframeåŽï¼Œiframeä»ç„¶ä¼šç•™åœ¨å†…å­˜ä¸­å‡ºçŽ°ä¸Šè¿°é—®é¢˜ï¼Œç½®æ¢srcæ˜¯æœ€å®¹æ˜“è§£å†³çš„æ–¹æ³•
                    $iframe.attr('src', 'about:blank').remove();


                }, false);

                api.content($iframe[0]);

                api.iframeNode = $iframe[0];

            }


            // å¯¹äºŽå­é¡µé¢å‘¼å‡ºçš„å¯¹è¯æ¡†ç‰¹æ®Šå¤„ç†
            // å¦‚æžœå¯¹è¯æ¡†é…ç½®æ¥è‡ª iframe
            if (!(originalOptions instanceof Object)) {

                var un = function () {
                    api.close().remove();
                };

                // æ‰¾åˆ°é‚£ä¸ª iframe
                for (var i = 0; i < frames.length; i ++) {
                    try {
                        if (originalOptions instanceof frames[i].Object) {
                            // è®© iframe åˆ·æ–°å‰æ—¶å€™ä¹Ÿå…³é—­å¯¹è¯æ¡†ï¼Œ
                            // é˜²æ­¢è¦æ‰§è¡Œçš„å¯¹è±¡è¢«å¼ºåˆ¶æ”¶å›žå¯¼è‡´ IE æŠ¥é”™ï¼šâ€œä¸èƒ½æ‰§è¡Œå·²é‡Šæ”¾ Script çš„ä»£ç â€
                            $(frames[i]).one('unload', un);
                            break;
                        }
                    } catch (e) {}
                }
            }


            // æ‹–æ‹½æ”¯æŒ
            $(api.node).on(drag.types.start, '[i=title]', function (event) {
                // æŽ’é™¤æ°”æ³¡ç±»åž‹çš„å¯¹è¯æ¡†
                if (!api.follow) {
                    api.focus();
                    drag.create(api.node, event);
                }
            });

        };



        dialog.get = function (id) {

            // ä»Ž iframe ä¼ å…¥ window å¯¹è±¡
            if (id && id.frameElement) {
                var iframe = id.frameElement;
                var list = dialog.list;
                var api;
                for (var i in list) {
                    api = list[i];
                    if (api.node.getElementsByTagName('iframe')[0] === iframe) {
                        return api;
                    }
                }
                // ç›´æŽ¥ä¼ å…¥ id çš„æƒ…å†µ
            } else if (id) {
                return dialog.list[id];
            }

        };



        return dialog;

    });


    window.dialog = require("dialog-plus");

})();