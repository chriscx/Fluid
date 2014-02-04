module.exports = {

	/*
	*
	*/
	"title": "Fluid",

	/*
	*
	*/
	"baseurl": "http://localhost:3333",

	/*
	*
	*/
	"env": "development",

	/*
	*
	*/
	"menu": {
		"enabled": true,
		"content": [
			{"label": "Index", "path": "/"},
			{"label": "Blog", "path": "/blog"},
			{"label": "LinkedIn", "path": ""},
			{"label": "GitHub", "path": ""},
			{"label": "Contact", "path": "/contact"}
		]
	},

	/*
	*
	*/
	"routes": [
		{"path": "/", "view": "index", "title": ""}
	],

	/*
	*
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