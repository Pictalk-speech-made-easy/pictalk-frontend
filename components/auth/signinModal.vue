<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("LogIn") }}</p>
			</header>
			<section class="modal-card-body">
				<b-field :label="$t('Email')">
					<b-input
						type="email"
						v-model="username"
						:placeholder="$t('PlaceHolderEmail')"
						required
					></b-input>
				</b-field>

				<b-field :label="$t('Password')">
					<b-input
						type="password"
						v-model="password"
						password-reveal
						:placeholder="$t('PlaceHolderPassword')"
						required
					></b-input>
				</b-field>
				<a href="/changePassword">{{ $t("ForgotPswd") }}</a>
			</section>
			<footer class="modal-card-foot">
				<b-button class="is-primary" @click="onSubmit">{{
					$t("LogIn")
				}}</b-button>
			</footer>
		</div>
	</form>
</template>

<script>
export default {
	data() {
		return {
			username: "",
			password: "",
		};
	},
	methods: {
		async onSubmit() {
			try {
				const res = await this.$store.dispatch("authenticateUser", {
					username: this.username,
					password: this.password,
					isLogin: true,
				});
				if (res.status == 201) {
					this.$parent.close();
					this.$router.push("/pictalk");
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: this.$t("Welcome"),
						position: "is-top-right",
						type: "is-info",
						hasIcon: true,
					});
				}
			} catch (error) {
				if (error.response) {
					if (
						error.response.status == 400 ||
						error.response.status == 401
					) {
						const notif = this.$buefy.notification.open({
							duration: 5000,
							message: this.$t("WrongCredentials"),
							position: "is-top-right",
							type: "is-danger",
							hasIcon: true,
							icon: "account",
						});
					} else {
						const notif = this.$buefy.notification.open({
							duration: 5000,
							message: this.$t("ServerOffline"),
							position: "is-top-right",
							type: "is-danger",
							hasIcon: true,
							icon: "account",
						});
					}
				} else {
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: this.$t("ServerOffline"),
						position: "is-top-right",
						type: "is-danger",
						hasIcon: true,
						icon: "account",
					});
				}
			}
		},
	},
};
</script>
