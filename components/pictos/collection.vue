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
		<div class="notification is-size-6 name">{{ collection.name }}</div>

		<div v-if="adminMode" class="adminMenu adminoption columns">
      <b-dropdown aria-role="list" class="column noMargin is-mobile">
        <template #trigger="{ active }">
          <b-button
            type="is-primary"
            :icon-right="active ? 'menu-up' : 'menu-down'"
          />
        </template>

        <b-dropdown-item aria-role="listitem"
          ><b-button
            type="is-info"
            icon-right="pencil"
            :expanded="true"
            @click="editCollection(collection)"
          />
        </b-dropdown-item>
        <b-dropdown-item aria-role="listitem"
          ><b-button
            :expanded="true"
            type="is-danger"
            icon-right="delete"
            @click="deleteCollection(collection)"
        /></b-dropdown-item>
      </b-dropdown>

      <div class="column noMargin is-mobile" v-if="collection.starred">
        <b-button
          type="is-success"
          icon-right="star"
          @click="alternateStar(collection)"
        />
      </div>
      <div class="column noMargin is-mobile" v-else>
        <b-button
          type="is-light"
          icon-right="star"
          @click="alternateStar(collection)"
        />
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
				canCancel: ["escape", "x"],
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
.adminoption {
  display: flex;
  flex-direction: row;
  align-items:center;
  justify-content: center;
}
.image {
	margin: auto;
}
.adminMenu {
  align-self: center;
  margin-top: auto;
  margin-left: 0%;
  margin-right: 0%;
}
.name {
	margin: 0 auto;
	margin-top: auto;
	font-size: 1rem;
}
.noMargin {
  padding: 0%;
}
</style>
