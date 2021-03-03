
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
    :items="LaunchSpecs"
    sort-by="Name"
    class="elevation-1"
    :search="search"
  >
     <template #item.spec="{ value }">
      <v-icon
        small
        class="mr-2"
        @click="showData(value)"
      >
        mdi-book-open-page-variant
      </v-icon>        
    </template>
     <template #item.user_data="{ value }">
      <v-icon
        small
        class="mr-2"
        @click="showData(value)"
      >
        mdi-book-open-page-variant
      </v-icon>
    </template>
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>LaunchSpecs</v-toolbar-title>
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

            <v-card-text v-if="currentLaunchSpec">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentLaunchSpec.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                 <v-textarea
                    clearable
                    name="spec"
                    auto-grow
                    label="Spec"
                    v-model=currentLaunchSpec.spec
                  ></v-textarea>  
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                 <v-textarea
                    clearable
                    name="user_data"
                    auto-grow
                    label="User Data"
                    v-model=currentLaunchSpec.user_data
                  ></v-textarea>  
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
        <v-dialog v-model="dialogData" max-width="700px">
          <v-card>
            <v-card-title class="headline">Data</v-card-title>
            <v-container fluid>
              <v-textarea
                name="data"
                auto-grow
                filled
                v-model=data
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
import DataService from "../services/DataService";
export default {
  name: "LaunchSpecs-list",
  data() {
    return {
      selected: null,
      search: '', 
      dialog: false,
      dialogDelete: false,
      dialogData: false,
      data: null,
      currentLaunchSpec: null,
      LaunchSpecs: [],
      title: "",
      headers: [
        { text: "id", align: "start", sortable: false, value: "id",},
        { text: "name", value: "name", sortable: false },
        { text: "spec", value: "spec", sortable: false},
        { text: "user_data", value: "user_data", sortable: false },        
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
        console.log(this.currentLaunchSpecIndex)
        return this.currentLaunchSpecIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  methods: {
    showData(value){
      this.dialogData = true
      this.data = value 
    },
    editItem (item) {
        this.launchselected = []
        console.log(this.currentLaunchSpecIndex === -1)
        this.currentLaunchSpec = Object.assign({}, item)
        this.dialog = true
      },

    close () {
        this.dialog = false
        this.$nextTick(() => {
        this.currentLaunchSpec = Object.assign({}, this.defaultItem)
        this.currentLaunchSpecIndex = -1
        })
        this.refreshList()
    },
    updateData(){
        this.currentLaunchSpec.spec = JSON.parse(this.currentLaunchSpec.spec)
    },
    save () {
        this.updateData()
            if(this.currentLaunchSpec.id != undefined){
                DataService.update('launch_spec', this.currentLaunchSpec.id, this.currentLaunchSpec)
                    .then((response) => {
                    console.log(response.data);
                    this.message = "The LaunchSpec was updated successfully!";
                    })
                    .catch((e) => {
                    console.log(e);
                    });
            }else{ 
                console.log("in")
                DataService.create('launch_spec', this.currentLaunchSpec)
                    .then((response) => {
                    this.currentLaunchSpec.id = response.data.id;
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
        this.currentLaunchSpec = Object.assign({}, item)
        console.log(this.currentLaunchSpec)
        this.dialogDelete = true
    },

    closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
            this.currentLaunchSpec = Object.assign({}, this.defaultItem)
            this.currentLaunchSpecIndex = -1
            this.refreshList()
        })
    },

    deleteItemConfirm () {
        DataService.delete('launch_spec', this.currentLaunchSpec.LaunchSpec_id)
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

    retrieveLaunchSpecs() {
        DataService.getAll('launch_spec')
        .then((response) => {
            this.LaunchSpecs = response.data.map(this.getDisplayLaunchSpec);
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
      this.retrieveLaunchSpecs();
    },

    removeAllLaunchSpecs() {
        DataService.deleteAll('launch_spec')
            .then((response) => {
                console.log(response.data);
                this.refreshList();
        })
        .catch((e) => {
            console.log(e);
        });
    },

    searchTitle() {
        DataService.findByName('launch_spec', this.name)
            .then((response) => {
                this.LaunchSpecs = response.data.map(this.getDisplayLaunchSpec);
                console.log(response.data);
        })
        .catch((e) => {
            console.log(e);
        });
    },

    editLaunchSpec(id) {
        this.$router.push({ name: "LaunchSpec-details", params: { id: id } });
    },

    deleteLaunchSpec(id) {
        DataService.delete('LaunchSpec', id)
            .then(() => {
                this.refreshList();
        })
        .catch((e) => {
            console.log(e);
        });
    },

    getDisplayLaunchSpec(LaunchSpec) {
      return {
          id: LaunchSpec.id,
          name: LaunchSpec.name,
          spec: JSON.stringify(LaunchSpec.spec),
          user_data: LaunchSpec.user_data
      };
    },
  },
  mounted() {
    this.retrieveLaunchSpecs();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>