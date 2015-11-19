// setup

	var path = require("path");

// module

var BuildPaths = function(app, site) {
			
	var paths = {};

	paths.themesBase = path.join(app.siteBase, app.themesFolder);
	paths.contentBase = path.join(app.siteBase, app.contentFolder);
	paths.publicBase = path.join(app.siteBase, app.publicFolder);

	paths.themes = "/" + app.themesFolder;	
	paths.homepage = path.join(paths.contentBase, site.homepage);	
	paths.error = path.join(paths.contentBase, site.error);
	
	return paths;
	
}

module.exports = BuildPaths;