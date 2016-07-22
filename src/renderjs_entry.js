var MePage = require("../dist/MePage.js");
var MeAnimation = require("../dist/MeAnimation.js");
var MeToolBar = require("../dist/MeToolBar.js");
var MeDiv = require("../dist/MeDiv.js");
var MeImage = require("../dist/MeImage.js");
var MeMusic = require("../dist/MeMusic.js");
var MeTouchTrigger = require("../dist/MeTouchTrigger.js");
var MeVPads = require("../dist/MeVPads.js");
var MePanArea = require("../dist/MePanArea.js");
var MeAudio = require("../dist/MeAudio.js");
var MeArticle = require("../src/me-article.js");
var MePageMgr = require("../src/MePageMgr.js");
var MeMediaMgr = require("../src/MeMediaMgr.js");
var MeSvg = require("../dist/MeSvg.js");
var MeRadio = require("../dist/MeRadio.js");
var MeCheckbox = require("../dist/MeCheckbox.js");
var MeLabel = require("../dist/MeLabel.js");
var MeText = require("../dist/MeText.js");
var MeIFrameVideo = require("../dist/MeIFrameVideo.js");
var MeInnerVideo = require("../dist/MeInnerVideo.js");
var MeClip = require("../dist/MeClip.js");
var MeGallary = require("../dist/MeGallary.js");
var MeInput = require("../dist/MeInput.js");
var MeSubmit = require("../dist/MeSubmit.js");
var MePhone = require("../dist/MePhone.js");
var MeMap = require("../dist/MeMap.js");
var MeReward = require("../dist/MeReward.js");
var MeRedEnvelopes = require("../dist/MeRedEnvelopes.js");
var MeShake = require("../dist/MeShake.js");
var MeLongPress = require("../dist/MeLongPress.js");
var MePanorama = require("../dist/MePanorama.js");
var MeVote = require("../dist/MeVote.js");
var MeMessageBox = require("../dist/MeMessageBox.js");
var MePageNum = require("../dist/MePageNum.js");
var MeDirectory = require("../dist/MeDirectory.js");
var MeEndPage = require("../dist/MeEndPage.js");

var EventEmitter = require("wolfy87-eventemitter");
var React = require("react");
var ReactDOM = require("react-dom");

