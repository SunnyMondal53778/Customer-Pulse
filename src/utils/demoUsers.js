// Initialize demo users for testing
export const initializeDemoUsers = () => {
    const existingUsers = localStorage.getItem('users');

    if (!existingUsers) {
        const demoUsers = [
            {
                id: '1',
                name: 'John Doe',
                email: 'demo@customerpulse.com',
                password: 'demo123',
                company: 'Tech Solutions Inc.',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                company: 'Marketing Pro',
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('users', JSON.stringify(demoUsers));
        console.log('Demo users initialized! Use demo@customerpulse.com / demo123 to login');
    }
};
