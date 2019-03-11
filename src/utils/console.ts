export default {
	show: false,
	c: function(...args) {
		if (this.show) {
			console.log(...args);
		}
	},
};
