<template>
  <div class="admin-dashboard">
    <Header />
    <div class="dashboard-content">
      <Sidebar />
      <main class="main-content">
        <h1>Admin Dashboard</h1>
        
        <div class="dashboard-section">
          <h2>Add Student</h2>
          <AddStudent />
        </div>
        
        <!-- <div class="dashboard-section">
          <h2>Assign Teacher</h2>
          <AssignTeacher />
        </div> -->
        
        <div class="dashboard-section">
          <h2>Student List</h2>
          <StudentList />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from '../../components/common/Header.vue';
import Sidebar from '../../components/common/Sidebar.vue';
import AddStudent from '../../components/admin/AddStudent.vue';
import AssignTeacher from '../../components/admin/AssignTeacher.vue';
import StudentList from '../../components/admin/StudentList.vue';
</script>

<style scoped>
.admin-dashboard {
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