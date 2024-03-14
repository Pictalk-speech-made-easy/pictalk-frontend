<template>
  <div>
    <div class="container is-max-desktop" style="padding: 1rem">
      <body>
        <section class="section" style="padding: 0%">
          <h1 class="title is-size-3-mobile">
            {{ $t("Settings") }}
          </h1>
          <account :user="getUser" />
        </section>
      </body>
    </div>
  </div>
</template>
<script >
import axios from "axios";
import account from "@/components/auth/account";
export default {
  nuxtI18n: false,
  components: {
    account,
  },
  computed: {
    getUser() {
      let user = JSON.parse(JSON.stringify(this.$store.getters.getUser));
      if (user.settings.analytics == null) {
        user.settings.analytics = true;
      }
      return user;
    },
  },
  middleware: ["check-auth", "auth", "axios"],
  layout: "pictalk",
  async fetch() {
    const user = this.$store.getters.getUser;
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