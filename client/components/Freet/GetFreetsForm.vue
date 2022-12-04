<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetFreetsForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.filter, username: this.$store.state.username};
  },
  methods: {
    async submit() {
      const url = this.value ? `/api/events?author=${this.value}` : '/api/events';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateFilter', this.value);
        this.$store.commit('updateEvents', res);
        
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshEvents');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.filter;
        }
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
