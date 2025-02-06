<template>
    <li class="list-group-item">
      <div class="d-flex align-items-center">
        <div class="me-3">
          <strong>{{ note.name }}</strong> <br />
          <small class="text-muted">Owned by: <em>{{ note.user }}</em></small> <br />
          
          <!-- Display tags -->
          <small
            v-for="(tag, index) in note.tags.split(',')"
            :key="index"
            class="badge bg-info text-dark me-1"
            style="cursor: pointer;"
            @click="searchByTag(tag.trim())"
          >
            📌 {{ tag.trim() }}
          </small>
          
          <!-- Show budget if available -->
          <small v-if="note.budget" class="badge bg-success ms-2">
            💾 Size: {{ note.budget }} MB
          </small>
        </div>
  
        <!-- Show thumbnail or file link -->
        <div class="ms-auto">
          <span v-if="note.thumbnail_url">
            <img :src="note.thumbnail_url" alt="Thumbnail" class="img-thumbnail" width="100" />
          </span>
          <span v-else>
            <a :href="note.file_url" target="_blank" class="btn btn-outline-secondary btn-sm">View File</a>
          </span>
        </div>
      </div>
    </li>
  </template>
  
  <script>
  export default {
    props: {
      note: {
        type: Object,
        required: true,
      },
    },
    methods: {
      searchByTag(tag) {
        this.$emit("tag-clicked", tag);
      },
    },
  };
  </script>
  
  <style>
  .img-thumbnail {
    max-height: 100px;
  }
  </style>
  