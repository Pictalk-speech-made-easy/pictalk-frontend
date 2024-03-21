import Security from "@/components/auth/securityModal";
export default {
  components: { Security },
  computed: {
    admin() {
      return this.$route.query.isAdmin ? "?isAdmin=true" : "";
    },
    homeLink() {
      return this.$route.path;
    },
  },
  methods: {
    onLogout() {
      if (this.admin) {
        this.$router.push("/");
        this.$store.dispatch("logout", this.$keycloak);
      } else {
        if (this.$store.getters.getUser.settings.securityMode) {
          let postFunction = function (t) {
            t.$router.push("/");
            t.$store.dispatch("logout", this.$keycloak);
          };
          this.$buefy.modal.open({
            parent: this,
            props: {
              callback: postFunction,
            },
            component: Security,
            hasModalCard: true,
            customClass: "custom-class custom-class-2",
            trapFocus: true,
            canCancel: ["escape", "x"],
          });
        } else {
          this.$router.push("/");
          this.$store.dispatch("logout", this.$keycloak);
        }
      }
    },
  },
}
