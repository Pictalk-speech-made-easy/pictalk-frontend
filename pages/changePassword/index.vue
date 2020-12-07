<template>
    <div>
        <div class="container">
            <section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">Reset Password</h1>
				</div>
			</div>
		</section>
        <b-field label="Email">
          <b-input
            type="email"
            v-model="username"
            placeholder="alex@pictalk.com"
            required
          ></b-input>
        </b-field>
        <b-button class="is-primary" @click="onSubmit(username)">Reset Password</b-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
    };
  },
  methods: {
      async onSubmit(username) {
      if(username == ""){
        const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Email is empty...`,
            position: "is-top-right",
            type: "is-info",
            hasIcon: true,
            icon: "account"
          });
        return;
      }
      try {
        const res = await axios.post("/auth/resetPassword", {
          username: username,
        });
        if (res.status == 200) {
          const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Password reset demand successfully transmitted, please look at your emails.`,
            position: "is-top-right",
            type: "is-success",
            hasIcon: true
          });
        this.$router.push("/");
        } else {
          const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `An error occurred: ${res.data}...`,
            position: "is-top-right",
            type: "is-danger",
            hasIcon: true,
            icon: "account"
          });
        }
      } catch (error) {
        console.log("error: ", error);
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: `An error has occurred: ${res.data}`,
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          icon: "account"
        });
      }
      
    }
  },
}
</script>

