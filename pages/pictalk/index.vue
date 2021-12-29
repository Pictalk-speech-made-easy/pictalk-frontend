<template>
	<div class="container is-widescreen">
		<pictoList
			:isPicto="isPicto"
			:pictos="loadedCollections"
			:adminMode="isAdmin"
		/>
		<div class="filler"></div>
	</div>
</template>
<script>
import pictoList from "@/components/pictos/pictoList";
import axios from "axios";

export default {
	layout: "pictalk",
	middleware: ["check-auth", "auth", "axios"],
	components: {
		pictoList: pictoList,
	},
	computed: {
		isAdmin() {
			if (this.$route.query.isAdmin) {
				return true;
			} else {
				return false;
			}
		},
		loadedCollections() {
			let rankedCollections = [];
			this.$store.getters.getCollections.forEach((collection) => {
				if (collection.starred == true) {
					rankedCollections.unshift(collection);
				} else {
					rankedCollections.push(collection);
				}
			});
			return rankedCollections;
		},
	},
	async asyncData(context) {
		const collections = await context.store.getters.getCollections;
		if (collections.length !== 0) {
			return;
		} else {
			try {
				const res = await axios.get("/pictalk/collection");
				res.data.map((collection) => {
					if (collection.path) {
						collection.path =
							context.$config.baseURL + "/pictalk/image/" + collection.path;
					}
				});
				context.store.commit("setCollections", res.data);
				return;
			} catch (error) {
				console.log("error ", error);
			}
			const user = context.store.getters.getUser;
			if (user.username) {
			} else {
				try {
					var res = await axios.get("/auth/details/");
					context.store.commit("editUser", res.data);
				} catch (error) {
					console.log("error ", error);
				}
			}
		}
	},
	data() {
		return {
			isPicto: false,
		};
	},
};
</script>
<style scoped>
.filler {
	padding-bottom: 20%;
}
</style>
