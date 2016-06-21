/** 文件名称: MeSubmit
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 14:25
 * 描    述: 提交组件  --- 对应 item_type 19
 */
define("MeSubmit", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeSubmit = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box'}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeSubmit";
            return {};
        },
        mixins:[MeComponentMixin,MeCommandMixin],
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
        clickHandle : function(ev){
            console.log("submit");
            //todo 获取当前页的所有表单数据，保存数据到数据库
            var inst = this.getPageInstance();
            var container = inst.container;
            var inputArr = [];
            var radioArr = [];
            var checkboxArr = [];
            var hasContent = false;
            //找出所有input
            var data = {};
            //拼接输入框的值
            var inputContent = {};
            var inputContentArr = [];
            //通过获取当前页，获取到每个表单组件
            for(var key in container){
                var inputTemp = container[key].refs.myMeInput;
                if(inputTemp){
                    inputArr.push(inputTemp);
                }
                var radioTemp = container[key].refs.myMeRadio;
                if(radioTemp){
                    radioArr.push(radioTemp);
                }
                var checkboxTemp = container[key].refs.myMeCheckbox;
                if(checkboxTemp){
                    checkboxArr.push(checkboxTemp);
                }
            }
            /**
             * 获取input元素的所有输入值
             */
            if(inputArr.length > 0){
                for(var i = 0; i < inputArr.length; i++ ){
                    var obj = inputArr[i];
                    var objectId = obj.getAttribute('data-objectId');
                    var fb_val = obj.value;
                    if(fb_val&&objectId){
                        var tempObj = {};
                        tempObj[objectId] = fb_val;
                        inputContentArr.push(tempObj);
                    }
                    if (fb_val) {
                        hasContent = true;
                    }
                }
            }
            //赋值  如{ "input_content":[{objcetId:"张三"}，{objectId:"41191379@qq.com"} ] }
            if(inputContentArr.length > 0){
                inputContent["input_content"] = inputContentArr;
                data["cd_input"] = JSON.stringify(inputContent);
            }
            /**
             * 获取单选框所有输入的值
             */
            //拼接多个单选框的值["objectId1", "objectId2"]  ["value1", "values2"]
            var radioTitleArr = [];
            var radioContentArr = [];
            if(radioArr.length > 0){
                for(var i = 0; i < radioArr.length; i++ ){
                    //获取每一个单选的
                    var radioOptionArr = radioArr[i].querySelectorAll("input[data-radio='user-radio']");
                    for(var i = 0; i < radioOptionArr.length; i++ ){
                        var obj = radioOptionArr[i];
                        if(obj.checked){
                            hasContent = true;
                            var fb_val = obj.value;
                            var objectId = obj.getAttribute('data-objectId');
                            if(objectId && fb_val){
                                radioTitleArr.push(objectId);
                                radioContentArr.push(fb_val);
                            }
                        }
                    }
                }
                data["cd_radio"] = JSON.stringify(radioTitleArr);
                data["cd_radio_val"] = JSON.stringify(radioContentArr);
            }
            /**
             * 获取多选框所有输入的值
             */
            //拼接多个多选框的值["objectId1", "objectId2"]  ["value1", "values2"]
            var checkboxTitleArr = [];
            var checkboxContentArr = [];
            if(checkboxArr.length > 0){
                for(var i = 0; i < checkboxArr.length; i++ ){
                    //获取每一个单选的
                    var checkboxOptionArr = checkboxArr[i].querySelectorAll("input[data-checkbox='user-checkbox']");
                    var checkboxContent = "";
                    var checkObjectId = "";
                    for(var i = 0; i < checkboxOptionArr.length; i++ ){
                        var obj = checkboxOptionArr[i];
                        checkObjectId = obj.getAttribute('data-objectId');
                        if(obj.checked){
                            hasContent = true;
                            checkboxContent += obj.value + "|";
                        }
                    }
                    if(checkObjectId && checkboxContent){
                        checkboxTitleArr.push(checkObjectId);
                        checkboxContentArr.push(checkboxContent);
                    }
                }
                data["cd_checkbox"] = JSON.stringify(checkboxTitleArr);
                data["cd_checkbox_val"] = JSON.stringify(checkboxContentArr);
            }
            //表单至少有一项有值,并且至少有一个输入框
            if(!hasContent){
                alert("请填写表单");
                return;
            }
            //TODO 提交数据 并且清空输入的信息
//            this._handleCmd(action);
            console.log(data);
            //清除数据
            this._clearForm(inputArr, false);
            this._clearForm(radioArr, true);
            this._clearForm(checkboxArr, true);
        },
        /**
         * 清空表单中所填写的数据
         * @param objArr
         * @param isCheck
         * @private
         */
        _clearForm : function(objArr, isCheck){
            for(var i = 0; i <objArr.length; i++ ){
                if(isCheck){
                    var options = objArr[i].querySelectorAll("input[data-type='common-check-radio']");
                    for(var j = 0; j < options.length; j++){
                        options[j].checked = false;
                    }
                }else{
                    objArr[i].value = "";
                }
            }
        },
        render: function () {
            this.props.normalStyle.lineHeight = this.props.data.lineHeight;
            var content = "";
            if(this.props.data.cnType == 2){
                this.props.normalStyle.background = "url('"+this.props.data.content+"') no-repeat center";
            }else{
                content = this.props.data.content;
            }
            return (<div onClick={this.clickHandle} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef}>{content}</div>);
        },
        componentDidMount: function () {

        }
    });
    return MeSubmit;
});
