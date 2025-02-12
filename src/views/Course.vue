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
  export default {
    data() {
      return {
        courses: [
          { id: "CS101", name: "Introduction to Computer Science", isEditing: false },
          { id: "CS102", name: "Data Structures and Algorithms", isEditing: false },
          { id: "SE201", name: "Software Engineering Principles", isEditing: false }
        ],
        newCourse: { id: "", name: "" }
      };
    },
    methods: {
      addCourse() {
        if (!this.newCourse.id.trim() || !this.newCourse.name.trim()) return;
        this.courses.unshift({ 
          id: this.newCourse.id.trim(), 
          name: this.newCourse.name.trim(), 
          isEditing: false 
        });
        this.newCourse = { id: "", name: "" };
      },
      editCourse(course) {
        course.isEditing = true;
        course.tempId = course.id;
        course.tempName = course.name;
      },
      cancelEdit(course) {
        course.isEditing = false;
      },
      saveEdit(course) {
        course.id = course.tempId.trim();
        course.name = course.tempName.trim();
        course.isEditing = false;
      },
      removeCourse(id) {
        if (!confirm("Are you sure you want to delete this course?")) return;
        this.courses = this.courses.filter(course => course.id !== id);
      }
    }
  };
  </script>
  

