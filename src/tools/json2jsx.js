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
var grpTemplate = _.template("<MeDiv displayType = {<%= displayType%>} pageIdx={<%= pageIdx %>} cxt={cxt} id={<%= id%>} style={{<%= style %>}}><%= children%></MeDiv>");
var divTemplate = _.template('<div style={{<%= style %>}}><%= content%></div>')
var animationTemplate = _.template('<MeAnimation displayType = {<%= displayType%>} pageIdx={<%= pageIdx %>} cxt={cxt} animationClass="<%= animationClass%>" animation={<%= animation%>} normalStyle={{<%= normalStyle%>}}><%= children %></MeAnimation>');


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
		break;
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

	var _style = [posStyleTemplate(item),sizeStyleTemplate(item)];
	var otherStyle = [];
	if(item.item_opacity != 100){}
	
	if(item.item_animation == null || item.item_animation === "" || item.item_animation === "none"){
		return imgTemplate({src:item.item_val,style:_style.join(",")});
	}else{
		var animation = item.item_animation_val != "" ? item.item_animation_val
				.replace(/delay/,"animationDelay")
				.replace(/duration/,"animationDuration")
				.replace(/infinite/,"animationIterationCount") : defaultAnimation;
		return animationTemplate({animationClass:item.item_animation,
								  animation:animation,
								  normalStyle:_style.join(","),
								  pageIdx:page.idx,
	}
								  animation:animation,
								  pageIdx:page.idx,
	}
	}
}
	
	
}

module.exports = main;



