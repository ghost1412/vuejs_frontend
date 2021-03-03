
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
    :items="Apps"
    sort-by="Name"
    class="elevation-1"
    :search="search"
  >
   <template #item.launch_configs="{ value }">
      <li class="list-inline-item" v-for="type in value"  v-bind:key="type" >
        <a :href="`launch_conf/${type}`">
          {{ launchConfigMap.get(type) }} ,
        </a>
      </li>      
    </template>
     <template #item.custom_tags="{ value }">
      <v-icon
        small
        class="mr-2"
        @click="showCustomTags(value)"
      >
        mdi-book-open-page-variant
      </v-icon>      
    </template>
       <template #item.allocation_strategy_params="{ value }">
      <v-icon
        small
        class="mr-2"
        @click="showCustomTags(value)"
      >
        mdi-book-open-page-variant
      </v-icon>
    </template>
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Apps</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="1200px"
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

            <v-card-text v-if="currentApp">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentApp.app_id"
                      label="app_id"
                      :disabled=true
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentApp.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                 <input type="checkbox" id="paused" v-model="currentApp.paused">
                 <label for="checkbox">Pause making any changes to the fleet (including auto scaling): {{ currentApp.paused }}</label>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentApp.allocation_strategy"
                      label="allocation_strategy"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentApp.allocation_strategy_params"
                      label="allocation_strategy_params"
                    ></v-text-field>
                  </v-col>  
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.target_capacity"
                      label="target_capacity"
                    ></v-text-field>       
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.ondemand_buffer_value"
                      label="ondemand_buffer_value"
                    ></v-text-field>  
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.instance_lost_hooks"
                      label="instance_lost_hooks"
                      :disabled=true
                    ></v-text-field>                    
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.instance_obtained_hooks"
                      label="instance_obtained_hooks"
                      :disabled=true
                    ></v-text-field>                    
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                        
                  <v-textarea
                    name="customTags"
                    auto-grow
                    label="Custom Tags"
                    v-model=currentApp.custom_tags
                  ></v-textarea>             
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.current_deployment"
                      :disabled=true
                      label="current_deployment"
                    ></v-text-field>                    
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                  <multiselect v-model="launchselected" :options="launchConfigOptions" multiple/>  
                  <p> Launch Configs </p>        

                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                  <multiselect label="name" v-model="currentApp.ondemand_buffer_unit" :options="ondemandOptions"/>            
                  <p> Fraction of target capacity or absolute value. </p>        
                  </v-col>           
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.auto_scaling_enabled"
                      label="auto_scaling_enabled"
                    ></v-text-field>                    
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.auto_scaling_policy"
                      label="auto_scaling_policy"
                    ></v-text-field>                    
                  </v-col>  
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.spot_capacity"
                      label="spot_capacity"
                    ></v-text-field>                    
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.ondemand_capacity"
                      label="ondemand_capacity"
                    ></v-text-field>                    
                  </v-col>  
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >                                    
                    <v-text-field
                      v-model="currentApp.overall_capacity"
                      label="overall_capacity"
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
        <v-dialog v-model="dialogCustomTags" max-width="700px">
          <v-card>
            <v-card-title class="headline">Custom Tags</v-card-title>
            <v-container fluid>
              <v-textarea
                name="customTags"
                auto-grow
                filled
                v-model=customTags
              ></v-textarea>
            </v-container>
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
import Multiselect from "vue-multiselect";
import DataService from "../services/DataService";
export default {
  components: { Multiselect },
  name: "Apps-list",
  data() {
    return {
      selected: null,
      launchselected: [],
      launchConfigMap: new Map(),
      launchConfigRMap: new Map(),
      launchConfigOptions: [],
      ondemandOptions: [{value:"cpu", name:"No. of CPUs in total capacity (max = Target Capacity)"}, {value:"ratio", name:"Ratio of total capacity (max = 1.0)"}],
      search: '', 
      dialog: false,
      dialogDelete: false,
      dialogCustomTags: false,
      customTags: null,
      currentApp: null,
      Apps: [],
      title: "",
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name",},
        { text: "App Id", value: "app_id", sortable: false},
        { text: "Paused", value: "paused", sortable: false },
        { text: "Allocation Strategy", value: "allocation_strategy", sortable: false },
        { text: "Allocation Strategy_params", value: "allocation_strategy_params", sortable: false },
        { text: "Target Capacity", value: "target_capacity", sortable: false },      
        { text: "Instance Lost Hooks Value", value: "instance_lost_hooks", sortable: false },      
        { text: "Instance Obtained Hooks", value: "instance_obtained_hooks", sortable: false },      
        { text: "Custom Tags", value: "custom_tags", sortable: false },  
        { text: "Current Deployment", value: "current_deployment", sortable: false },
        { text: "Launch Configs", value: "launch_configs", sortable: false },
        { text: "Ondemand Buffer Unit", value: "ondemand_buffer_unit", sortable: false },
        { text: "Auto Scaling Enabled", value: "auto_scaling_enabled", sortable: false },
        { text: "Auto Scaling Policy", value: "auto_scaling_policy", sortable: false },      
        { text: "Spot Capacity", value: "spot_capacity", sortable: false },      
        { text: "Ondemand Capacity", value: "ondemand_capacity", sortable: false },      
        { text: "Overall Capacity", value: "overall_capacity", sortable: false },            
        { text: "marathon_cluster", value: "marathon_cluster", sortable: false },            

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
        console.log(this.currentAppIndex)
        return this.currentAppIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  methods: {
    showCustomTags(value){
      this.dialogCustomTags = true
      this.customTags = value 
    },
    editItem (item) {
        this.launchselected = []
        console.log(this.currentAppIndex === -1)
        this.currentApp = Object.assign({}, item)
        if(this.currentApp.app_id != undefined){
          for(var i=0; i<this.currentApp.launch_configs.length; i++){
            this.launchselected.push(this.launchConfigMap.get(this.currentApp.launch_configs[i]))
          }
        }
        console.log(this.launchselected)
        this.dialog = true
      },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.currentApp = Object.assign({}, this.defaultItem)
        this.currentAppIndex = -1
      })
    },
    updateData(){
      this.currentApp.ondemand_buffer_unit = this.currentApp.ondemand_buffer_unit.value
      this.currentApp.custom_tags = JSON.parse(this.currentApp.custom_tags)
      this.currentApp.launch_configs = []
      for(var i=0; i<this.launchselected.length; i++){
        this.currentApp.launch_configs.push(this.launchConfigRMap.get(this.launchselected[i]))
      }
      console.log(this.currentApp.launch_configs)
    },
    save () {
      this.updateData()
      if(this.currentApp.app_id != undefined){
        DataService.update('app', this.currentApp.app_id, this.currentApp)
          .then((response) => {
            console.log(response.data);
            this.message = "The App was updated successfully!";
          })
          .catch((e) => {
            console.log(e);
          });
      }else{ 
        console.log("in")
        DataService.create('app', this.currentApp)
          .then((response) => {
            this.currentApp.id = response.data.id;
            console.log(response.data);
            this.submitted = true;
          })
          .catch((e) => {
            console.log(e);
          });      
      }
      this.refreshList()
      this.close()
    },
    
    deleteItem (item) {
      this.currentApp = Object.assign({}, item)
      console.log(this.currentApp)
      this.dialogDelete = true
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.currentApp = Object.assign({}, this.defaultItem)
        this.currentAppIndex = -1
        this.refreshList()
      })
    },

    deleteItemConfirm () {
      DataService.delete('app', this.currentApp.app_id)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();

    },
    checkToken(){
      console.log(JSON.stringify(this.$route.query.token))
      if(this.$route.query.token!=undefined){
          localStorage.setItem('user', JSON.stringify(this.$route.query.token)); 
      }
      return
    },

    retrieveApps() {
      DataService.getAll('app')
        .then((response) => {
          this.Apps = response.data.map(this.getDisplayApp);
          console.log(response.data);
        })
        .catch((e) => {
         if(String(e).indexOf("401")!==-1){
                this.$store.dispatch('authentication/logout')
            }
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveApps();
    },

    removeAllApps() {
      DataService.deleteAll('app')
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      DataService.findByName('app', this.name)
        .then((response) => {
          this.Apps = response.data.map(this.getDisplayApp);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editApp(id) {
      this.$router.push({ name: "App-details", params: { id: id } });
    },

    deleteApp(id) {
      DataService.delete('app', id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayApp(App) {
      return {
        id: App.id,
        name: App.name,
        app_id: App.app_id,
        paused: App.paused,
        allocation_strategy: App.allocation_strategy,
        allocation_strategy_params: JSON.stringify(App.allocation_strategy_params),
        target_capacity: App.target_capacity,
        ondemand_buffer_value: App.ondemand_buffer_value,
        instance_lost_hooks: App.instance_lost_hooks,
        instance_obtained_hooks: App.instance_obtained_hooks,
        custom_tags: JSON.stringify(App.custom_tags),
        current_deployment: App.current_deployment,
        launch_configs: App.launch_configs,
        ondemand_buffer_unit: App.ondemand_buffer_unit,
        auto_scaling_enabled: App.auto_scaling_enabled,
        auto_scaling_policy: App.auto_scaling_policy,
        spot_capacity: App.spot_capacity,
        ondemand_capacity: App.ondemand_capacity,
        overall_capacity: App.overall_capacity,
        marathon_cluster: App.marathon_cluster
      };
    },
    getLaunchConfig(){
      console.log("fd")
      DataService.getAll('launch_conf')
        .then((response) => {
          var lc = response.data;

          for(var i=0; i< lc.length; i++){
            this.launchConfigMap.set(JSON.parse(JSON.stringify(lc[i])).id, JSON.parse(JSON.stringify(lc[i])).name)
            this.launchConfigRMap.set(JSON.parse(JSON.stringify(lc[i])).name, JSON.parse(JSON.stringify(lc[i])).id)
            this.launchConfigOptions.push(JSON.parse(JSON.stringify(lc[i])).name)
          }
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(this.launchConfigOptions)
    }
  },
  mounted() {
    this.getLaunchConfig()
    this.retrieveApps();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>