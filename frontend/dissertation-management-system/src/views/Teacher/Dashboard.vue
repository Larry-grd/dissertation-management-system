<template>
  <div class="teacher-dashboard">
    <Header />
    <div class="dashboard-content">
      <Sidebar />
      <main class="main-content">
        <h1>Teacher Dashboard</h1>
        
        <div class="dashboard-section">
          <h2>My Students List</h2>
          <StudentList />
        </div>
        
        <!-- <div class="dashboard-section">
          <h2>Grade Input</h2>
          <GradeInput />
        </div> -->
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from '../../components/common/Header.vue';
import Sidebar from '../../components/common/Sidebar.vue';
import StudentList from '../../components/teacher/StudentList.vue';
// import GradeInput from '../../components/teacher/GradeInput.vue';
</script>

<style scoped>
.teacher-dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-content {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.dashboard-section {
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>