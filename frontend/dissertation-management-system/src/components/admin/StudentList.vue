<template>
  <div class="student-list">
    <h3>Student List</h3>
    <div v-if="studentStore.loading">Loading...</div>
    <div v-else-if="studentStore.error" class="error">{{ studentStore.error }}</div>
    <div v-else>
      <div v-if="studentStore.students.length === 0" class="no-students">
        No student data
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Assigned Teacher</th>
            <th>Progress Report</th>
            <th>Final Report</th>
            <th>Status</th>
            <th v-if="user?.role === 'admin'">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in studentStore.students" :key="student._id">
            <td>{{ student.studentId }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>
              <div v-if="student.assignedTeacher">
                <div>Teacher Name: {{ student.assignedTeacher.name }}</div>
                <div>Teacher ID: {{ student.assignedTeacher.teacherId }}</div>
                <div>Teacher Email: {{ student.assignedTeacher.email }}</div>
              </div>
              <div v-else>Not assigned</div>
            </td>
            <td>
              {{ student.progressReport.submitted ? 
                `Submitted (${student.progressReport.grade || 'Not graded'})` : 
                'Not submitted' 
              }}
            </td>
            <td>
              {{ student.finalReport.submitted ? 
                `Submitted (${student.finalReport.grade || 'Not graded'})` : 
                'Not submitted' 
              }}
            </td>
            <td>
              <span :class="getStatusClass(student.status)">
                {{ student.status }}
              </span>
            </td>
            <td v-if="user?.role === 'admin'">
              <button 
                @click="openAssignModal(student)"
                :disabled="!!student.assignedTeacher"
                :class="{ 'assigned': !!student.assignedTeacher }"
              >
                {{ student.assignedTeacher ? 'Already assigned' : 'Assign Teacher' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分配教师模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ modalTitle }}</h3>
        <form @submit.prevent="assignTeacher">
          <div class="form-group">
            <label for="teacherId">Teacher ID</label>
            <input 
              type="text" 
              id="teacherId" 
              v-model="teacherId" 
              required
            />
          </div>
          <div v-if="assignError" class="error">{{ assignError }}</div>
          <div class="form-buttons">
            <button type="submit" :disabled="assignLoading">
              {{ assignLoading ? 'Assigning...' : 'Assign Teacher' }}
            </button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../store';
import { useStudentStore } from '../../store';

const studentStore = useStudentStore();
const user = useAuthStore().user;
const showModal = ref(false);
const modalTitle = ref('');
const currentStudent = ref(null);
const teacherId = ref('');
const assignError = ref('');
const assignLoading = ref(false);

onMounted(() => {
  studentStore.fetchStudents();
});

const getStatusClass = (status) => {
  switch(status) {
    case 'pending': return 'status-pending';
    case 'in-progress': return 'status-in-progress';
    case 'completed': return 'status-completed';
    default: return '';
  }
};

const openAssignModal = (student) => {
  currentStudent.value = student;
  teacherId.value = '';
  assignError.value = '';
  modalTitle.value = `Assign Teacher to ${student.name}`;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentStudent.value = null;
  teacherId.value = '';
  assignError.value = '';
};

const assignTeacher = async () => {
  if (!currentStudent.value || !teacherId.value) return;
  
  assignLoading.value = true;
  assignError.value = '';
  
  try {
    console.log('Assigning teacher:', {
      studentId: currentStudent.value.studentId,
      teacherId: teacherId.value
    });
    
    await studentStore.assignTeacher({
      studentId: currentStudent.value.studentId,
      teacherId: teacherId.value
    });
    
    closeModal();
  } catch (err) {
    console.error('Assign teacher failed:', err);
    assignError.value = 'Assign teacher failed: ' + (err.response?.data?.message || err.message);
  } finally {
    assignLoading.value = false;
  }
};
</script>

<style scoped>
/* 保持原有样式 */
.student-list {
  margin-bottom: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

button.assigned {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

.status-pending {
  color: #f39c12;
  font-weight: bold;
}

.status-in-progress {
  color: #3498db;
  font-weight: bold;
}

.status-completed {
  color: #27ae60;
  font-weight: bold;
}

.error {
  color: #e74c3c;
  margin-top: 1rem;
}

.no-students {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.assign-error {
  color: #e74c3c;
  margin-top: 0.5rem;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-buttons button {
  padding: 0.5rem 1rem;
}
</style>