import apiClient from "../config/axios.js"

export async function submitExam(payload) {
    const {
        examSessionId,
        answers,
        cheatingLog,
        writingTask1Text,
        writingTask2Text,
        speakingRecordingBlob,
    } = payload;
    const formData = new FormData();
    formData.append('examId', examId)
    formData.append('answer', JSON.stringify(answers))
    formData.append('cheatingLog', JSON.stringify(cheatingLog))
    formData.append('WritingTask1Text', writingTask1Text || '')
    formData.append('WritingTask2Text', writingTask2Text || '')
    if (speakingRecordingBlob) {
        formData.append('speakingRecording', speakingRecordingBlob, 'speaking-recording.webm')
    }
    const { data } = await apiClient.post('/results/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;

}

export async function getMyResultHistory() {
    const { data } = await apiClient.get('/result/me');
    return data;
}