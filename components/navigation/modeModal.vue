<template>
  <div class="modal-card small-card">
    <section class="modal-card-body">
      <p class="subtitle centered">{{ $t("AnotherSpace") }}</p>
      <div class="option">
        <b-button
          class="fullWidth modeButton mainColor"
          :label="$t('MyHome')"
          @click="GoToRoot()"
          icon-left="home"
        />
      </div>
      <div class="option">
        <b-button
          :label="$t('PublicCollections')"
          @click="goTo('/public')"
          icon-left="web"
          class="fullWidth modeButton publicColor"
        />
      </div>
      <div class="option">
        <b-button
          :label="$t('MyShared')"
          @click="goTo(sharedLink)"
          icon-left="folder-account"
          class="fullWidth modeButton sharedColor"
        />
      </div>
      <div class="option">
        <b-button
          :label="$t('MySidebar')"
          @mousedown="goTo(sidebarLink)"
          icon-left="page-layout-sidebar-right"
          class="fullWidth modeButton sidebarColor"
        />
      </div>
    </section>
  </div>
</template>
<script >
export default {
  methods: {
    GoToRoot() {
      if (this.$store.getters.getRootId) {
        this.$router.push({
          path: "/pictalk/" + this.$store.getters.getRootId,
          query: {
            isAdmin: this.$route.query.isAdmin,
            sidebarPictoId: this.$store.getters.getSidebarId,
          },
        });
      } else {
        this.$router.push({
          path: "/pictalk",
          query: {
            isAdmin: this.$route.query.isAdmin,
            sidebarPictoId: this.$store.getters.getSidebarId,
          },
        });
      }
      this.$parent.close();
    },
    goTo(link) {
      this.$router.push({
        path: link,
      });
      this.$parent.close();
    },
  },
  computed: {
    sharedLink() {
      return "/pictalk/" + this.$store.getters.getSharedId + this.admin;
    },
    sidebarLink() {
      return "/pictalk/" + this.$store.getters.getSidebarId + this.admin;
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.buttonBorder {
  border: solid;
  border-width: 1px;
  border-color: #48c78e;
}
.option {
  display: flex;
  align-items: center;
  padding: 0.3em 0;
}
.small-card {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 300px;
  min-width: 220px;
  max-height: 350px;
  min-height: 200px;
  border-radius: 12px;
}
.centered {
  text-align: center;
}
.fullWidth {
  width: 100%;
  justify-content: left;
}
.modeButton {
  color: white;
  border-color: transparent;
}
.modeButton:hover {
  color: #f1f1f1;
  filter: brightness(1.1);
}
</style>