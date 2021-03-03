
<template>
  <div data-app>
    <v-card-title>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
  </v-card-title>
  <v-data-table
    :headers="headers"
    :items="AutoScales"
    sort-by="Name"
    class="elevation-1"
    :search="search"
  >

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Autos Scaling Policy</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              @click="editItem()"
            >
              New Item
            </v-btn>
          </template> 
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text v-if="currentAutoScale">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentAutoScale.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentAutoScale.maximum"
                      label="maximum"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentAutoScale.minimum"
                      label="minimum"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentAutoScale.scale_up_cooldown"
                      label="scale_up_cooldown"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentAutoScale.scale_down_cooldown"
                      label="scale_down_cooldown"
                    ></v-text-field>              
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  </div>
</template>
<script>
import DataService from "../services/DataService";
export default {
  name: "AutoScales-list",
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      currentAutoScale: null,
      AutoScales: [],
      title: "",
      headers: [
        { text: "id", align: "start", sortable: false, value: "id",},
        { text: "Name", align: "start", sortable: false, value: "name",},
        { text: "maximum", value: "maximum", sortable: false },
        { text: "minimum", value: "minimum", sortable: false },
        { text: "scale_up_cooldown", value: "scale_up_cooldown", sortable: false },
        { text: "scale_down_cooldown", value: "scale_down_cooldown", sortable: false },
        { text: "created_date", value: "created_date", sortable: false },      
        { text: "modified_date", value: "modified_date", sortable: false },            
        { text: "Actions", value: "actions", sortable: false },                  
      ],
    };
  },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    computed: {
      formTitle () {
        console.log(this.currentAutoScaleIndex)
        return this.currentAutoScaleIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  methods: {
    editItem (item) {
        console.log(this.currentAutoScaleIndex === -1)
        this.currentAutoScale = Object.assign({}, item)
        this.dialog = true
      },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.currentAutoScale = Object.assign({}, this.defaultItem)
        this.currentAutoScaleIndex = -1
      })
    },
    save () {
      if(this.currentAutoScale.id != undefined){
        DataService.update('auto_scaling_policy', this.currentAutoScale.id, this.currentAutoScale)
          .then((response) => {
            console.log(response.data);
            this.message = "The AutoScale was updated successfully!";
          })
          .catch((e) => {
            console.log(e);
          });
      }else{ 
        DataService.create('auto_scaling_policy', this.currentAutoScale)
          .then((response) => {
            this.currentAutoScale.id = response.data.id;
            console.log(response.data);
            this.submitted = true;
          })
          .catch((e) => {
            console.log(e);
          });      
      }
      this.close()
    },
    deleteItem (item) {
      this.currentAutoScale = Object.assign({}, item)
      console.log(this.currentAutoScale)
      this.dialogDelete = true
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.currentAutoScale = Object.assign({}, this.defaultItem)
        this.currentAutoScaleIndex = -1
        this.$router.go(0);
      })
    },

    deleteItemConfirm () {
      DataService.delete('auto_scaling_policy', this.currentAutoScale.id)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();

    },

    retrieveAutoScales() {
      var id = this.$route.params.id
      if(id == undefined){
        DataService.getAll('auto_scaling_policy')
          .then((response) => {
            this.AutoScales = response.data.map(this.getDisplayAutoScale);
          })
          .catch((e) => {
            if(String(e).indexOf("401")!==-1){
                this.$store.dispatch('authentication/logout')
            }
            console.log(e)
          });
      }else{
        DataService.get('auto_scaling_policy', id)
        .then((response) => {
          this.AutoScales = response.data.map(this.getDisplayAutoScale);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });      
      }
    },

    refreshList() {
      this.retrieveAutoScales();
    },

    removeAllAutoScales() {
      DataService.deleteAll('auto_scaling_policy')
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      DataService.findByName('auto_scaling_policy', this.name)
        .then((response) => {
          this.AutoScales = response.data.map(this.getDisplayAutoScale);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editAutoScale(id) {
      this.$router.push({ name: "AutoScale-details", params: { id: id } });
    },

    deleteAutoScale(id) {
      DataService.delete('auto_scaling_policy', id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayAutoScale(AutoScale) {
      return {
        id: AutoScale.id,
        name: AutoScale.name,
        minimum: AutoScale.minimum,
        maximum: AutoScale.maximum,
        scale_up_cooldown: AutoScale.scale_up_cooldown,
        scale_down_cooldown:  AutoScale.scale_down_cooldown,
        created_date: AutoScale.created_date,   
        modified_date: AutoScale.modified_date,   
      };
    },
  },
  mounted() {
    this.retrieveAutoScales();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
