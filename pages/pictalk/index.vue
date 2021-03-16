<template>
  <div class="container is-widescreen">
    <pictoList
      :isPicto="isPicto"
      :pictos="loadedCollections"
      :adminMode="isAdmin"
    />
  </div>
</template>
<script>
import pictoList from "@/components/pictos/pictoList";
import axios from "axios";

export default {
  layout: "pictalk",
  middleware: ["check-auth", "auth", "axios"],
  components: {
    pictoList: pictoList
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
      return this.$store.getters.getCollections;
    }
  },
  async asyncData(context) {
    const collections = await context.store.getters.getCollections;
    if (collections.length !== 0) {
      return;
    } else {
      try {
        const res = await axios.get("/pictalk/collection");
        res.data.map(collection => {
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
    }
  },
  data() {
    return {
      isPicto: false
    };
  }
};
</script>
