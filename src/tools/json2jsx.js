var _ = require("underscore");
var fs = require('fs');
var process = require('process');
var url = require('url');  
var http = require('http')

function main(tpl,mag){
var MePageT = _.template("<MePage idx={<%= idx %>} cxt={cxt} >\n<%= children%>\n</MePage>");
var NoTypeDefinedT = _.template('<div cxt={cxt} style={{<%= style%>}}> No Such Type defined <%= item_type %></div>');
var posStyleTemplate = _.template('top:"<%= item_top%>px",left:"<%= item_left%>px",zIndex:<%= item_layer%>');
var sizeStyleTemplate = _.template('height:"<%= item_height%>px",width:"<%= item_width%>px",position:"absolute"');
var fontStyleTemplate = _.template('fontSize:"<%= font_size%>px", color:"<%= item_color%>",fontFamily:"<%= font_family %>"');
var imgTemplate = _.template('<MeImage src="<%= src%>" displayType = {<%= displayType%>} style={{<%= style %>}}></MeImage>');
var grpTemplate = _.template('<MeDiv displayType = {<%= displayType%>} pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>" style={{<%= style %>}}><%= children%></MeDiv>');
var divTemplate = _.template('<div style={{<%= style %>}}><%= content%></div>')
var animationTemplate = _.template('<MeAnimation displayType = {<%= displayType%>} pageIdx={<%= pageIdx %>} cxt={cxt} animationClass="<%= animationClass%>" animation={<%= animation%>} normalStyle={{<%= normalStyle%>}}><%= children %></MeAnimation>');
var touchTriggerTemplate = _.template('<MeTouchTrigger pageIdx={<%= pageIdx %>} cxt={cxt} id="<%= id%>" normalStyle={{<%= style%>}} triggerActions={{"<%= triggerActions.evt %>":<%= triggerActions.cmds %>}}><%= children %></MeTouchTrigger>');


var itemFuncMap = {
	"1":		imgRenderItem,
	"2":		textRenderItem,
	"3":		imgRenderItem,
	"18":		imgRenderItem,
	"34":		grpRenderItem,
};

var gId = 0;

var defaultAnimation = 	'{animationIterationCount:"1",animationDelay:"0s",animationDuration:"1s"}';
	var index = [];
	index.push(-1);
	var pageContent = [];
	var pages = mag.pages;
 	for(var i = 0;i < pages.length;i ++){
		pages[i].idx = i;
		pageContent.push(renderPage(pages[i]));
		index.push(i);
	}
	index.push(-1);
	return (_.template(tpl))({pages:pageContent.join(","),layout:index.toString(),music_src:mag.tpl_music});
function renderPage(page){
	var items = [];
	var grps = indexItems(page.item_object);
	
	_.each(grps,function(grp,key){
		var newGrps = []
		_.each(grp.items,function(item,idx){
			newGrps.push(renderItem(page,item));
		});
		if(grp.owner != null){
			grpDiv = renderItem(page,grp.owner,newGrps);
			items.push(grpDiv);
		}else{
			items = items.concat(newGrps);
		}
	});
	page.children = items.join("\n");
	return (MePageT(page) + "\n");
}

function indexItems(items){
	var grps = {};
	grps["0"] = {
				items:[],
				owner:null
			}
	for(var i = 0; i < items.length;i ++){
		if(items[i].group_id == undefined) items[i].group_id = "0";
		if(grps.hasOwnProperty(items[i].group_id)){
			if(items[i].item_id == items[i].group_id) grps[items[i].group_id].owner = items[i];
			else grps[items[i].group_id].items.push(items[i]);
		}else{
			grps[items[i].group_id] = {
				items:[],
				owner:null
			}
			if(items[i].item_id == items[i].group_id) grps[items[i].group_id].owner = items[i];
			else grps[items[i].group_id].items.push(items[i]);
		}
	}
	return grps;
}
function noTypeDefined(page,item){
	var _style = [posStyleTemplate(item),sizeStyleTemplate(item)];
	return NoTypeDefinedT({item_type:item.item_type,style:_style});
}

function imgRenderItem(page,item,_style){
	return imgTemplate({src:item.item_val,displayType:item.item_display_status,style:_style.join(",")});
}

function textRenderItem(page,item,_style){
	_style.push(fontStyleTemplate(item));
	return divTemplate({content:item.item_val,displayType:item.item_display_status,style:_style.join(",")});
}

function grpRenderItem(page,item,_style,content){
	_style.push(fontStyleTemplate(item));
	return grpTemplate({displayType:item.item_display_status,
						pageIdx:page.idx,
						id:item.item_id,
						style:_style,
						children:content});
}
function renderItem(page,item,content){
	var cmds = [];
	var _style = [posStyleTemplate(item),sizeStyleTemplate(item)];
	var animation = null;
	item.pageIdx = page.idx;
	if(item.item_href != null && item.item_href != ""){
		//hide_el:-2|hide_el:65185725
		cmds = convertOldCmd(item.item_href);
	}
	if(!(item.item_animation == null || item.item_animation === "" || item.item_animation === "none")){
		animation = item.item_animation_val != "" ? item.item_animation_val
				.replace(/delay/,"animationDelay")
				.replace(/duration/,"animationDuration")
				.replace(/infinite/,"animationIterationCount") : defaultAnimation;
	}
	
	var funcKey = item.item_type.toString();
	var renderFunc = itemFuncMap[funcKey]
	
	if(renderFunc == undefined ){
		return NoTypeDefinedT({item_type:item.item_type,style:_style});
	}
	
	if(animation == null && cmds.length == 0){
		return renderFunc(page,item,_style,content)
	}
	
	var _itemContent = renderFunc(page,item,[],content);//_style将放在外围
	
	if(cmds.length == 0 && animation != null){
		return animationTemplate({animationClass:item.item_animation,
								  children:_itemContent,
								  animation:animation,
								  normalStyle:_style.join(","),
								  pageIdx:page.idx,
								  displayType:item.item_display_status,
								  id:item.item_id});
	}
	if(animation != null){
		_itemContent = animationTemplate({animationClass:item.item_animation,
								  children:_itemContent,
								  animation:animation,
								  normalStyle:"",
								  pageIdx:page.idx,
								  displayType:0,
								  id:item.item_id});
	}
	if(cmds.length > 0){
		return touchTriggerTemplate({
			style:_style,
			children:_itemContent,
			pageIdx:page.idx,
			id:item.item_id,
			triggerActions:{evt:"tap",
							cmds:"[" + cmds.join(",") + "]"
						}
		});
	}
	return "";
	
	function convertOldCmd(item_href){
		var _cmdMap ={
			"hide_el":["componentDo","hide"],
			"show_el":["componentDo","show"],
		}
		var actionTemplate = _.template('{action:"<%= cmd %>",propagate:<%= propagate%>}');
			//hide_el:-2|hide_el:65185725
		var _cmds = item_href.split("|");
		var res = [];
		_.each(_cmds,function(cmd){
			var args = cmd.split(":");
			var new_cmd = _cmdMap[args[0]];
			var resStr = "";
			if(new_cmd != undefined){
				args.splice(0,1);
				new_cmd = new_cmd.concat(args);
				var _method = new_cmd[0];
				new_cmd.splice(0,1);
				resStr = _method + "(" + new_cmd.join(",") + ")";
				res.push(actionTemplate({cmd:resStr,propagate:true}));
			}
		});
		return res;
	}
}
	
	
}

module.exports = main;



