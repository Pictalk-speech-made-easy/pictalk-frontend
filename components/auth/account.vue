<template>
	<div class="columns container is-fullhd">
		<div class="column">
			<b-field :label="$t('Email')">
				<b-input
					v-model="user.username"
					placeholder="exemple@mail.com"
					type="email"
					maxlength="30"
				></b-input>
			</b-field>
			<b-field :label="$t('Password')">
				<b-input
					v-model="user.password"
					placeholder="S0meExample!"
					type="password"
					maxlength="30"
					password-reveal
				></b-input>
			</b-field>
			<div class="columns">
				<b-field class="column" :label="$t('PrincipalLanguage')">
					<b-select
						v-model="voiceURI"
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
							{{ getEmoji(voice.lang) }} {{voice.voiceURI}}
						</option>
					</b-select>
				</b-field>
				<b-field class="column" :label="$t('Languages')">
					<b-select
						v-model="voiceURIs"
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
			</div>
			<hr />
			<h1 class="subtitle">{{$t('OptionnalParameters')}}</h1>

			<b-field>
            <b-switch>{{$t('PronouncePictoOnClick')}}</b-switch>
      </b-field>
			<b-field>
            <b-switch>{{$t('EnforcedSecurityMode')}}</b-switch>
      </b-field>
			<b-field>
            <b-switch>{{$t('ReturnWithoutRemoveButton')}}</b-switch>
      </b-field>
			<b-field>
            <b-switch>{{$t('TravelerMode')}}</b-switch>
      </b-field>
			<hr />
			<b-button tag="nuxt-link" to="/pictalk">{{
				$t("Cancel")
			}}</b-button>
			<b-button
				type="is-info"
				@click="onSave(user.username, user.password, user.language)"
				>{{ $t("Save") }}</b-button
			>
			<br />
		</div>
		<div class="column">
			<b-field :label="$t('TrustedSources')">
				<b-table
					:checked-rows.sync="checkedRows"
					checkable
					:data="getObjectUserDirectSharers"
					:columns="columns"
				>
				</b-table>
			</b-field>
			<b-button
				type="is-danger"
				icon-left="delete"
				class="field"
				@click="deleteSelectedTrustedSources()"
			/>
			<b-button
				type="is-success"
				:icon-left="showDirectSharerInputText ? 'menu-up' : 'plus'"
				class="field"
				@click="showDirectSharerInput()"
			/>
			<b-field
				v-if="showDirectSharerInputText"
				:label="$t('AddTrustedSource')"
			>
				<b-input
					v-model="addDirectSharer"
					placeholder="alex@pictalk.xyz"
					type="email"
					maxlength="30"
				></b-input>
				<p class="control">
					<b-button
						type="is-success"
						icon-right="plus"
						@click="directSharers.push(addDirectSharer)"
					/>
				</p>
			</b-field>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { countryCodeEmoji } from "country-code-emoji";
