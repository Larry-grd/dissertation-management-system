<template>
  <div class="assign-teacher">
    <h3>Assign Teacher to Student</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="studentId">Student ID</label>
        <input 
          type="text" 
          id="studentId" 
          v-model="studentId" 
          required
        />
      </div>
      <div class="form-group">
        <label for="teacherId">Teacher ID</label>
        <input 
          type="text" 
          id="teacherId" 
          v-model="teacherId" 
          required
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Assigning...' : 'Assign Teacher' }}
      </button>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { studentApi } from '../../api/students';

const studentId = ref('');
const teacherId = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    const response = await studentApi.assignTeacher({
      studentId: studentId.value,
      teacherId: teacherId.value
    });
    
    success.value = 'Teacher assigned successfully!';
    // Clear form
    studentId.value = '';
    teacherId.value = '';
  } catch (err) {
    error.value = 'Failed to assign teacher: ' + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.assign-teacher {
  margin-bottom: 2rem;
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

button {
  background-color: #9b59b6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  margin-top: 1rem;
}

.success {
  color: #27ae60;
  margin-top: 1rem;
}
</style>