<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("CreateCollection") }}</p>
			</header>
			<section class="modal-card-body">
				<CollectionSteps 
				create="true"
				@close="$parent.close()"
				/>
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
	components: {
		CollectionSteps,
	},
};
</script>