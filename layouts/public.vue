<template>
  <div class="wrapper">
    <navbar />
    <hr style="margin: 20px" />
    <nuxt />
    <br />
  </div>
</template>
<script >
import navbar from "@/components/navigation/navbar";
import popupModal from "@/components/auth/popupModal";
import Cookie from "js-cookie";
export default {
  components: {
    navbar,
  },
  data() {
    return {
      popupTimeout: null,
    };
  },
  created() {
    // If the user isn't authenticated and the popup cookie isn't set or hasn't expired, show the popup
    console.log(this.popupTimeout);
    this.popupTimeout = setTimeout(() => {
      if (!Cookie.get('popup') && !this.$store.getters.isAuthenticated) {
      this.$buefy.modal.open({
        parent: this,
        component: popupModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false,
        onCancel: () => {
          this.$buefy.modal.close();
        },
      });
      Cookie.set('popup', true, { expires: 3 });
    }
    }, 30000);
    console.log(this.popupTimeout);
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
  },
  destroyed() {
    console.log(this.popupTimeout);
    clearTimeout(this.popupTimeout);
    console.log(this.popupTimeout);
  },
};
</script>
<style scoped>
.wrapper {
  overflow-x: hidden;
  position: relative;
  width: 100%;
  bottom: 0%;
  height: calc(100vh - 32px);
}
</style>

