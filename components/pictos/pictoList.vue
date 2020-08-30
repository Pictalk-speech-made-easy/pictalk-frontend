<template>
	<div>
		<section>
			<div class="columns is-mobile is-multiline">
				<picto
					class="column"
					v-for="picto in pictos"
					:key="picto.speech"
					:speech="picto.speech"
					:image="picto.image"
					:adminMode="adminMode"
				/>
			</div>
		</section>
	</div>
</template>
<script>
import picto from "@/components/pictos/picto";
export default {
	components: {
		picto: picto
	},
	props: {
		pictos: {
			type: Array,
			required: true
		},
		adminMode: {
			type: Boolean,
			required: true
		}
	}
};
</script>
