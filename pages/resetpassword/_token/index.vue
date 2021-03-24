<template>
	<div>
		<div class="container">
			<section class="hero">
				<div class="hero-body">
					<div class="container">
						<h1 class="title">{{ $t("ResetPassword") }}</h1>
					</div>
				</div>
			</section>
			<b-field :label="$t('NewPassword')">
				<b-input
					type="password"
					v-model="password"
					password-reveal
					:placeholder="$('PasswordNotice')"
					required
					minlength="8"
					pattern="((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
					:validation-message="$t('PasswordValidationMessage')"
				></b-input>
			</b-field>
			<b-button class="is-primary" @click="onSubmit(password)">{{
				$t("ChangePassword")
			}}</b-button>
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
			if (password == "") {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("PasswordEmpty"),
					position: "is-top-right",
					type: "is-info",
					hasIcon: true,
					icon: "account",
				});
				return;
			}
			try {
				const res = await axios.post(
					"/auth/changePassword/" + this.$route.params.token,
					{
						password: password,
					}
				);
				if (res.status == 201) {
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: this.$t("ChangePasswordSuccess"),
						position: "is-top-right",
						type: "is-success",
						hasIcon: true,
					});
					this.$router.push("/");
				} else {
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: this.$t("SomeThingBadHappened"),
						position: "is-top-right",
						type: "is-danger",
						hasIcon: true,
						icon: "account",
					});
				}
			} catch (error) {
				console.log("error: ", error);
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("SomeThingBadHappened"),
					position: "is-top-right",
					type: "is-danger",
					hasIcon: true,
					icon: "account",
				});
			}
		},
	},
};
</script>