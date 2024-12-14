// Sample data for all letter types
export const mockLetters = [
  {
    id: "LTR001",
    dateRequested: "2024-01-15 09:30 AM",
    letterType: "Communication Letter (In Campus)",
    nameOfTransaction: "Event Announcement",
    requestedBy: "Computer Society",
    transactionStatus: "For Evaluation",
    lastUpdatingDate: "2024-01-15 09:30 AM",
    content: {
      date: "January 15, 2024",
      letterContent: "Dear Rev. Fr. Jessie P. Pasquin, DCC,\n\nI am writing to request permission to conduct our annual Tech Summit event at the College Auditorium. The event will showcase the latest technological innovations and provide hands-on workshops for our students.\n\nWe believe this event will greatly benefit our students by exposing them to current industry trends and practices.\n\nThank you for your consideration.\n\nRespectfully yours,"
    }
  },
  {
    id: "LTR002",
    dateRequested: "2024-01-14 02:15 PM",
    letterType: "Communication Letter (Off Campus)",
    nameOfTransaction: "Industry Visit Request",
    requestedBy: "Engineering Society",
    transactionStatus: "For Evaluation",
    lastUpdatingDate: "2024-01-14 02:15 PM",
    content: {
      date: "January 14, 2024",
      letterContent: "Dear Rev. Fr. Daryll Dhan L. Bilbao, DCC,\n\nThe Engineering Society would like to request permission for an industry visit to Tech Solutions Inc. This visit aims to provide our students with practical exposure to industrial processes and professional work environments.\n\nThe company has agreed to host our students and provide a comprehensive tour of their facilities.\n\nThank you for your consideration.\n\nRespectfully yours,"
    }
  },
  {
    id: "LTR003",
    dateRequested: "2024-01-13 11:20 AM",
    letterType: "Implementation Letter (In Campus)",
    nameOfTransaction: "Technical Workshop Series",
    requestedBy: "IEEE Student Branch",
    transactionStatus: "For Evaluation",
    lastUpdatingDate: "2024-01-13 11:20 AM",
    content: {
      organizationName: "IEEE Student Branch",
      activityName: "Technical Workshop Series",
      semester: "1st Semester, A.Y. 2024-2025",
      title: "Advanced Programming Workshop",
      dateTime: "January 20, 2024 2:00 PM",
      venue: "Computer Laboratory 1",
      participants: "BSCS Students",
      rationale: "• To enhance programming skills of BSCS students\n• To provide hands-on experience with industry-standard tools\n• To prepare students for future career opportunities",
      objectives: "• Improve coding practices and standards\n• Learn new programming technologies\n• Develop problem-solving skills\n• Create practical applications",
      sourcesOfFund: "• Organization funds - ₱5,000\n• Registration fees - ₱3,000\n• Department allocation - ₱2,000",
      projectedExpenses: "• Materials and handouts - ₱3,000\n• Refreshments - ₱2,000\n• Certificates - ₱1,000\n• Workshop materials - ₱4,000",
      expectedOutput: "• Skilled participants in advanced programming\n• Project outputs and documentation\n• Certificates of completion\n• Workshop documentation"
    }
  },
  {
    id: "LTR004",
    dateRequested: "2024-01-12 03:45 PM",
    letterType: "Implementation Letter (Off Campus)",
    nameOfTransaction: "Community Outreach Program",
    requestedBy: "Community Service Club",
    transactionStatus: "For Evaluation",
    lastUpdatingDate: "2024-01-12 03:45 PM",
    content: {
      activityTitle: "Digital Literacy for Senior Citizens",
      rationale: "• To bridge the digital divide in our community\n• To help senior citizens adapt to modern technology\n• To promote intergenerational learning",
      targetGroup: "• Senior citizens from Barangay San Lorenzo\n• Age group: 60 years old and above\n• Limited or no experience with digital devices",
      implementationDate: "January 25, 2024 at Barangay San Lorenzo Community Center",
      activities: [
        {
          activity: "Basic Computer Operations",
          objective: "Teach fundamental computer skills",
          output: "Participants can operate basic computer functions",
          committee: "Technical Team"
        },
        {
          activity: "Internet Safety Workshop",
          objective: "Educate about online security",
          output: "Understanding of safe internet practices",
          committee: "Security Team"
        },
        {
          activity: "Social Media Training",
          objective: "Introduce social media platforms",
          output: "Ability to use basic social media features",
          committee: "Communications Team"
        }
      ],
      programFlow: "8:00 AM - Registration\n9:00 AM - Opening Ceremony\n10:00 AM - Workshop Session 1\n12:00 PM - Lunch Break\n1:00 PM - Workshop Session 2\n3:00 PM - Closing Ceremony"
    }
  },
  {
    id: "LTR005",
    dateRequested: "2024-01-11 10:30 AM",
    letterType: "Budget Proposal",
    nameOfTransaction: "Annual Technology Fair",
    requestedBy: "Technology Club",
    transactionStatus: "For Evaluation",
    lastUpdatingDate: "2024-01-11 10:30 AM",
    content: {
      activityName: "Annual Technology Fair 2024",
      date: "February 15, 2024",
      venue: "College Gymnasium",
      sourceOfFund: "Student Organization Fund",
      amountAllotted: "25000",
      expenses: [
        { item: "Venue Setup and Decoration", amount: "5000" },
        { item: "Technical Equipment Rental", amount: "8000" },
        { item: "Promotional Materials", amount: "3000" },
        { item: "Refreshments", amount: "4000" },
        { item: "Certificates and Materials", amount: "2000" },
        { item: "Honorarium for Speakers", amount: "3000" }
      ]
    }
  }
];