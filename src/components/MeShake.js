/** 文件名称: MeShake
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 17:52
 * 描    述: 电话组件  --- 对应 item_type 12
 */
define("MeShake", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeShake = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative',display:"inline-block", boxSizing: 'border-box', outline:"none", backgroundPosition:"center", backgroundRepeat:"no-repeat", overFlow:"hidden"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeShake";
            return {};
        },
        mixins:[MeComponentMixin],
        /**
         * 显示当前页的时候
         */
        pageActive:function(){
            console.log("active shake");
            var self = this;
            if (window.DeviceMotionEvent) {
//                var $el = $(this.contentElement);
//                if(!$el.hasClass("yaoYiYao")){
//                    $el.addClass("yaoYiYao");
//                }
                //TODO 这里变量只能 放这，，放到该对象上，会促使在IOS手机上面不出现摇一摇元素
                var SHAKE_THRESHOLD = 800;
                var shake_last_update = 0;
                var shake_x =  0;
                var shake_y = 0;
                var shake_z = 0;
                var shake_last_x = 0;
                var shake_last_y = 0;
                var shake_last_z = 0;
                this.shakeHandle = function deviceMotionShakeHandler (eventData){
                    var acceleration =eventData.accelerationIncludingGravity;
                    var curTime = new Date().getTime();
                    if ((curTime - shake_last_update)> 300) {
                        var diffTime = curTime - shake_last_update;
                        shake_last_update = curTime;
                        if(acceleration){
                            shake_x = acceleration.x;
                            shake_y = acceleration.y;
                            shake_z = acceleration.z;
                        }
                        var speed = Math.abs(shake_x + shake_y + shake_z - shake_last_x - shake_last_y - shake_last_z) / diffTime * 10000;
                        if (speed > SHAKE_THRESHOLD) {
                            //TODO 只支持摇晃一次执行,去掉摇晃的样式
                            //执行脚本
                            if((!!self.props.triggerActions) && (!!self.props.triggerActions.tap))
                                self.callActionMethod(self.props.triggerActions.tap);
                        }
                        shake_last_x = shake_x;
                        shake_last_y = shake_y;
                        shake_last_z = shake_z;
                    }
                };
                if(this.shakeHandle){
                    window.addEventListener('devicemotion',this.shakeHandle, false);
                }
            }
        },
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            console.log("deactive shake");
            if (window.DeviceMotionEvent) {
                window.removeEventListener('devicemotion', this.shakeHandle, false);
                this.shakeHandle = null;
            }
        },
        componentWillMount: function () {

        },
        render: function () {
            return (<div style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} data-type={"me-shake"} className={"me-yaoyiyao yaoYiYao"}></div>);
        },
        componentDidMount: function () {

        }
    });
    return MeShake;
});
