export default {
  methods: {
    async pushToGroup() {
      const index = this.group.users.indexOf(this.addUser);
      if (index === -1) {
        if (
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            this.addUser
          )
        ) {
          if (this.addUser != this.$store.getters.getUser.username) {
            this.group.users.push(this.addUser);
          } else {
            this.$buefy.toast.open({
              message: this.$t("NotShareYourself"),
              position: "is-top",
              type: "is-danger",
            });
          }
        } else {
          this.$buefy.toast.open({
            message: this.$t("EmailPlease"),
            position: "is-top",
            type: "is-danger",
          });
        }
      } else {
        this.$buefy.toast.open({
          message: this.$t("DuplicateGroupUser"),
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    removeFromGroup() {
      try {
        const index = this.group.users.indexOf(this.selected.username);
        if (index !== -1) {
          this.group.users.splice(index);
        } else {
          this.$buefy.toast.open({
            message: this.$t("CannotRemoveGroupUser"),
            position: "is-top",
            type: "is-danger",
          });
        }
      } catch (error) {
        // selected is empty
      }
    },
  }
}