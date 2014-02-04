module.exports = {

	/*
	* Website's title
	*/
	"title": "Fluid",

	/*
	* REQUIRED
	* base url of website 
	*/
	"baseurl": "http://localhost:3333",

	/*
	* environment variable
	* DEFAULT: production
	*/
	"env": "development",

	/*
	* website's menu:
	*/
	"menu": {
		"enabled": true,
		"content": [
			{"label": "Index", "path": "/"},
			{"label": "Blog", "path": "/blog", "sub": [
				{"label": "example", "path": "/blob"}]
			},
			{"label": "LinkedIn", "path": ""},
			{"label": "GitHub", "path": ""},
			{"label": "Contact", "path": "/contact"}
		]
	},

	/*
	* Routes to single web pages link to a view
	*/
	"routes": [
		{"path": "/", "view": "index", "title": ""}
	],

	/*
	* REQUIRED
	* blog enabling
	*/
	"blog": {
		"enabled": true,
	},

	/*
	*
	*/
	"mongo": {
		"host": "",
		"db": "",
		"user": "",
		"password": "",
	},

	/*
	*
	*/
	"secret": ""
}