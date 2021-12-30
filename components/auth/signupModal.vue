<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("SignUp") }}</p>
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
						minlength="8"
						pattern="((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
						validation-message="At least one captial letter, one digit and a password minimum length of 8"
					></b-input>
				</b-field>
				<b-field :label="$t('ConfirmPassword')">
					<b-input
						type="password"
						password-reveal
						:placeholder="$t('PlaceHolderPassword')"
						required
						minlength="8"
						v-model="passwordConfirmation"
					></b-input>
				</b-field>
				<div class="columns">
					<b-field class="column" :label="$t('Principal Language')">
						<b-select
							v-model="language"
							placeholder="Select language"
							required
							expanded
							:loading="loadingVoices"
							size="is-small"
						>
							<option
								v-for="language in loadedVoices"
								:value="language.lang"
								:key="language.voiceURI"
							>
								{{ getEmoji(language.lang) }}
							</option>
						</b-select>
					</b-field>
					<b-field class="column" :label="$t('Languages')">
						<b-select
							v-model="languages"
							placeholder="Select language"
							required
							multiple
							expanded
							native-size="8"
							size="is-small"
							:loading="loadingVoices"
						>
							<option
								v-for="language in loadedVoices"
								:value="language.lang"
								:key="language.voiceURI"
							>
								{{ getEmoji(language.lang) }}
							</option>
						</b-select>
					</b-field>
					<b-field :label="$t('Direct Sharers')">
						<b-input
							v-for="index in directSharers.length"
							:key="index"
							v-model="directSharers[index - 1]"
						></b-input>
						<p class="control">
							<b-button
								type="is-primary"
								icon-right="plus"
								@click="directSharers.push('')"
							/>
						</p>
					</b-field>
				</div>
				<br />
				<div class="field">
					<b-checkbox v-model="majority" required type="is-success">
						{{ $t("Majority") }}
					</b-checkbox>
				</div>
				<div class="field">
					<b-checkbox v-model="terms" required type="is-success">
						{{ $t("IHaveRead") }}
						<nuxt-link to="/legal-infos/terms-of-use">{{
							$t("TermsOfUse")
						}}</nuxt-link>
						{{ $t("And") }}
						<nuxt-link to="/legal-infos/privacy-policy">{{
							$t("PrivacyPolicy")
						}}</nuxt-link
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
					>{{ $t("SignUp") }}</b-button
				>
			</footer>
		</div>
	</form>
</template>

<script>
import axios from "axios";
import { countryCodeEmoji } from "country-code-emoji";

export default {
	computed: {
		loadedVoices() {
			return this.voices;
		},
	},
	data() {
		return {
			username: "",
			password: "",
			language: "",
			voices: [],
			languages: [],
			terms: false,
			majority: false,
			passwordConfirmation: "",
			loadingVoices: true,
			directSharers: [],
		};
	},
	async created() {
		const allVoicesObtained = new Promise(function (resolve, reject) {
			let voices = window.speechSynthesis.getVoices();
			if (voices.length !== 0) {
				resolve(voices);
			} else {
				window.speechSynthesis.addEventListener(
					"voiceschanged",
					function () {
						voices = window.speechSynthesis.getVoices();
						resolve(voices);
					}
				);
			}
		});
		allVoicesObtained.then((voices) => {
			this.voices = voices;
			this.loadingVoices = false;
		});
	},
	watch: {
		language(l) {
			this.languages = [];
			this.languages.push(l);
		},
	},
	methods: {
		getEmoji(language) {
			return countryCodeEmoji(language.split("-")[1]);
		},
		async onSubmit() {
			if (
				this.username == "" ||
				this.password == "" ||
				this.passwordConfirmation == "" ||
				this.major == false ||
				this.terms == false ||
				this.language == "" ||
				this.languages.length == 0
			) {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("PleaseCompleteForm"),
					position: "is-top-right",
					type: "is-info",
					hasIcon: true,
					icon: "account",
				});
				return;
			}
			if (this.passwordConfirmation != this.password) {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("PasswordNotCorrespond"),
					position: "is-top-right",
					type: "is-warning",
					hasIcon: true,
					icon: "key",
				});
				return;
			}
			try {
				const res = await axios.post("/auth/signup", {
					username: this.username,
					password: this.password,
					language: this.language,
					languages: this.languages,
					directSharers: this.directSharers,
				});
				if (res.status == 201) {
					await this.$store.dispatch("authenticateUser", {
						username: this.username,
						password: this.password,
						isLogin: true,
					});
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: this.$t("AccountCreated"),
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
							message: this.$t("ParametersInvalid"),
							position: "is-top-right",
							type: "is-danger",
							hasIcon: true,
							icon: "account",
						});
					} else {
						if (error.response.status == 409) {
							const notif = this.$buefy.notification.open({
								duration: 5000,
								message: this.$t("EmailAlreadyInUse"),
								position: "is-top-right",
								type: "is-danger",
								hasIcon: true,
								icon: "mail",
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
