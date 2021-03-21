<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">Sign Up</p>
			</header>
			<section class="modal-card-body">
				<b-field label="Email">
					<b-input
						type="email"
						v-model="username"
						placeholder="alex@pictalk.com"
						required
					></b-input>
				</b-field>

				<b-field label="Password">
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
				<b-field label="Confirm Password">
					<b-input
						type="password"
						password-reveal
						placeholder="C0nf1rm y0ur Stro!g Passw0Rd"
						required
						minlength="8"
						v-model="passwordConfirmation"
					></b-input>
				</b-field>
				<b-field label="Language">
					<b-select
						v-model="language"
						placeholder="Select language"
						rounded
						required
					>
						<option
							v-for="language in languages"
							:value="language.lang"
							:key="language.voiceURI"
						>
							{{ language.lang }}
						</option>
					</b-select>
				</b-field>
				<br />
				<div class="field">
					<b-checkbox v-model="majority" required type="is-success">
						I have more than 13 years old
					</b-checkbox>
				</div>
				<div class="field">
					<b-checkbox v-model="terms" required type="is-success">
						I have read and I accept the
						<nuxt-link to="/legal-infos/terms-of-use"
							>terms of use</nuxt-link
						>
						and
						<nuxt-link to="/legal-infos/privacy-policy"
							>the privacy policy</nuxt-link
						>.
					</b-checkbox>
				</div>
			</section>
			<footer class="modal-card-foot">
				<b-button
					class="is-primary"
					@click="
						onSubmit(
							username,
							password,
							language,
							majority,
							terms,
							passwordConfirmation
						)
					"
					>Sign Up</b-button
				>
			</footer>
		</div>
	</form>
</template>

<script>
import axios from "axios";
export default {
	data() {
		return {
			username: "",
			password: "",
			language: "",
			languages: [],
			terms: false,
			majority: false,
			passwordConfirmation: "",
		};
	},
	async created() {
		if ("speechSynthesis" in window) {
			let voices = window.speechSynthesis.getVoices();
			let increment = 0;
			while (voices.length == 0 && increment != 10) {
				voices = window.speechSynthesis.getVoices();
				increment++;
				await this.delay(10);
			}
			this.languages = voices;
		}
	},
	methods: {
		delay(delayInms) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(2);
				}, delayInms);
			});
		},
		async onSubmit(
			username,
			password,
			language,
			major,
			terms,
			passwordConfirmation
		) {
			if (
				username == "" ||
				password == "" ||
				passwordConfirmation == "" ||
				major == false ||
				terms == false
			) {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: `Please complete the form...`,
					position: "is-top-right",
					type: "is-info",
					hasIcon: true,
					icon: "account",
				});
				return;
			}
			if (passwordConfirmation != password) {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: `Passwords do not correspond...`,
					position: "is-top-right",
					type: "is-warning",
					hasIcon: true,
					icon: "key",
				});
				return;
			}
			try {
				const res = await axios.post("/auth/signup", {
					username: username,
					password: password,
					language: language,
				});
				if (res.status == 201) {
					await this.$store.dispatch("authenticateUser", {
						username: this.username,
						password: this.password,
						isLogin: true,
					});
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: `Your account has been successfully created !`,
						position: "is-top-right",
						type: "is-success",
						hasIcon: true,
					});
					this.$parent.close();
					this.$router.push("/pictalk");
				}
			} catch (error) {
				if (error.response) {
					if (
						error.response.status == 400 ||
						error.response.status == 401
					) {
						const notif = this.$buefy.notification.open({
							duration: 5000,
							message: `Some parameters are invalid (like the email address or the password)`,
							position: "is-top-right",
							type: "is-danger",
							hasIcon: true,
							icon: "account",
						});
					} else {
						if (error.response.status == 500) {
							const notif = this.$buefy.notification.open({
								duration: 5000,
								message: `This email is already used`,
								position: "is-top-right",
								type: "is-danger",
								hasIcon: true,
								icon: "mail",
							});
						} else {
							const notif = this.$buefy.notification.open({
								duration: 5000,
								message: `Server cannot be reached`,
								position: "is-top-right",
								type: "is-danger",
								hasIcon: true,
								icon: "account",
							});
						}
					}
				} else {
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: `Server cannot be reached`,
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
