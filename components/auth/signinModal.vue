<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Login</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Email">
          <b-input
            type="email"
            v-model="username"
            placeholder="Your email"
            required
          ></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Your password"
            required
          ></b-input>
        </b-field>
        <a href="/changePassword">Forgot password ?</a>
      </section>
      <footer class="modal-card-foot">
        <b-button class="is-primary" @click="onSubmit">Login</b-button>
        
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    async onSubmit() {
      try {
        const res = await this.$store.dispatch("authenticateUser", {
          username: this.username,
          password: this.password,
          isLogin: true
        });
        if (res.status == 201) {
          this.$parent.close();
          this.$router.push("/pictalk");
          const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Welcome !`,
            position: "is-top-right",
            type: "is-info",
            hasIcon: true
          });
        } else {
          const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Invalid credentials`,
            position: "is-top-right",
            type: "is-danger",
            hasIcon: true,
            icon: "account"
          });
        }
      } catch (error) {
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: `A problem occurred`,
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          icon: "account"
        });
        console.log("error: ", error);
      }
    }
  }
};
</script>
