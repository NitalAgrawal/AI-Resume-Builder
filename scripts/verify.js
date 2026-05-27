const axios = require('axios');
require('dotenv').config({ path: '../server/.env' });

const api = axios.create({ baseURL: process.env.VITE_BASE_URL || 'http://localhost:5000' });

async function run() {
  try {
    console.log('--- Register test user ---');
    await api.post('/api/users/register', { name: 'Test User', email: 'test@example.com', password: 'Password123' }).catch(e => { if (e.response && e.response.status===400) console.log('User maybe already exists, continuing...'); else throw e; });
    console.log('--- Login test user ---');
    const loginRes = await api.post('/api/users/login', { email: 'test@example.com', password: 'Password123' });
    const token = loginRes.data.token;
    console.log('Token obtained');
    api.defaults.headers.common['Authorization'] = token;
    console.log('--- Create resume ---');
    const createRes = await api.post('/api/resumes/create', { title: 'Test Resume' });
    const resumeId = createRes.data.resume._id;
    console.log('Resume created', resumeId);
    console.log('--- Update resume (add summary) ---');
    await api.put('/api/resumes/update', { resumeId, resumeData: JSON.stringify({ professional_summary: 'Experienced developer' }) });
    console.log('Resume updated');
    console.log('--- ATS text check ---');
    const atsRes = await api.post('/api/ats/check', { resumeText: 'Experienced developer', jobDescription: 'Software Engineer' });
    console.log('ATS result', atsRes.data);
    console.log('All checks passed');
  } catch (err) {
    console.error('Verification failed', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}
run();
