<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("EditPictogram") }}</p>
			</header>
			<section class="modal-card-body">
				<PictoSteps :picto="picto" />
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
	props: {
		picto: {
			type: Object,
			required: true,
		},
	},
};
</script>
