module.exports = {

	title: "Fluid",

	menu: {
		enabled: true,
		content: [
			{label: "Index", path: "/"},
			{label: "Blog", path: "/blog"},
			{label: "LinkedIn", path: ""},
			{label: "GitHub", path: ""},
			{label: "Contact", path: "/contact"}
			]}
	},

	routes: [
		{path: "/", view: "index"},
	],

	blog: {
		enabled: true,
	}

	mongo: {
		host: "",
		db: "",
		user: "",
		password: "",
	}
}