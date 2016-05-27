/**
 * Created by lifeng on 2016/5/25.
 */
define("MeSvg", function () {
    var React = require("react");
    var ReactDOM = require("react-dom");
    var MeSvg = React.createClass({
        render: function () {
            var style={perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', border: 'none', boxSizing: 'border-box', animationDelay: '0.3s',width: '320px', height: '320px'};
            var svgStr='<svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="71 -165 183 745" xml:space="preserve">'
                + '<path fill="none" stroke="#FF0000" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" d="M77-159v304.472	c0,5.5,4.328,9.528,9.828,9.528H238.5c5.5,0,9.5,4.972,9.5,10.472v5.157c0,5.5-4,10.371-9.5,10.371H86.828	c-5.5,0-9.828,4.129-9.828,9.629v4.151c0,5.5,4.328,10.22,9.828,10.22H238.5c5.5,0,9.5,4.28,9.5,9.78v5.157	c0,5.5-4,10.062-9.5,10.062H87.826c-5.5,0-9.826,4.438-9.826,9.938v5.157c0,5.5,4.326,9.905,9.826,9.905H238.5	c5.5,0,9.5,4.595,9.5,10.095v4.15c0,5.5-4,9.755-9.5,9.755H89.822c-5.5,0-9.822,4.745-9.822,10.245v5.157	c0,5.5,4.322,9.598,9.822,9.598h147.68c5.5,0,10.498,4.902,10.498,10.402V574" id="path1" style="transform: matrix(1, 0, 0, 1, 0, 0); stroke-dasharray: 1863.11; stroke-dashoffset: 1863.11; animation-name: dash489; animation-duration: 10s; animation-timing-function: linear; animation-delay: 3.4s; animation-iteration-count: 1; animation-fill-mode: forwards;"></path>'
                +'</svg>'
            return (<div style={style} dangerouslySetInnerHTML={{__html:svgStr}}></div>)
        }
    });
    return MeSvg;
});
