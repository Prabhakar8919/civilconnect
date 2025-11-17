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
    heroTitle: 'Connect with Construction Professionals',
    heroSubtitle: 'Find architects, engineers, contractors, and more for your construction needs',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    ourServices: 'Our Services',
    whyChooseUs: 'Why Choose Us',
    trustedPlatform: 'Trusted Platform',
    verifiedProfessionals: 'Verified Professionals',
    secureTransactions: 'Secure Transactions',
    
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
    heroTitle: 'నిర్మాణ నిపుణులతో కనెక్ట్ అవ్వండి',
    heroSubtitle: 'మీ నిర్మాణ అవసరాలకు ఆర్కిటెక్ట్‌లు, ఇంజనీర్లు, కాంట్రాక్టర్లు మరియు మరిన్నింటిని కనుగొనండి',
    getStarted: 'ప్రారంభించండి',
    learnMore: 'మరింత తెలుసుకోండి',
    ourServices: 'మా సేవలు',
    whyChooseUs: 'మమ్మల్ని ఎందుకు ఎంచుకోవాలి',
    trustedPlatform: 'విశ్వసనీయ ప్లాట్‌ఫారమ్',
    verifiedProfessionals: 'ధృవీకరించబడిన నిపుణులు',
    secureTransactions: 'సురక్షిత లావాదేవీలు',
    
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
