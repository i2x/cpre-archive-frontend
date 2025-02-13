<template>
  <div class="container">
    <h1>Manage Courses</h1>
    <div class="table-wrapper">
      <div class="table-responsive" style="width: 800px;">
        <table class="table table-bordered table-sm text-center align-middle small">
          <thead class="table-light">
            <tr>
              <th style="width: 20%">ID</th>
              <th style="width: 60%">Course Name</th>
              <th style="width: 20%">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Add new course -->
            <tr>
              <td>
                <input v-model="newCourse.id" type="text" class="form-control form-control-sm" placeholder="Enter course ID" />
              </td>
              <td>
                <input v-model="newCourse.name" type="text" class="form-control form-control-sm" placeholder="Enter course name" />
              </td>
              <td>
                <button class="btn btn-success btn-sm" @click="addCourse">
                  <i class="bi bi-plus-circle"></i>
                </button>
              </td>
            </tr>

            <!-- List existing courses -->
            <tr v-for="(course, index) in courses" :key="course.id">
              <td>
                <template v-if="course.isEditing">
                  <input v-model="course.tempId" type="text" class="form-control form-control-sm" />
                </template>
                <template v-else>
                  {{ course.id }}
                </template>
              </td>
              <td>
                <template v-if="course.isEditing">
                  <input v-model="course.tempName" type="text" class="form-control form-control-sm" />
                </template>
                <template v-else>
                  {{ course.name }}
                </template>
              </td>
              <td>
                <template v-if="course.isEditing">
                  <button class="btn btn-primary btn-sm" @click="saveEdit(course)">
                    <i class="bi bi-check-circle"></i>
                  </button>
                  <button class="btn btn-secondary btn-sm ms-1" @click="cancelEdit(course)">
                    <i class="bi bi-x-circle"></i>
                  </button>
                </template>
                <template v-else>
                  <button class="btn btn-warning btn-sm" @click="editCourse(course)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-danger btn-sm ms-1" @click="removeCourse(course.id)">
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
      courses: [],
      newCourse: { id: "", name: "" }
    };
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await api.get("courses/");
        this.courses = response.data.courses.map(course => ({
          ...course,
          isEditing: false
        }));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    async addCourse() {
      if (!this.newCourse.id.trim() || !this.newCourse.name.trim()) return;
      try {
        const response = await api.post("courses/", this.newCourse);
        this.courses.unshift({ 
          ...response.data.course, 
          isEditing: false 
        });
        this.newCourse = { id: "", name: "" };
      } catch (error) {
        console.error("Error adding course:", error);
      }
    },
    editCourse(course) {
      course.isEditing = true;
      course.tempId = course.id;
      course.tempName = course.name;
    },
    cancelEdit(course) {
      course.isEditing = false;
    },
    async saveEdit(course) {
      try {
        await api.put(`courses/${course.id}/`, {
          id: course.tempId.trim(),
          name: course.tempName.trim()
        });
        course.id = course.tempId.trim();
        course.name = course.tempName.trim();
        course.isEditing = false;
      } catch (error) {
        console.error("Error updating course:", error);
      }
    },
    async removeCourse(id) {
      if (!confirm("Are you sure you want to delete this course?")) return;
      try {
        await api.delete(`courses/${id}/`);
        this.courses = this.courses.filter(course => course.id !== id);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  },
  mounted() {
    this.fetchCourses();
  }
};
</script>
