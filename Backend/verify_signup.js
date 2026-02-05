import http from 'http';

const uniqueId = Date.now();
const userEmail = `testuser_${uniqueId}@example.com`;
const userPassword = 'Password123!';

const signupPayload = JSON.stringify({
    name: 'Test User',
    email: userEmail,
    password: userPassword,
    confirmPassword: userPassword
});

const loginPayload = JSON.stringify({
    email: userEmail,
    password: userPassword
});

function makeRequest(options, payload) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data ? JSON.parse(data) : {}
                });
            });
        });

        req.on('error', reject);

        if (payload) {
            req.write(payload);
        }
        req.end();
    });
}

async function runTests() {
    console.log('--- Starting Auth Flow Verification ---');

    try {
        // 1. Signup
        console.log(`\n1. Attempting Signup (${userEmail})...`);
        const signupRes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': signupPayload.length
            }
        }, signupPayload);
        console.log('Signup Status:', signupRes.statusCode);
        console.log('Signup Body:', signupRes.body);

        // 2. Login
        console.log(`\n2. Attempting Login...`);
        const loginRes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginPayload.length
            }
        }, loginPayload);
        console.log('Login Status:', loginRes.statusCode);

        if (loginRes.statusCode !== 200) {
            throw new Error('Login failed');
        }

        const accessToken = loginRes.body.accessToken;
        console.log('Access Token received:', !!accessToken);

        // 3. Protected Route
        console.log(`\n3. Accessing Protected Route (/api/pet/pets)...`);
        const protectedRes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/pet/pets',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log('Protected Route Status:', protectedRes.statusCode);
        console.log('Protected Route Body:', protectedRes.body);

        if (protectedRes.statusCode === 200) {
            console.log('\nSUCCESS: Full auth flow verification passed!');
        } else {
            console.error('\nFAILURE: Protected route access failed.');
        }

        // 4. Training (Public/Protected?)
        console.log(`\n4. Accessing Training Courses (/api/training/courses)...`);
        const trainingRes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/training/courses',
            method: 'GET'
        });
        console.log('Training Route Status:', trainingRes.statusCode);
        // console.log('Training Route Body:', trainingRes.body);

        if (trainingRes.statusCode === 200 && trainingRes.body.success && trainingRes.body.trainingPrograms.length > 0) {
            const programId = trainingRes.body.trainingPrograms[0].id;
            const price = trainingRes.body.trainingPrograms[0].price;
            console.log(`\n5. Attempting to Create Payment for Program: ${programId} (${price})...`);

            const paymentRes = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: '/api/payment/create-payment',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }, JSON.stringify({
                trainingProgramId: programId,
                price: price
            }));
            console.log('Payment Creation Status:', paymentRes.statusCode);
            console.log('Payment Creation Body:', paymentRes.body);
        } else {
            console.log('Skipping payment test: No training programs found.');
        }

    } catch (error) {
        console.error('\nTest Error:', error);
    }
}

runTests();
