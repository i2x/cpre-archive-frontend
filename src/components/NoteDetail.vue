<template>
  <li class="list-group-item">
    <div class="d-flex align-items-center">
      <div class="me-3">
        <strong>{{ note.name }}</strong> <br />

        <small class="text-muted">Owned by: <em>{{ note.user }}</em></small> <br />

        <code>{{ note.course }}</code> <br />

        <!-- Display tags -->
        <span
          v-for="(tag, index) in note.tags.split(',')"
          :key="index"
          class="badge bg-primary me-1"
          style="cursor: pointer;"
          @click="searchByTag(tag.trim())"
        >
          <i class="bi bi-bookmarks-fill"></i> {{ tag.trim() }}
        </span>

        <!-- Show budget if available -->
        <small v-if="note.budget" class="badge bg-success ms-2">
          💾 Size: {{ note.budget }} MB
        </small>
      </div>

      <!-- Show file link (always clickable) -->
      <div class="ms-auto">
        <a :href="note.file_url" target="_blank" class="d-inline-block">
          <img v-if="note.thumbnail_url" :src="note.thumbnail_url" alt="Thumbnail" class="img-thumbnail" width="100" />
          <button v-else class="btn btn-outline-secondary btn-sm">View File</button>
        </a>
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
