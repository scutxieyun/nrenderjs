var _ = require("underscore");
var fs = require('fs');
var url = require('url');
var http = require('http');
function main(tpl, magObj, callback) {
    var MePageT = _.template('<MePage idx={<%= idx %>} cxt={cxt} normalStyle={{height:"<%= page_height%>px",width:"<%= page_width%>px"}} >\n<%= children%>\n</MePage>');
    var NoTypeDefinedT = _.template('<div cxt={cxt} style={{<%= style%>}}> No Such Type defined <%= item_type %></div>');
    var posStyleTemplate = _.template('top:"<%= item_top%>px",left:"<%= item_left%>px",zIndex:<%= item_layer%>,position:"absolute"');
    var imgTemplate = _.template('<MeImage src="<%= src%>" displayType = {<%= displayType%>} normalStyle={{<%= style %>}}></MeImage>');
    var grpTemplate = _.template('<MeDiv displayType = {<%= displayType%>} pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>" normalStyle={{<%= style %>}}><%= children%></MeDiv>');
    var divTemplate = _.template('<div style={{<%= style %>}}><%= content%></div>');
    var textTemplate = _.template('<MeText data={<%= data%>} displayType = {<%= displayType%>} normalStyle={{<%= style %>}}></MeText>');
    var animationTemplate = _.template('<MeAnimation displayType = {<%= displayType%>} pageIdx={<%= pageIdx %>} cxt={cxt} animationClass={<%= animationClass%>} animation={<%= animation%>} normalStyle={{<%= normalStyle%>}}><%= children %></MeAnimation>');
    var touchTriggerTemplate = _.template('<MeTouchTrigger pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>" normalStyle={{<%= normalStyle%>}} triggerActions={{"<%= triggerActions.evt %>":[<%= triggerActions.actions%>]}}><%= children %></MeTouchTrigger>');
 
   //最终返回的对象
    var pageTemp;
    //页容器的字符串
    var pagesContentTemp = "";
    //需要加载云字体的缓存
    var fontCache = [];
    //云字体域名
    var fontServer = "http://agoodme.com:3000";
    //默认从第0个其实加载
    var fontIndex = 0;

    var itemFuncMap = {
        "1": imgRenderItem,
        "2": textRenderItem,
        "3": imgRenderItem,
        "10": imgRenderItem,
        "18": imgRenderItem,//带链接
        "17": grpRenderItem,
        "34": grpRenderItem,
		"12": phoneRenderItem,//打电话
		"7": musicRenderItem,		
    };
    //给一个初始的随机数
    var gId = (0 | (Math.random() * 998));
	var mag = magObj.tplData;
    var defaultAnimation = '{animationIterationCount:"1",animationDelay:"0s",animationDuration:"1s"}';
    var index = [];
    index.push(-1);
    var pageContent = [];
    if (mag.groups == undefined) {
        mag.groups = [
            {
                pages: mag.pages
            }
        ];
    }
    var pageNum = 0;
    for (grpIdx = 0; grpIdx < mag.groups.length; grpIdx++) {
        var pages = mag.groups[grpIdx].pages;
        pages = getPages(pages);
        var subIndex = [];
        subIndex.push(-1);
        for (var i = 0; i < pages.length; i++) {
            pages[i].idx = i + pageNum;
            pageContent.push(renderPage(pages[i]));
            subIndex.push(i + pageNum);
            //index.push(i+pageNum);
        }
        subIndex.push(-1);
        index.push(subIndex);
        pageNum += pages.length;
    }
    index.push(-1);
    pagesContentTemp = pageContent.join(",");
    pageTemp = (_.template(tpl))({pages: pagesContentTemp, layout: JSON.stringify(index), music_src: mag.tpl_music});
    //循环下载云字体
    loop(callback);

//        return (_.template(tpl))({pages: pageContent.join(","), layout: JSON.stringify(index), music_src: mag.tpl_music});
    /**
     * 获取组之内的所有页的数据集合
     * @param {arr|array}       需要合并页数据的组集合
     * @returns {Array}         返回组之内的所有页的数据集合
     */
    function getPages(arr) {
        var result = [], obj;
        for (var i = 0; i < arr.length; i++) {
            obj = arr[i];
            if (!obj.hasOwnProperty("pages")) {
                result.push(obj);
            } else {
                var tmp = getPages(obj["pages"]);
                result = result.concat(tmp);
            }
        }
        return result;
    }

    function renderPage(page) {
        var items = [];
        var grps = indexItems(page.item_object);

        _.each(grps, function (grp, key) {
            var newGrps = []
            _.each(grp.items, function (item, idx) {
                newGrps.push(renderItem(page, item));
            });
            if (grp.owner != null) {
                grpDiv = renderItem(page, grp.owner, newGrps);
                items.push(grpDiv);
            } else {
                items = items.concat(newGrps);
            }
        });
        page.children = items.join("\n");

        return (MePageT(page) + "\n");
    }

    function indexItems(items) {
        var grps = {};
        grps["0"] = {
            items: [],
            owner: null
        }
        for (var i = 0; i < items.length; i++) {
            if (items[i].group_id == undefined) items[i].group_id = "0";
            if (grps.hasOwnProperty(items[i].group_id)) {
                if ((items[i].item_id == items[i].group_id) || items[i].item_type == 17 || items[i] == 34) {
                    grps[items[i].group_id].owner = items[i];
                }
                else grps[items[i].group_id].items.push(items[i]);
            } else {
                grps[items[i].group_id] = {
                    items: [],
                    owner: null
                }
                if (items[i].item_id == items[i].group_id || items[i].item_type == 17 || items[i] == 34)
                    grps[items[i].group_id].owner = items[i];
                else grps[items[i].group_id].items.push(items[i]);
            }
        }
        return grps;
    }

    function noTypeDefined(page, item) {
        var _style = [posStyleTemplate(item), sizeStyleTemplateWrap(item)];
        return NoTypeDefinedT({item_type: item.item_type, style: _style});
    }

    function renderTransform(item) {
        /**scale 的处理交给转换程序，将scale，修改hieght,和width
         var scale = "";
         if(item.x_scale != null && item.x_scale != 1 ){
		scale = "scale3d(" +item.x_scale;
	}
         if(item.y_scale != null && item.y_scale != 1 ){
		if(scale == "") scale =  "scale3d(1";
		scale = scale + "," + item.y_scale + ",1)";
	}else{
		if(scale != "") scale = scale + ",1,1)";
	}*/
        //if(scale == "") return "";
        //return 'transform:"' + scale + '"';
        return "";
    }
function imgRenderItem(page,item,_style){
    //人工实现Scale,
    if(item.x_scale == null) item.x_scale = 1;
    if(item.y_scale == null) item.y_scale = 1;
    item.item_height *= item.y_scale;
    item.item_width *= item.x_scale;	//激进一点，然返回的图片小一些
	
	item.y_scale = 1;
	item.x_scale = 1;
	
	
    if(item.item_val.search(/imageView2/) == -1){
        item.item_val = item.item_val + "?imageView2/2/w/"+Math.floor(item.item_width) + "/h/" + Math.floor(item.item_height);
    }

    _style.push(sizeStyleTemplateWrap(item));
    var tem = renderTransform(item);
    if (tem != "")
        _style.push(tem);	
	
	
    return imgTemplate({src:item.item_val,displayType:item.item_display_status,style:_style.join(",")});
}
function musicRenderItem(page,item,_style){
    var audioTemplate = _.template('<MeAudio pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"  normalStyle={{<%= normalStyle%>}} src="<%= src%>" autoplay={<%= autoplay%>} musicImg="<%= music_img%>" musicName="<%= music_name%>" ></MeAudio>');
	return audioTemplate({
		normalStyle:_style.join(","),
		src:item.item_val,
		autoplay: item.music_autoplay ? true:false,
		music_name:item.music_name,
		music_img:item.music_img,//实际没有用，后续怎么处理看产品部todo
		pageIdx:page.idx,
		id:item.item_id
	});
}



function phoneRenderItem(page,item,_style){//todo can not adjust the font to center, 
	_style.push(fontStyleTemplateWrap(item));
	_style.push(sizeStyleTemplateWrap(item));
	var phoneTemplate = _.template('<div className="mePhone" style={{<%= _style %>}}><%= item_val%></div>');
	item._style = _style.join(",");
	return phoneTemplate(item);
}
    /**
     * 获取设置云字体
     * @param cIndex
     * @param cb
     */
    function getCloundFont(cIndex, cb) {
        var jsonData = "";
        var obj = fontCache[cIndex];
        var key = "";
        var url = "";
        for (key in obj) {
            url = obj[key]
        }
        http.get(url, function (res) {
            res.on("data", function (data) {
                jsonData = jsonData + data;
            }).on("end", function () {
                //过滤&&之前的多余的字符串 typeof === 'function' &&
                jsonData = jsonData.split("&&")[1];
                var jsStatement = "(function(){return " + jsonData + ";})();";
                var fontObj = eval(jsStatement);
                if (fontObj.src == 'undefined' || !fontObj.src) {
                    //没有云字体的情况
                } else {
                    //获取云字体成功正确的情况
                    var temp = fontServer + fontObj.src + "?" + fontObj.type;
                    //替换文字
                    var patt1 = new RegExp(key, "g");
                    pagesContentTemp = pagesContentTemp.replace(patt1, temp);
                    pageTemp = (_.template(tpl))({pages: pagesContentTemp, layout: JSON.stringify(index), music_src: mag.tpl_music});
                }
                cb();
            }).on("error", function () {
                console.log("get font data error");
                cb();
            });
        });
    }

    /**
     *循环加载云字体载方法
     */
    function loop(cb_ok) {
        if (fontIndex >= fontCache.length) {
            cb_ok(pageTemp);
            return;
        } else {
            getCloundFont(fontIndex, function () {
                fontIndex++;
                loop(cb_ok);
            })
        }
    }

    /**
     * 获取随机唯一ID
     * @returns {number}
     */
    function getNewID() {
        gId++;
        return gId;
    }
	
	function sizeStyleTemplateWrap(item){
		var height = item.item_height + "px";
		var width = item.item_width + "px";
		if (item.item_height == 0)height = "auto";
		if (item.item_width == 0)width = "auto";
		
		var sizeStyleTemplate = _.template('height:"<%= height%>",width:"<%= width%>"');
		
		return sizeStyleTemplate({
			height:height,
			width:width
		});
	}
	
	function fontStyleTemplateWrap(item){
		var fontStyleTemplate = _.template('fontSize:"<%= font_size%>", color:"<%= item_color%>",fontFamily:"<%= font_family %>",backgroundColor:"<%= bg_color %>"');
		var color = item.item_color;
		try{
			color = JSON.parse(color);
			color = color.colors[0];
			//"item_color": "{\"colors\":[\"#FF0000\"]}",
		}catch(e){
		//normal string
		}
		item.item_color = color;
		return fontStyleTemplate(item);
	}
	

    function textRenderItem(page, item, _style) {
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
		if (Math.abs(1-item.y_scale) < 0.01 || Math.abs(item.x_scale - item.y_scale) < 0.01){
			//直接修改字体size来实现缩放
			item.font_size = (parseInt(item.font_size) * item.y_scale) + "px";
			item.x_scale = 1;item.y_scale = 1;//禁止x_scale,y_scale
		}
        _style.push(fontStyleTemplateWrap(item));
        //获取文字内容和云字体
        var text = item.item_val;
        var fontFamily = item.font_family;
        //防止react错误，对{}进行替换
        item.item_val = item.item_val.replace(/[{|}]/g, function (word) {
            return "{'" + word + "'}"
        });
		
		item.item_val = item.item_val.replace(/\n/g,'<BR/>')
		item.item_val = item.item_val.replace(/\s/g, '&nbsp');
		//&nbsp
        //针对文字的情况去设置云字体
        //TODO 可能还不只是item_type为2的
        var fontName = "css-font-" + getNewID();
        var url = fontServer + "/loadfont/?callback=?&type=fixed&font=" + fontFamily + "&text=" + text + "&r=" + Math.random();
        url = encodeURI(url);
        var data = {};
        data.fontName = fontName;
        data.content = item.item_val;
        var cacheKey = "me-clould-font-cache" + getNewID();
        data.src = cacheKey;
        data = JSON.stringify(data);
        //添加需要加载的云字体链接到缓存
        var tempFont = {};
        tempFont[cacheKey] = url;
        fontCache.push(tempFont);
		var tem = renderTransform(item);
        if (tem != "")
        _style.push(tem);
        return textTemplate({data: data, displayType: item.item_display_status, style: _style.join(",")});
    }

    function grpRenderItem(page, item, _style, content) {
        var tem = renderTransform(item);
        if (tem != "")
            _style.push(tem);
        _style.push(sizeStyleTemplateWrap(item));
        _style.push('overflow:"hidden"');
        return grpTemplate({displayType: item.item_display_status,
            pageIdx: page.idx,
            id: item.item_id,
            style: _style,
            children: content});
    }

	function genStyleRender(item){
		var genStyle = [];
		if (item.item_opacity != 100) {
            genStyle.push('opacity:' + (item.item_opacity / 100));
        }
		if (!!item.bg_color){
			genStyle.push('backgroundColor:"' + item.bg_color + '"');
		}
		if (!!item.item_color){
			genStyle.push('color:"' + item.item_color + '"');
		}
		if (!!item.bd_radius){
			genStyle.push('borderRadius:"' + item.bd_radius + 'px"');
		}
		if (!!item.item_border){
			genStyle.push('borderSize:"' + item.item_border + 'px"');
		}
		if (!!item.bd_style){
			genStyle.push('borderStyle:"' + item.bd_style + '"');
		}
		
		return genStyle;
	}

    function renderItem(page, item, content) {
        var cmds = {};
        var posStyle = posStyleTemplate(item);//位置由最外围决定
        var genStyle = [];
        var animationData = null;
        var transformStyle = renderTransform(item);


        item.pageIdx = page.idx;

        if (item.item_display_status == undefined)item.item_display_status = 0;

		genStyle = genStyleRender(item);
        if (item.item_href != null && item.item_href != "") {
            //hide_el:-2|hide_el:65185725
            cmds = convertOldCmd(item);
        }

        var funcKey = item.item_type.toString();
        var renderFunc = itemFuncMap[funcKey]

        animationData = animationParse(item);

        if (renderFunc == undefined) {
            console.log("no render function defined for", item);
            return NoTypeDefinedT({item_type: item.item_type, style: posStyle});
        }

        if (animationData == null && (cmds.actions == undefined || cmds.actions.length == 0)) {
            genStyle.push(posStyle);
            if (transformStyle != "") genStyle.push(transformStyle);
            return renderFunc(page, item, genStyle, content)
        }

        var _itemContent = renderFunc(page, item, genStyle, content);//内容自己决定大小,位置有容器决定

        var conStyle = [posStyle];
        if (transformStyle != "")conStyle.push(transformStyle);

        if ((cmds.actions == undefined || cmds.actions.length == 0) && animationData != null) {
            return animationTemplate({animationClass: animationData.animationClass,
                children: _itemContent,
                animation: animationData.animation,
                normalStyle: conStyle.join(','),
                pageIdx: page.idx,
                displayType: item.item_display_status,
                id: item.item_id});
        }
        if (animationData != null) {
            _itemContent = animationTemplate({animationClass: animationData.animationClass,
                children: _itemContent,
                animation: animationData.animation,
                normalStyle: "",
                pageIdx: page.idx,
                displayType: 0,
                id: item.item_id});
        }
        if ((cmds.actions != undefined && cmds.actions.length > 0)) {
			cmds.actions = cmds.actions.join(",");
            return touchTriggerTemplate({
                normalStyle: conStyle.join(','),
                children: _itemContent,
                pageIdx: page.idx,
                id: item.item_id,
                triggerActions: cmds
            });
        }
        return "";

        function animationParse(item) {
            var animation = [];
            var animationClass = [];
            if (!(item.item_animation == null || item.item_animation === "" || item.item_animation === "none")) {
				var temp = null;
				try{
					temp = JSON.parse(item.item_animation_val);
				}catch(e){
					temp = null;
				}
                if (temp != null) {
                    if (temp instanceof Array) {
                        animation = [];
                        var tempClass = JSON.parse(item.item_animation_val);
                        _.each(temp, function (a, idx) {
                            animation.push({
                                animationDelay: a.delay + "s",
                                animationDuration: a.duration + "s",
                                animationIterationCount: a.infinite
                            });
                            if (idx < tempClass.length) {
                                animationClass.push(tempClass[idx]);
                            }
                        });
                    } else {
                        animation = [
                            {
                                animationDelay: temp.delay + "s",
                                animationDuration: temp.duration + "s",
                                animationIterationCount: temp.infinite
                            }
                        ];
                        animationClass = [item.item_animation];
                    }
                } else {
                    animation = [defaultAnimation];
                    animationClass = [item.item_animation];
                }
                return {
                    animation: JSON.stringify(animation),
                    animationClass: JSON.stringify(animationClass)
                };
            }
            return null;
        }

        function convertOldCmd(item) {
			//通常是type 18
			var item_href = item.item_href;
            var _cmdMap = {
                "hide_el": ["componentDo", "hide"],
                "show_el": ["componentDo", "show"],
				"telto"  : ["phoneFunc","telto"],
				"http":function(_link){
					var tid = articleLinkDetect(_link);
					if(tid != null){
						return '{action:"' + linkToAction(_link) + '",propagate:true}';
					}
					return null;
				}
            }
            var actionTemplate = _.template('{action:"<%= cmd %>",propagate:<%= propagate%>}');
            //hide_el:-2|hide_el:65185725, 
			var cmds = null;
			try{
				cmds = JSON.parse(item_href);
			}catch(e){
				return {evt:"tap",actions:[]};
			}
			
			if(cmds != null && cmds instanceof Array){
				return convertv2Cmd(cmds);
			}else{
				return convertv1Cmd(item);
			}
			
			function convertv1Cmd(item_href){
				var _cmds = item_href.split("|");
				var res = {evt:"tap",actions:strToActions(item_href)};
				return res;
			}
			function strToActions(item_href){
				var _cmds = item_href.split("|");
				var actions = [];
				_.each(_cmds, function (cmd) {
					var args = cmd.split(":");
					var new_cmd = _cmdMap[args[0]];
					var resStr = "";
					if(new_cmd != undefined){
						if (new_cmd instanceof Array) {
							args.splice(0, 1);
							new_cmd = new_cmd.concat(args);
							var _method = new_cmd[0];
							new_cmd.splice(0, 1);
							resStr = _method + "(" + new_cmd.join(",") + ")";
							actions.push(actionTemplate({cmd: resStr, propagate: true}));
						} else if(!!(new_cmd && new_cmd.constructor && new_cmd.call && new_cmd.apply)){
							var cmd = new_cmd.apply(null,[cmd]);
							if(cmd != null)	actions.push(cmd);
						}
					}
				});
				return actions;
			}
			
			function convertv2Cmd(cmds){
				//"[{"meTap":{"target":"_blank","value":"http://www.agoodme.com/#/preview/tid=154ebc5570c44252"}}]"
				//[{"meTap":"show_el:-2|show_el:53054687"}]'
				//"[{\"meTap\":\"telto:0571-64395888\"}]"
				var res = {evt:"tap",actions:[]};
				_.each(cmds,function(cmd){
					if(cmd.meTap != undefined){//放弃多事件的case
						debugger;
						if(cmd.meTap.hasOwnProperty("value"))
							res.actions.push('{action:"' + linkToAction(cmd.meTap.value) + '",propagate:true}');
						else if(typeof cmd.meTap == "string"){
							res.actions = res.actions.concat(strToActions(cmd.meTap));
						}
					}
				});
				return res;
			}
 			
			function linkToAction(_link){
				var tid = _articleLinkDetect(_link);
				if(tid != null){
					return "gotoArticle(" + tid + ")";
				}else{
					return "gotoLink(" + _link + ")";
				}
			}
			
			function _articleLinkDetect(_link){
				var articleLink = /www\.agoodme\.com\/#\/preview\/tid=([0-9|a-f|A-F]+)/
				var res = articleLink.exec(_link);
				if(res != null){
					return res[1];
				}
				return null;
			}
        }
    }

}

module.exports = main;



