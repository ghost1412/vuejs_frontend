
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
    :items="CloudWatchMetrics"
    sort-by="Name"
    class="elevation-1"
    :search="search"
  >

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Cloud Watch Metric</v-toolbar-title>
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

            <v-card-text v-if="currentCloudWatchMetric">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentCloudWatchMetric.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentCloudWatchMetric.region"
                      label="region"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentCloudWatchMetric.namespace"
                      label="namespace"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentCloudWatchMetric.metric"
                      label="metric"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentCloudWatchMetric.period"
                      label="period"
                    ></v-text-field>              
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentCloudWatchMetric.statistic"
                      label="statistic"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentCloudWatchMetric.null_is_zero"
                      label="null_is_zero"
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
  name: "CloudWatchMetrics-list",
  components: { Multiselect },
  data() {
    return {
      actions: ["Prometheus Metric", "Cloud Watch Metric", "Graphite Metric"],  
      search: '',
      dialog: false,
      dialogDelete: false,
      currentCloudWatchMetric: null,
      CloudWatchMetrics: [],
      title: "",
      headers: [
        { text: "id", align: "start", sortable: false, value: "id",},
        { text: "Name", align: "start", sortable: false, value: "name",},
        { text: "region", value: "region", sortable: false },
        { text: "query", value: "query", sortable: false },
        { text: "created_date", value: "created_date", sortable: false },      
        { text: "modified_date", value: "modified_date", sortable: false },            
        { text: "namespace", value: "namespace", sortable: false },     
        { text: "metric", value: "metric", sortable: false }, 
        { text: "period", value: "period", sortable: false }, 
        { text: "statistic", value: "statistic", sortable: false }, 
        { text: "null_is_zero", value: "null_is_zero", sortable: false },                                        
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
        console.log(this.currentCloudWatchMetricIndex)
        return this.currentCloudWatchMetricIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  methods: {
    dispatchAction (actionName) {
        switch (actionName) {
            case 'Prometheus Metric':
                this.$router.push('cloud_watch_metric') 
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
        console.log(this.currentCloudWatchMetricIndex === -1)
        this.currentCloudWatchMetric = Object.assign({}, item)
        this.dialog = true
      },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.currentCloudWatchMetric = Object.assign({}, this.defaultItem)
        this.currentCloudWatchMetricIndex = -1
      })
    },
    save () {
      if(this.currentCloudWatchMetric.id != undefined){
        DataService.update('metric/cloud_watch_metric', this.currentCloudWatchMetric.id, this.currentCloudWatchMetric)
          .then((response) => {
            console.log(response.data);
            this.message = "The CloudWatchMetric was updated successfully!";
          })
          .catch((e) => {
            console.log(e);
          });
      }else{ 
        DataService.create('metric/cloud_watch_metric', this.currentCloudWatchMetric)
          .then((response) => {
            this.currentCloudWatchMetric.id = response.data.id;
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
      this.currentCloudWatchMetric = Object.assign({}, item)
      console.log(this.currentCloudWatchMetric)
      this.dialogDelete = true
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.currentCloudWatchMetric = Object.assign({}, this.defaultItem)
        this.currentCloudWatchMetricIndex = -1
        this.$router.go(0);
      })
    },

    deleteItemConfirm () {
      DataService.delete('metric/cloud_watch_metric', this.currentCloudWatchMetric.id)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();

    },

    retrieveCloudWatchMetrics() {
      var id = this.$route.params.id
      if(id == undefined){
        DataService.getAll('metric/cloud_watch_metric')
          .then((response) => {
            this.CloudWatchMetrics = response.data.map(this.getDisplayCloudWatchMetric);
          })
          .catch((e) => {
            if(String(e).indexOf("401")!==-1){
                this.$store.dispatch('authentication/logout')
            }
            console.log(e)
          });
      }else{
        DataService.get('metric/cloud_watch_metric', id)
        .then((response) => {
          this.CloudWatchMetrics = response.data.map(this.getDisplayCloudWatchMetric);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });      
      }
    },

    refreshList() {
      this.retrieveCloudWatchMetrics();
    },

    removeAllCloudWatchMetrics() {
      DataService.deleteAll('metric/cloud_watch_metric')
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      DataService.findByName('metric/cloud_watch_metric', this.name)
        .then((response) => {
          this.CloudWatchMetrics = response.data.map(this.getDisplayCloudWatchMetric);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editCloudWatchMetric(id) {
      this.$router.push({ name: "CloudWatchMetric-details", params: { id: id } });
    },

    deleteCloudWatchMetric(id) {
      DataService.delete('metric/cloud_watch_metric', id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayCloudWatchMetric(CloudWatchMetric) {
      return {
        id: CloudWatchMetric.id,
        name: CloudWatchMetric.name,
        region: CloudWatchMetric.region,
        query:  CloudWatchMetric.query,
        created_date: CloudWatchMetric.created_date,   
        modified_date: CloudWatchMetric.modified_date,   
        namespace: CloudWatchMetric.namespace,   
        metric: CloudWatchMetric.metric,   
        period: CloudWatchMetric.period,   
        statistic: CloudWatchMetric.statistic,   
        null_is_zero: CloudWatchMetric.null_is_zero,   


      };
    },
  },
  mounted() {
    this.retrieveCloudWatchMetrics();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
