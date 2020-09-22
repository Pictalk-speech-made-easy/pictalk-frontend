<template>
  <div>
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
    }
  },
  async asyncData(context) {
    const collections = await context.store.getters.getCollections;
    console.log("Collections stored are : ", collections);
    if (collections.length !== 0) {
      return { loadedCollections: collections };
    } else {
      console.log("Axios request ...");
      try {
        const res = await axios.get("http://localhost:3001/pictalk/collection");
        context.store.commit("setCollections", res.data);
        return { loadedCollections: res.data };
      } catch (error) {
        console.log("error ", error);
      }
    }
  },
  data() {
    return {
      isPicto: false
      /*loadedCollections: [
				{
					color: "blue",
					id: "1",
					name: "Passe",
					path:
						"https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
				},
				{
					color: "yellow",
					id: "2",
					name: "Voyager",
					path:
						"https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
				},
				{
					color: "red",
					id: "3",
					name: "Present",
					path:
						"https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
				}
			]
			*/
    };
  }
};
</script>
