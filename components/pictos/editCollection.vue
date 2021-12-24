<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("EditCollection") }}</p>
			</header>
			<section class="modal-card-body">
				<collection-steps :collection="collection" />
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
import CollectionSteps from "@/components/pictos/collectionSteps";
export default {
	props: {
		collection: {
			type: Object,
			required: true,
		},
	},
	components: {
		CollectionSteps,
	},
};
</script>
