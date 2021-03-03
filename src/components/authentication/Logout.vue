<script>
export default {
    created () {
        // reset login status
        this.$cookies.remove('X-Auth-Token')
        this.$store.dispatch('authentication/logout');
        this.$router.push({ name: "login" });
    },
    beforeMount(){
        this.$router.on
    }
};
</script>