<template>
  <div class="add-student">
    <h3>Add New Student</h3>
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
        <label for="name">Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Adding...' : 'Add Student' }}
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
const name = ref('');
const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    const response = await studentApi.addStudent({
      studentId: studentId.value,
      name: name.value,
      email: email.value
    });
    
    success.value = 'Student added successfully!';
    // Clear form
    studentId.value = '';
    name.value = '';
    email.value = '';
  } catch (err) {
    error.value = 'Failed to add student: ' + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-student {
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
  background-color: #3498db;
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