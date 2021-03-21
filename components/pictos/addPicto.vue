<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">Create Pictogram</p>
			</header>
			<section class="modal-card-body">
				<b-field label="Speech">
					<b-input
						type="text"
						v-model="pictoSpeech"
						placeholder="The text to be spoken"
					></b-input>
				</b-field>
				<b-button
					type="is-success"
					icon-right="message"
					@click="pronounce(pictoSpeech)"
				/>
				<br />
				<br />
				<b-field label="Meaning">
					<b-input
						type="text"
						v-model="pictoMeaning"
						placeholder="The text to be displayed"
						required
					></b-input>
				</b-field>
				<b-field label="Folder">
					<b-checkbox
						v-model="isFolder"
						true-value="1"
						false-value="0"
						>is it a folder ?</b-checkbox
					>
				</b-field>
				<br />
				<div>
					<section>
						<b-field class="file">
							<b-upload
								v-model="file"
								accept="image/*"
								native
								expanded
								required
							>
								<a class="button is-primary is-fullwidth">
									<b-icon icon="upload"></b-icon>
									<span>{{
										file.name || "Click to upload"
									}}</span>
								</a>
							</b-upload>
						</b-field>
						<b-field>
							<b-upload
								v-model="file"
								accept="image/*"
								native
								drag-drop
								expanded
							>
								<section class="section">
									<div class="content has-text-centered">
										<p>
											<b-icon
												icon="upload"
												size="is-large"
											></b-icon>
										</p>
										<p>
											Drop your files here or click to
											upload
										</p>
									</div>
								</section>
							</b-upload>
						</b-field>
						<b-field>
							<b-switch
								v-model="highQuality"
								false-value="Standard quality (for pictograms)"
								true-value="High quality (for pictures)"
							>
								{{ highQuality }}
							</b-switch>
						</b-field>
						<div class="tags">
							<span class="tag is-primary">
								{{ file.name }}
								<button
									class="delete is-small"
									type="button"
									@click="file = {}"
								></button>
							</span>
						</div>
					</section>
				</div>
			</section>

			<footer class="modal-card-foot">
				<b-button class="button" type="button" @click="$parent.close()"
					>Close</b-button
				>
				<b-button
					class="button is-primary"
					@click="
						onSubmitted(
							pictoSpeech,
							pictoMeaning,
							isFolder,
							file,
							highQuality
						)
					"
					>Create</b-button
				>
			</footer>
		</div>
	</form>
</template>
<script>
const jpegasus = require("jpegasus");
export default {
	data() {
		return {
			selectedOption: "",
			pictoSpeech: "",
			pictoMeaning: "",
			isFolder: "0",
			file: {},
			highQuality: "Standard quality (for pictograms)",
		};
	},
	computed: {
		getUserLang() {
			const user = this.$store.getters.getUser;
			return user.language;
		},
	},
	methods: {
		delay(delayInms) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(2);
				}, delayInms);
			});
		},
		async pronounce(speech) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				msg.text = speech;
				let voices = window.speechSynthesis.getVoices();
				let voice = voices.filter(
					(voice) => voice.lang == this.getUserLang
				);
				let increment;
				while (voice.length == 0 && increment != 10) {
					voices = window.speechSynthesis.getVoices();
					voice = voices.filter(
						(voice) => voice.lang == this.getUserLang
					);
					increment++;
					await this.delay(10);
				}
				voice = voices.filter(
					(voice) => voice.lang == this.getUserLang
				);
				if (voice.length !== 0) {
					msg.voice = voice[0];
				} else {
					console.log("No voices found !");
				}
				window.speechSynthesis.speak(msg);
			} else {
				console.log("Your browser doesn't support speechSynthesis :(");
			}
		},
		async onSubmitted(speech, meaning, isfolder, file, highQuality) {
			if (meaning != "" && file.name) {
				if (!file.name.match(/\.(jpeg|png|gif)$/)) {
					this.$buefy.notification.open({
						message:
							"Only <b>gif png</b> or <b>jpeg</b> images are allowed",
						type: "is-warning",
					});
					return;
				}
				if (speech == "") {
					speech = " ";
				}
				try {
					let quality;
					quality =
						highQuality == "High quality (for pictures)"
							? (quality = 0.1)
							: (quality = 0.01);
					const cfile = await jpegasus.compress(file, {
						maxHeight: 500,
						maxWidth: 500,
						quality: quality,
					});
					this.$store.dispatch("addPicto", {
						picto: {
							speech: speech,
							meaning: meaning,
							folder: parseInt(isfolder, 10),
							image: cfile,
							fatherId: parseInt(this.$route.params.fatherId, 10),
						},
						collectionId: parseInt(
							this.$route.params.collectionId,
							10
						),
					});
					this.$buefy.notification.open({
						message: "The pictogram was uploaded flawlessly !",
						type: "is-success",
					});
					this.$parent.close();
				} catch (ex) {
					console.log(ex);
					this.$buefy.notification.open({
						message: "Something bad happened...",
						type: "is-danger",
					});
				}
			} else {
				this.$buefy.notification.open({
					message:
						"Please input a speech, a meaning, a isFolder and a File...",
					type: "is-danger",
				});
			}
		},
	},
};
</script>
