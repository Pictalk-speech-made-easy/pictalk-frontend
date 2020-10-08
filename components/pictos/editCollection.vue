<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">Edit Collection</p>
			</header>
			<section class="modal-card-body">
				<b-field label="Name">
					<b-input
						v-model="collection.name"
						type="name"
						placeholder="The name of the collection"
						required
					></b-input>
				</b-field>
				<b-field label="Color">
					<b-input type="color" v-model="collection.color" required></b-input>
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
					@click="
            onSubmitted(collection.name, collection.color, file, collection.id)
          "
				>Create</b-button>
			</footer>
		</div>
	</form>
</template>
<script>
const jpegasus = require("jpegasus");
export default {
	props: {
		collection: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			selectedOption: "",
			file: {}
		};
	},
	methods: {
		async onSubmitted(name, color, file, id) {
			if (name != "" && color != "") {
				try {
					if (file.name) {
						const cfile = await jpegasus.compress(file, {
							maxHeight: 500,
							maxWidth: 500,
							quality: 0.01
						});
						const res = await this.$store.dispatch(
							"editCollection",
							{
								id: id,
								name: name,
								color: color,
								image: cfile
							}
						);
					} else {
						const res = await this.$store.dispatch(
							"editCollection",
							{
								id: id,
								name: name,
								color: color
							}
						);
					}

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
				}
			}
		}
	}
};
</script>
