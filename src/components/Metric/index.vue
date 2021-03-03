<template>
    <multiselect placeholder="Pick Metric" :options="actions" @select="dispatchAction" :reset-after="true"/> 
</template>

<script>

import Multiselect from "vue-multiselect";
export default {
    components: { Multiselect },
    data () {
        return {
            actions: ["Prometheus Metric", "Cloud Watch Metric", "Graphite Metric"]
        }
    },
    methods:{
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
        }
    }
};
</script>
<style>
.list {
  max-width: 750px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>