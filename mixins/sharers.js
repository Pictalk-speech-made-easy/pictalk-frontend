export default {
	methods: {
		async pushToSharers() {
			const index = this.directSharers.indexOf(this.addDirectSharer);
			if (index === -1) {
				if (
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
						this.addDirectSharer
					)
				) {
					if (
						this.addDirectSharer !=
						this.$store.getters.getUser.username
					) {
						try {
							this.loading = true;
							const res = await this.$store.dispatch(
								"userExists",
								{
									username: this.addDirectSharer,
								}
							);
							if (res) {
								this.directSharers.push(this.addDirectSharer);
								this.directSharersObj.push({
									username: this.addDirectSharer,
								});
							} else {
								this.$buefy.toast.open({
									duration: 5000,
									message: this.$t("UserNotExists"),
									position: "is-top",
									type: "is-danger",
								});
							}
						} catch (err) {
							this.$buefy.toast.open({
								message: this.$t("SomeThingBadHappened"),
								type: "is-danger",
							});
						}

						this.loading = false;
					} else {
						this.$buefy.toast.open({
							duration: 5000,
							message: this.$t("NotFriendYourself"),
							position: "is-top",
							type: "is-danger",
						});
					}
				} else {
					this.$buefy.toast.open({
						duration: 5000,
						message: this.$t("EmailPlease"),
						position: "is-top",
						type: "is-danger",
					});
				}
			} else {
				this.$buefy.toast.open({
					duration: 5000,
					message: this.$t("DuplicateFriends"),
					position: "is-top",
					type: "is-danger",
				});
			}
		},
		removeFromSharers() {
			const index = this.directSharers.indexOf(this.selected.username);
			if (index !== -1) {
				this.directSharers.splice(index);
				this.directSharersObj.splice(index);
			} else {
				this.$buefy.toast.open({
					duration: 5000,
					message: this.$t("CannotRemoveFriends"),
					position: "is-top",
					type: "is-danger",
				});
			}
		},
	},
}