var renderjs = function () {
    var myself = {
        MePage: MePage,
        MeAnimation: MeAnimation,
        MeToolBar: MeToolBar,
        MeMusic: MeMusic,
        MeVPads: MeVPads,
        MeArticle: MeArticle,
        MeTouchTrigger: MeTouchTrigger,
        MePanArea: MePanArea,
        MePageMgr: MePageMgr,
        MeAudio: MeAudio,
        MeDiv: MeDiv,
        MeMediaMgr: MeMediaMgr,
        MeSvg: MeSvg,
        MeImage: MeImage,
        MeRadio: MeRadio,
        MeCheckbox: MeCheckbox,
        MeLabel: MeLabel,
        MeText: MeText,
        MeIFrameVideo: MeIFrameVideo,
        MeInnerVideo: MeInnerVideo,
        MeClip: MeClip,
        MeGallary: MeGallary,
        MeInput: MeInput,
        MeSubmit: MeSubmit,
        MePhone: MePhone,
        MeMap: MeMap,
        MeReward: MeReward,
        MeRedEnvelopes: MeRedEnvelopes,
        MeShake: MeShake,
        MeLongPress: MeLongPress,
        MePanorama: MePanorama,
        MeVote: MeVote,
        MeMessageBox: MeMessageBox,
        MePageNum: MePageNum,
        MeDirectory: MeDirectory,
        MeEndPage: MeEndPage,
        ee: new EventEmitter(),	//因为需要ee建立，容器，Pads和作品之间的联系，所以在这里创建ee
        React: React,
        ReactDOM: ReactDOM,
        helper: function () {
            var pads = null;
            var elem = null;
            var cfg = {};

            function _init(_elem, options) {
                window.IsMeElementTap = false;  //用于判断，是否派发全局的点击事件
                var _assign = require("object-assign");
                var _default = {
                    containerHeight: _elem.offsetHeight,
                    containerWidth: _elem.offsetWidth,
                    bufferLen: 5,
                    pageHeight: 1008,
                    pageWidth: 640,
                    article: null,
                    ee: myself.ee
                };
                elem = _elem;
                cfg = _assign(
                    _default, options
                );
            }

            function _loadArticle(mag) {
                myself.ee.removeAllListeners(); // later, 仅仅删除与page相关的内容
                if (elem != null) {
                    if (cfg.article != null) ReactDOM.unmountComponentAtNode(elem);
                    var _article = new MeArticle(mag);
                    cfg.article = _article;
                    _article.getCxt().system = myself;
                    pads = ReactDOM.render(React.createElement(MeVPads, cfg), elem);
                    //添加全局的目录组件
                    if (elem.parentNode != null) {
                        //预防多次重启的情况下，会添加多个目录全局组件的容器。
                        var directoryContainer = document.getElementById("me-directory-container");
                        if(directoryContainer) {
                            elem.parentNode.removeChild(directoryContainer);
                        }
//                        if (elem.parentNode.children.length > 1) {
//                            var tempDiv = elem.parentNode.children[elem.parentNode.children.length - 1];
//                            elem.parentNode.removeChild(tempDiv);
//                        }
                        var d = document.createElement("div");
                        d.id = "me-directory-container";
                        d.style.width = "100%";
                        d.style.height = "100%";
                        elem.parentNode.appendChild(d);
                        ReactDOM.render(_article.getDirectory(), d);
                    }
                }
            }

            function _unload() {
                if (elem != null) {
                    ReactDOM.unmountComponentAtNode(elem);
                    pads = null;
                    return;
                }
            }

            return {
                load: _loadArticle,
                unload: _unload,
                init: _init,
                getEE: function () {
                    return myself.ee;
                },
                gotoPos: function (x, y) {
                    if (pads != null) {
                        pads.gotoPos(x, y);
                    }
                },
                /**
                 * 加载tid的回调方法
                 * @param mag
                 */
                loadTidCallBack : function(mag) {
                    myself.helper.load(mag);
                },
                loadTid: function (tid) {
                    if (elem == null) return;
//                    if (globalLoadTid == undefined) return;//globalLoadTid是外部提供的一个函数，通过tid，获得作品数据
//                    globalLoadTid(tid, function (mag) {
//                        myself.helper.load(mag);
//                    });
                    //由于在容器端，会出现全局方法找不到情况，这里做改动为派发事件
                    myself.ee.emitEvent("global:load:tid", [tid, myself.helper.loadTidCallBack]);
                },
                gotoNext: function () {
                    if (pads != null) {
                        var x = 0;
                        var y = 0;
                        y = pads.moveYNext();
                        if (y == -1) {
                            x = pads.moveXNext();
                            if (x == -1) {
                                this.gotoPos(0, 0);
                            }
                        }
                    }
                },
                gotoPrev: function () {
                    if (pads != null) {
                        var x = 0;
                        var y = 0;
                        y = pads.moveYPrev();
                    }
                },
                /**
                 * 这里调用外部的以iframe打开链接
                 * @param target
                 */
                openWithInnerBrowse: function (target, height) {
                    if (elem == null) return;
//                    if (globalOpenWithInnerBrowse == undefined) return;//globalLoadTid是外部提供的一个函数，通过tid，获得作品数据
//                    globalOpenWithInnerBrowse(target, height);
                    //由于在容器端，会出现全局方法找不到情况，这里做改动为派发事件
                    myself.ee.emitEvent("global:open:with:inner:browse", [target, height]);
                },
                /**
                 * 这里调用外部的保存数据
                 * @param data  保存的数据
                 * @param type  保存的数据类型，有表单数据，和投票数据1---表单数据， 2-----投票数据
                 */
                submitDataToCloud: function (data, type) {
                    if (elem == null) return;
//                    if (globalSubmitDataToCloud == undefined) return;//globalLoadTid是外部提供的一个函数，通过tid，获得作品数据
//                    globalSubmitDataToCloud(data, type);
                    //由于在容器端，会出现全局方法找不到情况，这里做改动为派发事件
                    myself.ee.emitEvent("global:submit:data:to:cloud", [data, type]);
                },
                /**
                 * 显示消息框组件
                 */
                showMessageBox: function (msg, btn) {
                    myself.ee.emitEvent("show:message:box", [
                        {msg: msg, btn: btn}
                    ]);
                },
                /**
                 * 显示目录组件
                 */
                showDirectory: function () {
                    //获取当前的组序号
                    if (pads != null) {
                        var pos = pads.getPos();
                        myself.ee.emitEvent("show:directory", [
                            {isShow: true, currentX: pos.x}
                        ]);
                    }
                },
                /**
                 * 隐藏目录组件
                 */
                hideDirectory: function () {
                    myself.ee.emitEvent("hide:directory", [
                        {isShow: false}
                    ]);
                },
                /**
                 * 获取页的上下文
                 */
                getCxt: function () {
                    if (cfg.article != null) {
                        return cfg.article.getCxt();
                    }
                    return null;
                },
                /**
                 * 获取当前，x，序号，y序号
                 */
                getPos: function () {
                    if (pads != null) {
                        var pos = pads.getPos();
                        return pos;
                    }
                    return null;
                },
                /**
                 * 获取所有组的长度
                 */
                getGroupLength: function () {
                    if (cfg.article != null) {
                        return cfg.article.getL1Num();
                    }
                    return 0;
                },
                /**
                 * 获取当前组的总页数
                 */
                getCurrentGroupPageLength: function () {
                    if (pads != null) {
                        var pos = pads.getPos();
                        if (cfg.article != null) {
                            return cfg.article.getL2Num(pos.x);
                        }
                    }
                    return 0;
                },
                /**
                 * 获取当前组的总页数
                 */
                getAllPageLengths: function () {
                    if (cfg.article != null) {
                        return cfg.article.getNumOfPage();
                    }
                    return 0;
                },
                /**
                 * 获取每一页的动画信息
                 * {tplMode:'{}', pageMode:[['{}'],['{}',.....],......]}
                 * @returns {*}
                 */
                getAnimationMode: function () {
                    if (cfg.article != null) {
                        return cfg.article.getAnimationMode();
                    }
                    return null;
                }
            };
        }()
    }

    return myself;
}();
window.renderjs = renderjs;
module.exports = renderjs;
