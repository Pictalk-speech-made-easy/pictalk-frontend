<template>
  <div class="wrapper">
    <pictalkNavbar />
    <hr class="margins" />
    <nuxt />
  </div>
</template>
<script >
import pictalkNavbar from "@/components/navigation/pictalk-navbar";
export default {
  middleware: ["check-auth", "auth", "axios"],
  components: {
    pictalkNavbar,
  },
  data() {
    return {
      intervalId: null,
    };
  },
  async created() {
    if ('BroadcastChannel' in window) {
      const bc2 = new BroadcastChannel("sync");
      bc2.onmessage = (event) => {
      if (event.isTrusted) {
        this.$store.dispatch("downloadCollections", event.data.collections);
      }
    };
    }
    if (!this.$store.getters.getUser.username) {
      try {
        await this.$store.dispatch("getUser");
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }
    if (
      this.$store.getters.isAuthenticated &&
      this.$store.getters.getUser &&
      this.$store.getters.getUser.displayLanguage.match(/[a-z]{2}/g)
    ) {
      if (
        this.$i18n.locale.code != this.$store.getters.getUser.displayLanguage
      ) {
        this.$i18n.setLocale(this.$store.getters.getUser.displayLanguage);
      }
    }
    const workbox = await window.$workbox;
    if (workbox) {
      workbox.addEventListener('installed', (event) => {
        // If we don't do this we'll be displaying the notification after the initial installation, which isn't perferred.
        if (event.isUpdate) {
          const notif = this.$buefy.notification.open({
              duration: 4500,
              message: this.$t("NewVersionAvailable"),
              position: "is-top-right",
              type: "is-success",
              hasIcon: true,
              iconSize: "is-small",
              iconSize: "medium",
              icon: "gift",
            });
          setTimeout(() => {
            window.location.reload(true)
          }, 4500);
        }
      });
    }
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
  mounted() {
    this.intervalId = setInterval(async () => {
      if (window.navigator.onLine) {
        try {
          await this.$nuxt.$store.dispatch("getUser");
        } catch (err) {
          clearInterval(this.intervalId);
          console.log(err);
        }
      }
    }, 1200000); // 20 minutes
  },
};
</script>
<style scoped>
.wrapper {
  overflow-x: hidden;
  position: relative;
  width: 100%;
  height: 100%;
}

.margins {
  margin: 10px;
}
</style>

