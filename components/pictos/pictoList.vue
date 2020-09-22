<template>
	<div>
		<div v-if="isPicto">
			<div class="columns is-mobile is-multiline">
				<picto
					class="column"
					v-for="picto in pictos"
					:key="picto.id"
					:picto="picto"
					:adminMode="adminMode"
				/>
				<div class="column" v-if="adminMode">
					<img
						class="is-centered"
						width="50%"
						@click="addPicto()"
						src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0yNTYgNTEyYy0xNDEuMTY0MDYyIDAtMjU2LTExNC44MzU5MzgtMjU2LTI1NnMxMTQuODM1OTM4LTI1NiAyNTYtMjU2IDI1NiAxMTQuODM1OTM4IDI1NiAyNTYtMTE0LjgzNTkzOCAyNTYtMjU2IDI1NnptMC00ODBjLTEyMy41MTk1MzEgMC0yMjQgMTAwLjQ4MDQ2OS0yMjQgMjI0czEwMC40ODA0NjkgMjI0IDIyNCAyMjQgMjI0LTEwMC40ODA0NjkgMjI0LTIyNC0xMDAuNDgwNDY5LTIyNC0yMjQtMjI0em0wIDAiLz48cGF0aCBkPSJtMzY4IDI3MmgtMjI0Yy04LjgzMjAzMSAwLTE2LTcuMTY3OTY5LTE2LTE2czcuMTY3OTY5LTE2IDE2LTE2aDIyNGM4LjgzMjAzMSAwIDE2IDcuMTY3OTY5IDE2IDE2cy03LjE2Nzk2OSAxNi0xNiAxNnptMCAwIi8+PHBhdGggZD0ibTI1NiAzODRjLTguODMyMDMxIDAtMTYtNy4xNjc5NjktMTYtMTZ2LTIyNGMwLTguODMyMDMxIDcuMTY3OTY5LTE2IDE2LTE2czE2IDcuMTY3OTY5IDE2IDE2djIyNGMwIDguODMyMDMxLTcuMTY3OTY5IDE2LTE2IDE2em0wIDAiLz48L3N2Zz4="
					/>
				</div>
			</div>
		</div>
		<div v-else>
			<div class="columns is-mobile is-multiline">
				<collection
					class="column"
					v-for="collection in pictos"
					:key="collection.id"
					:collection="collection"
					:adminMode="adminMode"
				/>
				<div class="column" v-if="adminMode">
					<img
						class="is-centered"
						width="50%"
						@click="addCollection()"
						src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0yNTYgNTEyYy0xNDEuMTY0MDYyIDAtMjU2LTExNC44MzU5MzgtMjU2LTI1NnMxMTQuODM1OTM4LTI1NiAyNTYtMjU2IDI1NiAxMTQuODM1OTM4IDI1NiAyNTYtMTE0LjgzNTkzOCAyNTYtMjU2IDI1NnptMC00ODBjLTEyMy41MTk1MzEgMC0yMjQgMTAwLjQ4MDQ2OS0yMjQgMjI0czEwMC40ODA0NjkgMjI0IDIyNCAyMjQgMjI0LTEwMC40ODA0NjkgMjI0LTIyNC0xMDAuNDgwNDY5LTIyNC0yMjQtMjI0em0wIDAiLz48cGF0aCBkPSJtMzY4IDI3MmgtMjI0Yy04LjgzMjAzMSAwLTE2LTcuMTY3OTY5LTE2LTE2czcuMTY3OTY5LTE2IDE2LTE2aDIyNGM4LjgzMjAzMSAwIDE2IDcuMTY3OTY5IDE2IDE2cy03LjE2Nzk2OSAxNi0xNiAxNnptMCAwIi8+PHBhdGggZD0ibTI1NiAzODRjLTguODMyMDMxIDAtMTYtNy4xNjc5NjktMTYtMTZ2LTIyNGMwLTguODMyMDMxIDcuMTY3OTY5LTE2IDE2LTE2czE2IDcuMTY3OTY5IDE2IDE2djIyNGMwIDguODMyMDMxLTcuMTY3OTY5IDE2LTE2IDE2em0wIDAiLz48L3N2Zz4="
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import picto from "@/components/pictos/picto";
import collection from "@/components/pictos/collection";
import addPicto from "@/components/pictos/addPicto";
import addCollection from "@/components/pictos/addCollection";
export default {
	components: {
		picto,
		collection,
		addPicto,
		addCollection
	},
	props: {
		pictos: {
			type: Array,
			required: true
		},
		adminMode: {
			type: Boolean,
			required: true
		},
		isPicto: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		addPicto() {
			this.$buefy.modal.open({
				parent: this,
				component: addPicto,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true
			});
		},
		addCollection() {
			this.$buefy.modal.open({
				parent: this,
				component: addCollection,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true
			});
		}
	}
};
</script>

<style scoped>
.centered {
	margin-left: auto;
	margin-right: auto;
}
</style>