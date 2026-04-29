<template>
  <div class="student-list">
    <h3>My Students List</h3>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-if="students.length === 0" class="no-students">
        No student data or you have no assigned students
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Progress Report</th>
            <th>Final Report</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student._id">
            <td>{{ student.studentId }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>
              <div class="report-status">
                <div class="report-score" v-if="student.progressReport.submitted">
                  {{ student.progressReport.grade || 'Not graded' }}
                </div>
                <div class="report-unsubmitted" v-else>
                  Not submitted
                </div>
              </div>
            </td>
            <td>
              <div class="report-status">
                <div class="report-score" v-if="student.finalReport.submitted">
                  {{ student.finalReport.grade || 'Not graded' }}
                </div>
                <div class="report-unsubmitted" v-else>
                  Not submitted
                </div>
              </div>
            </td>
            <td>
              <span :class="getStatusClass(student.status)">
                {{ student.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  @click="openGradeModal(student, 'progress')"
                  :disabled="student.progressReport.submitted"
                  :class="{ 'scored': student.progressReport.submitted }"
                >
                  {{ student.progressReport.submitted ? 
                    'Progress report already graded' : 
                    'Grade progress report' 
                  }}
                </button>
                <button 
                  @click="openGradeModal(student, 'final')"
                  :disabled="student.finalReport.submitted"
                  :class="{ 'scored': student.finalReport.submitted }"
                >
                  {{ student.finalReport.submitted ? 
                    'Final report already graded' : 
                    'Grade final report' 
                  }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Grade Input Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ modalTitle }}</h3>
        <form @submit.prevent="submitGrade">
          <div class="form-group">
            <label for="grade">Grade (0-100)</label>
            <input 
              type="number" 
              id="grade" 
              v-model="grade" 
              min="0" 
              max="100" 
              required
            />
          </div>
          <div class="form-buttons">
            <button type="submit" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Grade' }}
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
import { studentApi } from '../../api/students';
import { useAuthStore } from '../../store';

const students = ref([]);
const loading = ref(false);
const error = ref('');
const user = useAuthStore().user;
const showModal = ref(false);
const modalTitle = ref('');
const currentStudent = ref(null);
const currentReportType = ref('');
const grade = ref('');

onMounted(() => {
  fetchStudents();
});

const fetchStudents = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    console.log('Teacher ID:', user.teacherId);
    console.log('Fetching teacher students list...');
    
    const response = await studentApi.getTeacherStudents(user.teacherId);
    console.log('API response:', response.data);
    
    // Modify: Use response.data directly, regardless of whether it's an array or object
    let studentData = response.data;
    
    // If it's an object and contains students array, use the students array
    if (studentData && typeof studentData === 'object' && studentData.students) {
      studentData = studentData.students;
    }
    
    // Ensure studentData is an array
    if (Array.isArray(studentData)) {
      students.value = studentData;
      console.log('Student data:', students.value);
      
      // Check assigned teacher for each student
      students.value.forEach((student, index) => {
        console.log(`Student ${index + 1}:`, {
          studentId: student.studentId,
          name: student.name,
          hasAssignedTeacher: !!student.assignedTeacher,
          assignedTeacher: student.assignedTeacher,
          progressReport: student.progressReport,
          finalReport: student.finalReport
        });
      });
    } else {
      error.value = 'Invalid data format, expected array';
    }
  } catch (err) {
    console.error('Failed to fetch student list:', err);
    error.value = 'Failed to fetch student list: ' + (err.response?.data?.message || err.message);
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

const openGradeModal = (student, reportType) => {
  currentStudent.value = student;
  currentReportType.value = reportType;
  modalTitle.value = `${student.name} - ${reportType === 'progress' ? 'Progress Report' : 'Final Report'} Grade`;
  grade.value = student[reportType + 'Report'].grade || '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentStudent.value = null;
  currentReportType.value = '';
  grade.value = '';
};

const submitGrade = async () => {
  if (!currentStudent.value || !currentReportType.value) return;
  
  loading.value = true;
  
  try {
    console.log('Submitting grade:', {
      studentId: currentStudent.value.studentId,
      reportType: currentReportType.value,
      grade: parseInt(grade.value)
    });
    
    await studentApi.updateGrade({
      studentId: currentStudent.value.studentId,
      reportType: currentReportType.value,
      grade: parseInt(grade.value)
    });
    
    // Refresh student list
    await fetchStudents();
    closeModal();
  } catch (err) {
    console.error('Failed to save grade:', err);
    error.value = 'Failed to save grade: ' + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
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
  font-weight: bold;
}

.report-status {
  min-height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.report-score {
  color: #27ae60;
  font-weight: bold;
}

.report-unsubmitted {
  color: #e74c3c;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

button.scored {
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
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* Modal styles */
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