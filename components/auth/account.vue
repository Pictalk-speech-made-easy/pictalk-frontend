<template>
	<div>
		<b-field label="Email">
			<b-input
				v-model="user.username"
				placeholder="exemple@mail.com"
				type="email"
				maxlength="30"
			></b-input>
		</b-field>
		<b-field label="Password">
			<b-input
				v-model="user.password"
				placeholder="S0meExample!"
				type="password"
				maxlength="30"
				password-reveal
			></b-input>
		</b-field>
		<b-field label="Language">
			<b-select
				v-model="user.language"
				placeholder="Select language"
				rounded
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
		<hr />
		<b-button tag="nuxt-link" to="/pictalk">Cancel</b-button>
		<b-button
			type="is-info"
			@click="onSave(user.username, user.password, user.language)"
			>Save</b-button
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
			>Download all pictograms
		</b-button>
		<br />
		<br />
		<b-message type="is-success">
			<div class="subtitle">
				Pressing this button will download all your pictograms so you
				can safely use Pictalk in offline mode ! Please be patient and
				wait at least for a minute.
			</div>
		</b-message>
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
				//const cache = await caches.open("pictos"); //TODO only dirty way works
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
							caches.open("pictos").then((cache) => {
								cache
									.add(picto.path)
									.then(() => {
										this.done_requests++;
									})
									.catch((err) => {
										console.log(err);
									});
							});

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
										view.collectionId === picto.collectionId
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
			} catch (e) {
				this.nb_requests = 0;
				this.done_requests = 0;
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: `Server cannot be reached, check your internet connection`,
					position: "is-top-right",
					type: "is-danger",
					hasIcon: true,
					icon: "danger",
				});
			}
		},
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
};
</script>
