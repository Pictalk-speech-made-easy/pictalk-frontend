export default {
	methods: {
		enforcedSecurityMinor(onConfirmFunction) {
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
						onConfirmFunction(this);
					}
					return;
				},
			});
		},
	},
}