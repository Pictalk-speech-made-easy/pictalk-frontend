<template>
	<div>
		<nuxt-link :to="collectionLink">
			<img :src="collection.path" width="50%" class="is-centered" />
		</nuxt-link>
		<div v-if="adminMode">
			<div class="notification is-size-6">{{collection.name}}</div>
			<div>
				<b-button type="is-danger" icon-right="delete" @click="deleteCollection(collection)" />
				<b-button type="is-info" @click="editCollection(collection)">Edit</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import editCollection from "@/components/pictos/editCollection";
export default {
	name: "collection",
	components: {
		editCollection
	},
	props: {
		adminMode: {
			type: Boolean,
			required: true
		},
		collection: {
			type: Object,
			required: true
		}
	},
	methods: {
		deleteCollection() {
			this.$store.commit("deleteCollection", collection);
		},
		editCollection(collection) {
			this.$buefy.modal.open({
				parent: this,
				collection: collection,
				component: editCollection,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true
			});
		}
	},
	computed: {
		collectionLink() {
			return "/pictalk/" + this.collection.id + "/0";
		}
	}
};
</script>
<style scoped>
.centered {
	margin-left: auto;
	margin-right: auto;
}
</style>