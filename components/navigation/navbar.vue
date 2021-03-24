<template>
	<div>
		<b-navbar fixed-top>
			<template slot="brand">
				<b-navbar-item tag="nuxt-link" to="/">
					<img
						src="~/assets/logo_compressed.png"
						alt="A web app that help speach-disabled people"
						height="100px"
						width="150px"
					/>
				</b-navbar-item>
			</template>
			<template slot="start">
				<b-navbar-item tag="nuxt-link" to="/">
					{{ $t("Home") }}</b-navbar-item
				>
				<b-navbar-item tag="nuxt-link" to="/getstarted"
					>{{ $t("GetStarted") }} 🚀</b-navbar-item
				>
				<b-navbar-dropdown :label="$t('More')">
					<b-navbar-item tag="nuxt-link" to="/about">{{
						$t("Infos")
					}}</b-navbar-item>
					<b-navbar-item tag="nuxt-link" to="/contact"
						>{{ $t("BugsAndSuggestions") }} 👨‍💻</b-navbar-item
					>
				</b-navbar-dropdown>
				<b-navbar-item tag="nuxt-link" to="/news"
					>{{ $t("NewsAndUpdates") }} &#127881;</b-navbar-item
				>
				<b-navbar-item tag="nuxt-link" to="/makaton"
					>{{ $t("Makaton") }} 👐</b-navbar-item
				>
			</template>
			<template slot="end">
				<b-navbar-dropdown label="Languages">
					<b-navbar-item
						tag="nuxt-link"
						v-for="locale in availableLocales"
						:key="locale.code"
						:to="switchLocalePath(locale.code)"
						>{{ locale.name }}</b-navbar-item
					>
				</b-navbar-dropdown>
				<b-navbar-item tag="div">
					<div class="buttons">
						<b-button
							v-if="!isLogged"
							@click="openSignInModal()"
							type="is-primary"
							>{{ $t("LogIn") }}</b-button
						>
						<b-button v-else type="is-light" @click="onLogout">{{
							$t("LogOut")
						}}</b-button>
						<b-button
							v-if="!isLogged"
							@click="openSignUpModal()"
							type="is-light"
							>{{ $t("SignUp") }}</b-button
						>
						<b-button
							v-else
							tag="nuxt-link"
							to="/pictalk"
							type="is-primary"
							>{{ $t("GoToPictalk") }}</b-button
						>
					</div>
				</b-navbar-item>
			</template>
		</b-navbar>
	</div>
</template>

<script>
import signin from "@/components/auth/signinModal";
import signup from "@/components/auth/signupModal";
export default {
	components: {
		signin,
		signup,
	},
	computed: {
		availableLocales() {
			return this.$i18n.locales.filter(
				(i) => i.code !== this.$i18n.locale
			);
		},
		isLogged() {
			return this.$store.getters.isAuthenticated;
		},
	},
	methods: {
		onLogout() {
			this.$store.dispatch("logout");
			this.$router.push("/");
		},

		openSignInModal() {
			this.$buefy.modal.open({
				parent: this,
				component: signin,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
			});
		},
		openSignUpModal() {
			this.$buefy.modal.open({
				parent: this,
				component: signup,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
			});
		},
	},
};
</script>
