
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
    :items="LaunchConfigs"
    sort-by="Name"
    class="elevation-1"
    :search="search"
  >

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Launch Configuration</v-toolbar-title>
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

            <v-card-text v-if="currentLaunchConfig">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentLaunchConfig.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentLaunchConfig.lifecycle"
                      label="lifecycle"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentLaunchConfig.instance_type"
                      label="instance_type"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentLaunchConfig.availability_zone"
                      label="availability_zone"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentLaunchConfig.weight"
                      label="weight"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >              
                    <v-text-field
                      v-model="currentLaunchConfig.launch_spec"
                      label="launch_spec"
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
  name: "LaunchConfigs-list",
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      currentLaunchConfig: null,
      LaunchConfigs: [],
      title: "",
      headers: [
        { text: "id", align: "start", sortable: false, value: "id",},
        { text: "Name", align: "start", sortable: false, value: "name",},
        { text: "Lifecycle", value: "lifecycle", sortable: false },
        { text: "Instance Type", value: "instance_type", sortable: false },
        { text: "Availabilty Zone", value: "availabilty_zone", sortable: false },
        { text: "Weight", value: "weight", sortable: false },
        { text: "Launch Spec", value: "launch_spec", sortable: false },      
        { text: "Price", value: "price", sortable: false },      
        { text: "Unit Price", value: "unit_price", sortable: false },      
        { text: "Reliability", value: "reliability", sortable: false },      
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
        console.log(this.currentLaunchConfigIndex)
        return this.currentLaunchConfigIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  methods: {
    editItem (item) {
        console.log(this.currentLaunchConfigIndex === -1)
        this.currentLaunchConfig = Object.assign({}, item)
        this.dialog = true
      },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.currentLaunchConfig = Object.assign({}, this.defaultItem)
        this.currentLaunchConfigIndex = -1
      })
    },
    save () {
      if(this.currentLaunchConfig.id != undefined){
        DataService.update('launch_conf', this.currentLaunchConfig.id, this.currentLaunchConfig)
          .then((response) => {
            console.log(response.data);
            this.message = "The LaunchConfig was updated successfully!";
          })
          .catch((e) => {
            console.log(e);
          });
      }else{ 
        DataService.create('launch_conf', this.currentLaunchConfig)
          .then((response) => {
            this.currentLaunchConfig.id = response.data.id;
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
      this.currentLaunchConfig = Object.assign({}, item)
      console.log(this.currentLaunchConfig)
      this.dialogDelete = true
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.currentLaunchConfig = Object.assign({}, this.defaultItem)
        this.currentLaunchConfigIndex = -1
        this.$router.go(0);
      })
    },

    deleteItemConfirm () {
      DataService.delete('launch_conf', this.currentLaunchConfig.id)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();

    },

    retrieveLaunchConfigs() {
      var id = this.$route.params.id
      if(id == undefined){
        DataService.getAll('launch_conf')
          .then((response) => {
            this.LaunchConfigs = response.data.map(this.getDisplayLaunchConfig);
          })
          .catch((e) => {
            if(String(e).indexOf("401")!==-1){
                this.$store.dispatch('authentication/logout')
            }
            console.log(e)
          });
      }else{
        DataService.get('launch_conf', id)
        .then((response) => {
          this.LaunchConfigs = response.data.map(this.getDisplayLaunchConfig);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });      
      }
    },

    refreshList() {
      this.retrieveLaunchConfigs();
    },

    removeAllLaunchConfigs() {
      DataService.deleteAll('launch_conf')
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      DataService.findByName('launch_conf', this.name)
        .then((response) => {
          this.LaunchConfigs = response.data.map(this.getDisplayLaunchConfig);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editLaunchConfig(id) {
      this.$router.push({ name: "LaunchConfig-details", params: { id: id } });
    },

    deleteLaunchConfig(id) {
      DataService.delete('launch_conf', id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayLaunchConfig(LaunchConfig) {
      return {
        id: LaunchConfig.id,
        name: LaunchConfig.name,
        lifecycle: LaunchConfig.lifecycle,
        instance_type: LaunchConfig.instance_type,
        availability_zone: LaunchConfig.availability_zone,
        weight:  LaunchConfig.weight,
        launch_spec: LaunchConfig.launch_spec,   
        price: LaunchConfig.price,
        unit_price: LaunchConfig.unit_price,
        reliability: LaunchConfig.reliability,     
      };
    },
  },
  mounted() {
    this.retrieveLaunchConfigs();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
