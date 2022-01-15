<template>
	<div>
		<div class="container">
			<b-field :label="$t('SearchPictoLabel')">
            <b-autocomplete
                v-model="search"
                :data="$store.getters.getPublicCollections.map((collections) => collections.meaning)"
                :placeholder="$t('SearchPictoPlaceholder')"
                icon="magnify"	
                clearable>
            </b-autocomplete>
        </b-field>
			<b-taglist>
        <b-tag type="is-info">First</b-tag>
        <b-tag type="is-info">Second</b-tag>
        <b-tag type="is-info">Third</b-tag>
        <b-tag type="is-info">Fourth</b-tag>
    </b-taglist>
		</div>
		<br>
		<br>
		<div class="container is-widescreen">
			<pictoList :pictos="loadedPictos" :adminMode="isLogged" :publicMode="true" />
		</div>
		<div class="contenant">
			<pictoBar
				v-if="loadSpeech.length != 0"
				class="pictobar"
				:pictos="loadSpeech"
				collectionColor="#fe5656"
			/>
		</div>
		<div class="filler"></div>
			<div class="container is-max-desktop">
		</div>
	</div>
</template>
<script>
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
	middleware: ["axios"],
	components: {
		pictoList: pictoList,
		pictoBar: pictoBar,
	},
	data(){
		return {
			search: "",
		}
	},
	async fetch(){
		this.$store.dispatch("getPublicCollections");
	},
	computed: {
		isLogged() {
			return this.$store.getters.getUser.username ==! undefined;
		},
		loadedPictos() {
			return this.$store.getters.getPublicCollections;
		},
		loadSpeech() {
			return this.$store.getters.getSpeech;
		}
	},
}
</script>
