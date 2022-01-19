<template>
	<form action>
		<div class="modal-card" style="height: 100vh; width: 100vw;">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("SignUp") }}</p>
			</header>
			<section class="modal-card-body">
				<b-steps 
					rounded
					animated
					mobile-mode="compact"
					label-position="bottom">
        <b-step-item clickable label="Account" icon="account-key">
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
				</b-step-item>
        <b-step-item clickable label="Profile" icon="account">
					<div class="contenant">
					<b-image
					class="center"
            lazy
						:srcset="require('@/assets/signup_languages.png').srcSet"
						alt="A boy and a girl speaking different languages"
						style="width: 80%;"
        ></b-image>
				</div>
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
								v-for="voice in loadedVoices"
								:value="voice.voiceURI"
								:key="voice.voiceURI"
							>
								{{getEmoji(voice.lang)}} {{voice.voiceURI}}
							</option>
						</b-select>
					</b-field>
					<b-button @click="showLanguages = !showLanguages" type="is-ghost">{{ $t('SpeakMoreLanguage')}}</b-button>
					<b-field v-if="showLanguages" class="column" :label="$t('Languages')">
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
								v-for="voice in loadedVoices"
								:value="voice.voiceURI"
								:key="voice.voiceURI"
							>
								{{ getEmoji(voice.lang) }} {{voice.voiceURI}} 
							</option>
						</b-select>
					</b-field>
				</b-step-item clickable>
        <b-step-item clickable label="Social" icon="account-plus">
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
				</b-step-item>
				<b-step-item clickable label="Social" icon="account-plus">
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
				</b-step-item>
    		</b-steps>
				
				<br />
				
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
			showLanguages: false,
		};
	},
	async created() {
		const allVoicesObtained = new Promise(function (resolve, reject) {
			let voices = window.speechSynthesis.getVoices();
			if (voices.length !== 0) {
				console.log(voices);
				resolve(voices);
			} else {
				window.speechSynthesis.addEventListener(
					"voiceschanged",
					function () {
						voices = window.speechSynthesis.getVoices();
						console.log(voices);
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
		language: {
			handler: function(l) {
				this.languages = [];
				this.languages.push(l);
				this.playSentenceInLanguage(this.voices.filter((voice) => voice.voiceURI == l)[0].lang, l);
			},
			deep: true,
		},
	},
	methods: {
		convertToSimpleLanguage(language){
			return language.replace(/[^a-z]/g, "");
		},
		async playSentenceInLanguage(lang, voiceURI){
			console.log(lang);
			console.log(voiceURI);
			// Ask deepL for traduction of a specific phrase
			let translatedText = (await axios.get('/translation/', { 
							params: {
								text: "I like french fries",
								targetLang: this.convertToSimpleLanguage(lang),
							}
						}))?.data.translations[0].text;
			this.pronounce(translatedText, lang, voiceURI);
			console.log("Done playSentence");
			// Play it
		},
		async pronounce(speech, lang, voiceURI) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				msg.text = speech;
				let voice = this.voices.filter(
					(voice) => voice.voiceURI == voiceURI
				);
				console.log(voice);
				if (voice.length == 0) {
					voice = this.voices.filter(
					(voice) => voice.lang == lang
					);
				}
				console.log(voice);
				if (voice.length !== 0) {
					console.log("Voice: ",voice[0]);
					msg.voice = voice[0];
				}
				window.speechSynthesis.speak(msg);
			} else {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("NoVoicesFound"),
					position: "is-top-right",
					type: "is-warning",
					hasIcon: true,
				});
			}
		},
		getEmoji(language) {
			if (language) {
				if (language.match(/[a-z]{2}-[A-Z]{2}/g)) {
					return countryCodeEmoji(language.split("-")[1]);
				}
			}
			return;
			
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
			this.languages = this.languages.filter(function(item, pos, a) {
    		return a.indexOf(item) == pos;
			});
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
<style>
.center {
	display: block;
	margin-left: auto;
	margin-right: auto;
}
.contenant {
	display: flex;
	justify-content: center;
}
</style>