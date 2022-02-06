<template>
	<div class="modal-card" style="width: auto">
		<header class="modal-card-head">
			<p class="modal-card-title">{{ $t("ShareCollection") }}</p>
		</header>
		<section class="modal-card-body">
			<div class="columns is-mobile">
				<div class="column">
					<b-field
						v-for="(
							collaborator, index
						) in getTrueAccessCollaborators"
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
				</div>
				<div class="column">
					<b-field :label="$t('Groups')">
						<div class="columns is-mobile is-multiline">
							<div
								class=""
								:class="[
									groupInSelected(group) != -1
										? 'has-background card column is-half'
										: 'card column is-half ',
								]"
								v-for="(group, index) in $store.getters.getUser
									.mailingList"
								@click="addOrRemoveGroupToSelected(group)"
							>
								<div class="card-content">
									<div class="media">
										<div class="media-left">
											<b-icon :icon="group.icon" />
										</div>
										<div class="media-content">
											<p class="title is-6">
												{{ group.name }}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</b-field>
				</div>
			</div>
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
			selectedGroups: [],
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
		groupInSelected(selectedGroup) {
			return this.selectedGroups
				.map((group) => group.name)
				.indexOf(selectedGroup.name);
		},
		addOrRemoveGroupToSelected(selectedGroup) {
			const groupIndex = this.selectedGroups
				.map((group) => group?.name)
				.indexOf(selectedGroup?.name);
			if (groupIndex != -1) {
				this.selectedGroups.splice(groupIndex, 1);
			} else {
				this.selectedGroups.push(selectedGroup);
			}
		},
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
<style scoped>
.has-background {
	border-radius: 5px;
	-webkit-box-shadow: 3px 3px 5px 6px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
	-moz-box-shadow: 3px 3px 5px 6px #ccc; /* Firefox 3.5 - 3.6 */
	box-shadow: 3px 3px 5px 6px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
</style>