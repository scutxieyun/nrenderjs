/** 文件名称: MePanorama
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/14 9:05
 * 描    述: 360全景组件  --- 对应 item_type 40
 */
define("MePanorama", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MePanorama = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:"none"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMePanorama";
            this.reLoadIndex = 0; //预加载图片索引
            this.reLoadEdNum = 0;
            this.startPosX = 0;                     //开始位置
            this.manuallyStart = 0;                 //是否手动开始拖拽
            this.lastNum = 0;                        //最后惯性围几圈
            this.lastToLeft = 0;                    //最后松开时状态 -1=向左  1=向右
            this.spinningSpeed = 20;                //默认速度20
            this.moveTime = 0;
            this.endTime = 0;
            return {
                currentIndex:0
            };
        },
        mixins:[MeComponentMixin],
        /**
         * 显示当前页的时候
         */
        pageActive:function(){
            console.log("active checkbox");
        },
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            console.log("deactive checkbox");
        },
        initEvent : function(){
            var self = this;
            var hastouch = self.isPC() ? false : true;
            var tapstart = hastouch ? "touchstart" : "mousedown",
                tapmove = hastouch ? "touchmove" : "mousemove",
                tapend = hastouch ? "touchend" : "mouseup";
            var panorama = self.refs.myMePanorama;
            panorama.addEventListener(tapstart, function (e) {
                e.preventDefault();
                e.stopPropagation();
                var touch = e.originalEvent ? e.originalEvent.changedTouches[0] : e.touches[0];
                self.startPosX = touch.clientX;
                self.startPosY = touch.clientY; //记录是否滑页
                self.manuallyStart = true;
                self.lastToLeft = 0;
            });

            panorama.addEventListener(tapmove, function (e) {
                e.preventDefault();
                e.stopPropagation();
                var touch = e.changedTouches ? e.changedTouches[0] : e.touches[0];
                var posX = Math.floor(touch.clientX);
                if(posX < self.minLeft)
                    posX = self.minLeft;
                if(posX > self.maxLeft)
                    posX = self.maxLeft;
                var d = new Date();
                self.changeImgSrc(self.startPosX-posX);
                self.lastToLeft = self.startPosX-posX;
                self.startPosX = posX;
                self.moveTime = d.getTime();
            });

            panorama.addEventListener(tapend, function (e) {
                e.preventDefault();
                e.stopPropagation();
                var touch = e.changedTouches ? e.changedTouches[0] : e.touches[0];
                var posY = Math.floor(touch.clientY);
                if(Math.abs(posY - self.startPosY) > 100){
                    console.log("翻页");
                }
                var d = new Date();
                self.endTime = d.getTime();
                self.manuallyStart = false;
                var speed  = self.endTime-self.moveTime;
                if(speed < 20) {
                    self.lastNum = (20 - speed)*2;
                    self.spinningSpeed = 10;
                }
            });
        },
        //左移多少>0表示左移 =0不动 <0表示右移
        changeImgSrc : function(toLeft){
            var self = this;
            if(toLeft == 0)return;
            if(toLeft > 0)
                self.setState({currentIndex:self.state.currentIndex + 1});
            else
                self.setState({currentIndex:self.state.currentIndex - 1});
            if(self.state.currentIndex  < 0)
                self.setState({currentIndex:self.props.imgItems.length - 1});
            else if(self.state.currentIndex > self.props.imgItems.length-1)
                self.setState({currentIndex:0});
        },
        loadImg : function(){
            var self = this;
            while(self.reLoadIndex < self.props.imgItems.length) {
                self.reLoad();
                self.reLoadIndex++;
            }
        },
        reLoad : function(){
            var self = this;
            var img = document.createElement("img");
            img.src = self.props.imgItems[self.reLoadIndex];
            img.onload = function(){
                self.reLoadEdNum++;
                if(self.reLoadEdNum >= self.props.imgItems.length){
                    console.log("图片列表加载结束!");
                }
            }
        },
        componentWillMount: function () {
            //预加图片
            this.loadImg();
        },
        render: function () {
            var src = this.props.imgItems[this.state.currentIndex];
            return (<img  src={src} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} />);
        },
        componentDidMount: function () {
            this.initEvent();
        }
    });
    return MePanorama;
});
