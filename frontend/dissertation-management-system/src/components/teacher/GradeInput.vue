<template>
  <div class="grade-input">
    <h3>成绩录入</h3>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>学号</th>
            <th>姓名</th>
            <th>进度报告成绩</th>
            <th>最终报告成绩</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student._id">
            <td>{{ student.studentId }}</td>
            <td>{{ student.name }}</td>
            <td>
              <input 
                type="number" 
                v-model="student.progressGrade" 
                min="0" 
                max="100"
                :disabled="student.progressReport.submitted"
              />
            </td>
            <td>
              <input 
                type="number" 
                v-model="student.finalGrade" 
                min="0" 
                max="100"
                :disabled="student.finalReport.submitted"
              />
            </td>
            <td>
              <span :class="getStatusClass(student.status)">
                {{ student.status }}
              </span>
            </td>
            <td>
              <button @click="saveGrades(student)" :disabled="saving">
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { studentApi } from '../../api/students';
import { useAuthStore } from '../../store';

const students = ref([]);
const loading = ref(false);
const error = ref('');
const saving = ref(false);
const user = useAuthStore().user;

onMounted(() => {
  fetchStudents();
});

const fetchStudents = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await studentApi.getTeacherStudents(user.teacherId);
    students.value = response.data.students.map(student => ({
      ...student,
      progressGrade: student.progressReport.grade || '',
      finalGrade: student.finalReport.grade || ''
    }));
  } catch (err) {
    error.value = '获取学生列表失败：' + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => {
  switch(status) {
    case 'pending': return 'status-pending';
    case 'in-progress': return 'status-in-progress';
    case 'completed': return 'status-completed';
    default: return '';
  }
};

const saveGrades = async (student) => {
  saving.value = true;
  
  try {
    // 更新进度报告成绩
    if (student.progressGrade !== '' && student.progressGrade !== student.progressReport.grade) {
      await studentApi.updateGrade({
        studentId: student.studentId,
        reportType: 'progress',
        grade: parseInt(student.progressGrade)
      });
    }
    
    // 更新最终报告成绩
    if (student.finalGrade !== '' && student.finalGrade !== student.finalReport.grade) {
      await studentApi.updateGrade({
        studentId: student.studentId,
        reportType: 'final',
        grade: parseInt(student.finalGrade)
      });
    }
    
    // 刷新学生列表
    await fetchStudents();
  } catch (err) {
    error.value = '保存成绩失败：' + (err.response?.data?.message || err.message);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.grade-input {
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

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
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
</style>