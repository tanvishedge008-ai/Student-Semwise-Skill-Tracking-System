const API_BASE_URL="http://localhost:8080/api";
// Future REST calls can replace localStorage functions in main.js.
const API_ENDPOINTS={students:`${API_BASE_URL}/students`,student:id=>`${API_BASE_URL}/students/${id}`,skills:`${API_BASE_URL}/skills`,projects:`${API_BASE_URL}/projects`,assessments:`${API_BASE_URL}/assessments`,verify:id=>`${API_BASE_URL}/evidence/${id}/verify`};
