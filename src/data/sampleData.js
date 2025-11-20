// Sample data for the CRM application
export const sampleCustomers = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@techcorp.com",
        phone: "+1 (555) 123-4567",
        company: "TechCorp Solutions",
        address: "123 Business Ave, Tech City, TC 12345",
        status: "active",
        notes: "Key decision maker for technology purchases. Prefers email communication.",
        createdAt: "2024-01-15T10:30:00.000Z"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@innovatetech.com",
        phone: "+1 (555) 987-6543",
        company: "InnovateTech",
        address: "456 Innovation Dr, Silicon Valley, SV 67890",
        status: "active",
        notes: "Interested in our premium package. Follow up next month.",
        createdAt: "2024-01-20T14:15:00.000Z"
    },
    {
        id: 3,
        name: "Michael Brown",
        email: "m.brown@globalventures.com",
        phone: "+1 (555) 456-7890",
        company: "Global Ventures Inc",
        address: "789 Corporate Blvd, Business City, BC 13579",
        status: "pending",
        notes: "Currently evaluating multiple vendors. Schedule demo next week.",
        createdAt: "2024-02-01T09:45:00.000Z"
    }
];

export const sampleLeads = [
    {
        id: 1,
        name: "Emily Davis",
        email: "emily.davis@startup123.com",
        phone: "+1 (555) 234-5678",
        company: "Startup123",
        address: "321 Entrepreneur St, Startup City, SC 24680",
        source: "website",
        status: "new",
        score: 75,
        budget: "$10,000 - $25,000",
        timeline: "short-term",
        notes: "Downloaded our whitepaper last week. High interest in our services.",
        createdAt: "2024-02-10T11:20:00.000Z"
    },
    {
        id: 2,
        name: "David Wilson",
        email: "david.w@futuretech.io",
        phone: "+1 (555) 345-6789",
        company: "FutureTech IO",
        address: "654 Future Ave, Tomorrow City, TC 35791",
        source: "referral",
        status: "contacted",
        score: 85,
        budget: "$25,000 - $50,000",
        timeline: "medium-term",
        notes: "Referred by John Smith. Very interested in our enterprise solution.",
        createdAt: "2024-02-12T16:30:00.000Z"
    },
    {
        id: 3,
        name: "Lisa Chen",
        email: "lisa.chen@webdesignpro.com",
        phone: "+1 (555) 567-8901",
        company: "WebDesign Pro",
        address: "987 Creative Way, Design City, DC 46802",
        source: "social-media",
        status: "qualified",
        score: 90,
        budget: "$5,000 - $15,000",
        timeline: "immediate",
        notes: "Ready to proceed. Waiting for final proposal.",
        createdAt: "2024-02-15T13:45:00.000Z"
    }
];

export const sampleContacts = [
    {
        id: 1,
        name: "Robert Anderson",
        email: "r.anderson@megacorp.com",
        phone: "+1 (555) 678-9012",
        company: "MegaCorp Industries",
        title: "Chief Technology Officer",
        department: "Technology",
        address: "147 Corporate Plaza, Big City, BC 57913",
        birthday: "1975-08-15",
        linkedin: "https://linkedin.com/in/robert-anderson-cto",
        notes: "Technical decision maker. Prefers detailed technical documentation.",
        createdAt: "2024-01-25T08:15:00.000Z"
    },
    {
        id: 2,
        name: "Jennifer Martinez",
        email: "j.martinez@salesforce.example",
        phone: "+1 (555) 789-0123",
        company: "SalesForce Example",
        title: "VP of Sales",
        department: "Sales",
        address: "258 Sales Street, Revenue City, RC 68024",
        birthday: "1982-03-22",
        linkedin: "https://linkedin.com/in/jennifer-martinez-vp",
        notes: "Great relationship builder. Always available for quick calls.",
        createdAt: "2024-02-05T12:30:00.000Z"
    },
    {
        id: 3,
        name: "Thomas Lee",
        email: "thomas.lee@marketinggenius.com",
        phone: "+1 (555) 890-1234",
        company: "Marketing Genius",
        title: "Marketing Director",
        department: "Marketing",
        address: "369 Marketing Mile, Brand City, BC 79135",
        birthday: "1978-11-30",
        linkedin: "https://linkedin.com/in/thomas-lee-marketing",
        notes: "Creative thinker. Loves innovative marketing solutions.",
        createdAt: "2024-02-08T15:45:00.000Z"
    }
];

// Function to initialize sample data
export const initializeSampleData = () => {
    // Only add sample data if localStorage is empty
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    }
    if (!localStorage.getItem('leads')) {
        localStorage.setItem('leads', JSON.stringify(sampleLeads));
    }
    if (!localStorage.getItem('contacts')) {
        localStorage.setItem('contacts', JSON.stringify(sampleContacts));
    }
};
