<template>



    <div class="container mt-4">
      <h1 mt-3>Search Notes</h1>
  
      <!-- Center and limit width -->
      <div class="input-group  w-50 mx-auto">
        <input v-model="query" @keyup.enter="searchFiles" class="form-control" placeholder="Search for notes..." />
        <select v-model="selectedField" class="form-select" style="max-width: 20%;">
          <option value="name">Name</option>
          <option value="tags">Tags</option>
          <option value="user__username">User</option>
          <option value="course__name">Course</option>
        </select>
        <button class="btn btn-primary" @click="searchFiles">Search</button>
      </div>
  
  
      <div v-if="searched">
        <div v-if="files.length === 0" class="alert alert-warning">
          No files found.
        </div>
        <ul v-else class="list-group">
          <NoteDetail v-for="file in files" :key="file.id" :note="file" @tag-clicked="searchByTag" />
        </ul>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from "axios";
  import NoteDetail from "@/components/NoteDetail.vue";
  
  export default {
    components: { NoteDetail },
    data() {
      return {
        query: "",
        selectedField: "name", // Default search field
        files: [],
        searched: false,
      };
    },
    methods: {
      async searchFiles() {
        if (this.query.trim().length === 0) {
          this.files = [];
          this.searched = true;
          return;
        }
  
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/notes/search/", {
            params: { q: this.query, field: this.selectedField },
          });
          this.files = response.data.results;
          this.searched = true;
        } catch (error) {
          console.error("Error fetching search results:", error);
          alert("Error fetching search results.");
        }
      },
      searchByTag(tag) {
        this.query = tag;
        this.selectedField = "tags"; // Automatically set field to "tags"
        this.searchFiles();
      },
    },
  };
  </script>
  