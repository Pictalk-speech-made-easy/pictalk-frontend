<template>
	<b-navbar fixed-top>
		<template slot="brand">
			<b-navbar-item @click="eraseSpeech()">
				<img
					src="~/assets/logo_compressed.png"
					alt="A web app that help speach-disabled people"
					height="100px"
				/>
			</b-navbar-item>
		</template>
		<template slot="start">
			<b-navbar-item tag="nuxt-link" to="/">{{ $t("Home") }}</b-navbar-item>
			<b-navbar-item tag="nuxt-link" to="/getstarted"
				>{{ $t("GetStarted") }} 🚀</b-navbar-item
			>
			<b-navbar-dropdown collapsible label="Info">
				<b-navbar-item tag="nuxt-link" to="/about">{{
					$t("Infos")
				}}</b-navbar-item>
				<b-navbar-item tag="nuxt-link" to="/contact"
					>{{ $t("BugsAndSuggestions") }} 👨‍💻</b-navbar-item
				>
				<b-navbar-item tag="nuxt-link" to="/pictograms"
					>{{ $t("Pictograms") }} 👐</b-navbar-item
				>
				<b-navbar-item tag="nuxt-link" to="/news"
					>{{ $t("NewsAndUpdates") }} &#127881;</b-navbar-item
				>
			</b-navbar-dropdown>
		</template>

		<template slot="end">
			<b-navbar-dropdown collapsible :label="getEmoji(localeIso())">
				<b-navbar-item
					v-for="locale in availableLocales"
					:key="locale.code"
					@click.prevent.stop="$i18n.setLocale(locale.code)"
					>{{ getEmoji(locale.iso) }}</b-navbar-item
				>
			</b-navbar-dropdown>
			<b-navbar-item tag="div">
				<div class="buttons b-tooltips">
					<b-tooltip
						position="is-right"
						type="is-primary"
						label="delayed by 1000ms"
						:delay="1000"
					>
						<b-button
							type="is-primary"
							@click="eraseSpeech()"
							icon-right="home"
						/>
					</b-tooltip>
					<b-tooltip
						position="is-bottom"
						type="is-primary"
						label="delayed by 1000ms"
						:delay="1000"
					>
						<b-button
							type="is-success-light"
							icon-right="human"
							tag="nuxt-link"
							to="/public"
						/>
					</b-tooltip>
					<b-tooltip
						position="is-top"
						type="is-primary"
						label="delayed by 1000ms"
						:delay="1000"
					>
						<b-button
							type="is-primary-light"
							icon-right="folder-account"
							:to="sharedLink"
							tag="nuxt-link"
						/>
					</b-tooltip>
					<b-button
						v-if="this.$route.path.includes('pictalk')"
						type="is-success"
						icon-right="cloud-sync"
						@click="refreshPictos"
					/>
					<b-button
						v-if="this.$route.path.includes('pictalk')"
						type="is-info"
						icon-right="account-cog"
						tag="nuxt-link"
						to="/account"
					/>
					<b-button
						v-if="
							!this.$route.query.isAdmin && this.$route.path.includes('pictalk')
						"
						type="is-warning"
						@click="toAdmin"
						icon-right="lock-open-variant"
					/>
					<b-button
						v-else-if="this.$route.path.includes('pictalk')"
						type="is-warning"
						tag="nuxt-link"
						:to="homeLink"
						icon-right="lock"
					/>
					<b-button
						type="is-light"
						tag="nuxt-link"
						to="/help"
						icon-right="help-circle"
					/>
					<b-button type="is-light" icon-right="logout" @click="onLogout" />
				</div>
			</b-navbar-item>
		</template>
	</b-navbar>
</template>
<script>
import { countryCodeEmoji } from "country-code-emoji";
export default {
	computed: {
		admin() {
			return this.$route.query.isAdmin ? "?isAdmin=true" : "";
		},
		homeLink() {
			return this.$route.path;
		},
		publicLink() {
			return "/public" + this.admin;
		},
		availableLocales() {
			return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
		},
		sharedLink() {
			//this.$store.commit('eraseSpeech');
			return "/pictalk/" + this.$store.getters.getSharedId + this.admin;
		},
	},
	methods: {
		localeIso() {
			return this.$i18n.locales.filter((i) => i.code == this.$i18n.locale)[0]
				.iso;
		},
		getEmoji(language) {
			if (language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
				return countryCodeEmoji(language.split("-")[1]);
			}
			return;
		},
		async refreshPictos() {
			try {
				await this.$store.dispatch("downloadCollections");
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("PictosFetched"),
					position: "is-top-right",
					type: "is-success",
					hasIcon: true,
					icon: "refresh",
				});
			} catch (err) {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("ServerOffline"),
					position: "is-top-right",
					type: "is-danger",
					hasIcon: true,
					icon: "danger",
				});
			}
		},
		eraseSpeech() {
			this.$store.commit("eraseSpeech");
			if (this.$store.getters.getRootId) {
				this.$router.push(
					"/pictalk/" + this.$store.getters.getRootId + this.admin
				);
			} else {
				this.$router.push("/pictalk" + this.admin);
			}
		},
		toAdmin() {
			const a = Math.floor(Math.random() * 10 + 1);
			const b = Math.floor(Math.random() * 10 + 1);
			const res = a + b;
			this.$buefy.dialog.prompt({
				message: this.$t("SupervisorModeQuestion") + " : " + `${a} + ${b} ?`,
				inputAttrs: {
					type: "number",
					placeholder: this.$t("SupervisorModeInput"),
					value: "",
					maxlength: 2,
					min: 0,
					max: 20,
				},
				trapFocus: true,
				onConfirm: (value) => {
					if (value == res) {
						if (!this.$route.query.isAdmin) {
							this.$buefy.toast.open(this.$t("SupervisorModeSuccess"));
						}
						this.$router.push(this.$route.path + "?isAdmin=true");
					}
					return;
				},
			});
		},
		onLogout() {
			const a = Math.floor(Math.random() * 10 + 1);
			const b = Math.floor(Math.random() * 10 + 1);
			const res = a + b;
			this.$buefy.dialog.prompt({
				message: this.$t("SupervisorModeQuestion") + " : " + `${a} + ${b} ?`,
				inputAttrs: {
					type: "number",
					placeholder: this.$t("SupervisorModeInput"),
					value: "",
					maxlength: 2,
					min: 0,
					max: 20,
				},
				trapFocus: true,
				onConfirm: (value) => {
					if (value == res) {
						this.$store.dispatch("logout");
						this.$router.push("/");
					}
					return;
				},
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.b-tooltips {
	.b-tooltip:not(:last-child) {
		margin-right: 0.5em;
	}
	.b-tooltip {
		margin-bottom: 0.5em;
	}
}
</style>
