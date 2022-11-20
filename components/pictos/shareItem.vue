<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <b-button
        class="button"
        type="is-danger"
        icon-left="close"
        @click="$parent.close()"
      />
      <p align="center" class="modal-card-title">
        {{ $t("ShareCollection") }}
      </p>
    </header>
    <section class="modal-card-body">
      <div>
        <b-field>
          <b-input
            v-model="addSharer"
            expanded
            :placeholder="$t('PlaceHolderEmail')"
            type="email"
            maxlength="64"
          ></b-input>
          <b-select v-model="mode" required>
            <option value="editor">✏️</option>
            <option value="viewer">👁️</option>
          </b-select>
          <b-button
            type="is-success"
            icon-right="plus"
            @click="pushToCollaborators()"
          />
        </b-field>
        <b-table
          v-if="loneCollaborators.length > 0"
          :focusable="true"
          :data="SharersObj"
          :columns="columns"
          :selected.sync="selected"
          :mobile-cards="false"
        >
        </b-table>
        <br />
        <b-button
          v-if="
            loneCollaborators
              .map((Sharer) => {
                return Sharer.username;
              })
              .indexOf(selected.username) !== -1
          "
          class="fourWidth"
          type="is-danger"
          icon-left="delete"
          @click="removeFromCollaborators()"
        />
        <hr v-if="SharersObj.length > 0" />
        <b-field :label="$t('Groups')">
          <div v-if="groups.length != 0" class="columns is-multiline is-mobile">
            <div
              v-for="(group, index) in groups"
              class="
                column
                lessPadding
                is-6-mobile is-6-tablet is-6-desktop is-6-widescreen is-6-fullhd
              "
            >
              <div>
                <div
                  :class="[
                    isGroupSelected(group) ? 'card has-background' : 'card',
                  ]"
                >
                  <div class="card-content">
                    <div
                      class="media"
                      @click="addOrRemoveGroupToSelected(group)"
                    >
                      <div v-if="group.icon" class="media-left">
                        <b-icon :icon="group.icon" />
                      </div>
                      <div class="media-content">
                        <p class="title is-6">
                          {{ group.name }}
                        </p>
                      </div>
                    </div>
                    <b-select
                      @input="changeGroupMode(group)"
                      v-if="group.selected"
                      v-model="group.mode"
                      required
                    >
                      <option value="viewer">👁️</option>
                      <option value="editor">✏️</option>
                    </b-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-field>
        <b-button
          style="margin-bottom: 45px"
          type="is-success"
          class="actionButtons"
          icon-left="plus"
          @click="openAddGroupModal()"
          expanded
          >{{ $t("CreateNewGroup") }}</b-button
        >
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button class="button" type="button" @click="$parent.close()">{{
        $t("Close")
      }}</b-button>
    </footer>
  </div>
