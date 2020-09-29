<template>
  <div class="containing">
    <nuxt-link :to="collectionLink">
      <img :src="collection.path" class="image" width="60%" />
    </nuxt-link>
    <div v-if="adminMode" class="adminMenu">
      <div class="notification is-size-6">{{ collection.name }}</div>
      <div>
        <b-button
          type="is-danger"
          icon-right="delete"
          @click="removeCollection(collection.id)"
        />
        <b-button type="is-info" @click="editCollection(collection)"
          >Edit</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import editCollection from "@/components/pictos/editCollection";
export default {
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
    async removeCollection(collectionId) {
      const res = await this.$store.dispatch("removeCollection", collectionId);
    },
    editCollection(collection) {
      this.$buefy.modal.open({
        parent: this,
        props: { collection: { ...collection } },
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
