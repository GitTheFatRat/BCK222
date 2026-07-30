import apiClient from '../config/axios.js';

export async function submitExam(payload) {
  const {
    examId,
    skill,
    sessionId,
    answers,
    cheatingLog,
    writingTask1Text,
    writingTask2Text,
    speakingRecordingBlob,
  } = payload;

  const formData = new FormData();
  formData.append('examId', examId);
  formData.append('skill', skill);
  formData.append('sessionId', sessionId);
  formData.append('answers', JSON.stringify(answers));
  formData.append('cheatingLog', JSON.stringify(cheatingLog));
  formData.append('writingTask1Text', writingTask1Text || '');
  formData.append('writingTask2Text', writingTask2Text || '');

  if (speakingRecordingBlob) {
    formData.append('speakingRecording', speakingRecordingBlob, 'speaking-recording.webm');
  }

  const { data } = await apiClient.post('/results/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function getMyResultHistory() {
  const { data } = await apiClient.get('/results/me');
  return data;
}

export async function getPendingResults() {
  const { data } = await apiClient.get('/results/admin/pending');
  return data;
}

export async function submitGrade(resultId, score) {
  const { data } = await apiClient.put(`/results/admin/${resultId}/grade`, { score });
  return data;
}