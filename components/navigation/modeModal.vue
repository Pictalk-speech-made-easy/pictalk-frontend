<template>
  <div class="modal-card small-card">
    <section class="modal-card-body">
      <p class="subtitle centered">{{ $t("AnotherSpace") }}</p>
      <div class="option">
        <b-button
          style="background-color: hsl(0, 100%, 70%)"
          class="fullWidth customButton"
          :label="$t('MyHome')"
          @click="GoToRoot()"
          icon-left="home"
        />
      </div>
      <div class="option">
        <b-button
          style="background-color: hsl(154, 100%, 70%)"
          :label="$t('PublicCollections')"
          @click="$router.push({ path: '/public' })"
          icon-left="web"
          class="fullWidth customButton"
        />
      </div>
      <div class="option">
        <b-button
          style="background-color: hsl(210, 100%, 70%)"
          :label="$t('MyShared')"
          @click="goTo(sharedLink)"
          icon-left="folder-account"
          class="fullWidth customButton"
        />
      </div>
      <div class="option">
        <b-button
          style="background-color: hsl(45, 100%, 70%)"
          :label="$t('MySidebar')"
          @mousedown="goTo(sidebarLink)"
          icon-left="page-layout-sidebar-right"
          class="fullWidth customButton"
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
          query: { ...this.$route.query, isAdmin: this.$route.query.isAdmin, fatherCollectionId: this.$store.getters.getRootId },
        });
      } else {
        this.$router.push({
          query: { ...this.$route.query, isAdmin: this.$route.query.isAdmin },
        });
      }
      this.$parent.close();
    },
    goTo(link) {
      this.$router.push({
        query: { ...this.$route.query, isAdmin: this.$route.query.isAdmin, fatherCollectionId: link},
      });
      this.$parent.close();
    },
  },
  computed: {
    sharedLink() {
      return this.$store.getters.getSharedId;
    },
    sidebarLink() {
      return this.$store.getters.getSidebarId;
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.customButton {
  font-size: clamp(0.8em, 4vw, 1.15em);
  font-weight: 600;
  color: #171717;
  border: 2px solid #666;
  transition: all 0.05s;
  margin: 0 2px;
}
.customButton:hover {
  box-shadow: 0px 0px 12px #00000090;
}
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
  max-width: 350px;
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