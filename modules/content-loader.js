// setup

	var ContentLoader = {};
	var HTML = {};
	var HTMLFrontMatter = {};
	var HTMLFirstComment = {};
	var HTMLTopHeader = {};
	
	var fileHelper = require("peezy-file-helper"),
		path = require("path"),
		fs = require("fs"),
		_ = require("lodash");

// getPages
	
	ContentLoader.getPages = function(folderpath) {
	
		var page_files = fileHelper.getFilesRecursive(folderpath);				
		var pages = {};				
		var page;
		
		for (var i = 0; i < page_files.length;) {
		
			// if .DS_Store, delete it from array
			if (page_files[i].indexOf(".DS_Store") > -1) page_files.splice(i, 1);
			
			// else build page obj and add it to pages
			else {
			
				page = {};
				
				// set vars
				page.filepath = page_files[i];
				page.filename = page.filepath.replace(folderpath, "").replace(/^\//, '');
				page.ext = path.extname(page.filename);
				page.slug = page.filename.replace(page.ext, "");
				
				// process dot vars
				
				var dot_vars = {};
				
				// if there's a dot var, parse it
				if (path.extname(page.slug)) parse_dot_var();
				
				// helper function
				function parse_dot_var() {
				
					var chunk_ext = path.extname(page.slug);
					var chunk = chunk_ext.replace(".", "");
					
					// if its a named prop
					if (chunk.indexOf("-") > 0) {
					
						var prop = chunk.substr(0, chunk.indexOf("-"));
						var val = chunk.substr(chunk.indexOf("-") + 1);
												
						dot_vars[prop] = val;
						
						page.slug = page.slug.replace(chunk_ext, "");
					
					}
					
					// else template override
					else dot_vars["template"] = chunk;
				
					// set new slug
					page.slug = path.basename(page.slug, chunk_ext);
					
					// recursive parsing					
					if (path.extname(page.slug)) parse_dot_var();
				
				}
								
				// get raw content
				page.content = fileHelper.import(page.filepath);

				// extract meta data
				//_.extend(page, HTML.parse(page.content));
				
				// dot vars override
				if (dot_vars) _.extend(page, dot_vars);
				
				pages[page.slug] = page;
				
				i++;
			
			}
			
		}
		
		return pages;
	
	}
	
	/* HTML Parse */
	
		HTML.parse = function(content) {
		
			var page = {};
			
			// parse front matter
			_.extend(page, HTMLFrontMatter.parse(content));
			
			// if no title, parse top 
			if (!page.title) _.extend(page, HTMLTopHeader.parse(content));
		
			return page;
		
		}
	
	/* HTML Front Matter */	
	
		HTMLFrontMatter.parse = function(content) {
		
			var page = FirstComment.parse(content);
			
			// if starts with comment
			
			if (page.comment) {
			
				// convert comment to md
				var md = convert_to_md(get_first_comment(contents));
				
				// if contains front matter, set data
				if (get_front_matter(md)) _.extend(page, get_front_matter(md));	   // TODO front matter module
				
			}
			
			function convert_to_md(comment) {	
				
				comment.replace("<!--", "---");		// TODO make this work
				comment.replace("-->", "---");			
				return comment;
			
			}		
			
		}
		
	/* First Comment */
		
		HTMLFirstComment.parse = function(content, prop) {
		
			var page = {};
			
			// if starts with comment
			if (FirstComment.getBeginning(contents)) {
			
				var begin = FirstComment.getBeginning(contents);
				var end = FirstComment.getEnd(contents);
			
				// get the first comment
				//page.comment = from begin to end;				// TODO logic
				//page.content = from end to end of file;		// TODO logic
				
				if (prop) return page[prop];				
				else return page;
				
			}
				
			// else return false
			page.content = content;
			return page;		
		
		}
		
		HTMLFirstComment.getBeginning = function() {
			
			// if starts with comment, return start		// TODO logic
			
		}
	
		HTMLFirstComment.getEnd = function() {
			
			// return first end							// TODO logic
				
		}
		
	/* HTML Top Title */
	
		HTMLTopHeader.parse = function(content) {
		
			// if headers								// TODO everything
				
				// var page = {};
				// page.title = highest header;			
				// return page;
			
			// else return nothing
		
		}

module.exports = ContentLoader;