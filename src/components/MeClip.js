/** 文件名称: MeClip
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/6 18:28
 * 描    述: 涂抹组件  --- 对应 item_type 24
 */
define("MeClip", function () {
    var React = require("react");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeMediaMixin = require("../src/MeMediaMixin.js");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeClip = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {position: 'absolute',top:0,left:0,opacity:1,transition:'opacity .5s',"-webkit-transition":'opacity .5s'}
            }
        },
        getInitialState : function(){
            this._clipCtx = null;
            this._clipPopupView = null;
            this.x1 = 0;
            this.y1 = 0;
            this.a = 30;
            this.timeout = null;
            this.totimes = 100;
            this.distance = 30;
            this._img = null;
            return {isOver : false};
        },
        mixins:[MeComponentMixin],
        /**
         * 显示当前页的时候
         */
        pageActive:function(){
            console.log("active clip");
        },
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            console.log("deactive clip");
            this._clipCtx = null;
        },
        /**
         * 初始化涂抹的参数
         */
        initCanvas : function(){
            var self = this;
            var width = self.props.normalStyle.width;
            var height = self.props.normalStyle.height;
            var opacity = self.props.normalStyle.opacity;
            var fontSize = self.props.normalStyle.fontSize;
            self._clipPopupView = self.refs.myMeClip;
            self._clipCtx = self._clipPopupView.getContext("2d");
            self._clipPopupView.width = parseInt(width) || 640;
            self._clipPopupView.height = parseInt(height) || 1008;
            self._clipCtx.globalAlpha = (100 - opacity) / 100;
            if(!fontSize){
                self._clipCtx.font = "36px Arial";
            }else{
                self._clipCtx.font = fontSize + " Arial";
            }
            self.initDraw();
        },
        initDraw : function(){
            var self = this;
            var _src = this.props.data.src;
            var itemVal = this.props.data.content;
            var itemLeft = parseInt(self.props.normalStyle.left);
            var itemTop = parseInt(self.props.normalStyle.top);
            var itemColor = self.props.normalStyle.color;
            var fontSize = self.props.normalStyle.fontSize;
            this._img = new Image();
            this._img.onload = function () {
                var rw = self._img.width / self._clipPopupView.width, rh = self._img.height / self._clipPopupView.height;
                if (rw > rh) {
                    //image with rate is bigger then height, clip image with
                    var clipW = rh * self._clipPopupView.width;
                    var sx = (self._img.width - clipW) / 2;
                    self._clipCtx.drawImage(self._img, sx, 0,clipW ,self._img.height,0,0,self._clipPopupView.width, self._clipPopupView.height);
                } else {
                    var clipH = rh * self._clipPopupView.height;
                    var sy = (self._img.height - clipH) / 2;
                    self._clipCtx.drawImage(self._img, 0, sy,self._img.width ,clipH,0,0,self._clipPopupView.width, self._clipPopupView.height);
                }
                //TODO 这里的绘制椭圆的宽度和高度，定位都是根据字来的
                //1、字的位置-50
                //2、宽度为字的大小*长度
                //3、高度为字体的高度+30
                var fontInt = 36;
                if(fontSize){
                    fontInt = parseInt(fontSize.substring(0, fontSize.length-2))
                }
                //从坐标点(itemLeft,itemTop)开始绘制文字  位置固定
                if(itemVal){
                    //绘制圆背景 否层的时候添加文字阴影
                    var roundRectHeight = fontInt + 46; //绘制椭圆背景的高度
                    var tempTop = (roundRectHeight + fontInt) / 2 - 6;  //文字Y坐标需要减掉的Y轴坐标
                    var roundRectTop = itemTop - tempTop;
                    var roundRectLeft = itemLeft - 20;
                    var roundRectWidth = fontInt * itemVal.length + 20; //绘制椭圆的宽度
                    var roundRectR = roundRectHeight / 2;   //绘制椭圆的半径
                    self.roundRect(roundRectLeft, roundRectTop, roundRectWidth, roundRectHeight, roundRectR);
                    self._clipCtx.fill();
                    //绘制文字背景
                    //设置字体填充颜色
                    if(!itemColor){
                        self._clipCtx.fillStyle = "#909090";
                    }else{
                        self._clipCtx.fillStyle = itemColor;
                    }
                    self._clipCtx.fillText(itemVal,itemLeft, itemTop);
                }
                self.tapClip();
            };
            this._img.crossOrigin = "anonymous";
            this._img.src = _src;
        },
        /**
         * 通过修改globalCompositeOperation来达到擦除的效果
         */
        tapClip : function(){
            var self = this;
            var hastouch = self.isPC() ? false : true;
            var tapstart = hastouch ? "touchstart" : "mousedown",
                tapmove = hastouch ? "touchmove" : "mousemove",
                tapend = hastouch ? "touchend" : "mouseup";

            var area;
            var x2,y2;

            self._clipCtx.lineCap = "round";
            self._clipCtx.lineJoin = "round";
            self._clipCtx.lineWidth = self.a * 2;
            self._clipCtx.globalCompositeOperation = "destination-out";
            self._clipPopupView.addEventListener(tapstart, tapStartHandler);
            self._clipPopupView.addEventListener(tapend, tapEndHandler);

            /**
             * 移动开始处理函数
             * @param e
             */
            function tapStartHandler(e) {
                clearTimeout(self.timeout);
                e.preventDefault();
                e.stopPropagation();

                area = self.getClipArea(e, hastouch);
                if(!area){  //预防报错
                    return;
                }
                self.x1 = area.x;
                self.y1 = area.y;
                self.drawLine(self.x1, self.y1);
                self._clipPopupView.addEventListener(tapmove, tapmoveHandler);
            }
            /**
             * 移动中处理函数
             * @param e
             */
            function tapmoveHandler(e) {
                clearTimeout(self.timeout);

                e.preventDefault();
                e.stopPropagation();

                area = self.getClipArea(e, hastouch);
                if(!area){  //预防报错
                    return;
                }
                x2 = area.x;
                y2 = area.y;

                self.drawLine(self.x1, self.y1, x2, y2);

                self.x1 = x2;
                self.y1 = y2;
            }

            /**
             * 移动结束处理函数
             * @param e
             */
            function tapEndHandler(e) {
                e.preventDefault();
                e.stopPropagation();
                self._clipPopupView.removeEventListener(tapmove, tapmoveHandler);
                //检测擦除状态
                self.timeout = setTimeout(function () {
                    var imgData;
                    if (self._clipCtx){
                        imgData = self._clipCtx.getImageData(0, 0, self._clipPopupView.width, self._clipPopupView.height);
                        var dd = 0;
                        for (var x = 0; x < imgData.width; x += self.distance) {
                            for (var y = 0; y < imgData.height; y += self.distance) {
                                var i = (y * imgData.width + x) * 4;
                                if (imgData.data[i + 3] > 0) {
                                    dd++
                                }
                            }
                        }
                    }
                    if(imgData){
                        var percent = 0.8;
                        if(self.percent){
                            percent = (100-self.percent) / 100;
                        }
                        // modify by fishYu 2016-2-17 13:52 更改涂抹比例的不精确
                        if(self.isPC()){
                            percent = percent + 0.15;
                        }else{
                            percent = percent + 0.25;
                        }
                        console.log(dd / (imgData.width * imgData.height / (self.distance * self.distance)),"sadasdasd " ,percent);
                        if (dd / (imgData.width * imgData.height / (self.distance * self.distance)) < percent) {
                            self._clipPopupView.className = "noOp";
                            //注销滑动事件
                            self._clipPopupView.removeEventListener(tapend,tapEndHandler);
                            self._clipPopupView.removeEventListener(tapmove, tapmoveHandler);
                            self._clipPopupView.removeEventListener(tapstart, tapStartHandler);
                            //TODO 执行脚本
//                            if(self.endScript){
//                                //TODO 更换了执行完的脚本
//                                self.parentView.execAnimationEndAct();
//                            }
                            self._destroy();
                        }
                    }
                }, self.totimes)
            }
        },
        /**
         * 获取涂抹的区域
         * @param e
         * @param hastouch
         */
        getClipArea : function(e, hastouch){
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var x = hastouch ? e.targetTouches[0].pageX : e.clientX;
            var y = hastouch ? e.targetTouches[0].pageY : e.clientY;
            var ndom = this._clipPopupView;
//        修正缩放后的x,y值
            if(!ndom){  //预防报错
                return;
            }
            var rect = ndom.getBoundingClientRect();
            //不用zoom的时候
            x = ( ( x - rect.left ) * (ndom.width  / rect.width  ) );
            y =  ( ( y - rect.top  ) * (ndom.height / rect.height ) );
            return {
                x: x,
                y: y
            }
        },
        /**
         * 绘制涂抹的横线
         * @param x1
         * @param y1
         * @param x2
         * @param y2
         */
        drawLine : function(x1, y1, x2, y2){
            var self = this;
            self._clipCtx.save();
            self._clipCtx.beginPath();
            if(arguments.length==2){
                self._clipCtx.arc(x1, y1, self.a, 0, 2 * Math.PI);
                self._clipCtx.fill();
            }else {
                self._clipCtx.moveTo(x1, y1);
                self._clipCtx.lineTo(x2, y2);
                self._clipCtx.stroke();
            }
            self._clipCtx.restore();
        },
        /**
         * 绘制圆角矩形
         * @param x
         * @param y
         * @param w
         * @param h
         * @param r
         */
        roundRect : function(x, y, w, h, r){
            this._clipCtx.beginPath();
            this._clipCtx.fillStyle  = "rgba(0,0,0,.5)";
            this._clipCtx.moveTo(x+r, y);
            this._clipCtx.arcTo(x+w, y, x+w, y+h, r);
            this._clipCtx.arcTo(x+w, y+h, x, y+h, r);
            this._clipCtx.arcTo(x, y+h, x, y, r);
            this._clipCtx.arcTo(x, y, x+w, y, r);
            this._clipCtx.closePath();
        },
        /**
         * 销毁删除组件,重置元素
         * @private
         */
        _destroy : function(){
            if(this._clipPopupView){
                this.x1 = 0;
                this.y1 = 0;
                this.a = 30;
                this.timeout = null;
                this.totimes = 100;
                this.distance = 30;
                this._img = null;
                this._clipCtx = null;
                this._clipPopupView = null;
                //TODO unMount 根据不同的state来移除
                this.setState({isOver:true});
            }
        },
        componentWillMount: function () {

        },
        render: function () {
            //todo 这里层级自己设置最高的，后期可以根据页元素最大层级+1
            this.props.commonStyle.zIndex = "100000";
            var ref = null;
            if(!this.state.isOver){
                ref = (<canvas ref="myMeClip" style={this.props.commonStyle}/>);
            }
            return ref;
        },
        componentDidMount: function () {
            this.initCanvas();
        }
    });
    return MeClip;
});
