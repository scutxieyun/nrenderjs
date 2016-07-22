module.exports = {
    entry: "./src/renderjs_entry.js",
    output: {
        //path: "./lib",
        filename: "renderjs.js",
		libraryTarget:"var",
		library:"renderjs"
    },
	external:{
		"react":"React",
		"react-dom":"ReactDOM",
	},
    module: {
        loaders: [
        ]
    }
};