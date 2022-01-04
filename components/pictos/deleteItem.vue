<template>
	<div class="modal-card" style="width: auto">
		<header class="modal-card-head">
			<p class="modal-card-title">{{ $t("Delete") }}</p>
		</header>
		<section class="modal-card-body">
			{{ $t("DeleteItem")
			}}{{ object.meaning[$store.getters.getUser.language] }} ?
			<br />
			<br />
			<img
				class="image"
				:src="object.image"
				width="40%"
				crossorigin="anonymous"
				style=""
			/>
			<br />
			<br />
			<b-field
				:label="
					$t('PleaseType1') +
					' ' +
					object.meaning[$store.getters.getUser.language] +
					' ' +
					$t('PleaseType2')
				"
			>
				<b-input
					v-model="meaningOrName"
					:placeholder="
						object.meaning[$store.getters.getUser.language]
					"
					v-on:keyup.native.enter="
						object.meaning[$store.getters.getUser.language]
					"
				></b-input>
			</b-field>
		</section>
		<footer class="modal-card-foot">
			<b-button class="button" type="button" @click="$parent.close()">{{
				$t("Close")
			}}</b-button>
			<b-button
				class="button is-primary"
				@click="onSubmitted(meaningOrName)"
				>{{ $t("Delete") }}</b-button
			>
		</footer>
	</div>
</template>
<script>
export default {
	props: {
		object: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			meaningOrName: "",
		};
	},
	methods: {
		async onSubmitted(name) {
			if (
				name ==
				this.object.meaning[this.$store.getters.getUser.language]
			) {
				try {
					if (this.object.collection) {
						const res = await this.$store.dispatch(
							"removeCollection",
							this.object
						);
					} else {
						const res = await this.$store.dispatch(
							"removePicto",
							this.object
						);
					}
					this.$buefy.notification.open({
						message: this.$t("DeletedSuccess"),
						type: "is-success",
					});
					this.$parent.close();
					return;
				} catch (ex) {
					console.log(ex);
					this.$buefy.notification.open({
						message: this.$t("SomeThingBadHappened"),
						type: "is-danger",
					});
				}
			} else {
				this.$buefy.notification.open({
					message: this.$t("DeleteNotCorrespond"),
					type: "is-danger",
				});
			}
		},
	},
};
</script>
