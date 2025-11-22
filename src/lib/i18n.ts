// Internationalization (i18n) support for CivilConnect
// Supports English, Telugu, and Hindi

export type Language = 'en' | 'te' | 'hi';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    landRecords: 'Land Records',
    engineers: 'Engineers',
    architects: 'Architects',
    civilWorkers: 'Civil Workers',
    contractorsBuilders: 'Contractors & Builders',
    materialSellers: 'Material Sellers',
    aiInsights: 'AI Insights',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    dashboard: 'Dashboard',
    returnToHome: 'Return to Home',
    
    // Common
    connect: 'Connect',
    chat: 'Chat',
    chatNow: 'Chat Now',
    requestPending: 'Request Pending',
    connected: 'Connected',
    online: 'Online',
    search: 'Search',
    more: 'More',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    loading: 'Loading...',
    noData: 'No data available',
    error: 'Error',
    success: 'Success',
    
    // Profile
    editProfile: 'Edit Profile',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    city: 'City',
    state: 'State',
    bio: 'Bio',
    userType: 'User Type',
    profileImage: 'Profile Image',
    uploadImage: 'Upload Image',
    
    // Professional Details
    specialization: 'Specialization',
    experienceYears: 'Years of Experience',
    pricePerSqft: 'Price per Sq Ft',
    totalProjects: 'Total Projects',
    completedProjects: 'Completed Projects',
    skills: 'Skills',
    rating: 'Rating',
    reviews: 'Reviews',
    yearsExperience: '{count}+ years experience',
    projectsCompleted: '{count}+ projects completed',
    
    // Chat
    typeMessage: 'Type your message...',
    sendMessage: 'Send',
    attachFile: 'Attach file',
    connectionRequired: 'Connection required to send messages',
    connectionPending: 'Connection Pending',
    startConversation: 'Start the Conversation',
    noMessages: 'No messages yet',
    waitForAcceptance: 'Wait for {name} to accept your connection request to start chatting.',
    sendMessageTo: 'Send a message to {name} to get started!',
    
    // Ratings
    rateUser: 'Rate User',
    yourRating: 'Your Rating',
    writeReview: 'Write a review (optional)',
    submitRating: 'Submit Rating',
    averageRating: 'Average Rating',
    basedOnReviews: 'based on {count} reviews',
    rateExperience: 'Rate your experience with {name}',
    
    // Auth
    welcomeBack: 'Welcome back',
    createAccount: 'Create an account',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signInToContinue: 'Sign in to continue',
    joinCivilConnect: 'Join CivilConnect',
    
    // User Types
    buyer: 'Buyer',
    landOwner: 'Land Owner',
    architect: 'Architect',
    engineer: 'Engineer',
    contractor: 'Contractor',
    builder: 'Builder',
    worker: 'Civil Worker',
    materialSeller: 'Material Seller',
    
    // Dashboard
    welcomeBackUser: 'Welcome back, {name}!',
    activeConnections: 'Active Connections',
    pendingRequests: 'Pending Requests',
    sentRequests: 'Sent Requests',
    unreadNotifications: 'Unread Notifications',
    yourConnections: 'Your Connections',
    manageConnections: 'Manage your professional network and connection requests',
    messages: 'Messages',
    chatWithConnections: 'Chat with your connections',
    notifications: 'Notifications',
    stayUpdated: 'Stay updated with your activity',
    noConnectionsYet: 'No connections yet',
    exploreServices: 'Explore Services',
    noActiveChats: 'No active chats',
    selectConversation: 'Select a conversation to start chatting',
    noNotificationsYet: 'No notifications yet',
    
    // Homepage
    heroTitle: 'Professional Platform',
    heroTitle2: 'for Modern Construction',
    heroSubtitle: 'Connect with engineers, architects, contractors, civil workers, and material suppliers all in one place. Build your dream project with trusted professionals.',
    exploreServicesBtn: 'Explore Services',
    getStartedFree: 'Get Started Free',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    ourServices: 'Our Services',
    whyChooseUs: 'Why Choose Us',
    trustedPlatform: 'Trusted Platform',
    verifiedProfessionals: 'Verified Professionals',
    secureTransactions: 'Secure Transactions',
    
    // Services descriptions
    engineersDesc: 'Connect with certified civil engineers for your construction projects',
    civilWorkersDesc: 'Find skilled workers for construction and civil work',
    architectsDesc: 'Professional architects for interior and exterior design',
    contractorsBuildersDesc: 'Complete construction solutions from start to finish',
    landRecordsDesc: 'Access verified land listings and property information',
    materialSellersDesc: 'Quality construction materials from verified suppliers',
    
    // Stats
    professionals: 'Professionals',
    projectsCompleted: 'Projects Completed',
    landListings: 'Land Listings',
    averageRating: 'Average Rating',
    
    // How it works
    howItWorks: 'How It Works',
    browseServices: 'Browse Services',
    browseServicesDesc: 'Explore engineers, architects, workers, and more',
    connectStep: 'Connect',
    connectStepDesc: 'Send connection requests to professionals',
    buildStep: 'Build',
    buildStepDesc: 'Start your construction project with confidence',
    
    // Profile Pages
    professionalArchitects: 'Professional architects for interior and exterior design',
    connectWithEngineers: 'Connect with professional engineers for your construction projects',
    skilledWorkers: 'Skilled workers for construction, repairs, and civil work',
    completeConstruction: 'Complete construction solutions from start to finish',
    noArchitectsYet: 'No Architects Available Yet',
    noEngineersYet: 'No Engineers Available Yet',
    noWorkersYet: 'No Civil Workers Available Yet',
    noContractorsYet: 'No Contractors or Builders Available Yet',
    beFirstToJoin: 'Be the first to join our platform!',
    createYourProfile: 'Create Your Profile',
    
    // Forms
    enterFullName: 'Enter your full name',
    enterEmail: 'Enter your email',
    enterPhone: 'Enter your phone number',
    enterCity: 'Enter your city',
    enterState: 'Enter your state',
    tellUsAboutYourself: 'Tell us about yourself',
    selectUserType: 'Select user type',
    enterPassword: 'Enter your password',
    confirmYourPassword: 'Confirm your password',
    
    // Services Page
    exploreServicesTitle: 'Explore Services',
    exploreServicesSubtitle: 'Browse and connect with construction professionals, land owners, and material suppliers all in one place.',
    all: 'All',
    showingProfessionals: 'Showing {count} professional{plural}',
    showingLandListings: 'and {count} land listing{plural}',
    professionals: 'Professionals',
    landListings: 'Land Listings',
    noServicesAvailable: 'No Services Available',
    noProfessionalsRegistered: 'No professionals have registered yet. Be the first to join our platform!',
    noLandListingsAvailable: 'No Land Listings Available',
    noLandListingsMessage: 'No land listings are currently available. Check back later!',
    
    // Land Details
    landDetails: 'Land Details',
    chatWithOwner: 'Chat with Owner',
    propertyOwner: 'Property Owner',
    totalPrice: 'Total Price',
    area: 'Area',
    description: 'Description',
    amenities: 'Amenities',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    close: 'Close',
    
    // Chat Messages
    chatFeature: 'Chat Feature',
    chatFeatureComingSoon: 'Chat with owner feature coming soon!',
    authenticationRequired: 'Authentication Required',
    pleaseLoginToChat: 'Please login to chat with the owner.',
    cannotChat: 'Cannot Chat',
    cannotChatWithYourself: 'You cannot chat with yourself.',
    chatStarted: 'Chat Started',
    canNowChatWithOwner: 'You can now chat with the land owner.',
    failedToStartChat: 'Failed to start chat. Please try again.',
    
    // Chatbot
    chatbotGreeting: "Hello! I'm your CivilConnect Assistant. I'm here to help you navigate and use the CivilConnect platform. How can I assist you today?",
    chatbotWelcome: "Hello! 👋 Welcome to CivilConnect. I'm your assistant here to help you with anything related to our platform. What would you like to know?",
    chatbotThankYou: "You're welcome! 😊 Feel free to ask if you need anything else about CivilConnect.",
    chatbotAskAnything: "I'd love to help! Could you please tell me more about what you're looking for?",
    howCanIHelp: "💬 Ask me anything about CivilConnect - I'm here to help!",
    readyToHelp: "Online • Ready to help",
    replyPlaceholder: "Reply ...",
  },
  
  te: {
    // Navigation (Telugu)
    home: 'హోమ్',
    landRecords: 'భూమి రికార్డులు',
    engineers: 'ఇంజనీర్లు',
    architects: 'ఆర్కిటెక్ట్స్',
    civilWorkers: 'సివిల్ వర్కర్స్',
    contractorsBuilders: 'కాంట్రాక్టర్లు & బిల్డర్లు',
    materialSellers: 'మెటీరియల్ విక్రేతలు',
    aiInsights: 'AI ఇన్‌సైట్స్',
    contact: 'సంప్రదించండి',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    logout: 'లాగౌట్',
    dashboard: 'డాష్‌బోర్డ్',
    returnToHome: 'హోమ్‌కు తిరిగి వెళ్ళండి',
    
    // Common
    connect: 'కనెక్ట్',
    chat: 'చాట్',
    chatNow: 'ఇప్పుడు చాట్ చేయండి',
    requestPending: 'అభ్యర్థన పెండింగ్‌లో ఉంది',
    connected: 'కనెక్ట్ అయింది',
    online: 'ఆన్‌లైన్',
    search: 'వెతకండి',
    more: 'మరిన్ని',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    view: 'చూడండి',
    loading: 'లోడ్ అవుతోంది...',
    noData: 'డేటా అందుబాటులో లేదు',
    error: 'లోపం',
    success: 'విజయం',
    
    // Profile
    editProfile: 'ప్రొఫైల్ సవరించండి',
    fullName: 'పూర్తి పేరు',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్',
    city: 'నగరం',
    state: 'రాష్ట్రం',
    bio: 'బయో',
    userType: 'వినియోగదారు రకం',
    profileImage: 'ప్రొఫైల్ చిత్రం',
    uploadImage: 'చిత్రాన్ని అప్‌లోడ్ చేయండి',
    
    // Professional Details
    specialization: 'స్పెషలైజేషన్',
    experienceYears: 'అనుభవ సంవత్సరాలు',
    pricePerSqft: 'చదరపు అడుగుకు ధర',
    totalProjects: 'మొత్తం ప్రాజెక్ట్‌లు',
    completedProjects: 'పూర్తయిన ప్రాజెక్ట్‌లు',
    skills: 'నైపుణ్యాలు',
    rating: 'రేటింగ్',
    reviews: 'సమీక్షలు',
    yearsExperience: '{count}+ సంవత్సరాల అనుభవం',
    projectsCompleted: '{count}+ ప్రాజెక్ట్‌లు పూర్తయ్యాయి',
    
    // Chat
    typeMessage: 'మీ సందేశాన్ని టైప్ చేయండి...',
    sendMessage: 'పంపండి',
    attachFile: 'ఫైల్ జోడించండి',
    connectionRequired: 'సందేశాలు పంపడానికి కనెక్షన్ అవసరం',
    connectionPending: 'కనెక్షన్ పెండింగ్‌లో ఉంది',
    startConversation: 'సంభాషణ ప్రారంభించండి',
    noMessages: 'ఇంకా సందేశాలు లేవు',
    waitForAcceptance: '{name} మీ కనెక్షన్ అభ్యర్థనను అంగీకరించడానికి వేచి ఉండండి.',
    sendMessageTo: 'ప్రారంభించడానికి {name}కి సందేశం పంపండి!',
    
    // Ratings
    rateUser: 'వినియోగదారుని రేట్ చేయండి',
    yourRating: 'మీ రేటింగ్',
    writeReview: 'సమీక్ష రాయండి (ఐచ్ఛికం)',
    submitRating: 'రేటింగ్ సమర్పించండి',
    averageRating: 'సగటు రేటింగ్',
    basedOnReviews: '{count} సమీక్షల ఆధారంగా',
    rateExperience: '{name}తో మీ అనుభవాన్ని రేట్ చేయండి',
    
    // Auth
    welcomeBack: 'తిరిగి స్వాగతం',
    createAccount: 'ఖాతా సృష్టించండి',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    dontHaveAccount: 'ఖాతా లేదా?',
    signInToContinue: 'కొనసాగించడానికి సైన్ ఇన్ చేయండి',
    joinCivilConnect: 'CivilConnect లో చేరండి',
    
    // User Types
    buyer: 'కొనుగోలుదారు',
    landOwner: 'భూ యజమాని',
    architect: 'ఆర్కిటెక్ట్',
    engineer: 'ఇంజనీర్',
    contractor: 'కాంట్రాక్టర్',
    builder: 'బిల్డర్',
    worker: 'సివిల్ వర్కర్',
    materialSeller: 'మెటీరియల్ విక్రేత',
    
    // Dashboard
    welcomeBackUser: 'తిరిగి స్వాగతం, {name}!',
    activeConnections: 'యాక్టివ్ కనెక్షన్లు',
    pendingRequests: 'పెండింగ్ అభ్యర్థనలు',
    sentRequests: 'పంపిన అభ్యర్థనలు',
    unreadNotifications: 'చదవని నోటిఫికేషన్లు',
    yourConnections: 'మీ కనెక్షన్లు',
    manageConnections: 'మీ ప్రొఫెషనల్ నెట్‌వర్క్ మరియు కనెక్షన్ అభ్యర్థనలను నిర్వహించండి',
    messages: 'సందేశాలు',
    chatWithConnections: 'మీ కనెక్షన్లతో చాట్ చేయండి',
    notifications: 'నోటిఫికేషన్లు',
    stayUpdated: 'మీ కార్యకలాపాలతో అప్‌డేట్‌గా ఉండండి',
    noConnectionsYet: 'ఇంకా కనెక్షన్లు లేవు',
    exploreServices: 'సేవలను అన్వేషించండి',
    noActiveChats: 'యాక్టివ్ చాట్‌లు లేవు',
    selectConversation: 'చాట్ చేయడం ప్రారంభించడానికి సంభాషణను ఎంచుకోండి',
    noNotificationsYet: 'ఇంకా నోటిఫికేషన్లు లేవు',
    
    // Homepage
    heroTitle: 'ప్రొఫెషనల్ ప్లాట్‌ఫారమ్',
    heroTitle2: 'ఆధునిక నిర్మాణం కోసం',
    heroSubtitle: 'ఇంజనీర్లు, ఆర్కిటెక్ట్‌లు, కాంట్రాక్టర్లు, సివిల్ వర్కర్లు మరియు మెటీరియల్ సరఫరాదారులతో ఒకే చోట కనెక్ట్ అవ్వండి. విశ్వసనీయ నిపుణులతో మీ కల ప్రాజెక్ట్‌ను నిర్మించండి.',
    exploreServicesBtn: 'సేవలను అన్వేషించండి',
    getStartedFree: 'ఉచితంగా ప్రారంభించండి',
    getStarted: 'ప్రారంభించండి',
    learnMore: 'మరింత తెలుసుకోండి',
    ourServices: 'మా సేవలు',
    whyChooseUs: 'మమ్మల్ని ఎందుకు ఎంచుకోవాలి',
    trustedPlatform: 'విశ్వసనీయ ప్లాట్‌ఫారమ్',
    verifiedProfessionals: 'ధృవీకరించబడిన నిపుణులు',
    secureTransactions: 'సురక్షిత లావాదేవీలు',
    
    // Services descriptions
    engineersDesc: 'మీ నిర్మాణ ప్రాజెక్ట్‌ల కోసం ధృవీకరించబడిన సివిల్ ఇంజనీర్లతో కనెక్ట్ అవ్వండి',
    civilWorkersDesc: 'నిర్మాణం మరియు సివిల్ పని కోసం నైపుణ్యం కలిగిన కార్మికులను కనుగొనండి',
    architectsDesc: 'ఇంటీరియర్ మరియు ఎక్స్‌టీరియర్ డిజైన్ కోసం ప్రొఫెషనల్ ఆర్కిటెక్ట్‌లు',
    contractorsBuildersDesc: 'ప్రారంభం నుండి ముగింపు వరకు పూర్తి నిర్మాణ పరిష్కారాలు',
    landRecordsDesc: 'ధృవీకరించబడిన భూమి లిస్టింగ్‌లు మరియు ఆస్తి సమాచారాన్ని యాక్సెస్ చేయండి',
    materialSellersDesc: 'ధృవీకరించబడిన సరఫరాదారుల నుండి నాణ్యమైన నిర్మాణ సామగ్రి',
    
    // Stats
    professionals: 'ప్రొఫెషనల్స్',
    projectsCompleted: 'పూర్తయిన ప్రాజెక్ట్‌లు',
    landListings: 'భూమి లిస్టింగ్‌లు',
    averageRating: 'సగటు రేటింగ్',
    
    // How it works
    howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    browseServices: 'సేవలను బ్రౌజ్ చేయండి',
    browseServicesDesc: 'ఇంజనీర్లు, ఆర్కిటెక్ట్‌లు, వర్కర్లు మరియు మరిన్నింటిని అన్వేషించండి',
    connectStep: 'కనెక్ట్',
    connectStepDesc: 'ప్రొఫెషనల్స్‌కు కనెక్షన్ అభ్యర్థనలు పంపండి',
    buildStep: 'నిర్మించండి',
    buildStepDesc: 'విశ్వాసంతో మీ నిర్మాణ ప్రాజెక్ట్‌ను ప్రారంభించండి',
    
    // Profile Pages
    professionalArchitects: 'ఇంటీరియర్ మరియు ఎక్స్‌టీరియర్ డిజైన్ కోసం ప్రొఫెషనల్ ఆర్కిటెక్ట్‌లు',
    connectWithEngineers: 'మీ నిర్మాణ ప్రాజెక్ట్‌ల కోసం ప్రొఫెషనల్ ఇంజనీర్లతో కనెక్ట్ అవ్వండి',
    skilledWorkers: 'నిర్మాణం, మరమ్మతులు మరియు సివిల్ పని కోసం నైపుణ్యం కలిగిన కార్మికులు',
    completeConstruction: 'ప్రారంభం నుండి ముగింపు వరకు పూర్తి నిర్మాణ పరిష్కారాలు',
    noArchitectsYet: 'ఇంకా ఆర్కిటెక్ట్‌లు అందుబాటులో లేరు',
    noEngineersYet: 'ఇంకా ఇంజనీర్లు అందుబాటులో లేరు',
    noWorkersYet: 'ఇంకా సివిల్ వర్కర్లు అందుబాటులో లేరు',
    noContractorsYet: 'ఇంకా కాంట్రాక్టర్లు లేదా బిల్డర్లు అందుబాటులో లేరు',
    beFirstToJoin: 'మా ప్లాట్‌ఫారమ్‌లో చేరిన మొదటి వ్యక్తి అవ్వండి!',
    createYourProfile: 'మీ ప్రొఫైల్‌ను సృష్టించండి',
    
    // Forms
    enterFullName: 'మీ పూర్తి పేరును నమోదు చేయండి',
    enterEmail: 'మీ ఇమెయిల్‌ను నమోదు చేయండి',
    enterPhone: 'మీ ఫోన్ నంబర్‌ను నమోదు చేయండి',
    enterCity: 'మీ నగరాన్ని నమోదు చేయండి',
    enterState: 'మీ రాష్ట్రాన్ని నమోదు చేయండి',
    tellUsAboutYourself: 'మీ గురించి మాకు చెప్పండి',
    selectUserType: 'వినియోగదారు రకాన్ని ఎంచుకోండి',
    enterPassword: 'మీ పాస్‌వర్డ్‌ను నమోదు చేయండి',
    confirmYourPassword: 'మీ పాస్‌వర్డ్‌ను నిర్ధారించండి',
    
    // Services Page
    exploreServicesTitle: 'సేవలను అన్వేషించండి',
    exploreServicesSubtitle: 'నిర్మాణ నిపుణులు, భూ యజమానులు మరియు మెటీరియల్ సరఫరాదారులతో బ్రౌజ్ చేయండి మరియు కనెక్ట్ అవ్వండి.',
    all: 'అన్నీ',
    showingProfessionals: '{count} ప్రొఫెషనల్{plural} చూపిస్తోంది',
    showingLandListings: 'మరియు {count} భూమి లిస్టింగ్{plural}',
    professionals: 'ప్రొఫెషనల్స్',
    landListings: 'భూమి లిస్టింగ్‌లు',
    noServicesAvailable: 'సేవలు అందుబాటులో లేవు',
    noProfessionalsRegistered: 'ఇంకా ప్రొఫెషనల్స్ నమోదు కాలేదు. మా ప్లాట్‌ఫారమ్‌లో చేరిన మొదటి వ్యక్తి అవ్వండి!',
    noLandListingsAvailable: 'భూమి లిస్టింగ్‌లు అందుబాటులో లేవు',
    noLandListingsMessage: 'ప్రస్తుతం భూమి లిస్టింగ్‌లు అందుబాటులో లేవు. తర్వాత తనిఖీ చేయండి!',
    
    // Land Details
    landDetails: 'భూమి వివరాలు',
    chatWithOwner: 'యజమానితో చాట్ చేయండి',
    propertyOwner: 'ఆస్తి యజమాని',
    totalPrice: 'మొత్తం ధర',
    area: 'విస్తీర్ణం',
    description: 'వివరణ',
    amenities: 'సౌకర్యాలు',
    status: 'స్థితి',
    active: 'యాక్టివ్',
    inactive: 'ఇనాక్టివ్',
    close: 'మూసివేయండి',
    
    // Chat Messages
    chatFeature: 'చాట్ ఫీచర్',
    chatFeatureComingSoon: 'యజమానితో చాట్ ఫీచర్ త్వరలో వస్తుంది!',
    authenticationRequired: 'ప్రామాణీకరణ అవసరం',
    pleaseLoginToChat: 'యజమానితో చాట్ చేయడానికి దయచేసి లాగిన్ అవ్వండి.',
    cannotChat: 'చాట్ చేయలేరు',
    cannotChatWithYourself: 'మీరు మీతో చాట్ చేయలేరు.',
    chatStarted: 'చాట్ ప్రారంభమైంది',
    canNowChatWithOwner: 'మీరు ఇప్పుడు భూమి యజమానితో చాట్ చేయవచ్చు.',
    failedToStartChat: 'చాట్ ప్రారంభించడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    
    // Chatbot
    chatbotGreeting: "నమస్కారం! నేను మీ CivilConnect అసిస్టెంట్. CivilConnect ప్లాట్‌ఫారమ్‌ను నావిగేట్ చేయడానికి మరియు ఉపయోగించడానికి నేను ఇక్కడ ఉన్నాను. నేను మీకు ఎలా సహాయం చేయగలను?",
    chatbotWelcome: "నమస్కారం! 👋 CivilConnect కు స్వాగతం. మా ప్లాట్‌ఫారమ్‌కు సంబంధించిన ఏదైనా విషయంలో మీకు సహాయం చేయడానికి నేను మీ అసిస్టెంట్. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
    chatbotThankYou: "మీకు స్వాగతం! 😊 CivilConnect గురించి మీకు ఇంకా ఏదైనా అవసరమైతే అడగడానికి సంకోచించకండి.",
    chatbotAskAnything: "నేను సహాయం చేయాలనుకుంటున్నాను! మీరు ఏమి వెతుకుతున్నారో దయచేసి మరింత చెప్పగలరా?",
    howCanIHelp: "💬 CivilConnect గురించి ఏదైనా అడగండి - నేను సహాయం చేయడానికి ఇక్కడ ఉన్నాను!",
    readyToHelp: "ఆన్‌లైన్ • సహాయం చేయడానికి సిద్ధంగా ఉంది",
    replyPlaceholder: "ప్రత్యుత్తరం ...",
  },
  
  hi: {
    // Navigation (Hindi)
    home: 'होम',
    landRecords: 'भूमि रिकॉर्ड',
    engineers: 'इंजीनियर',
    architects: 'आर्किटेक्ट',
    civilWorkers: 'सिविल वर्कर',
    contractorsBuilders: 'ठेकेदार और बिल्डर',
    materialSellers: 'सामग्री विक्रेता',
    aiInsights: 'AI इनसाइट्स',
    contact: 'संपर्क करें',
    login: 'लॉगिन',
    signup: 'साइन अप',
    logout: 'लॉगआउट',
    dashboard: 'डैशबोर्ड',
    
    // Common
    connect: 'कनेक्ट',
    chat: 'चैट',
    chatNow: 'अभी चैट करें',
    requestPending: 'अनुरोध लंबित',
    connected: 'कनेक्टेड',
    online: 'ऑनलाइन',
    search: 'खोजें',
    more: 'और',
    
    // Profile
    editProfile: 'प्रोफ़ाइल संपादित करें',
    fullName: 'पूरा नाम',
    email: 'ईमेल',
    phone: 'फोन',
    city: 'शहर',
    state: 'राज्य',
    bio: 'बायो',
    userType: 'उपयोगकर्ता प्रकार',
    
    // Professional Details
    specialization: 'विशेषज्ञता',
    experienceYears: 'अनुभव के वर्ष',
    pricePerSqft: 'प्रति वर्ग फुट मूल्य',
    totalProjects: 'कुल परियोजनाएं',
    skills: 'कौशल',
    rating: 'रेटिंग',
    reviews: 'समीक्षाएं',
    
    // Chat
    typeMessage: 'अपना संदेश टाइप करें...',
    sendMessage: 'भेजें',
    attachFile: 'फ़ाइल संलग्न करें',
    connectionRequired: 'संदेश भेजने के लिए कनेक्शन आवश्यक है',
    connectionPending: 'कनेक्शन लंबित',
    startConversation: 'बातचीत शुरू करें',
    
    // Ratings
    rateUser: 'उपयोगकर्ता को रेट करें',
    yourRating: 'आपकी रेटिंग',
    writeReview: 'समीक्षा लिखें (वैकल्पिक)',
    submitRating: 'रेटिंग सबमिट करें',
    averageRating: 'औसत रेटिंग',
    basedOnReviews: '{count} समीक्षाओं के आधार पर',
    
    // Auth
    welcomeBack: 'वापसी पर स्वागत है',
    createAccount: 'खाता बनाएं',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    alreadyHaveAccount: 'पहले से खाता है?',
    dontHaveAccount: 'खाता नहीं है?',
    
    // User Types
    buyer: 'खरीदार',
    landOwner: 'भूमि मालिक',
    architect: 'आर्किटेक्ट',
    engineer: 'इंजीनियर',
    contractor: 'ठेकेदार',
    builder: 'बिल्डर',
    worker: 'सिविल वर्कर',
    materialSeller: 'सामग्री विक्रेता',
    
    // Dashboard
    welcomeBackUser: 'वापसी पर स्वागत है, {name}!',
    activeConnections: 'सक्रिय कनेक्शन',
    pendingRequests: 'लंबित अनुरोध',
    sentRequests: 'भेजे गए अनुरोध',
    unreadNotifications: 'अपठित सूचनाएं',
    yourConnections: 'आपके कनेक्शन',
    manageConnections: 'अपने पेशेवर नेटवर्क और कनेक्शन अनुरोधों का प्रबंधन करें',
    messages: 'संदेश',
    chatWithConnections: 'अपने कनेक्शन के साथ चैट करें',
    notifications: 'सूचनाएं',
    stayUpdated: 'अपनी गतिविधि के साथ अपडेट रहें',
    noConnectionsYet: 'अभी तक कोई कनेक्शन नहीं',
    exploreServices: 'सेवाएं एक्सप्लोर करें',
    noActiveChats: 'कोई सक्रिय चैट नहीं',
    selectConversation: 'चैट शुरू करने के लिए एक बातचीत चुनें',
    noNotificationsYet: 'अभी तक कोई सूचना नहीं',
    
    // Homepage
    heroTitle: 'पेशेवर प्लेटफ़ॉर्म',
    heroTitle2: 'आधुनिक निर्माण के लिए',
    heroSubtitle: 'इंजीनियरों, आर्किटेक्ट्स, ठेकेदारों, सिविल वर्कर्स और सामग्री आपूर्तिकर्ताओं से एक ही स्थान पर जुड़ें। विश्वसनीय पेशेवरों के साथ अपनी सपनों की परियोजना बनाएं।',
    exploreServicesBtn: 'सेवाएं एक्सप्लोर करें',
    getStartedFree: 'मुफ्त में शुरू करें',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    ourServices: 'हमारी सेवाएं',
    whyChooseUs: 'हमें क्यों चुनें',
    trustedPlatform: 'विश्वसनीय प्लेटफ़ॉर्म',
    verifiedProfessionals: 'सत्यापित पेशेवर',
    secureTransactions: 'सुरक्षित लेनदेन',
    
    // Services descriptions
    engineersDesc: 'अपनी निर्माण परियोजनाओं के लिए प्रमाणित सिविल इंजीनियरों से जुड़ें',
    civilWorkersDesc: 'निर्माण और सिविल कार्य के लिए कुशल कार्यकर्ता खोजें',
    architectsDesc: 'इंटीरियर और एक्सटीरियर डिज़ाइन के लिए पेशेवर आर्किटेक्ट',
    contractorsBuildersDesc: 'शुरू से अंत तक पूर्ण निर्माण समाधान',
    landRecordsDesc: 'सत्यापित भूमि लिस्टिंग और संपत्ति जानकारी तक पहुंचें',
    materialSellersDesc: 'सत्यापित आपूर्तिकर्ताओं से गुणवत्ता निर्माण सामग्री',
    
    // Stats
    professionals: 'पेशेवर',
    projectsCompleted: 'पूर्ण परियोजनाएं',
    landListings: 'भूमि लिस्टिंग',
    averageRating: 'औसत रेटिंग',
    
    // How it works
    howItWorks: 'यह कैसे काम करता है',
    browseServices: 'सेवाएं ब्राउज़ करें',
    browseServicesDesc: 'इंजीनियरों, आर्किटेक्ट्स, वर्कर्स और अधिक का अन्वेषण करें',
    connectStep: 'कनेक्ट करें',
    connectStepDesc: 'पेशेवरों को कनेक्शन अनुरोध भेजें',
    buildStep: 'निर्माण करें',
    buildStepDesc: 'आत्मविश्वास के साथ अपनी निर्माण परियोजना शुरू करें',
    
    // Forms
    enterFullName: 'अपना पूरा नाम दर्ज करें',
    enterEmail: 'अपना ईमेल दर्ज करें',
    enterPhone: 'अपना फोन नंबर दर्ज करें',
    enterCity: 'अपना शहर दर्ज करें',
    enterState: 'अपना राज्य दर्ज करें',
    tellUsAboutYourself: 'अपने बारे में बताएं',
    selectUserType: 'उपयोगकर्ता प्रकार चुनें',
    enterPassword: 'अपना पासवर्ड दर्ज करें',
    confirmYourPassword: 'अपने पासवर्ड की पुष्टि करें',
    
    // Services Page
    exploreServicesTitle: 'सेवाएं एक्सप्लोर करें',
    exploreServicesSubtitle: 'निर्माण पेशेवरों, भूमि मालिकों और सामग्री आपूर्तिकर्ताओं के साथ ब्राउज़ करें और कनेक्ट करें।',
    all: 'सभी',
    showingProfessionals: '{count} पेशेवर{plural} दिखा रहे हैं',
    showingLandListings: 'और {count} भूमि लिस्टिंग{plural}',
    professionals: 'पेशेवर',
    landListings: 'भूमि लिस्टिंग',
    noServicesAvailable: 'कोई सेवा उपलब्ध नहीं',
    noProfessionalsRegistered: 'अभी तक कोई पेशेवर पंजीकृत नहीं हुआ है। हमारे प्लेटफ़ॉर्म में शामिल होने वाले पहले व्यक्ति बनें!',
    noLandListingsAvailable: 'कोई भूमि लिस्टिंग उपलब्ध नहीं',
    noLandListingsMessage: 'वर्तमान में कोई भूमि लिस्टिंग उपलब्ध नहीं है। बाद में जांचें!',
    
    // Land Details
    landDetails: 'भूमि विवरण',
    chatWithOwner: 'मालिक से चैट करें',
    propertyOwner: 'संपत्ति मालिक',
    totalPrice: 'कुल मूल्य',
    area: 'क्षेत्रफल',
    description: 'विवरण',
    amenities: 'सुविधाएं',
    status: 'स्थिति',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    close: 'बंद करें',
    
    // Chat Messages
    chatFeature: 'चैट सुविधा',
    chatFeatureComingSoon: 'मालिक के साथ चैट सुविधा जल्द आ रही है!',
    authenticationRequired: 'प्रमाणीकरण आवश्यक',
    pleaseLoginToChat: 'मालिक के साथ चैट करने के लिए कृपया लॉगिन करें।',
    cannotChat: 'चैट नहीं कर सकते',
    cannotChatWithYourself: 'आप अपने आप से चैट नहीं कर सकते।',
    chatStarted: 'चैट शुरू हुई',
    canNowChatWithOwner: 'अब आप भूमि मालिक के साथ चैट कर सकते हैं।',
    failedToStartChat: 'चैट शुरू करने में विफल। कृपया पुनः प्रयास करें।',
    
    // Chatbot
    chatbotGreeting: "नमस्ते! मैं आपका CivilConnect सहायक हूं। मैं CivilConnect प्लेटफ़ॉर्म को नेविगेट करने और उपयोग करने में आपकी मदद करने के लिए यहां हूं। मैं आपकी कैसे सहायता कर सकता हूं?",
    chatbotWelcome: "नमस्ते! 👋 CivilConnect में आपका स्वागत है। मैं आपका सहायक हूं और हमारे प्लेटफ़ॉर्म से संबंधित किसी भी चीज़ में आपकी मदद करने के लिए यहां हूं। आप क्या जानना चाहेंगे?",
    chatbotThankYou: "आपका स्वागत है! 😊 यदि आपको CivilConnect के बारे में कुछ और चाहिए तो बेझिझक पूछें।",
    chatbotAskAnything: "मैं मदद करना चाहूंगा! क्या आप कृपया मुझे बता सकते हैं कि आप क्या खोज रहे हैं?",
    howCanIHelp: "💬 CivilConnect के बारे में कुछ भी पूछें - मैं मदद करने के लिए यहां हूं!",
    readyToHelp: "ऑनलाइन • मदद के लिए तैयार",
    replyPlaceholder: "जवाब दें ...",
  },
};

// Get translation
export const t = (key: string, lang: Language = 'en', params?: Record<string, any>): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Replace parameters
  if (params) {
    Object.keys(params).forEach(param => {
      value = value.replace(`{${param}}`, params[param]);
    });
  }
  
  return value;
};

// Language storage
const LANGUAGE_KEY = 'civilconnect_language';

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem(LANGUAGE_KEY) as Language) || 'en';
};

export const setStoredLanguage = (lang: Language): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANGUAGE_KEY, lang);
};
