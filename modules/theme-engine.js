// setup

	var path = require("path"),
	 	fileHelper = require("peezy-file-helper"),
	 	_ = require("lodash");

	var ThemeEngine = {};
	
// initialize

	ThemeEngine.init = function(config, app) {
		
		this.locals = config;
		
		this.loadThemes();
		
		this.app = app;
	
	}
	
// load themes
	
	ThemeEngine.loadThemes = function() {
	
		var folders = fileHelper.getFolders(this.locals.paths.themesBase);
		var themes = {};

		// for each theme
		for (var i = 0; i < folders.length; i++) {
		
			// required files
			var config = path.join(this.locals.paths.themesBase, folders[i], "theme.json");
			var index = path.join(this.locals.paths.themesBase, folders[i], "index.ejs");
			
			// if files exist, add theme to stack
			if (fileHelper.exists([config, index])) themes[folders[i]] = require(config);
		
		}
	
		this.locals.themes = themes;	
	
	}
	
// set status

	ThemeEngine.setPage = function(page, err) {
		
		if (err) page.status = 404;
		else page.status = 200;
		
		this.locals.page = _.clone(page);
	
	}
			
// set error

	ThemeEngine.setError = function(page) {	
		this.setPage(page, true);	
	}
	
// set theme

	ThemeEngine.setTheme = function(query) {
	
		var theme = {};

		// theme override	
		if (query && query.theme && this.locals.themes[query.theme]) theme.slug = query.theme;
		else if (this.locals.app.themeOverride) theme.slug = this.locals.app.themeOverride;
		else theme.slug = this.locals.site.theme;
					
		// paths
		theme.path = "/" + this.locals.app.themesFolder + "/" + theme.slug;
		theme.base = path.join(this.locals.paths.themesBase, theme.slug);
		
		// load config
		var config = require(path.join(theme.base, "theme.json"));
		_.extend(theme, config);
		
		// set theme
		this.locals.theme = theme;
				
		// if child theme theme
		if (config.parent) {
			var parent = {};
			// set parent theme this.locals
			parent.slug = config.parent;
			parent.path = "/" + this.locals.app.themesFolder + "/" + config.parent;
			this.locals.parent = parent;
		}		

	}	

// get template

	ThemeEngine.setTemplate = function(page, query) {
	
		var template = {};

		// if inc override
		if (query && query.inc && this.templateExists(this.locals.theme.slug, "inc/" + query.inc)) template.slug = "inc/" + query.inc;
		
		// else if query override
		else if (query && query.template && this.templateExists(this.locals.theme.slug, query.template)) template.slug = query.template;
		
		// else if meta data		
		else if (page && page.template && this.templateExists(this.locals.theme.slug, page.template)) template.slug = page.template;
		
		// else if homepage
		
		// else default
		else template.slug = "index";
		
		template.filename = template.slug + ".ejs";
		
		this.locals.template = template;

	}
		
// if template exists

	ThemeEngine.templateExists = function(theme, template) {
	
		var filepath = path.join(this.locals.paths.themesBase, theme, template + ".ejs");
		if (fileHelper.exists(filepath)) return true;
		else return false;
	
	}	
	
// render

	ThemeEngine.render = function(res, extra_locals) {
		
		if (typeof extra_locals != "undefined") _.extend(this.locals, extra_locals);
		
		this.app.set("views", this.locals.theme.base);							
		res.status(this.locals.page.status).render(this.locals.template.filename, this.locals);
	
	}
	
// instantiate		

module.exports = ThemeEngine;