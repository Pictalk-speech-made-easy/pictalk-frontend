<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ group.name }}</p>
    </header>
    <section class="modal-card-body">
      <b-table
        :data="getUsersAsObjectArrays"
        :columns="columns"
        :selected.sync="selected"
        focusable
      >
      </b-table>
      <div class="columns">
        <div class="container column">
          <b-button
            class="is-success"
            :icon-left="showAddUser ? 'menu-up' : 'plus'"
            @click="showAddUserInput()"
          />
        </div>
        <div class="container column">
          <b-button
            class="is-danger"
            icon-left="delete"
            @click="deleteUser()"
          />
        </div>
      </div>
      <b-field v-if="showAddUser" :label="$t('AddUser')">
        <b-input
          v-model="addUser"
          placeholder="alex@pictalk.xyz"
          type="email"
          maxlength="64"
        ></b-input>
        <p class="control">
          <b-button
            type="is-success"
            icon-right="plus"
            @click="group.users.push(addUser)"
          />
        </p>
      </b-field>
      <b-button
        style="margin-left: auto; margin-right: auto; display: block"
        class="is-info"
        icon-left="content-save"
        @click="save()"
        >{{ $t("Save") }}</b-button
      >
    </section>
  </div>
</template>
<script>
export default {
  props: {
    group: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    getUsersAsObjectArrays() {
      return this.group.users.map((user) => {
        return {
          username: user,
        };
      });
    },
  },
  methods: {
    showAddUserInput() {
      this.showAddUser = !this.showAddUser;
    },
    deleteUser() {
      this.group.users.splice(
        this.group.users.indexOf(this.selected.username),
        1
      );
    },
    async save() {
      let tempMailingList = JSON.parse(
        JSON.stringify(this.$store.getters.getUser.mailingList)
      );
      tempMailingList[this.index] = this.group;
      try {
        const res = await this.$store.dispatch("editUser", {
          mailingList: tempMailingList,
        });
        this.$parent.close();
      } catch (err) {
        console.log(err);
        this.$buefy.toast.open({
          message: this.$t("SomeThingBadHappened"),
          type: "is-danger",
        });
      }
    },
  },
  data() {
    return {
      selected: {},
      addUser: "",
      showAddUser: false,
      columns: [
        {
          field: "username",
          label: "Email",
          width: "100",
          numeric: false,
          searchable: true,
        },
      ],
    };
  },
};
</script>
<style scoped>
.has-background {
  border-radius: 5px;
  -webkit-box-shadow: 3px 3px 5px 6px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 3px 3px 5px 6px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 3px 3px 5px 6px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
</style>