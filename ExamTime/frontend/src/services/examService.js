import apiClient from "../config/axios.js"

export async function getExam() {
    const { data } = await apiClient.get('/exams')
    return data
}

export async function getExamByCode(code, mode = 'practice') {
    const { data } = await apiClient.get(`/exams/${code}`, {
        params: { mode },
    });
    return data;
}