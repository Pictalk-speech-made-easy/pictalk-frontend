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
        <b-field label="New Password">
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Ch00s3 a Stro!g Passw0Rd"
            required
            minlength="8"
            pattern="((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
            validation-message="At least one captial letter, one digit and a password minimum length of 8"
          ></b-input>
        </b-field>
        <b-button class="is-primary" @click="onSubmit(password)">Change Password</b-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      password: "",
    };
  },
  methods: {
      async onSubmit(password) {
      if(password == ""){
        const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Password is empty...`,
            position: "is-top-right",
            type: "is-info",
            hasIcon: true,
            icon: "account"
          });
        return;
      }
      try {
        const res = await axios.post("/auth/changePassword/"+this.$route.params.token, {
          password: password,
        });
        if (res.status == 200) {
          const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Password change demand successfully transmitted`,
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