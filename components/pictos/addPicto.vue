<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("CreatePictogram") }}</p>
			</header>
			<section class="modal-card-body">
				<PictoSteps create="true" />
			</section>
			<footer class="modal-card-foot">
				<b-button
					class="button"
					type="button"
					@click="$parent.close()"
					>{{ $t("Close") }}</b-button
				>
			</footer>
		</div>
	</form>
</template>
<script>
import PictoSteps from "@/components/pictos/pictoSteps";
export default {
	components: {
		PictoSteps,
	},
	created() {
		this.$nuxt.$on("close-modal", () => {
			console.log("Called close modal");
			this.$parent.close();
		});
	},
};
</script>

<style scoped>
.has-background {
	border-radius: 3px;
	-webkit-box-shadow: 0px 0px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
	-moz-box-shadow: 0px 0px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
	box-shadow: 0px 0px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.containing {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.image {
	margin: auto;
}
.adminMenu {
	align-self: flex-end;
	margin: 0 auto;
	margin-top: auto;
}
</style>