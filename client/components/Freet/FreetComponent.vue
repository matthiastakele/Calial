<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <div class = "top">
        <div class = "left">
          <router-link @click.native = "goToProfile" to="/profile"><span class="profilePic">{{freet.author.charAt(0).toUpperCase()}}</span></router-link>
          <FollowComponent v-bind:username="this.freet.author" v-if="$store.state.username !== freet.author"/>
        </div>
        <div class = "right"> 
          <h3 class="author">
            @{{ freet.author }}
          </h3>
        </div>
      </div>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button class = "pretty_button"
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button class = "pretty_button"
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button class = "pretty_button"
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button class = "pretty_button" @click="deleteFreet"> 
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <LikeComponent v-bind:freetId="this.freet._id" />
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import LikeComponent from '@/components/Like/LikeComponent.vue'
import FollowComponent from '@/components/Follow/FollowComponent.vue'

export default {
  name: 'FreetComponent',
  components: {LikeComponent, FollowComponent},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification,
      author_id: null
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    async deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
      // delete likes when you delete freet
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }
      if(params.method === 'DELETE'){
        let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
        await fetch(`/api/likes/delete/${this.freet._id}`, options);
      }
      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');
        this.$store.commit('refreshProfileFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async goToProfile(){
      this.$store.commit('updateProfileUsername', this.freet.author);
      this.$store.commit('refreshProfileFreets');
      let options = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      };
      let r = await fetch(`/api/users/userIds/${this.freet.author}`, options);
      let res = await r.json();
      this.authorId = res.userId;
      this.$store.commit('refreshLikes', this.authorId);
      this.$store.commit('updateProfileUsername', this.authorId);
    }
  }
};
</script>

<style scoped>
@import "/components/global_css.css";
.freet {
    border-radius: 25px;
    margin: 10px;
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}

.top{
  /* display: flex; */
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  width: 15%;
}


.top .left, .top .right{
  display: flex;
  flex: 1;
}

span.profilePic{
  background: rgb(153, 153, 255);
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  color: #353535;
  display: inline-block;
  font-weight: bold;
  font-size: 35px;
  line-height: 60px;
  text-align: center;
  width: 60px;
}
</style>

