
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
    :items="PrometheusMetrics"
    sort-by="Name"
    class="elevation-1"
    :search="search"
  >

    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Prometheus Metric</v-toolbar-title>
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

            <v-card-text v-if="currentPrometheusMetric">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentPrometheusMetric.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentPrometheusMetric.prometheus_host"
                      label="prometheus_host"
                    ></v-text-field>
                  </v-col>
                  <v-textarea
                    name="query"
                    auto-grow
                    label="query"
                    v-model=currentPrometheusMetric.query
                  ></v-textarea>    
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="currentPrometheusMetric.step"
                      label="step"
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
  name: "PrometheusMetrics-list",
  components: { Multiselect },
  data() {
    return {
      actions: ["Prometheus Metric", "Cloud Watch Metric", "Graphite Metric"],  
      search: '',
      dialog: false,
      dialogDelete: false,
      currentPrometheusMetric: null,
      PrometheusMetrics: [],
      title: "",
      headers: [
        { text: "id", align: "start", sortable: false, value: "id",},
        { text: "Name", align: "start", sortable: false, value: "name",},
        { text: "prometheus_host", value: "prometheus_host", sortable: false },
        { text: "query", value: "query", sortable: false },
        { text: "created_date", value: "created_date", sortable: false },      
        { text: "modified_date", value: "modified_date", sortable: false },            
        { text: "step", value: "step", sortable: false },            
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
        console.log(this.currentPrometheusMetricIndex)
        return this.currentPrometheusMetricIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
  methods: {
    dispatchAction (actionName) {
        switch (actionName) {
            case 'Prometheus Metric':
                this.$router.push('prometheus_metric') 
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
        console.log(this.currentPrometheusMetricIndex === -1)
        this.currentPrometheusMetric = Object.assign({}, item)
        this.dialog = true
      },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.currentPrometheusMetric = Object.assign({}, this.defaultItem)
        this.currentPrometheusMetricIndex = -1
      })
    },
    save () {
      if(this.currentPrometheusMetric.id != undefined){
        DataService.update('metric/prometheus_metric', this.currentPrometheusMetric.id, this.currentPrometheusMetric)
          .then((response) => {
            console.log(response.data);
            this.message = "The PrometheusMetric was updated successfully!";
          })
          .catch((e) => {
            console.log(e);
          });
      }else{ 
        DataService.create('metric/prometheus_metric', this.currentPrometheusMetric)
          .then((response) => {
            this.currentPrometheusMetric.id = response.data.id;
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
      this.currentPrometheusMetric = Object.assign({}, item)
      console.log(this.currentPrometheusMetric)
      this.dialogDelete = true
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.currentPrometheusMetric = Object.assign({}, this.defaultItem)
        this.currentPrometheusMetricIndex = -1
        this.$router.go(0);
      })
    },

    deleteItemConfirm () {
      DataService.delete('metric/prometheus_metric', this.currentPrometheusMetric.id)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();

    },

    retrievePrometheusMetrics() {
      var id = this.$route.params.id
      if(id == undefined){
        DataService.getAll('metric/prometheus_metric')
          .then((response) => {
            this.PrometheusMetrics = response.data.map(this.getDisplayPrometheusMetric);
          })
          .catch((e) => {
            if(String(e).indexOf("401")!==-1){
                this.$store.dispatch('authentication/logout')
            }
            console.log(e)
          });
      }else{
        DataService.get('metric/prometheus_metric', id)
        .then((response) => {
          this.PrometheusMetrics = response.data.map(this.getDisplayPrometheusMetric);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });      
      }
    },

    refreshList() {
      this.retrievePrometheusMetrics();
    },

    removeAllPrometheusMetrics() {
      DataService.deleteAll('metric/prometheus_metric')
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      DataService.findByName('metric/prometheus_metric', this.name)
        .then((response) => {
          this.PrometheusMetrics = response.data.map(this.getDisplayPrometheusMetric);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editPrometheusMetric(id) {
      this.$router.push({ name: "PrometheusMetric-details", params: { id: id } });
    },

    deletePrometheusMetric(id) {
      DataService.delete('metric/prometheus_metric', id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayPrometheusMetric(PrometheusMetric) {
      return {
        id: PrometheusMetric.id,
        name: PrometheusMetric.name,
        prometheus_host: PrometheusMetric.prometheus_host,
        query:  PrometheusMetric.query,
        created_date: PrometheusMetric.created_date,   
        modified_date: PrometheusMetric.modified_date,   
        step: PrometheusMetric.step,   

      };
    },
  },
  mounted() {
    this.retrievePrometheusMetrics();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
