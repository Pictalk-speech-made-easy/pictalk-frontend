<template>
	<div class="modal-card" style="width: auto">
		<header class="modal-card-head">
			<p class="modal-card-title">{{ $t("ShareCollection") }}</p>
		</header>
		<section class="modal-card-body">
			<b-field
				v-for="(collaborator, index) in getTrueAccessCollaborators"
				:key="index"
				:label="$t('Contact') + ' ' + (index + 1)"
				group-multiline
				grouped
			>
				<b-input v-model="collaborator.username"></b-input>
				<p class="control">
					<b-select v-model="collaborator.mode" required>
						<option value="editor">✏️</option>
						<option value="viewer">👁️</option>
					</b-select>
				</p>
				<b-button
					class="is-danger"
					icon-left="delete"
					@click="deleteCollaborator(index)"
				>
				</b-button>
			</b-field>
			<b-button
				type="is-primary"
				icon-right="plus"
				@click="pushSharerAndMode()"
			/>
		</section>
		<footer class="modal-card-foot">
			<b-button class="button" type="button" @click="$parent.close()">{{
				$t("Close")
			}}</b-button>
			<b-button class="button is-primary" @click="onSubmitted()">{{
				$t("Share")
			}}</b-button>
		</footer>
	</div>
</template>
<script>
export default {
	props: {
		picto: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			collaborators: [],
		};
	},
	mounted() {
		this.picto.viewers.forEach((viewer) =>
			this.collaborators.push({
				username: viewer,
				mode: "viewer",
				access: "1",
			})
		);
		this.picto.editors.forEach((editor) =>
			this.collaborators.push({
				username: editor,
				mode: "editor",
				access: "1",
			})
		);
	},
	computed: {
		getTrueAccessCollaborators() {
			return this.collaborators.filter(
				(collaborator) => collaborator.access == "1"
			);
		},
	},
	methods: {
		async onSubmitted() {
			try {
				this.collaborators.forEach((sharer) => {
					this.$store.dispatch("shareCollection", {
						collectionId: this.picto.id,
						username: sharer.username,
						role: sharer.mode,
						access: "1",
					});
				});
				this.$buefy.notification.open({
					message: this.$t("UpdatedSharers"),
					type: "is-success",
				});
				this.$parent.close();
			} catch (err) {
				console.log(err);
				this.$buefy.notification.open({
					message: this.$t("SomeThingBadHappened"),
					type: "is-danger",
				});
			}
		},
		deleteCollaborator(index) {
			this.collaborators[index].access = "0";
		},
		getIconByMode(index) {
			return this.collaborators[index].mode == "editor"
				? "account-edit"
				: "account-eye";
		},
		pushSharerAndMode() {
			this.collaborators.push({
				username: "",
				mode: "viewer",
				access: "1",
			});
		},
	},
};
</script>
