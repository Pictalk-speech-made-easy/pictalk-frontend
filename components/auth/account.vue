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
			<b-field :label="$t('Language')">
				<b-select
					v-model="user.language"
					placeholder="Select language"
					rounded
				>
					<option
						v-for="language in loadedVoices"
						:value="language.lang"
						:key="language.voiceURI"
					>
						{{ language.lang }}
					</option>
				</b-select>
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
			<b-table :data="data" :columns="columns"> </b-table>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
	computed: {
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
			return this.languages;
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
			languages: [],
			nb_requests: 0,
			done_requests: 0,
			dl_launched: false,
			data: [
				{
					id: 1,
					first_name: "Jesse",
					last_name: "Simmons",
					date: "2016-10-15 13:43:27",
					gender: "Male",
				},
				{
					id: 2,
					first_name: "John",
					last_name: "Jacobs",
					date: "2016-12-15 06:00:53",
					gender: "Male",
				},
				{
					id: 3,
					first_name: "Tina",
					last_name: "Gilbert",
					date: "2016-04-26 06:26:28",
					gender: "Female",
				},
				{
					id: 4,
					first_name: "Clarence",
					last_name: "Flores",
					date: "2016-04-10 10:28:46",
					gender: "Male",
				},
				{
					id: 5,
					first_name: "Anne",
					last_name: "Lee",
					date: "2016-12-06 14:38:38",
					gender: "Female",
				},
			],
			columns: [
				{
					field: "id",
					label: "ID",
					width: "100",
					numeric: true,
					searchable: true,
				},
				{
					field: "first_name",
					label: "First Name",
					searchable: true,
				},
				{
					field: "last_name",
					label: "Last Name",
					searchable: true,
				},
				{
					field: "date",
					label: "Date",
					centered: true,
				},
				{
					field: "gender",
					label: "Gender",
				},
			],
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
		allVoicesObtained.then((voices) => (this.languages = voices));
	},

	methods: {
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
			//TODO integrate this within the store
			try {
				this.dl_launched = true;
				const res = await axios.get("/pictalk/allPictos");
				var views = [];
				var already_saved_pictos = [];
				await this.$store.dispatch("resetViews");
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
								if (picto.path) {
									picto.path =
										axios.defaults.baseURL +
										"/pictalk/image/" +
										picto.path;
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
		async onSave(username, password, language) {
			try {
				const res = await this.$store.dispatch("editUser", {
					username: username,
					password: password,
					password: password,
					language: language,
				});
			} catch (error) {
				console.log("error: ", error);
			}

			this.$router.push("/pictalk");
		},
	},
};
</script>
