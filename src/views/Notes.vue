<template>
    <div class="container">
      <h1>Manage Notes</h1>
      <div class="table-wrapper">
        <div class="table-responsive">
          <table class="table table-bordered table-sm text-center align-middle small">
            <thead class="table-light">
              <tr>
                <th style="width: 20%;">Name</th>
                <th style="width: 30%;">File URL</th>
                <th style="width: 15%;">Course</th>
                <th style="width: 25%;">Tags</th>
                <th style="width: 10%;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input v-model="newNote.name" type="text" class="form-control form-control-sm" placeholder="Enter name" /></td>
                <td><input v-model="newNote.file_url" type="text" class="form-control form-control-sm" placeholder="Enter file URL" /></td>
                <td><input v-model="newNote.course_id" type="text" class="form-control form-control-sm" placeholder="Enter course ID" /></td>
                <td><input v-model="newNote.tags" type="text" class="form-control form-control-sm" placeholder="Enter tags" /></td>
                <td>
                  <button class="btn btn-success btn-sm" @click="addNote">
                    <i class="bi bi-plus-circle"></i>
                  </button>
                </td>
              </tr>
              <tr v-for="(note, index) in notes" :key="note.id">
                <td>
                  <input v-model="note.name" @input="debouncedSave(note)" type="text" class="form-control form-control-sm" />
                </td>
                <td>
                  <input v-model="note.file_url" @input="debouncedSave(note)" type="text" class="form-control form-control-sm" />
                </td>
                <td>
                  <input v-model="note.course_id" @input="debouncedSave(note)" type="text" class="form-control form-control-sm" />
                </td>
                <td>
                  <input v-model="note.tags" @input="debouncedSave(note)" type="text" class="form-control form-control-sm" />
                </td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="removeNote(note.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from "@/utils/api.js";
  
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  export default {
    data() {
      return {
        notes: [],
        newNote: { name: "", file_url: "", course_id: "", tags: "" },
        debouncedSave: null, // Store debounced function
      };
    },
    methods: {
      async fetchNotes() {
        try {
          const response = await api.get("notes/");
          this.notes = response.data.notes;
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      },
      async saveNote(note) {
        try {
          await api.put(`notes/${note.id}/`, note);
        } catch (error) {
          console.error("Error saving note:", error);
        }
      },
      async addNote() {
        if (!this.newNote.name) return;
        try {
          const response = await api.post("notes/", this.newNote);
          this.notes.unshift(response.data.note); // Add new note at the beginning
          this.newNote = { name: "", file_url: "", course_id: "", tags: "" };
        } catch (error) {
          console.error("Error adding note:", error);
        }
      },
      async removeNote(id) {
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
          await api.delete(`notes/${id}/`);
          this.notes = this.notes.filter(note => note.id !== id);
        } catch (error) {
          console.error("Error deleting note:", error);
        }
      },
    },
    created() {
      this.debouncedSave = debounce(this.saveNote, 1000); // Bind 'this' to debounced function
    },
    mounted() {
      this.fetchNotes();
    },
  };
  </script>
  
  <style>
  .table-wrapper {
    max-height: 500px;
    overflow-y: auto;
  }
  </style>
  