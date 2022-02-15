export default {
	computed: {
		admin() {
			return this.$route.query.isAdmin ? "?isAdmin=true" : "";
		},
		homeLink() {
			return this.$route.path;
		},
	},
	methods: {
		onLogout() {
			if (this.admin) {
				this.$store.dispatch("logout");
				this.$router.push("/");
			} else {
				if (this.$store.getters.getUser.settings.securityMode) {
					let postFunction = function (t) {
						t.$store.dispatch("logout");
						t.$router.push("/");
					};
					this.enforcedSecurityMinor(postFunction);
				} else {
					this.$store.dispatch("logout");
					this.$router.push("/");
				}
			}
		},
	},
}