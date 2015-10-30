// routing

	var config = {
		"name": "Demo Site",
		"slug": "demo"
	};

	if (%1) req.page = %1;
	else req.page = "index";

	if (?theme) req.theme = "theme";
	else req.theme = config.theme;

	render_theme();
