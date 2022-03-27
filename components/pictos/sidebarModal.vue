<template>
	<div class="modal-card" style="width: auto">
		<section id="search" class="modal-card-body">
			<div class="container is-widescreen column">
				<pictoList :pictos="loadedPictos" :adminMode="isAdmin" />
			</div>
		</section>
	</div>
</template>
<script>
import pictoList from "@/components/pictos/pictoList";
export default {
	name: "sidebarModal",
	components: {
		pictoList,
	},
	computed: {
		loadedPictos() {
			return this.loadPictos(
				parseInt(this.$route.params.fatherCollectionId, 10)
			);
		},
		isAdmin() {
			if (this.$route.query.isAdmin) {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {
		sorting(collections, pictos) {
			let unsortedItems = collections.concat(pictos);
			let sortedItems = unsortedItems.sort(function (itemA, itemB) {
				return (
					new Date(itemB.createdDate) - new Date(itemA.createdDate)
				);
			});
			return sortedItems;
		},
		loadPictos(fatherCollectionId) {
			const index = this.$store.getters.getCollections.findIndex(
				(collection) => collection.id === fatherCollectionId
			);
			const collection = this.$store.getters.getCollections[index];
			if (collection) {
				const collectionList = collection.collections.map((col) => {
					return this.getCollectionFromId(col.id);
				});
				const pictos = collection.pictos.map((pict) => {
					return this.getPictoFromId(pict.id);
				});
				if (pictos && collectionList) {
					let sortedItems = [];
					let starredItems = [];
					let unstarredItems = [];
					sortedItems = this.sorting(collectionList, pictos);
					for (let item of sortedItems) {
						if (item.starred) {
							starredItems.push(item);
						} else {
							unstarredItems.push(item);
						}
					}
					return starredItems.concat(unstarredItems);
				} else {
					console.log("No ranked pictos");
					return [];
				}
			}
			return [];
		},
	},
};
</script>