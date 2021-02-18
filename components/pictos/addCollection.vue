<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">Create Collection</p>
			</header>
			<section class="modal-card-body">
				<b-field label="Name">
					<b-input
						type="name"
						v-model="collectionName"
						placeholder="The text to be displayed..."
						required
					></b-input>
				</b-field>
				<b-field label="Color">
					<b-input type="color" v-model="collectionColor" placeholder="The color" required></b-input>
				</b-field>
				<br />
				<div>
					<section>
						<b-field class="file">
							<b-upload v-model="file" accept="image/*" native expanded required>
								<a class="button is-primary is-fullwidth">
									<b-icon icon="upload"></b-icon>
									<span>{{ file.name || "Click to upload" }}</span>
								</a>
							</b-upload>
						</b-field>
						<b-field>
							<b-upload v-model="file" accept="image/*" native drag-drop expanded>
								<section class="section">
									<div class="content has-text-centered">
										<p>
											<b-icon icon="upload" size="is-large"></b-icon>
										</p>
										<p>Drop your files here or click to upload</p>
									</div>
								</section>
							</b-upload>
						</b-field>
						<b-field>
							<b-switch v-model="highQuality"
								false-value="Standard quality (for pictograms)"
								true-value="High quality (for pictures)">
								{{ highQuality }}
							</b-switch>
        				</b-field>
						<div class="tags">
							<span class="tag is-primary">
								{{ file.name }}
								<button class="delete is-small" type="button" @click="file = {}"></button>
							</span>
						</div>
					</section>
				</div>
			</section>
			<footer class="modal-card-foot">
				<b-button class="button" type="button" @click="$parent.close()">Close</b-button>
				<b-button
					class="button is-primary"
					@click="onSubmitted(collectionName, collectionColor, file, highQuality)"
				>Create</b-button>
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
			collectionName: "",
			collectionColor: "",
			file: {},
			highQuality: "Standard quality (for pictograms)"
		};
	},
	methods: {
		async onSubmitted(name, color, file, highQuality) {
			if (name != "" && color != "" && file.name) {
				try {
					let quality
					quality = highQuality=="High quality (for pictures)" ? quality=0.1 : quality=0.01;
					const cfile = await jpegasus.compress(file, {
						maxHeight: 500,
						maxWidth: 500,
						quality: quality,
					});
					const res = await this.$store.dispatch("addCollection", {
						name: name,
						color: color,
						image: cfile
					});
					this.$buefy.notification.open({
						message: "The collection was uploaded flawlessly !",
						type: "is-success"
					});
					this.$parent.close();
				} catch (ex) {
					console.log(ex);
					this.$buefy.notification.open({
						message: "Something bad happened...",
						type: "is-danger"
					});
				} finally {
				}
			}
		}
	}
};
</script>
