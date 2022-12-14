<template>
  <main>
    <p>{{this.test}}</p>
    <vue-cal
    style="height: 600px; width: 550px; margin-top:20px;"
    today-button
    selected-date="2022-12-12"
    :time-from="8 * 60"
    :time-step="30"
    :disable-views="['years', 'year', 'month']"
    editable-events
    :events="events"
    :split-days="splitDays"
    :sticky-split-labels="stickySplitLabels"
    :min-cell-width="minCellWidth"
    :min-split-width="minSplitWidth"
    >
    </vue-cal>
  </main>
</template>

<script>
import VueCal from "vue-cal";
export default {
  components: { VueCal },
  async created() {
    // style="height: 600px; width: 550px; margin-top:20px;"
    //   today-button
    //   :time-step="30"
    //   :disable-views="['years', 'year', 'month', 'week']"
    //   :editable-events="{ title: true, drag: false, resize: true, delete: true, create: true }"
    //   :split-days="splitDays"
    //   :sticky-split-labels="stickySplitLabels"
    //   :min-cell-width="minCellWidth"
    //   :min-split-width="minSplitWidth"
    //   :drag-to-create-event="false"
    //   :cell-click-hold="false"
    //   :dblclickToNavigate="false"
    // now = new Date();
    // const events =
    //   await `/api/events?author=${this.$store.state.profileUsername}`;
    // for (event of events) {
    //   this.events.push({
    //     start: event.start,
    //     end: event.end,
    //     title: event.title,
    //   });
    // }
    //this.test = this.$store.state.currentGroupMembers;
    // for(const member of this.$store.state.currentGroupMembers){
    //   this.splitDays[i].label = member;
    // }
  },
  data: () => ({
  stickySplitLabels: false,
  minCellWidth: 400,
  minSplitWidth: 0,
  splitDays: [
    // The id property is added automatically if none (starting from 1), but you can set a custom one.
    // If you need to toggle the splits, you must set the id explicitly.
    { id: 1, class: 'mom', label: 'Matthias' },
    { id: 2, class: 'dad', label: 'Steve', hide: false },
    { id: 3, class: 'kid1', label: 'Samuel' },
    { id: 4, class: 'kid2', label: 'Bryan' },
  ],
  events: [
    {
      start: '2022-12-12 11:00',
      end: '2022-12-12 12:00',
      title: 'Exercise',
      content: '',
      class: 'sport',
      split: 1 // Has to match the id of the split you have set (or integers if none).
    },
    {
      start: '2022-12-12 9:30',
      end: '2022-12-12 10:30',
      title: 'Dinner',
      content: '',
      class: 'leisure',
      split: 2
    },
    {
      start: '2022-12-12 8:30',
      end: '2022-12-12 9:45',
      title: 'Private',
      content: '',
      class: 'sport',
      split: 3
    },
    {
      start: '2022-12-12 9:00',
      end: '2022-12-12 10:00',
      title: 'Shopping',
      content: '',
      class: 'leisure',
      split: 4
    }
  ]
  }),
  methods: {
    /* onEventClick(event, e) {
      this.selectedEvent = event;
      this.showDialog = true;

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation();
      this.events = [];
    } */
    async createEvent(event, deleteEventFunction) {
      const start = this.convertDate(event.start);
      const end = this.convertDate(event.end);
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: this.$store.state.username,
          start: start,
          end: end,
          title: event.title,
        }),
      };
      await fetch(`/api/events`, options);
      return event;
    },
    async editEvent(event, deleteEventFunction) {
      const start = this.convertDate(event.start);
      const end = this.convertDate(event.end);
      let options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: this.$store.state.username,
          start: start,
          end: end,
          title: event.title,
        }),
      };
      await fetch(`/api/events`, options);
      return event;
    },
    async deleteEvent(event, e) {
      const start = this.convertDate(event.start);
      const end = this.convertDate(event.end);
      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: start,
          end: end,
        }),
      };
      await fetch(`/api/events`, options);
    },
    async changeDuration(event) {
      const originalEvent = event.originalEvent;
      const newEvent = event.event;
      this.deleteEvent(originalEvent, "_");
      this.createEvent(newEvent, "_");
    },
    async changeTitle(event) {
      const newEvent = event.event;
      //this.deleteEvent(newEvent, "_");
      this.editEvent(newEvent, "_");
    },
    async changeDrop(event) {
      //this.test = event;
      const originalEvent = event.originalEvent;
      const newEvent = event.event;
      // this.deleteEvent(originalEvent, "_");
      // this.createEvent(newEvent, "_");
    },
    convertDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      const hour =
        date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
      const minutes =
        date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
      return year + "-" + month + "-" + day + " " + hour + ":" + minutes;
    },
    calculateTimeDiff(start, end) {
      const startTime = start.split(" ")[1].split(":");
      const endTime = String(end).split(" ")[1].split(":");
      const hourDiff = (Number(endTime[0]) - 1 - Number(startTime[0])) * 60;
      const minDiff = Number(endTime[1]) + 60 - Number(startTime[1]);
      return hourDiff + minDiff;
    },
    // goes through every username in an array and adds the event to a calendar.
    async addEventsForUser(usernames) {
      for (const username of usernames) {
        const allEventsUrl = `/api/events?author=${username}`;
        try {
          const r = await fetch(allEventsUrl);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }

          // res contains a list of the events for that username
          for (const event of res) {
            // const timeDiff = 500;
            const timeDiff = this.calculateTimeDiff(event.start, event.end);
            this.$refs.vuecal.createEvent(
              // Formatted start date and time or JavaScript Date object.
              event.start,
              // Event duration in minutes (Integer).
              timeDiff,
              // Custom event props (optional).
              { title: event.title, content: event.content, class: "leisure" }
            );

            // const timeDiff = this.calculateTimeDiff(event.start, event.end);
            // this.$refs.vuecal.createEvent(event.start, timeDiff, {
            // title: event.title,
            // content: event.content,
            // })
          }
        } catch (e) {
          // do nothing
        }
      }
    },
  },
};
</script>

<style>
.vuecal__cell-split.dad {background-color: rgba(221, 238, 255, 0.7);}
.vuecal__cell-split.mom {background-color: rgba(255, 232, 251, 0.7);}
.vuecal__cell-split.kid1 {background-color: rgba(221, 255, 239, 0.7);}
.vuecal__cell-split.kid2 {background-color: rgba(255, 250, 196, 0.7);}
.vuecal__cell-split.kid3 {background-color: rgba(255, 206, 178, 0.7);}
</style>
