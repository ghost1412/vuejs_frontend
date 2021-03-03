
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
    :items="InstanceRequests"
    sort-by="Name"
    class="elevation-1"
    :search="search"
  >

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Instance Request</v-toolbar-title>
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

            <v-card-text v-if="currentInstanceRequest">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentInstanceRequest.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentInstanceRequest.lifecycle"
                      label="lifecycle"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentInstanceRequest.instance_type"
                      label="instance_type"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentInstanceRequest.availability_zone"
                      label="availability_zone"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentInstanceRequest.weight"
                      label="weight"
                    ></v-text-field>
                    <v-text-field
                      v-model="currentInstanceRequest.launch_spec"
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
  name: "InstanceRequests-list",
  data() {
    return {
      launchConfigMap: new Map(),
      launchConfigRMap: new Map(),
      search: '',
      dialog: false,
      dialogDelete: false,
      currentInstanceRequest: null,
      InstanceRequests: [],
      title: "",
      headers: [
        { text: "aws_id", align: "start", sortable: false, value: "aws_id",},
        { text: "app_id", value: "app_id", sortable: false },
        { text: "Instance Type", value: "instance_type", sortable: false },
        { text: "launch_config", value: "launch_config", sortable: false },
        { text: "launch_time", value: "launch_time", sortable: false },
        { text: "Launch Spec", value: "launch_spec", sortable: false },      
        { text: "private_ip_address", value: "private_ip_address", sortable: false },      
        { text: "fault_message", value: "fault_message", sortable: false },      
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
        console.log(this.currentInstanceRequestIndex)
        return this.currentInstanceRequestIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  methods: {
    editItem (item) {
        console.log(this.currentInstanceRequestIndex === -1)
        this.currentInstanceRequest = Object.assign({}, item)
        this.dialog = true
      },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.currentInstanceRequest = Object.assign({}, this.defaultItem)
        this.currentInstanceRequestIndex = -1
      })
    },
    save () {
      if(this.currentInstanceRequest.id != undefined){
        DataService.update('instance_request', this.currentInstanceRequest.id, this.currentInstanceRequest)
          .then((response) => {
            console.log(response.data);
            this.message = "The InstanceRequest was updated successfully!";
          })
          .catch((e) => {
            console.log(e);
          });
      }else{ 
        DataService.create('instance_request', this.currentInstanceRequest)
          .then((response) => {
            this.currentInstanceRequest.id = response.data.id;
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
      this.currentInstanceRequest = Object.assign({}, item)
      console.log(this.currentInstanceRequest)
      this.dialogDelete = true
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.currentInstanceRequest = Object.assign({}, this.defaultItem)
        this.currentInstanceRequestIndex = -1
        this.$router.go(0);
      })
    },

    deleteItemConfirm () {
      DataService.delete('instance_request', this.currentInstanceRequest.id)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();

    },

    retrieveInstanceRequests() {
      var id = this.$route.params.id
      if(id == undefined){
        DataService.getAll('instance_request')
          .then((response) => {
            this.InstanceRequests = response.data.map(this.getDisplayInstanceRequest);
          })
          .catch((e) => {
            if(String(e).indexOf("401")!==-1){
                this.$store.dispatch('authentication/logout')
            }
            console.log(e)
          });
      }else{
        DataService.get('instance_request', id)
        .then((response) => {
          this.InstanceRequests = response.data.map(this.getDisplayInstanceRequest);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });      
      }
    },

    refreshList() {
      this.retrieveInstanceRequests();
    },

    removeAllInstanceRequests() {
      DataService.deleteAll('instance_request')
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      DataService.findByName('instance_request', this.name)
        .then((response) => {
          this.InstanceRequests = response.data.map(this.getDisplayInstanceRequest);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editInstanceRequest(id) {
      this.$router.push({ name: "InstanceRequest-details", params: { id: id } });
    },

    deleteInstanceRequest(id) {
      DataService.delete('instance_request', id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayInstanceRequest(InstanceRequest) {
      console.log(InstanceRequest)
      return {
        aws_id: InstanceRequest.aws_id,
        app_id: InstanceRequest.app_id,
        launch_config: InstanceRequest.launch_config,
        launch_time: InstanceRequest.launch_time,
        private_ip_address:  InstanceRequest.private_ip_address,
        fault_message: InstanceRequest.fault_message,      
      };
    },
    getApp(){
      console.log("fd")
      DataService.getAll('app')
        .then((response) => {
          var app = response.data;

          for(var i=0; i< app.length; i++){
            this.appMap.set(JSON.parse(JSON.stringify(app[i])).id, JSON.parse(JSON.stringify(app[i])).name)
            this.appRMap.set(JSON.parse(JSON.stringify(app[i])).name, JSON.parse(JSON.stringify(app[i])).id)
            this.launchConfigOptions.push(JSON.parse(JSON.stringify(app[i])).name)
          }
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(this.launchConfigOptions)
    }
  },
  mounted() {
    this.retrieveInstanceRequests();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
