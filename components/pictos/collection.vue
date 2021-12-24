<template>
	<div class="containing">
		<nuxt-link :to="collectionLink">
			<img
				:src="collection.path"
				class="image"
				width="60%"
				crossorigin="anonymous"
			/>
		</nuxt-link>
		<div v-if="adminMode" class="adminMenu">
			<div class="notification is-size-6">{{ collection.name }}</div>
			<div>
				<b-button
					type="is-danger"
					icon-right="delete"
					@click="removeCollection(collection)"
				/>
				<b-button type="is-info" @click="editCollection(collection)"
					>Edit</b-button
				>
				<div v-if="collection.starred">
					<b-button
						type="is-warning"
						icon-right="star"
						@click="alternateStar(collection)"
					/>
				</div>
				<div v-else>
					<b-button
						type="is-light"
						icon-right="star"
						@click="alternateStar(collection)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import CollectionSteps from "@/components/pictos/collectionSteps";
import deleteItem from "@/components/pictos/deleteItem";
export default {
	components: {
		CollectionSteps,
	},
	props: {
		adminMode: {
			type: Boolean,
			required: true,
		},
		collection: {
			type: Object,
			required: true,
		},
	},
	methods: {
		async alternateStar(collection) {
			const star = collection.starred ? false : true;
			try {
				this.$store.commit("editCollection", {
					...collection,
					starred: star,
				});
			} catch (error) {
				console.log(error);
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("SomeThingBadHappened"),
					position: "is-top-right",
					type: "is-danger",
					hasIcon: true,
					icon: "account",
				});
			}
		},
		async removeCollection(collection) {
			this.$buefy.modal.open({
				parent: this,
				props: { object: { ...collection } },
				component: deleteItem,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
			});
		},
		editCollection(collection) {
			this.$buefy.modal.open({
				parent: this,
				props: { collection: { ...collection } },
				component: CollectionSteps,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
				canCancel:['escape', 'x'],
				create: false,
			});
		},
	},
	computed: {
		collectionLink() {
			let adminMode = "";
			if (this.$route.query.isAdmin) {
				adminMode = "?isAdmin=true";
			}
			return "/pictalk/" + this.collection.id + "/0" + adminMode;
		},
	},
};
</script>
<style scoped>
.has-background {
	background-color: rgb(168, 168, 168);
}
.containing {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.image {
	margin: auto;
}
.adminMenu {
	align-self: flex-end;
	margin: 0 auto;
	margin-top: auto;
}
</style>
