<template>
    <div id="curriculum-flow">
      <h1>Course Schedule</h1>
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="['tab-button', { active: activeTab === tab.name }]"
          @click="activeTab = tab.name"
        >
          {{ tab.label }}
        </button>
      </div>
  
      <!-- Select Year Filter -->
      <div v-if="activeTab === 'schedule'" class="filter-container">
        <label for="year-filter">Filter by Year:</label>
        <select id="year-filter" v-model="selectedYear">
          <option value="">All Years</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            Year {{ year }}
          </option>
        </select>
      </div>
  
      <!-- Tab: Schedule -->
      <div v-if="activeTab === 'schedule'" class="tab-content">
        <div class="horizontal-container">
          <div
            v-for="(term, index) in filteredCourses"
            :key="index"
            class="term-column"
          >
            <h2 class="term-header">Year {{ term.year }}, Term {{ term.term }}</h2>
            <div
              v-for="course in term.courses"
              :key="course.id"
              class="course-card"
              @click="showCourseDetail(course)"
            >
              <div class="course-code">{{ course.id }}</div>
              <div class="course-name">{{ course.name }}</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Tab: Course Notes -->
      <div v-if="activeTab === 'courseNotes'" class="tab-content">
        <h2>{{ selectedCourse?.name }}</h2>
        <div v-if="loadingNotes" class="loading">Loading notes...</div>
        <div v-else-if="notes.length === 0" class="alert alert-warning">
          No notes found for this course.
        </div>
        <ul v-else class="list-group">
          <NoteDetail v-for="note in notes" :key="note.id" :note="note" />
        </ul>
        <button class="btn btn-secondary mt-3" @click="backToSchedule">
          Back to Schedule
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import NoteDetail from "@/components/NoteDetail.vue";
  import api from "@/utils/api.js";

  
  export default {
    name: "CurriculumComponent",
    components: { NoteDetail },
    data() {
      return {
        tabs: [
          { name: "schedule", label: "Schedule" },
          { name: "courseNotes", label: "Course Notes" },
        ],
        activeTab: "schedule",
        courses: [],
        selectedCourse: null,
        notes: [],
        loadingNotes: false,
        selectedYear: "", // Selected year for filtering
      };
    },
    computed: {
      groupedCourses() {
        const groups = [];
        this.courses.forEach((course) => {
          let group = groups.find(
            (g) => g.year === course.year && g.term === course.term
          );
          if (!group) {
            group = { year: course.year, term: course.term, courses: [] };
            groups.push(group);
          }
          group.courses.push(course);
        });
        return groups.sort((a, b) => a.year - b.year || a.term - b.term);
      },
      filteredCourses() {
        if (!this.selectedYear) {
          return this.groupedCourses;
        }
        return this.groupedCourses.filter((group) => group.year === Number(this.selectedYear));
      },
      availableYears() {
        return [...new Set(this.courses.map((course) => course.year))];
      },
    },
    methods: {
      async fetchCurriculum() {
        try {
          const response = await api.get("curriculum/");
          this.courses = response.data.courses;
        } catch (error) {
          console.error("Error fetching curriculum:", error);
          alert("Error fetching curriculum data.");
        }
      },
      async showCourseDetail(course) {
        this.selectedCourse = course;
        this.activeTab = "courseNotes";
        this.loadingNotes = true;
  
        try {
          const response = await api.get("notes/search/", {
            params: { q: course.name, field: "course__name" }, // Search by course name
          });
          this.notes = response.data.results;
        } catch (error) {
          console.error("Error fetching notes:", error);
          alert("Error fetching course notes.");
        } finally {
          this.loadingNotes = false;
        }
      },
      backToSchedule() {
        this.activeTab = "schedule";
        this.selectedCourse = null;
        this.notes = [];
      },
    },
    mounted() {
      this.fetchCurriculum();
    }
  };
  </script>
  