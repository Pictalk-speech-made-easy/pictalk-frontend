<template>
  <div>
    <div class="container is-max-desktop" style="padding: 1rem">
      <body>
        <section class="section" style="padding: 0%"
          <h1 class="title is-size-3-mobile">
            {{ $t("Settings") }}
          </h1>
          <account :user="getUser" />
        </section>
      </body>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import account from "@/components/auth/account";
export default {
  components: {
    account,
  },
  computed: {
    getUser() {
      return JSON.parse(JSON.stringify(this.$store.getters.getUser));
    },
  },
  middleware: ["check-auth", "auth", "axios"],
  layout: "pictalk",
  async asyncData(context) {
    const user = context.store.getters.getUser;
    const collections = context.store.getters.getCollections;
    if (user.username) {
      return;
    } else {
      try {
        var res = await axios.get("/user/details/");
        context.store.commit("editUser", res.data);
        return res;
      } catch (error) {
        console.log("error ", error);
      }
    }
  },
};
</script>