import merge from 'lodash.merge';
export default {
	computed: {
		getObjectUserDirectSharers() {
			return this.directSharers.map((val) => {
				return { username: val };
			});
		},
		requestsPercentage() {
			if (this.nb_requests == 0 && this.dl_launched == false) {
				return 0;
			} else {
				if (this.dl_launched == true && this.nb_requests == 0) {
					return 100;
				} else {
					return (this.done_requests / this.nb_requests) * 100;
				}
			}
		},
		loadedVoices() {
			return this.voices;
		},
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			showDirectSharerInputText: false,
			addDirectSharer: "",
			voices: [],
			voiceURI: "",
			voiceURIs: [],
			nb_requests: 0,
			checkedRows: [],
			directSharers: [],
			loadingVoices: true,
			done_requests: 0,
			dl_launched: false,
			initialization: true,
			columns: [
				{
					field: "username",
					label: "Email",
					searchable: false,
				},
			],
		};
	},
	watch: {
		voiceURI:function(v, oldVoice) {
				const oldIndex = this.voiceURIs.findIndex((uri) => uri == oldVoice);
				if (oldIndex != -1) {
					this.voiceURIs.splice(oldIndex, 1);
				}
				this.voiceURIs.push(v);
				if (this.initialization == false) {this.playSentenceInLanguage(this.voices.filter((voice) => voice.voiceURI == v)[0].lang, v);}
		},
		voiceURIs: function(newValue, oldValue) {
				if (newValue.length > oldValue.length && newValue.length > 1) {
					const v = newValue.filter( ai => oldValue.indexOf(ai) == -1 )[0];
					if (this.initialization == false) {this.playSentenceInLanguage(this.voices.filter((voice) => voice.voiceURI == v)[0].lang, v);}
				}
		}
	},
	beforeUpdate() {
		this.initialization = false;
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
			this.voiceURI = this.user.language[Object.keys(this.user.language)[0]][this.getDeviceInfo()]?.voiceURI;
			this.voiceURIs = Object.keys(this.user.languages).map((lang) => {
				return (this.user.languages[lang][this.getDeviceInfo()]?.voiceURI)
			});
			// Si vide alors remplir avec la premiere valeur equiv a lang
			if (!this.voiceURI) {
				this.voiceURI = this.voices.filter((voice) => voice.lang == Object.keys(this.user.language)[0])[0].voiceURI;
			}
			
			this.voiceURIs = Object.keys(this.user.languages).map((lang, index) => {
				if (this.voiceURIs[index]) {
					return this.voiceURIs[index];
				} else {
					return this.voices.filter((voice) => voice.lang == lang)[0].voiceURI;
				}
			});
		});
		this.directSharers = [...this.user.directSharers];
	},
	methods: {
		getDeviceInfo(){
			return this.getOSInfo() + window.screen.height + window.screen.width + window.devicePixelRatio;
		},
		getOSInfo(){
			if (window.navigator.userAgent.indexOf("Windows NT 10.0")!= -1) return "Windows 10";
			if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1) return "Windows 8.1";
			if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) return "Windows 8";
			if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) return "Windows 7";
			if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) return "Windows Vista";
			if (window.navigator.userAgent.indexOf("Mac")            != -1) return "Mac/iOS";
			if (window.navigator.userAgent.indexOf("X11")            != -1) return "UNIX";
			if (window.navigator.userAgent.indexOf("Linux")          != -1) return "Linux";
		},
		convertToSimpleLanguage(language){
			return language.replace(/[^a-z]/g, "");
		},
		async playSentenceInLanguage(lang, voiceURI){
			let translatedText = (await axios.get('/translation/', { 
							params: {
								text: "I like french fries",
								targetLang: this.convertToSimpleLanguage(lang),
							}
						}))?.data.translations[0].text;
			this.pronounce(translatedText, lang, voiceURI);
		},
		async pronounce(speech, lang, voiceURI) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				msg.text = speech;
				let voice = this.voices.filter(
					(voice) => voice.voiceURI == voiceURI
				);
				if (voice.length == 0) {
					voice = this.voices.filter(
					(voice) => voice.lang == lang
					);
				}
				if (voice.length !== 0) {
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
		showDirectSharerInput() {
			this.showDirectSharerInputText = !this.showDirectSharerInputText;
		},
		deleteSelectedTrustedSources() {
			this.checkedRows.forEach((row) => {
				const index = this.directSharers.indexOf(row);
				this.directSharers.splice(index, 1);
			});
		},
		getEmoji(language) {
				if (language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
					return countryCodeEmoji(language.split("-")[1]);
				}
			return;
			
		},
		addRetry(cache, url, retries = 3, backoff = 300) {
			return cache
				.add(url)
				.then(() => {
					this.done_requests++;
					return;
				})
				.catch(() => {
					if (retries > 0) {
						setTimeout(() => {
							return this.addRetry(
								cache,
								url,
								retries - 1,
								backoff * 2
							);
						}, backoff);
					} else {
						console.log("Network disconnected !");
					}
				});
		},
		async downloadAll() {
			try {
				this.dl_launched = true;
				const res = await axios.get("/pictalk/allPictos");
				var views = [];
				var already_saved_pictos = [];
				await this.$store.dispatch("resetCollections");
				this.nb_requests =
					res.data.length - already_saved_pictos.length;
				caches.open("pictos").then((cache) => {
					new Promise((resolve, reject) =>
						res.data.forEach(async (picto, index, array) => {
							if (
								!already_saved_pictos.find(
									(elem) => elem == picto.id
								)
							) {
								if (picto.image) {
									picto.image =
										axios.defaults.baseURL +
										"/image/pictalk/" +
										picto.image;
								}
								setTimeout(() => {
									return this.addRetry(cache, picto.path);
								}, Math.floor(Math.random() * 1000));

								// View existante pour le picto ?
								const viewExists = views.findIndex(
									(view) =>
										view.fatherId === picto.fatherId &&
										view.collectionId === picto.collectionId
								);
								if (picto.folder == 1) {
									const folderExists = views.findIndex(
										(view) =>
											view.fatherId === picto.id &&
											view.collectionId ===
												picto.collectionId
									);
									if (folderExists != -1) {
										views.push({
											collectionId: picto.collectionId,
											fatherId: picto.id,
											pictos: Array(),
										}); //View of folder
									}
								}
								if (viewExists == -1) {
									views.push({
										collectionId: picto.collectionId,
										fatherId: picto.fatherId,
										pictos: Array(),
									}); //Add view if not here
									views[views.length - 1].pictos.push({
										...picto,
									});
								} else {
									views[viewExists].pictos.push({ ...picto });
									already_saved_pictos.push(picto.id);
								}
							}
							if (index === array.length - 1) {
								resolve();
							}
						})
					).then(() => {
						views.forEach((view) => {
							this.$store.dispatch("addView", view);
						});
					});
				});
			} catch (e) {
				this.nb_requests = 0;
				this.done_requests = 0;
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: $t("ServerOffline"),
					position: "is-top-right",
					type: "is-danger",
					hasIcon: true,
					icon: "danger",
				});
			}
		},
		async onSave() {
			let device = {};
			let language = {};
			let languages = {};
			let editedLanguage = {};
			device[this.getDeviceInfo()] = {voiceURI: this.voiceURI, pitch: ""};
			const languageLang = this.voices.filter((voice) => voice.voiceURI == this.voiceURI)[0].lang;
			language[languageLang] = device;
			if (Object.keys(this.user.language)[0] == languageLang) {
				editedLanguage = Object.assign({}, JSON.parse(JSON.stringify(this.user.language)));
				merge(editedLanguage, language);
			} else {
				const languagesIndex = Object.keys(this.user.languages).find((language) => language == languageLang);
				if (languagesIndex) {
					editedLanguage[languagesIndex] = this.user.languages[languagesIndex];
				} else {
					editedLanguage = language;
				}
			}
			this.voiceURIs.forEach((voiceURI) => {
				device = {};
				device[this.getDeviceInfo()] = {voiceURI: voiceURI, pitch: ""};
				languages[this.voices.filter((voice) => voice.voiceURI == voiceURI)[0].lang] = device;
			});
			let editedLanguages = Object.assign({}, JSON.parse(JSON.stringify(this.user.languages)));
			
			merge(editedLanguages, languages);
			try {
				const res = await this.$store.dispatch("editUser", {
					username: this.user.username,
					password: this.user.password,
					password: this.user.password,
					language: editedLanguage,
					languages: editedLanguages,
					directSharers: this.directSharers,
				});
			} catch (error) {
				console.log("error: ", error);
			}

			this.$router.push("/pictalk");
		},
	},
};
</script>