</template>
<script >
import sharers from "@/mixins/sharers";
import addGroupModal from "@/components/auth/addGroupModal";
export default {
  mixins: [sharers],
  props: {
    picto: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedGroups: [],
      loneCollaborators: [],
      groups: [],
      mode: "viewer",
      selected: {},
      loading: false,
      SharersObj: [],
      addSharer: "",
      columns: [
        {
          field: "username",
          label: "",
          searchable: false,
        },
        {
          field: "mode",
          label: "",
          searchable: false,
        },
      ],
    };
  },
  mounted() {
    this.getGroups();
    this.picto.viewers.forEach((viewer) => {
      let collaborator = {
        username: viewer,
        mode: "viewer",
        access: "1",
      };
      let found = false;
      this.groups.forEach((group) => {
        if (group.users.indexOf(viewer) != -1) {
          found = true;
          if (!group.foundViewerCount) {
            group.foundViewerCount = 0;
          }
          group.foundViewerCount += 1;
        }
      });
      if (!found) {
        this.loneCollaborators.push(collaborator);
        this.SharersObj = this.loneCollaborators.map((loneCollaborator) => {
          return {
            username: loneCollaborator.username,
            mode: loneCollaborator.mode === "viewer" ? "👁️" : "✏️",
            modeRaw: this.mode,
          };
        });
      }
    });
    this.picto.editors.forEach((editor) => {
      let collaborator = {
        username: editor,
        mode: "editor",
        access: "1",
      };
      let found = false;
      this.groups.forEach((group) => {
        if (group.users.indexOf(editor) != -1) {
          found = true;
          if (!group.foundEditorCount) {
            group.foundEditorCount = 0;
          }
          group.foundEditorCount += 1;
        }
      });
      if (!found) {
        this.loneCollaborators.push(collaborator);
        this.SharersObj = this.loneCollaborators.map((loneCollaborator) => {
          return {
            username: loneCollaborator.username,
            mode: loneCollaborator.mode === "viewer" ? "👁️" : "✏️",
            modeRaw: this.mode,
          };
        });
      }
    });
    this.groups.map((group) => {
      if (this.isGroupSharedEditor(group) || this.isGroupSharedViewer(group)) {
        group.selected = true;
        group.mode = this.isGroupSharedEditor(group) ? "editor" : "viewer";
        console.log(group);
      } else {
        group.mode = "viewer";
      }
      return group;
    });
  },
  computed: {
    getLoneCollaborators() {
      return this.loneCollaborators.filter(
        (collaborator) => collaborator.access == "1"
      );
    },
    getSharedGroups() {
      return this.groups.filter((group) => group.selected);
    },
  },
  methods: {
    triggerGroups() {
      this.groups.push("");
      this.groups.pop();
    },
    getGroups() {
      this.groups = JSON.parse(
        JSON.stringify(this.$store.getters.getUser.mailingList)
      );
    },
    async openAddGroupModal(group, index) {
      const modal = this.$buefy.modal.open({
        parent: this,
        component: addGroupModal,
        props: {
          group: group,
          index: index,
          mailingList: [...this.$store.getters.getUser.mailingList],
        },
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
      modal.$on("close", () => {
        this.getGroups();
      });
    },
    async pushToCollaborators() {
      const index = this.SharersObj.map((collaborator) => {
        return collaborator.username;
      }).indexOf(this.addSharer);
      if (
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.addSharer
        )
      ) {
        if (this.addSharer != this.$store.getters.getUser.username) {
          if (index !== -1) {
            this.SharersObj[index] = {
              username: this.addSharer,
              mode: this.mode === "viewer" ? "👁️" : "✏️",
              modeRaw: this.mode,
            };
          } else {
            this.SharersObj.push({
              username: this.addSharer,
              mode: this.mode === "viewer" ? "👁️" : "✏️",
              modeRaw: this.mode,
            });
          }
          await this.$store.dispatch("shareCollection", {
            collectionId: this.picto.id,
            usernames: [this.addSharer],
            role: this.mode,
            access: 1,
          });
        } else {
          this.$buefy.toast.open({
            message: this.$t("NotShareYourself"),
            position: "is-top",
            type: "is-danger",
          });
        }
      } else {
        this.$buefy.toast.open({
          message: this.$t("EmailPlease"),
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    async removeFromCollaborators() {
      const index = this.SharersObj.map((collaborator) => {
        return collaborator.username;
      }).indexOf(this.selected.username);
      await this.$store.dispatch("shareCollection", {
        collectionId: this.picto.id,
        usernames: [this.selected.username],
        role: this.SharersObj[index].modeRaw,
        access: 0,
      });
      if (index !== -1) {
        this.SharersObj.splice(index, 1);
      }
    },
    isGroupSelected(group) {
      return group.selected;
    },
    isGroupSharedViewer(group) {
      return group.foundViewerCount == group.users.length;
    },
    isGroupSharedEditor(group) {
      return group.foundEditorCount == group.users.length;
    },
    async addOrRemoveGroupToSelected(selectedGroup) {
      this.loading = true;
      selectedGroup.selected = !selectedGroup?.selected;
      await this.$store.dispatch("shareCollection", {
        collectionId: this.picto.id,
        usernames: selectedGroup.users,
        role: selectedGroup.mode,
        access: String(selectedGroup.selected | 0),
      });
      this.loading = false;
      this.groups.push("");
      this.groups.pop();
      //this.onSubmitted();
    },
    async changeGroupMode(selectedGroup) {
      this.loading = true;
      await this.$store.dispatch("shareCollection", {
        collectionId: this.picto.id,
        usernames: selectedGroup.users,
        role: selectedGroup.mode,
        access: String(selectedGroup.selected | 0),
      });
      this.loading = false;
    },
  },
};
</script>
<style scoped>
.has-background {
  background: #ffe2e2;
  border: solid;
  border-width: 2px;
  border-color: #ff5757;
  border-radius: 3px;
}
.lessPadding {
  padding: 0.3rem;
}
.fourWidth {
  width: 39%;
}
</style>
