<!-- Form for changing username (block style) -->

<script>
import NewBlockForm from '@/components/common/NewBlockForm.vue';

export default {
  name: 'JoinGroupForm',
  mixins: [NewBlockForm],
  data() {
    return {
      url: '/api/circles/self',
      method: 'PUT',
      hasBody: true,
      refreshGroups: true,
      refreshGroupEvents: true,
      fields: [
        {id: 'circleName', label: 'GroupName', value: ''}
      ],
      title: 'Join a Group',
      callback: () => {
        const message = `You have successfully joined the group!`;
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
