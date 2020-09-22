<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">Edit Collection</p>
			</header>
			<section class="modal-card-body">
				<b-field label="Name">
					<b-input type="name" :value="name" placeholder="The text to be displayed..." required></b-input>
				</b-field>
				<b-field label="Color">
					<b-input type="color" :value="color" placeholder="The text to be spoken" required></b-input>
				</b-field>
			</section>
			<section>
				<b-field class="file">
					<b-upload v-model="file" expanded>
						<a class="button is-primary is-fullwidth">
							<b-icon icon="upload"></b-icon>
							<span>{{ file.name || "Click to upload"}}</span>
						</a>
					</b-upload>
				</b-field>
				<b-field>
					<b-upload v-model="dropFiles" multiple drag-drop expanded>
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
					<span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary">
						{{file.name}}
						<button class="delete is-small" type="button" @click="deleteDropFile(index)"></button>
					</span>
				</div>
			</section>
			<footer class="modal-card-foot">
				<button class="button" type="button" @click="$parent.close()">Close</button>
				<button class="button is-primary">Save</button>
			</footer>
		</div>
	</form>
</template>
<script>
export default {
	data() {
		return {
			file: {},
			dropFiles: []
		};
	},
	methods: {
		deleteDropFile(index) {
			this.dropFiles.splice(index, 1);
		}
	}
};
</script>