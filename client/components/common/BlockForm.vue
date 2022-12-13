<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3 style="color:white">{{ title }}</h3>
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <label style="color:white" :for="field.id">{{ field.label }}:</label>
        <textarea
          class="content-text"
          :placeholder="message"
          v-if="field.id === 'content'"
          font-family="Arial"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else-if="field.id === 'title'"
          :placeholder="message1"
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
        <input type="datetime-local"
          v-else-if = "(field.id === 'start' || field.id === 'end')"
          :placeholder = message2 
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button class="pretty_button" type="submit">
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: "BlockForm",
  components: {},
  data() {
    /**
     * Options for submitting this form.
     */
    let messages = [
      "Name of the event",
      "Enter in YYYY-MM-DD HH:MM format",
      "Location (or other additional information you might want to include) goes here",
    ];
    return {
      url: "", // Url to submit form to
      method: "GET", // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      refreshGroups: false,
      refreshGroupEvents: false,
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      message1: messages[0],
      message2: messages[1],
      message: messages[2],
    };
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(
          Object.fromEntries(
            this.fields.map((field) => {
              const { id, value } = field;
              field.value = "";
              return [id, value];
            })
          )
        );
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          const freetId = res.freet?._id;
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('setUserId', res.user ? res.user._id : null);
          this.$store.commit('updateNavBarChosen', 'discover');
        }

        if (this.refreshFreets) {
          const res = await r.json();
          const freetId = res.freet._id;
          let options2 = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ freetId: freetId }),
          };
          this.$store.commit("refreshFreets");
          this.$store.commit("refreshProfileFreets");
        }

        if (this.refreshEvents) {
          const res = await r.json();
          const eventId = res.event._id;
          let options2 = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId: eventId }),
          };
          this.$store.commit("refreshEvents");
        }

        if (this.refreshGroups) {
          this.$store.commit("refreshGroups");
        }

        if (this.refreshGroupEvents) {
          this.$store.commit("refreshGroupEvents");
        }

        // if(this.signOut){
        //   this.$store.reset();
        // }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
@import "/components/global_css.css";
form {
  border-radius: 25px;
  border: 2px solid #111;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}

#labels {
  color: white;
}

#title {
  color: white;
}

.grid-container {
  display: grid;
  margin-right: 75%;
  gap: 50px;
  grid-auto-flow: column;
}
.grid-item {
  font-size: 10px;
  width: 125px;
  height: 125px;
  text-align: center;
}
.content-text {
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
}
.exitGroupOptions{
  height: 30px;
  width: 100%;
  background-color: white;
  color: red;
  border-top: none;
  border-left: 2px solid #111; 
  border-bottom: 2px solid #111; 
  border-right: 2px solid #111;
}
</style>
