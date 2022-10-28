<template>
  <div>
    <div class="container is-max-desktop" style="padding: 1rem">
      <body>
        <section class="section" style="padding: 0%"
          <h1 class="title is-size-3-mobile">
            {{ $t("Administration") }}
          </h1>
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
    console.log(user);
    if (user.admin) {
      try {
        var res = await axios.get("/feedback/");

        this.feedbacks = res.data;
        return res;
      } catch (error) {
        console.log("error ", error);
      }
    }
  },
};
</script>
