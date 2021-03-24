<template>
	<div>
		<div class="container is-max-desktop">
			<body>
				<section class="section">
					<h1 class="title is-size-3-mobile">
						{{ $t("EditUserDetails") }}
					</h1>
					<account class="is40" :user="getUser" />
				</section>
			</body>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import account from "@/components/auth/account";
export default {
	components: {
		account,
	},
	computed: {
		getUser() {
			return { ...this.$store.getters.getUser };
		},
	},
	middleware: ["check-auth", "auth", "axios"],
	layout: "pictalk",
	async asyncData(context) {
		const user = context.store.getters.getUser;
		const collections = context.store.getters.getCollections;
		if (user.username) {
			return;
		} else {
			try {
				var res = await axios.get("/auth/details/");
				context.store.commit("editUser", res.data);
				return res;
			} catch (error) {
				console.log("error ", error);
			}
		}
	},
};
</script>
<style scoped>
.is40 {
	max-width: 300px;
	min-width: 300px;
}
</style>
