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
				<b-field class="column" :label="$t('Principal Language')">
					<b-select
						v-model="user.language"
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
						v-model="user.languages"
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
			</div>
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
			<br />
			<br />
			<b-progress
				type="is-success"
				:value="requestsPercentage"
				show-value
				format="percent"
			></b-progress>

			<b-button icon-left="download" type="is-info" @click="downloadAll()"
				>{{ $t("DownloadAllPictos") }}
			</b-button>
			<br />
			<br />
			<b-message type="is-success">
				<div class="subtitle">
					{{ $t("DownloadAllPictosNotice") }}
				</div>
			</b-message>
		</div>
		<div class="column">
			<b-field :label="$t('Trusted Sources')">
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
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { countryCodeEmoji } from "country-code-emoji";
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
			voices: [],
			nb_requests: 0,
			checkedRows: [],
			directSharers: [],
			loadingVoices: true,
			done_requests: 0,
			dl_launched: false,
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
		language(l) {
			this.user.languages = [];
			this.user.languages.push(l);
		},
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
		this.directSharers = [...this.user.directSharers];
	},
	methods: {
		deleteSelectedTrustedSources() {
			this.checkedRows.forEach((row) => {
				const index = this.directSharers.indexOf(row);
				this.directSharers.splice(index, 1);
			});
		},
		getEmoji(language) {
			return countryCodeEmoji(language.split("-")[1]);
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
			try {
				const res = await this.$store.dispatch("editUser", {
					username: this.user.username,
					password: this.user.password,
					password: this.user.password,
					language: this.user.language,
					languages: this.user.languages,
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
