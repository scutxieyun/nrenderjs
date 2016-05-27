/**
 * Created by lifeng on 2016/5/25.
 */
define("MeAudio", function () {
    var React = require("react");
    var ReactDOM = require("react-dom");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeAudio = React.createClass({
        mixins:[MeComponentMixin],
        render: function () {
            var style = {width: '20px', height: '20px'};
            return (<div className="audioWrapper" ><img src="images/audio.png"  />
                <audio src="http://ac-hf3jpeco.clouddn.com/bed3dbebf579cc7e95ac.mp3" preload="none" play-status="play-current"></audio></div>)
        }
    });
    return MeAudio;
});
