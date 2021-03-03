
<template>
  <div data-app>
    <multiselect placeholder="Pick Metric" :options="actions" @select="dispatchAction" :reset-after="true"/> 

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
    :items="GraphiteMetrics"
    sort-by="Name"
    class="elevation-1"
    :search="search"
  >

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Graphite Metric</v-toolbar-title>
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

            <v-card-text v-if="currentGraphiteMetric">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentGraphiteMetric.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentGraphiteMetric.graphite_host"
                      label="graphite_host"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentGraphiteMetric.target"
                      label="target"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentGraphiteMetric.offset"
                      label="offset"
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
import DataService from "../../services/DataService";
import Multiselect from "vue-multiselect";
export default {
  name: "GraphiteMetrics-list",
  components: { Multiselect },
  data() {
    return {
      actions: ["Prometheus Metric", "Cloud Watch Metric", "Graphite Metric"],  
      search: '',
      dialog: false,
      dialogDelete: false,
      currentGraphiteMetric: null,
      GraphiteMetrics: [],
      title: "",
      headers: [
        { text: "id", align: "start", sortable: false, value: "id",},
        { text: "Name", align: "start", sortable: false, value: "name",},
        { text: "graphite_host", value: "graphite_host", sortable: false },
        { text: "target", value: "target", sortable: false },
        { text: "created_date", value: "created_date", sortable: false },      
        { text: "modified_date", value: "modified_date", sortable: false },            
        { text: "offset", value: "offset", sortable: false },            
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
        console.log(this.currentGraphiteMetricIndex)
        return this.currentGraphiteMetricIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  methods: {
    dispatchAction (actionName) {
        switch (actionName) {
            case 'Prometheus Metric':
                this.$router.push('graphite_metric') 
                break
            case 'Cloud Watch Metric':
                this.$router.push('cloud_watch_metric')
                break
            case 'Graphite Metric':
                this.$router.push('graphite_metric')
                break
        }
    },      
    editItem (item) {
        console.log(this.currentGraphiteMetricIndex === -1)
        this.currentGraphiteMetric = Object.assign({}, item)
        this.dialog = true
      },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.currentGraphiteMetric = Object.assign({}, this.defaultItem)
        this.currentGraphiteMetricIndex = -1
      })
    },
    save () {
      if(this.currentGraphiteMetric.id != undefined){
        DataService.update('metric/graphite_metric', this.currentGraphiteMetric.id, this.currentGraphiteMetric)
          .then((response) => {
            console.log(response.data);
            this.message = "The GraphiteMetric was updated successfully!";
          })
          .catch((e) => {
            console.log(e);
          });
      }else{ 
        DataService.create('metric/graphite_metric', this.currentGraphiteMetric)
          .then((response) => {
            this.currentGraphiteMetric.id = response.data.id;
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
      this.currentGraphiteMetric = Object.assign({}, item)
      console.log(this.currentGraphiteMetric)
      this.dialogDelete = true
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.currentGraphiteMetric = Object.assign({}, this.defaultItem)
        this.currentGraphiteMetricIndex = -1
        this.$router.go(0);
      })
    },

    deleteItemConfirm () {
      DataService.delete('metric/graphite_metric', this.currentGraphiteMetric.id)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();

    },

    retrieveGraphiteMetrics() {
      var id = this.$route.params.id
      if(id == undefined){
        DataService.getAll('metric/graphite_metric')
          .then((response) => {
            this.GraphiteMetrics = response.data.map(this.getDisplayGraphiteMetric);
          })
          .catch((e) => {
            if(String(e).indexOf("401")!==-1){
                this.$store.dispatch('authentication/logout')
            }
            console.log(e)
          });
      }else{
        DataService.get('metric/graphite_metric', id)
        .then((response) => {
          this.GraphiteMetrics = response.data.map(this.getDisplayGraphiteMetric);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });      
      }
    },

    refreshList() {
      this.retrieveGraphiteMetrics();
    },

    removeAllGraphiteMetrics() {
      DataService.deleteAll('metric/graphite_metric')
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      DataService.findByName('metric/graphite_metric', this.name)
        .then((response) => {
          this.GraphiteMetrics = response.data.map(this.getDisplayGraphiteMetric);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editGraphiteMetric(id) {
      this.$router.push({ name: "GraphiteMetric-details", params: { id: id } });
    },

    deleteGraphiteMetric(id) {
      DataService.delete('metric/graphite_metric', id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayGraphiteMetric(GraphiteMetric) {
      return {
        id: GraphiteMetric.id,
        name: GraphiteMetric.name,
        graphite_host: GraphiteMetric.graphite_host,
        target:  GraphiteMetric.target,
        created_date: GraphiteMetric.created_date,   
        modified_date: GraphiteMetric.modified_date,   
        offset: GraphiteMetric.offset,   

      };
    },
  },
  mounted() {
    this.retrieveGraphiteMetrics();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
