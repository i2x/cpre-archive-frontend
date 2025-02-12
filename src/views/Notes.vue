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
                <template v-if="note.isEditing">
                  <input v-model="note.tempName" type="text" class="form-control form-control-sm" />
                </template>
                <template v-else>
                  {{ note.name }}
                </template>
              </td>
              <td>
                <template v-if="note.isEditing">
                  <input v-model="note.tempFileUrl" type="text" class="form-control form-control-sm" />
                </template>
                <template v-else>
                  {{ note.file_url }}
                </template>
              </td>
              <td>
                <template v-if="note.isEditing">
                  <input v-model="note.tempCourseId" type="text" class="form-control form-control-sm" />
                </template>
                <template v-else>
                  {{ note.course_id }}
                </template>
              </td>
              <td>
                <template v-if="note.isEditing">
                  <input v-model="note.tempTags" type="text" class="form-control form-control-sm" />
                </template>
                <template v-else>
                  {{ note.tags }}
                </template>
              </td>
              <td>
                <template v-if="note.isEditing">
                  <button class="btn btn-primary btn-sm" @click="saveEdit(note)">
                    <i class="bi bi-check-circle"></i>
                  </button>
                  <button class="btn btn-secondary btn-sm ms-1" @click="cancelEdit(note)">
                    <i class="bi bi-x-circle"></i>
                  </button>
                </template>
                <template v-else>
                  <button class="btn btn-warning btn-sm" @click="editNote(note)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-danger btn-sm ms-1" @click="removeNote(note.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </template>
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

export default {
  data() {
    return {
      notes: [],
      newNote: { name: "", file_url: "", course_id: "", tags: "" },
    };
  },
  methods: {
    async fetchNotes() {
      try {
        const response = await api.get("notes/");
        this.notes = response.data.notes.map(note => ({
          ...note,
          isEditing: false
        }));
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    },
    async addNote() {
      if (!this.newNote.name.trim()) return;
      try {
        const response = await api.post("notes/", this.newNote);
        this.notes.unshift({
          ...response.data.note,
          isEditing: false
        });
        this.newNote = { name: "", file_url: "", course_id: "", tags: "" };
      } catch (error) {
        console.error("Error adding note:", error);
      }
    },
    editNote(note) {
      note.isEditing = true;
      note.tempName = note.name;
      note.tempFileUrl = note.file_url;
      note.tempCourseId = note.course_id;
      note.tempTags = note.tags;
    },
    cancelEdit(note) {
      note.isEditing = false;
    },
    async saveEdit(note) {
      try {
        await api.put(`notes/${note.id}/`, {
          name: note.tempName.trim(),
          file_url: note.tempFileUrl.trim(),
          course_id: note.tempCourseId.trim(),
          tags: note.tempTags.trim()
        });
        note.name = note.tempName.trim();
        note.file_url = note.tempFileUrl.trim();
        note.course_id = note.tempCourseId.trim();
        note.tags = note.tempTags.trim();
        note.isEditing = false;
      } catch (error) {
        console.error("Error updating note:", error);
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
    }
  },
  mounted() {
    this.fetchNotes();
  }
};
</script>
