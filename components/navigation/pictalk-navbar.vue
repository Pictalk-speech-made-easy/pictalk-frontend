<template>
	<b-navbar fixed-top>
		<template slot="brand">
			<b-navbar-item tag="nuxt-link" to="/">
				<img
					src="~/assets/logo_compressed.png"
					alt="A web app that help speach-disabled people"
					height="100px"
				/>
			</b-navbar-item>
		</template>
		<template slot="start">
			<b-navbar-item tag="nuxt-link" to="/">{{
				$t("Home")
			}}</b-navbar-item>
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
			<b-navbar-dropdown collapsible :label="$t('Language')">
				<b-navbar-item
					v-for="locale in availableLocales"
					:key="locale.code"
					@click.prevent.stop="$i18n.setLocale(locale.code)"
					>{{ locale.name }}</b-navbar-item
				>
			</b-navbar-dropdown>
			<b-navbar-item tag="div">
				<div class="buttons">
					<b-button
						type="is-primary"
						@click="eraseSpeech()"
						icon-right="home"
					/>
					<b-button
					type="is-success-light"
					icon-right="human"
					tag="nuxt-link"
					to="/public"
					/>
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
							!this.$route.query.isAdmin &&
							this.$route.path.includes('pictalk')
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
					<b-button
						type="is-light"
						icon-right="logout"
						@click="onLogout"
					/>
				</div>
			</b-navbar-item>
		</template>
	</b-navbar>
</template>
<script>
export default {
	computed: {
		homeLink() {
			return this.$route.path;
		},
		availableLocales() {
			return this.$i18n.locales.filter(
				(i) => i.code !== this.$i18n.locale
			);
		},
	},
	methods: {
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
			let adminMode = "";
			if (this.$route.query.isAdmin) {
				adminMode = "?isAdmin=true";
			}
			if (this.$store.getters.getRootId) {
				this.$router.push(
					"/pictalk/" + this.$store.getters.getRootId + adminMode
				);
			} else {
				this.$router.push("/pictalk" + adminMode);
			}
		},
		toAdmin() {
			const a = Math.floor(Math.random() * 10 + 1);
			const b = Math.floor(Math.random() * 10 + 1);
			const res = a + b;
			this.$buefy.dialog.prompt({
				message:
					this.$t("SupervisorModeQuestion") + " : " + `${a} + ${b} ?`,
				inputAttrs: {
					type: "number",
					placeholder: this.$t("SupervisorModeInput"),
					value: "0",
					maxlength: 2,
					min: 0,
					max: 20,
				},
				trapFocus: true,
				onConfirm: (value) => {
					if (value == res) {
						if (!this.$route.query.isAdmin) {
							this.$buefy.toast.open(
								this.$t("SupervisorModeSuccess")
							);
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
				message:
					this.$t("SupervisorModeQuestion") + " : " + `${a} + ${b} ?`,
				inputAttrs: {
					type: "number",
					placeholder: this.$t("SupervisorModeInput"),
					value: "0",
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
