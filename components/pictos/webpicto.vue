<template>
  <div>
    <img
      :src="webpicto.src"
    />
    <b>{{ webpicto.alt }}</b>
  </div>
</template>

<script>
export default {
  name: "webpicto",

  	props: {
		webpicto: {
			type: Object,
			required: true,
		},
	},
}
</script>
