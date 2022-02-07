<template>
	<div class="modal-card" style="width: auto">
		<header class="modal-card-head">
			<p class="modal-card-title">{{ $t("ShareCollection") }}</p>
		</header>
		<section class="modal-card-body">
			<div class="columns is-mobile">
				<div class="column">
					<b-field
						v-for="(collaborator, index) in getLoneCollaborators"
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
								v-for="(group, index) in groups"
								:class="[
									isGroupSelected(group) ||
									isGroupShared(group)
										? 'has-background card column is-half'
										: 'card column is-half ',
								]"
							>
								<div class="card-content">
									<div class="media">
										<div
											@click="
												addOrRemoveGroupToSelected(
													group
												)
											"
											class="media-left"
										>
											<b-icon :icon="group.icon" />
										</div>
										<div class="media-content">
											<p
												@click="
													addOrRemoveGroupToSelected(
														group
													)
												"
												class="title is-6"
											>
												{{ group.name }}
											</p>
											<b-select
												v-if="group.selected"
												v-model="group.mode"
												required
											>
												<option value="editor">
													✏️
												</option>
												<option value="viewer">
													👁️
												</option>
											</b-select>
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
			loneCollaborators: [],
			groups: [],
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
		this.groups = this.getGroups;
		let found;
		this.collaborators.forEach((coll) => {
			found = false;
			this.groups.forEach((group) => {
				if (group.users.indexOf(coll.username) != -1) {
					found = true;
					if (!group.foundUserCount) {
						group.foundUserCount = 0;
					}
					group.foundUserCount += 1;
				}
			});
			if (!found) {
				this.loneCollaborators.push(coll);
			}
		});
	},
	computed: {
		getLoneCollaborators() {
			return this.loneCollaborators.filter(
				(collaborator) => collaborator.access == "1"
			);
		},
		getTrueAccessCollaborators() {
			return this.collaborators.filter(
				(collaborator) => collaborator.access == "1"
			);
		},
		getGroups() {
			return JSON.parse(
				JSON.stringify(this.$store.getters.getUser.mailingList)
			);
		},
		getSharedGroups() {
			return this.groups.filter((group) => this.isGroupShared(group));
		},
	},
	methods: {
		isGroupSelected(group) {
			return group.selected;
		},
		isGroupShared(group) {
			return group.foundUserCount == group.users.length;
		},
		addOrRemoveGroupToSelected(selectedGroup) {
			selectedGroup.selected = !selectedGroup?.selected;
			this.groups.push("");
			this.groups.pop();
		},
		async onSubmitted() {
			try {
				const sharedGroups = this.getSharedGroups.concat(
					this.groups.filter((group) => group.selected)
				);
				const editorUsernameArray = sharedGroups
					.filter((group) => group.mode == "editor")
					.map((group) => group.users)
					.concat(
						this.loneCollaborators
							.filter((coll) => coll.mode == "editor")
							.map((coll) => coll.username)
					)
					.flat();
				if (editorUsernameArray.length != 0) {
					await this.$store.dispatch("shareCollection", {
						collectionId: this.picto.id,
						usernames: editorUsernameArray,
						role: "editor",
						access: "1",
					});
				}

				const viewerUsernameArray = sharedGroups
					.filter((group) => group.mode == "viewer")
					.map((group) => group.users)
					.concat(
						this.loneCollaborators
							.filter((coll) => coll.mode == "viewer")
							.map((coll) => coll.username)
					)
					.flat();
				if (viewerUsernameArray.length != 0) {
					await this.$store.dispatch("shareCollection", {
						collectionId: this.picto.id,
						usernames: viewerUsernameArray,
						role: "viewer",
						access: "1",
					});
				}

				const deletedUsernameArray = sharedGroups
					.filter((group) => !group.selected)
					.concat(
						this.loneCollaborators
							.filter((coll) => coll.access == "0")
							.map((coll) => coll.username)
					)
					.flat();
				if (deletedUsernameArray.length != 0) {
					await this.$store.dispatch("shareCollection", {
						collectionId: this.picto.id,
						usernames: deletedUsernameArray,
						role: "viewer",
						access: "0",
					});
				}
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