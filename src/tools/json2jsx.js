var _ = require("underscore");
var fs = require('fs');
var url = require('url');
var http = require('http');
function main(tpl, magObj, callback) {
    var MePageT = _.template('<MePage idx={<%= idx %>} cxt={cxt} normalStyle={{height:"<%= page_height%>px",width:"<%= page_width%>px"}} >\n<%= children%>\n</MePage>');
    var NoTypeDefinedT = _.template('<div cxt={cxt} style={{<%= style%>}}> No Such Type defined <%= item_type %></div>');
    var posStyleTemplate = _.template('top:"<%= item_top%>px",left:"<%= item_left%>px",zIndex:<%= item_layer%>,position:"absolute"');
    var imgTemplate = _.template('<MeImage src="<%= src%>" id=<%= id%> displayType = {<%= displayType%>} normalStyle={{<%= style %>}}></MeImage>');
    var grpTemplate = _.template('<MeDiv displayType = {<%= displayType%>} pageIdx={<%= pageIdx %>} cxt={cxt} id=<%= id%> normalStyle={{<%= style %>}}><%= children%></MeDiv>');
    var divTemplate = _.template('<div style={{<%= style %>}}><%= content%></div>');
    var textTemplate = _.template('<MeText data={<%= data%>} displayType = {<%= displayType%>} normalStyle={{<%= style %>}}></MeText>');
    var animationTemplate = _.template('<MeAnimation id=<%= id%> displayType = {<%= displayType%>} pageIdx={<%= pageIdx %>} cxt={cxt} animationClass={<%= animationClass%>} animation={<%= animation%>} normalStyle={{<%= normalStyle%>}}><%= children %></MeAnimation>');
    var touchTriggerTemplate = _.template('<MeTouchTrigger pageIdx={<%= pageIdx %>} cxt={cxt} id=<%= id%> normalStyle={{<%= normalStyle%>}} triggerActions={{"<%= triggerActions.evt %>":[<%= triggerActions.actions%>]}}><%= children %></MeTouchTrigger>');
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
	
	var convertOldCmdWrap = null;//临时为了合并，将convertOldCmd过度一下，减少后面合并的成本
    var itemFuncMap = {
        "1": imgRenderItem,     //图片
        "2": textRenderItem,    //文本
        "3": imgRenderItem,     //水印
        "7": musicRenderItem,   //音频
        "8": videoRenderItem,   //视频
        "10": imgRenderItem,    //边框
        "12": phoneRenderItem,  //打电话
        "14":inputRenderItem,   //输入
        "15":mapRenderItem,     //地图
        "17": grpRenderItem,    //多图边框对象
        "18": imgRenderItem,    //带遮罩的图片
        "19":submitRenderItem,  //提交按钮
        "20":radioRenderItem,    //单选
        "21":checkboxRenderItem, //多选
        "22":voteRenderItem,     //投票
        "24": clipRenderItem,    //涂抹
        "25":longPressRenderItem,//长按元素
        "27":shakeRenderItem,    //摇一摇
        "34": grpRenderItem,     //多图边框对象
        "36":rewardRenderItem,   //打赏
		"37": gallaryRenderItem, //图集
        "38": labelRenderItem,   //标签
        "39": svgRenderItem,     //SVG
        "40":panoramaRenderItem, //360全景图
        "41":redEnvelopesRenderItem //红包
    };
    //给一个初始的随机数
    var gId = (0 | (Math.random() * 998));
	var mag = magObj.tplData;
    //获取临时存储的变量，后续红包和打赏等元素需要
    var tplObj = magObj.tplObj;
    var tplId = tplObj.tpl_id;  //作品ID
    var userId = tplObj.author || ""; //用户ID
    var userHeaderSrc = tplObj.author_img || ""; //用户头像
    var userName = tplObj.author_name || "";    //用户名称
    var userLeave = tplObj.author_vip_level || 0;         //用户等级
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
    pageTemp = (_.template(tpl))({pages: pagesContentTemp, 
									layout: JSON.stringify(index),
									music_src: tplObj.tpl_music,
									music_autoplay: (!!tplObj.tpl_music_autoplay) ? "true":"false"});
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
        var idxRes = indexItems(page.item_object);
		var grps = idxRes.grps;
		page.referredItems = idxRes.referredItems;
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
        var res = {
			grps:{},
			referredItems:{}
		};
		var grps = res.grps;
        grps["0"] = {
            items: [],
            owner: null
        }
		var referredItems = res.referredItems;
		var referedPattern = /([0-9]+)/g
        for (var i = 0; i < items.length; i++) {
			if (items[i].animate_end_act != null && items[i].animate_end_act != ""){
				registerItem4Referred(items[i].animate_end_act,referredItems);
			}
			if (items[i].item_href != null && items[i].item_href != ""){
				//分析那些item被引用
				registerItem4Referred(items[i].item_href,referredItems);
			}
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
		return res;
		
		function registerItem4Referred(val,referredItems){
			var m = referedPattern.exec(val);
			if(m != null){
					debugger;
					for(var j = 1;j < m.length;j ++){
						if(m[j] != null){
							if(referredItems.hasOwnProperty(m[j]) == false){
								referredItems[m[j]] = true;
							}else{
								referredItems[m[j]] = false; //重复id定义,不能使用这个id
							}
						}
					}
			}
		}
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
	
function gallaryRenderItem(page,item,_style,content,hasWrap){
	var template = _.template('<MeGallary cxt={cxt} pageIdx={<%= pageIdx%>} id=<%= id%> imgItems={<%=imgItems%>} normalStyle={{<%= normalStyle%>}}></MeGallary>');
	var imgs = item.item_val.split("|");
	var urls = item.item_href.split("@");
	var imgItems = [];
	_.each(imgs,function(img,i){
		imgItems.push({
			src:img,
			action:urls[i],
		})
	});
	_style.push(sizeStyleTemplateWrap(item));
	return template({
		pageIdx:page.idx,
		id:generateId(page,item,hasWrap),
		imgItems:JSON.stringify(imgItems),
		normalStyle:_style.join(",")
	});
}

function generateId(page,item,hasWrap){
	if(page.referredItems.hasOwnProperty(item.item_id) == false || page.referredItems[item.item_id] == false ){
		return '{null}';
	}else{
		if(hasWrap)
			return '"' + item.item_id + 's"';
		else
			return '"' + item.item_id + '"';
	}
}
	
function imgRenderItem(page,item,_style,content,hasWrap){
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
	
	
    return imgTemplate({src:item.item_val,
						displayType:item.item_display_status,
						style:_style.join(","),
						id:generateId(page,item,hasWrap)});
}
function musicRenderItem(page,item,_style,content,hasWrap){
    var audioTemplate = _.template('<MeAudio pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>" triggerActions={{"<%= triggerActions.evt %>":[<%= triggerActions.actions%>]}}  normalStyle={{<%= normalStyle%>}} src="<%= src%>" autoplay={<%= autoplay%>} musicImg="<%= music_img%>" musicName="<%= music_name%>" ></MeAudio>');
    //处理音频的事件
    if(!item.animate_end_act){
        item.animate_end_act = "";
    }
    item.animate_end_act = item.animate_end_act.replace(/meTap/,'"meTap"');
    var cmds = convertOldCmdWrap(item.animate_end_act);
    if (!(cmds.actions != undefined && cmds.actions.length > 0)) {
        cmds.actions = [];
    }

    cmds.actions.join(",")
    return audioTemplate({
		normalStyle:_style.join(","),
		src:item.item_val,
		autoplay: item.music_autoplay ? true:false,
		music_name:item.music_name,
		music_img:item.music_img,//实际没有用，后续怎么处理看产品部todo
		pageIdx:page.idx,
		id:generateId(page,item,hasWrap),
        triggerActions:cmds
	});
}
    /**
     * 解析单选元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function radioRenderItem(page,item,_style){
        var radioTemplate = _.template('<MeRadio pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeRadio>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var itemVal = null;
        //预防JSON字符串解析出问题
        try{
            itemVal = JSON.parse(item.item_val);
        }catch (e){
            console.log(e.name + ": " + e.message);
            return;
        }
        if(itemVal == null){
            return;
        }
        var data = {};
        data.title = itemVal.title;
        data.options = itemVal.options;
        data.objectId = item.objectId;
        data = JSON.stringify(data);
        return radioTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析多选元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function checkboxRenderItem(page,item,_style){
        var checkboxTemplate = _.template('<MeCheckbox pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeCheckbox>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var itemVal = null;
        //预防JSON字符串解析出问题
        try{
            itemVal = JSON.parse(item.item_val);
        }catch (e){
            console.log(e.name + ": " + e.message);
            return;
        }
        if(itemVal == null){
            return;
        }
        var data = {};
        data.title = itemVal.title;
        data.options = itemVal.options;
        data.objectId = item.objectId;
        data = JSON.stringify(data);
        return checkboxTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析label元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function labelRenderItem(page,item,_style){
        var labelTemplate = _.template('<MeLabel pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeLabel>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var data = {};
        var itemSubVal = item.item_val_sub;
        itemSubVal = JSON.parse(itemSubVal);
        for(var key in itemSubVal){
            data.type = key;
            data.typeImg = itemSubVal[key];
        }
        data.content = item.item_val;
        data.direction = item.ext_attr;
        data = JSON.stringify(data);
        return labelTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }

    /**
     * 解析svg元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function svgRenderItem(page,item,_style){
        var svgTemplate = _.template('<MeSvg pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeSvg>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var data = {};
        data.content = item.item_val;
        var itemSubVal = item.item_val_sub;
        itemSubVal = JSON.parse(itemSubVal);
        data.delay = itemSubVal.delay;
        data.duration = itemSubVal.duration;
        data.infinite = itemSubVal.infinite;
        data.a1 = itemSubVal.a1;
        data.a2 = itemSubVal.a2;
        data.b1 = itemSubVal.b1;
        data.b2 = itemSubVal.b2;
        data = JSON.stringify(data);
        return svgTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析提交按钮元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function submitRenderItem(page,item,_style){
        var submitTemplate = _.template('<MeSubmit pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeSubmit>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var data = {};
        data.content = item.item_val;
        data.cnType = item.item_cntype;
        //行高特殊处理
        var borderWidth = item.item_border || 0;
        data.lineHeight = (item.item_height-2*borderWidth) + "px";
        data = JSON.stringify(data);
        return submitTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析map元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function mapRenderItem(page,item,_style){
        var mapTemplate = _.template('<MeMap pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeMap>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var itemVal = null;
        //预防JSON字符串解析出问题
        try{
            itemVal = JSON.parse(item.item_val);
        }catch (e){
            console.log(e.name + ": " + e.message);
            return;
        }
        if(itemVal == null){
            return;
        }
        var data = {};
        data.lng = itemVal.lng;
        data.lat = itemVal.lat;
        data.zoom = itemVal.zoom;
        data = JSON.stringify(data);
        return mapTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析input元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function inputRenderItem(page,item,_style){
        var inputTemplate = _.template('<MeInput pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeInput>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var pageId = page.objectId;
        var data = {};
        data.placeholder = item.item_val || "";
        data.objectId = item.objectId || "";
        data = JSON.stringify(data);
        return inputTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析打赏元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function rewardRenderItem(page,item,_style){
        var rewardTemplate = _.template('<MeReward pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeReward>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var pageId = page.objectId;
        var data = {};
        data.content = item.item_val;
        data.target = item.item_href || "";
        data.tplId = tplId;
        data.pageId = pageId;
        data.userId = userId;
        data.userName = userName;
        data.userHeaderSrc = userHeaderSrc;
        data.userLeave = userLeave;
        //行高特殊处理
        var borderWidth = item.item_border || 0;
        data.lineHeight = (item.item_height-2*borderWidth) + "px";
        data = JSON.stringify(data);
        return rewardTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析红包元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function redEnvelopesRenderItem(page,item,_style){
        var redEnvelopesTemplate = _.template('<MeRedEnvelopes pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MeRedEnvelopes>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var pageId = page.objectId;
        var data = {};
        data.content = item.item_val;
        data.target = item.item_href || "";
        data.tplId = tplId;
        data.pageId = pageId;
        data.userId = userId;
        data.userName = userName;
        data.userHeaderSrc = userHeaderSrc;
        data.envelopesId = item.item_val_sub || "";
        data = JSON.stringify(data);
        return redEnvelopesTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析电话元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function phoneRenderItem(page,item,_style){
        var phoneTemplate = _.template('<MePhone pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"   normalStyle={{<%= normalStyle%>}} data={<%= data%>} ></MePhone>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var data = {};
        data.content = item.item_val_sub || "";
        data.tel = "tel:"+item.item_val;
        data.extAttr = item.ext_attr || "";
        //行高特殊处理
        var borderWidth = item.item_border || 0;
        data.lineHeight = (item.item_height-2*borderWidth) + "px";
        data = JSON.stringify(data);
        return phoneTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id
        });
    }
    /**
     * 解析视频元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function videoRenderItem(page,item,_style,content,hasWrap){
        if(!item.item_href){
            return;
        }
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        //处理视频的事件
        if(!item.animate_end_act){
            item.animate_end_act = "";
        }
        item.animate_end_act = item.animate_end_act.replace(/meTap/,'"meTap"');
        var cmds = convertOldCmdWrap(item.animate_end_act);
        if (!(cmds.actions != undefined && cmds.actions.length > 0)) {
            cmds.actions = [];
        }
        cmds.actions.join(",");
        var audioTemplate;
        var data = {};
        //todo 最好用正则表达式获取 src height
        //<iframe frameborder="0" width="640" height="498" src="http://v.qq.com/iframe/player.html?vid=b0020d8wsqm&tiny=0&auto=0" allowfullscreen></iframe>
        var poster = item.item_val;
        var width = item.item_width;
        var height = item.item_height;
        var src = item.item_href;
        if(src.indexOf("iframe") > -1){
            var tempSrcArr = src.split('src="');
            src = tempSrcArr[1].split('"')[0];
            var tempHeightArr = item.item_href.split('height=');
            var iframeHeight = tempHeightArr[1].split(' ')[0];
			//var iframeHeight = extractIframe("height");
            data.iframeHeight = iframeHeight;
            audioTemplate = _.template('<MeIFrameVideo pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>" triggerActions={{"<%= triggerActions.evt %>":[<%= triggerActions.actions%>]}}  normalStyle={{<%= normalStyle%>}} data={<%= data%>}  ></MeIFrameVideo>');
        }else{
            audioTemplate = _.template('<MeInnerVideo pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"  triggerActions={{"<%= triggerActions.evt %>":[<%= triggerActions.actions%>]}} normalStyle={{<%= normalStyle%>}} data={<%= data%>}  ></MeInnerVideo>');
            data.width = width;
            data.height = height;
        }
        data.src = src;
        if(poster){
            //modify by fishYu 2016-4-22 18:44 修改让视频的背景图片适配视频的区域
            poster = poster.split("?")[0]+"?imageView2/1/w/"+parseInt(width)+"/h/" +parseInt(height);
        }
        data.poster = poster;
        data = JSON.stringify(data);
        return audioTemplate({
            normalStyle:_style.join(","),
            data:data,
            pageIdx:page.idx,
            id:generateId(page,item,hasWrap),
            triggerActions:cmds
        });
		
		
		function extractIframe(key){
			var pat = new RegExp(key + "=" + "(\S*)");
			var m = pat.exec(key);
			if(m != null && m.length == 2){
				return m[1];
			}
			return "";
		}
    }
    /**
     * 解析涂抹元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function clipRenderItem(page,item,_style,content,hasWrap){
        if(!item.item_href){
            return;
        }
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        if(!item.animate_end_act){
            item.animate_end_act = "";
        }
        item.animate_end_act = item.animate_end_act.replace(/meTap/,'"meTap"');
		var cmds = convertOldCmdWrap(item.animate_end_act);
		if (!(cmds.actions != undefined && cmds.actions.length > 0)) {
			cmds.actions = [];
        }
        cmds.actions.join(",");
        var clipTemplate = _.template('<MeClip pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"  normalStyle={{<%= normalStyle%>}} triggerActions={{"<%= triggerActions.evt %>":[<%= triggerActions.actions%>]}} data={<%= data%>}  ></MeClip>');
        var data = {};

        data.src = item.item_href;
        data.content = item.item_val;
        data.percent = item.clip_percent;
        data = JSON.stringify(data);
        return clipTemplate({
            normalStyle:_style.join(","),
            data:data,
            pageIdx:page.idx,
            id:generateId(page,item,hasWrap),
			triggerActions:cmds
			
        });
    }

    /**
     * 解析摇一摇元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function shakeRenderItem(page,item,_style){
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        if(!item.animate_end_act){
            item.animate_end_act = "";
        }
        item.animate_end_act = item.animate_end_act.replace(/meTap/,'"meTap"');
        var cmds = convertOldCmdWrap(item.animate_end_act);
        if (!(cmds.actions != undefined && cmds.actions.length > 0)) {
            cmds.actions = [];
        }
        cmds.actions.join(",");
        var shakeTemplate = _.template('<MeShake pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>"  normalStyle={{<%= normalStyle%>}} triggerActions={{"<%= triggerActions.evt %>":[<%= triggerActions.actions%>]}} ></MeShake>');
        return shakeTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            id:item.item_id,
            triggerActions:cmds

        });
    }

    /**
     * 解析长按元素
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function longPressRenderItem(page,item,_style){
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        if(!item.animate_end_act){
            item.animate_end_act = "";
        }
        item.animate_end_act = item.animate_end_act.replace(/meTap/,'"meTap"');
        var cmds = convertOldCmdWrap(item.animate_end_act);
        if (!(cmds.actions != undefined && cmds.actions.length > 0)) {
            cmds.actions = [];
        }
        cmds.actions.join(",");
        var longPressTemplate = _.template('<MeLongPress pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>" data={<%= data %>} normalStyle={{<%= normalStyle%>}} triggerActions={{"<%= triggerActions.evt %>":[<%= triggerActions.actions%>]}} ></MeLongPress>');
        var data = {};
        data.borderWidth = item.item_border;
        data = JSON.stringify(data);
        return longPressTemplate({
            normalStyle:_style.join(","),
            pageIdx:page.idx,
            data:data,
            id:item.item_id,
            triggerActions:cmds

        });
    }

    /**
     * 解析全景图
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function panoramaRenderItem(page,item,_style){
        var template = _.template('<MePanorama cxt={cxt} pageIdx={<%= pageIdx%>} id="<%= id%>" imgItems={<%=imgItems%>} normalStyle={{<%= normalStyle%>}}></MePanorama>');
        var imgs = item.item_val.split("|");
        var imgItems = [];
        _.each(imgs,function(img,i){
            imgItems.push(img)
        });
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        return template({
            pageIdx:page.idx,
            id:item.item_id,
            imgItems:JSON.stringify(imgItems),
            normalStyle:_style.join(",")
        });
    }

    /**
     * 解析投票
     * @param page
     * @param item
     * @param _style
     * @returns {*}
     */
    function voteRenderItem(page,item,_style){
        var template = _.template('<MeVote cxt={cxt} pageIdx={<%= pageIdx%>} id="<%= id%>" data={<%=data%>}  normalStyle={{<%= normalStyle%>}}></MeVote>');
        if ((item.item_width != undefined && item.item_width != 0 ) || (item.item_height != undefined && item.item_height != 0)) _style.push(sizeStyleTemplateWrap(item));
        //增加处理背景颜色
        if (item.bg_color == undefined || item.bg_color == null || item.bg_color == "null") item.bg_color = "transparent";
        _style.push(fontStyleTemplateWrap(item));
        var voteNum = page.page_vote || 0;
        var pageId = page.objectId || "";
        var content = item.item_val;
        var data = {};
        data.voteNum = voteNum;
        data.pageId = pageId;
        data.content = content;
        data = JSON.stringify(data);
        return template({
            pageIdx:page.idx,
            id:item.item_id,
            data:data,
            normalStyle:_style.join(",")
        });
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
                    pageTemp = (_.template(tpl))({pages: pagesContentTemp, 
									layout: JSON.stringify(index),
									music_src: tplObj.tpl_music,
									music_autoplay: (!!tplObj.tpl_music_autoplay) ? "true":"false"});
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
		var fontStyleTemplate = _.template('fontSize:"<%= font_size%>", color:"<%= item_color%>",fontFamily:"<%= font_family %>",backgroundColor:"<%= bg_color %>",borderRadius:"<%= bd_radius %>",' +
            'borderBottom:"<%= border_bottom %>",borderTop:"<%= border_top %>",borderLeft:"<%= border_left %>",borderRight:"<%= border_right %>",fontWeight:"<%= font_weight %>",' +
            'textAlign:"<%= font_halign %>",fontStyle:"<%= font_style %>",textDecoration:"<%= text_decoration %>",letterSpacing:"<%= font_dist %>"');
		var color = item.item_color;
		try{
			color = JSON.parse(color);
			color = color.colors[0];
			//"item_color": "{\"colors\":[\"#FF0000\"]}",
		}catch(e){
		//normal string
		}
		item.item_color = color;
        //添加边框样式
        var borderWidth = item.item_border; //边框宽度
        var borderRadius = item.bd_radius+"";  //边框圆角
        var borderColor = item.bd_color || "#000";  //边框颜色
        var borderSide = item.bd_side;   //哪边有值
        var borderStyle = item.bd_style || "solid";
        item.border_top = "";
        item.border_right = "";
        item.border_bottom = "";
        item.border_left = "";
        if(borderWidth){
            if(borderSide){
                if(borderSide.indexOf("top") > -1){
                    item.border_top = borderWidth + "px " +borderStyle +" " +borderColor;
                }
                if(borderSide.indexOf("right") > -1){
                    item.border_right = borderWidth +  "px " +borderStyle +" "  + borderColor;
                }
                if(borderSide.indexOf("bottom") > -1){
                    item.border_bottom = borderWidth +  "px " +borderStyle +" "  + borderColor;
                }
                if(borderSide.indexOf("left") > -1){
                    item.border_left = borderWidth +  "px " +borderStyle +" "  + borderColor;
                }
            }
        }
        if(borderRadius){
            if(borderRadius.indexOf("%") > -1){

            }else{
                if(borderRadius.indexOf("px") > -1){

                }else{
                    borderRadius = borderRadius + "px";
                }
            }
        }
        item.bd_radius = borderRadius;
        //对齐方式
        var align = item.font_halign=="mid"?"center":item.font_halign;
        var textAlign = align || "center";
        item.font_halign = textAlign;
        //letterSpacing
        item.font_dist = item.font_dist + "px";
        //字权重
        item.font_weight = item.font_weight || "";
        item.text_decoration = item.text_decoration || "";
        item.font_style = item.font_style || "";
		return fontStyleTemplate(item);
	}
	

    function textRenderItem(page, item, _style,content,hasWrap) {
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
        return textTemplate({data: data, displayType: item.item_display_status, style: _style.join(","),
			id:generateId(page,item,hasWrap),
		});
    }

    function grpRenderItem(page, item, _style, content,hasWrap) {
        var tem = renderTransform(item);
        if (tem != "")
            _style.push(tem);
        _style.push(sizeStyleTemplateWrap(item));
        _style.push('overflow:"hidden"');
        return grpTemplate({displayType: item.item_display_status,
            pageIdx: page.idx,
            id:generateId(page,item,hasWrap),
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
		convertOldCmdWrap = convertOldCmd;

        item.pageIdx = page.idx;

        if (item.item_display_status == undefined)item.item_display_status = 0;

		genStyle = genStyleRender(item);
       //TODO 这里有一些元素的item_href表示的是别的值
        //过滤掉视频8的item_href, 和涂抹24的item_href,和长按的25 item_href, 假话29,密码31的时候, 36打赏 37图集元素 40--360全景  41红包 过滤掉
        var itemType = item.item_type;
        if (item.item_href != null && item.item_href != "" && itemType != 8 && itemType != 24  && itemType != 29 && itemType != 31 && itemType != 36 && itemType != 37 && itemType != 40  && itemType != 41) {
            //hide_el:-2|hide_el:65185725
            cmds = convertOldCmd(item.item_href);
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
            return renderFunc(page, item, genStyle, content,false);//最终元素，没有包裹
        }

        var _itemContent = renderFunc(page, item, genStyle, content,true);//内容自己决定大小,位置有容器决定

        var conStyle = [posStyle];
        if (transformStyle != "")conStyle.push(transformStyle);
        if ((cmds.actions == undefined || cmds.actions.length == 0) && animationData != null) {
            return animationTemplate({animationClass: animationData.animationClass,
                children: _itemContent,
                animation: animationData.animation,
                normalStyle: conStyle.join(','),
                pageIdx: page.idx,
                displayType: item.item_display_status,
                id:generateId(page,item,false)});
        }
        if (animationData != null) {
            _itemContent = animationTemplate({animationClass: animationData.animationClass,
                children: _itemContent,
                animation: animationData.animation,
                normalStyle: "",
                pageIdx: page.idx,
                displayType: 0,
                id:generateId(page,item,false)});
        }
        if ((cmds.actions != undefined && cmds.actions.length > 0)) {
			cmds.actions = cmds.actions.join(",");
            return touchTriggerTemplate({
                normalStyle: conStyle.join(','),
                children: _itemContent,
                pageIdx: page.idx,
                id:generateId(page,item,true),
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
							if(a.duration < 0.2){return;}//如果动画太短，就忽略他算了。
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
				if(animationClass.length == 0){
					return null;
				}
                return {
                    animation: JSON.stringify(animation),
                    animationClass: JSON.stringify(animationClass)
                };
            }
            return null;
        }

        function convertOldCmd(item_href) {
			//通常是type 18
            var _cmdMap = {
                "hide_el": ["componentDo", "hide"],
                "show_el": ["componentDo", "show"],
				"telto"  : ["phoneFunc","telto"],
				"http":function(_link){
					var tid = _articleLinkDetect(_link);
					if(tid != null){
						return '{action:"' + linkToAction(_link,"_self") + '",propagate:true}';
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
				//console.log("old cmd format");
			}
			
			if(cmds != null && cmds instanceof Array){
				return convertv2Cmd(cmds);
			}else{
				return convertv1Cmd(item_href);
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
						if(cmd.meTap.hasOwnProperty("value"))
							res.actions.push('{action:"' + linkToAction(cmd.meTap.value,cmd.meTap.target) + '",propagate:true}');
						else if(typeof cmd.meTap == "string"){
							res.actions = res.actions.concat(strToActions(cmd.meTap));
						}
					}
				});
				return res;
			}
 			
			function linkToAction(_link,target){
				var tid = _articleLinkDetect(_link);
				if(tid != null){
					return "gotoArticle(" + tid + "," + target + ")";
				}else{
					return "gotoLink(" + _link + "," + target + ")";
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



