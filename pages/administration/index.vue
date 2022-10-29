<template>
  <div>
    <div class="container is-max-desktop" style="padding: 1rem">
      <body>
        <section class="section" style="padding: 0%">
          <h1 class="title is-size-3-mobile">
            {{ $t("Administration") }}
          </h1>
          <div class="container columns">
            <div class="column box">
              <h1 class="subtitle is-size-3-mobile">User number</h1>
              <h1 class="subtitle is-size-3-mobile">
                {{ this.userNb }}
              </h1>
            </div>
            <div class="column box">
              <h2 class="subtitle is-size-3-mobile">Pictogram count</h2>
              <h1 class="subtitle is-size-3-mobile">
                {{ this.pictogramNb }}
              </h1>
            </div>
            <div class="column box">
              <h1 class="subtitle is-size-3-mobile">Collection count</h1>
              <h1 class="subtitle is-size-3-mobile">
                {{ this.collectionNb }}
              </h1>
            </div>
            <div class="column box">
              <h1 class="subtitle is-size-3-mobile">Image size</h1>
              <h1 class="subtitle is-size-3-mobile">
                {{ this.imageSize }}
              </h1>
            </div>
          </div>
          <div class="box container">
            <feedbackTable :feedbacks="feedbacks" />
          </div>
        </section>
      </body>
    </div>
  </div>
</template>
<script >
import axios from "axios";
import feedbackTable from "@/components/admin/feedbackTable";
export default {
  components: {
    feedbackTable,
  },
  computed: {
    getUser() {
      return JSON.parse(JSON.stringify(this.$store.getters.getUser));
    },
  },
  data() {
    return {
      feedbacks: [],
      userNb: 0,
      pictogramNb: 0,
      collectionNb: 0,
      imageSize: 0,
    };
  },
  middleware: ["check-auth", "auth", "axios"],
  layout: "pictalk",
  async fetch() {
    let user = this.$store.getters.getUser;
    if (user.username) {
    } else {
      try {
        var res = await axios.get("/user/details/");
        this.$store.commit("editUser", res.data);
      } catch (error) {
        console.log("error ", error);
      }
    }
    user = this.$store.getters.getUser;
    if (user.admin) {
      try {
        var res = await axios.get("/extras/dbsummary");
        this.pictogramNb = res.data.pictogramNb;
        this.collectionNb = res.data.collectionNb;
        this.imageSize = res.data.imageSize;
        this.userNb = res.data.userNb;
        return res;
      } catch (error) {
        console.log("error ", error);
      }
    }
  },
};
</script>
