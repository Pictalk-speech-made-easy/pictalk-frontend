export default {
	computed: {
		admin() {
			return this.$route.query.isAdmin ? "?isAdmin=true" : "";
		},
		homeLink() {
			return this.$route.path;
		},
	}
}