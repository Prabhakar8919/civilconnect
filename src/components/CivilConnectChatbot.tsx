import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Smile, Image as ImageIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const CIVILCONNECT_KNOWLEDGE = {
  greeting: "Hello! I'm your CivilConnect Assistant. I'm here to help you navigate and use the CivilConnect platform. How can I assist you today?",
  
  features: {
    registration: "To create a profile on CivilConnect:\n1. Click 'Sign Up' in the navigation bar\n2. Choose your role (Engineer, Architect, Civil Worker, Contractor, Builder, Land Owner, or Material Seller)\n3. Fill in your details including name, location, and experience\n4. Complete your professional profile\n5. Start connecting with others!",
    
    roles: "CivilConnect supports multiple roles:\n• Engineers - Professional engineering services\n• Architects - Interior and exterior design\n• Civil Workers - Skilled construction workers\n• Contractors & Builders - Complete construction solutions\n• Land Owners - Property listings and management\n• Material Sellers - Construction material suppliers\n• Admin - Platform management and oversight",
    
    rating: "Rating System Rules:\n• Only users who have worked together can rate each other\n• You must have an accepted connection to rate someone\n• Land owners cannot be rated (they list properties, not services)\n• Ratings are from 1-5 stars with optional comments\n• Your ratings help build trust in the community",
    
    languages: "CivilConnect supports 3 languages:\n• English\n• Telugu (తెలుగు)\n• Hindi (हिंदी)\n\nYou can switch languages using the language selector in the navigation bar.",
    
    chat: "To chat with professionals:\n1. Browse Engineers, Architects, or other categories\n2. Click 'Connect' on a profile you're interested in\n3. Wait for them to accept your connection request\n4. Once accepted, click 'Chat Now' to start messaging\n5. You'll receive notifications for new messages",
    
    services: "The Explore Services page lets you:\n• Browse all professionals by category\n• Filter by role type (Engineers, Architects, etc.)\n• View profiles with ratings and experience\n• Connect with professionals directly\n• See availability and pricing",
    
    admin: "Admin Panel Features:\n• View and manage all user profiles\n• Edit or delete profiles if needed\n• Review contact messages from users\n• Monitor platform activity\n• Ensure quality and safety standards",
    
    landRecords: "Land Records page allows you to:\n• Browse available land listings\n• View property details (size, price, location)\n• Contact land owners directly\n• See price per square foot\n• Filter by location and status"
  },
  
  pages: {
    home: "The Home page is your starting point with an overview of CivilConnect features and quick access to all services.",
    engineers: "Engineers page shows professional engineers available for construction projects. You can view their experience, ratings, and connect with them.",
    architects: "Architects page displays professionals specializing in interior and exterior design. Browse portfolios and connect for your design needs.",
    workers: "Civil Workers page lists skilled workers for construction, repairs, and civil work. Find experienced workers for your project.",
    contractors: "Contractors & Builders page features professionals offering complete construction solutions from start to finish.",
    materials: "Material Sellers page connects you with verified suppliers of quality construction materials.",
    landRecords: "Land Records page shows available land listings with details like area, price, and location. Connect with owners directly.",
    dashboard: "Your Dashboard shows your profile, connections, messages, and activity. Manage your account and view notifications here.",
    contact: "Contact page lets you send messages to the CivilConnect team. We respond within 24 hours."
  }
};

export const CivilConnectChatbot = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with greeting in current language
  useEffect(() => {
    setMessages([{
      id: "1",
      text: t('chatbotGreeting'),
      sender: "assistant",
      timestamp: new Date()
    }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Language-specific responses
    const responses = {
      en: {
        greeting: "Hello! 👋 Welcome to CivilConnect. I'm your assistant here to help you with anything related to our platform. What would you like to know?",
        thankYou: "You're welcome! 😊 Feel free to ask if you need anything else about CivilConnect.",
        whatIs: "CivilConnect is a professional platform that connects construction professionals with clients. We bring together:\n\n• Engineers for technical expertise\n• Architects for design services\n• Civil Workers for skilled labor\n• Contractors & Builders for complete projects\n• Land Owners for property listings\n• Material Sellers for construction supplies\n\nIt's your one-stop solution for all construction needs! What would you like to explore?",
        signup: "Great! Here's how to create your CivilConnect account:\n\n1️⃣ Click the 'Sign Up' button in the top navigation\n2️⃣ Choose your role (Engineer, Architect, Worker, etc.)\n3️⃣ Fill in your details:\n   • Full name\n   • Email and password\n   • Location (city and state)\n   • Phone number\n4️⃣ Complete your professional profile\n5️⃣ Start connecting!\n\nNeed help with a specific step?",
        default: "I'd love to help! Could you please tell me more about what you're looking for?\n\n💡 Popular topics:\n• How to sign up and create a profile\n• Finding and connecting with professionals\n• Using the chat system\n• Understanding ratings\n• Switching languages\n• Reporting issues\n\nOr just ask me anything about CivilConnect! 😊"
      },
      te: {
        greeting: "నమస్కారం! 👋 CivilConnect కు స్వాగతం. మా ప్లాట్‌ఫారమ్‌కు సంబంధించిన ఏదైనా విషయంలో మీకు సహాయం చేయడానికి నేను మీ అసిస్టెంట్. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
        thankYou: "మీకు స్వాగతం! 😊 CivilConnect గురించి మీకు ఇంకా ఏదైనా అవసరమైతే అడగడానికి సంకోచించకండి.",
        whatIs: "CivilConnect అనేది నిర్మాణ నిపుణులను క్లయింట్‌లతో కనెక్ట్ చేసే ప్రొఫెషనల్ ప్లాట్‌ఫారమ్. మేము కలిపి తీసుకువస్తాము:\n\n• సాంకేతిక నైపుణ్యం కోసం ఇంజనీర్లు\n• డిజైన్ సేవల కోసం ఆర్కిటెక్ట్‌లు\n• నైపుణ్యం కలిగిన కార్మికుల కోసం సివిల్ వర్కర్లు\n• పూర్తి ప్రాజెక్ట్‌ల కోసం కాంట్రాక్టర్లు & బిల్డర్లు\n• ఆస్తి లిస్టింగ్‌ల కోసం భూ యజమానులు\n• నిర్మాణ సామగ్రి కోసం మెటీరియల్ విక్రేతలు\n\nఇది మీ అన్ని నిర్మాణ అవసరాలకు వన్-స్టాప్ సొల్యూషన్! మీరు ఏమి అన్వేషించాలనుకుంటున్నారు?",
        signup: "గొప్ప! మీ CivilConnect ఖాతాను ఎలా సృష్టించాలో ఇక్కడ ఉంది:\n\n1️⃣ టాప్ నావిగేషన్‌లో 'సైన్ అప్' బటన్‌ను క్లిక్ చేయండి\n2️⃣ మీ పాత్రను ఎంచుకోండి (ఇంజనీర్, ఆర్కిటెక్ట్, వర్కర్, మొదలైనవి)\n3️⃣ మీ వివరాలను పూరించండి:\n   • పూర్తి పేరు\n   • ఇమెయిల్ మరియు పాస్‌వర్డ్\n   • లొకేషన్ (నగరం మరియు రాష్ట్రం)\n   • ఫోన్ నంబర్\n4️⃣ మీ ప్రొఫెషనల్ ప్రొఫైల్‌ను పూర్తి చేయండి\n5️⃣ కనెక్ట్ అవ్వడం ప్రారంభించండి!\n\nనిర్దిష్ట దశతో సహాయం కావాలా?",
        default: "నేను సహాయం చేయాలనుకుంటున్నాను! మీరు ఏమి వెతుకుతున్నారో దయచేసి మరింత చెప్పగలరా?\n\n💡 ప్రసిద్ధ అంశాలు:\n• సైన్ అప్ చేయడం మరియు ప్రొఫైల్ సృష్టించడం ఎలా\n• ప్రొఫెషనల్స్‌ను కనుగొనడం మరియు కనెక్ట్ అవ్వడం\n• చాట్ సిస్టమ్‌ను ఉపయోగించడం\n• రేటింగ్‌లను అర్థం చేసుకోవడం\n• భాషలను మార్చడం\n• సమస్యలను నివేదించడం\n\nలేదా CivilConnect గురించి ఏదైనా అడగండి! 😊"
      },
      hi: {
        greeting: "नमस्ते! 👋 CivilConnect में आपका स्वागत है। मैं आपका सहायक हूं और हमारे प्लेटफ़ॉर्म से संबंधित किसी भी चीज़ में आपकी मदद करने के लिए यहां हूं। आप क्या जानना चाहेंगे?",
        thankYou: "आपका स्वागत है! 😊 यदि आपको CivilConnect के बारे में कुछ और चाहिए तो बेझिझक पूछें।",
        whatIs: "CivilConnect एक पेशेवर प्लेटफ़ॉर्म है जो निर्माण पेशेवरों को ग्राहकों से जोड़ता है। हम एक साथ लाते हैं:\n\n• तकनीकी विशेषज्ञता के लिए इंजीनियर\n• डिज़ाइन सेवाओं के लिए आर्किटेक्ट\n• कुशल श्रम के लिए सिविल वर्कर\n• पूर्ण परियोजनाओं के लिए ठेकेदार और बिल्डर\n• संपत्ति लिस्टिंग के लिए भूमि मालिक\n• निर्माण सामग्री के लिए सामग्री विक्रेता\n\nयह आपकी सभी निर्माण आवश्यकताओं के लिए वन-स्टॉप समाधान है! आप क्या एक्सप्लोर करना चाहेंगे?",
        signup: "बढ़िया! यहां बताया गया है कि अपना CivilConnect खाता कैसे बनाएं:\n\n1️⃣ शीर्ष नेविगेशन में 'साइन अप' बटन पर क्लिक करें\n2️⃣ अपनी भूमिका चुनें (इंजीनियर, आर्किटेक्ट, वर्कर, आदि)\n3️⃣ अपना विवरण भरें:\n   • पूरा नाम\n   • ईमेल और पासवर्ड\n   • स्थान (शहर और राज्य)\n   • फोन नंबर\n4️⃣ अपनी पेशेवर प्रोफ़ाइल पूरी करें\n5️⃣ कनेक्ट करना शुरू करें!\n\nकिसी विशिष्ट चरण में मदद चाहिए?",
        default: "मैं मदद करना चाहूंगा! क्या आप कृपया मुझे बता सकते हैं कि आप क्या खोज रहे हैं?\n\n💡 लोकप्रिय विषय:\n• साइन अप कैसे करें और प्रोफ़ाइल बनाएं\n• पेशेवरों को ढूंढना और कनेक्ट करना\n• चैट सिस्टम का उपयोग करना\n• रेटिंग को समझना\n• भाषाएं बदलना\n• समस्याओं की रिपोर्ट करना\n\nया CivilConnect के बारे में कुछ भी पूछें! 😊"
      }
    };
    
    const langResponses = responses[language as keyof typeof responses] || responses.en;

    // Greetings - More natural (multi-language support)
    if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste|నమస్కారం|नमस्ते)/)) {
      return langResponses.greeting;
    }

    // Thank you (multi-language)
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks") || lowerMessage.includes("ధన్యవాదాలు") || lowerMessage.includes("धन्यवाद")) {
      return langResponses.thankYou;
    }

    // What is CivilConnect (multi-language)
    if (lowerMessage.includes("what is civilconnect") || lowerMessage.includes("about civilconnect") || lowerMessage.includes("tell me about") ||
        lowerMessage.includes("civilconnect అంటే ఏమిటి") || lowerMessage.includes("civilconnect क्या है")) {
      return langResponses.whatIs;
    }

    // Registration/Sign up (multi-language)
    if (lowerMessage.includes("sign up") || lowerMessage.includes("register") || lowerMessage.includes("create account") || 
        lowerMessage.includes("join") || lowerMessage.includes("new account") || lowerMessage.includes("get started") ||
        lowerMessage.includes("సైన్ అప్") || lowerMessage.includes("रजिस्टर") || lowerMessage.includes("खाता बनाएं")) {
      return langResponses.signup;
    }

    // Login issues
    if (lowerMessage.includes("login") || lowerMessage.includes("log in") || lowerMessage.includes("sign in") || lowerMessage.includes("can't access")) {
      return "Having trouble logging in? Here's what to do:\n\n1️⃣ Click 'Login' in the navigation bar\n2️⃣ Enter your email and password\n3️⃣ Click 'Sign In'\n\nIf you forgot your password:\n• Click 'Forgot Password' on the login page\n• Enter your email\n• Check your inbox for reset instructions\n\nStill having issues? Let me know!";
    }

    // Connecting with professionals - More natural
    if (lowerMessage.includes("connect") || lowerMessage.includes("find engineer") || lowerMessage.includes("find architect") ||
        lowerMessage.includes("hire") || lowerMessage.includes("contact professional") || lowerMessage.includes("get in touch")) {
      return "Here's how to connect with professionals on CivilConnect:\n\n1️⃣ Browse the category you need:\n   • Engineers page\n   • Architects page\n   • Civil Workers page\n   • Contractors & Builders page\n\n2️⃣ View profiles and check:\n   • Experience and ratings\n   • Past projects\n   • Price per sq ft\n\n3️⃣ Click 'Connect' on their profile\n\n4️⃣ Wait for them to accept (you'll get a notification)\n\n5️⃣ Once connected, click 'Chat Now' to start messaging!\n\nWhich type of professional are you looking for?";
    }

    // Chat/Messaging - More detailed
    if (lowerMessage.includes("chat") || lowerMessage.includes("message") || lowerMessage.includes("talk to") || 
        lowerMessage.includes("send message") || lowerMessage.includes("messaging")) {
      return "The CivilConnect chat system is easy to use:\n\n📱 To start chatting:\n1. First, send a connection request to the professional\n2. Wait for them to accept\n3. Click 'Chat Now' on their profile\n4. Start your conversation!\n\n🔔 You'll receive notifications for:\n• New messages\n• Connection requests\n• Connection acceptances\n\n💬 Chat features:\n• Real-time messaging\n• Message history\n• Professional communication\n\nNote: You can only chat with accepted connections!";
    }

    // Rating system - More comprehensive
    if (lowerMessage.includes("rating") || lowerMessage.includes("rate") || lowerMessage.includes("review") || 
        lowerMessage.includes("feedback") || lowerMessage.includes("star")) {
      return "Here's how the rating system works on CivilConnect:\n\n⭐ Rating Rules:\n• You can only rate professionals you've worked with\n• Both users must have an accepted connection\n• Ratings are from 1 to 5 stars\n• You can add comments with your rating\n• Land owners cannot be rated (they list properties, not services)\n\n📝 To rate someone:\n1. Go to their profile\n2. Click 'Rate This Professional'\n3. Select stars (1-5)\n4. Add your experience (optional)\n5. Submit\n\nRatings help build trust in our community!";
    }

    // Languages - More helpful
    if (lowerMessage.includes("language") || lowerMessage.includes("telugu") || lowerMessage.includes("hindi") || 
        lowerMessage.includes("translate") || lowerMessage.includes("change language")) {
      return "CivilConnect supports 3 languages:\n\n🌐 Available Languages:\n• English\n• Telugu (తెలుగు)\n• Hindi (हिंदी)\n\n🔄 To change language:\n1. Look for the language selector (🌐 icon) in the navigation bar\n2. Click it\n3. Choose your preferred language\n4. The entire platform will switch instantly!\n\nAll features work in all languages. Which language would you prefer?";
    }

    // Finding specific professionals
    if (lowerMessage.includes("find") || lowerMessage.includes("search") || lowerMessage.includes("looking for")) {
      return "Looking for someone specific? Here's how to find professionals:\n\n🔍 Browse by Category:\n• Engineers - Technical expertise\n• Architects - Design services\n• Civil Workers - Skilled labor\n• Contractors & Builders - Complete projects\n• Material Sellers - Construction supplies\n\n📍 Use the Search feature:\n• Click the search icon (🔍) in navigation\n• Enter what you're looking for\n• Filter by location, experience, or ratings\n\n💡 Tip: Check the 'Explore Services' page to see all professionals at once!\n\nWhat type of professional do you need?";
    }

    // Land/Property
    if (lowerMessage.includes("land") || lowerMessage.includes("property") || lowerMessage.includes("plot") || 
        lowerMessage.includes("buy land") || lowerMessage.includes("sell land")) {
      return "Looking for land or property? Here's how to use Land Records:\n\n🏞️ To browse land listings:\n1. Go to 'Land Records' page\n2. View available properties with:\n   • Area (sq ft)\n   • Price and price per sq ft\n   • Location details\n   • Owner information\n3. Click 'Contact Owner' to connect\n\n📋 To list your property:\n1. Create an account as 'Land Owner'\n2. Go to your Dashboard\n3. Add property details\n4. Your listing will appear on Land Records page\n\nNeed help with a specific property?";
    }

    // Dashboard
    if (lowerMessage.includes("dashboard") || lowerMessage.includes("my profile") || lowerMessage.includes("my account")) {
      return "Your Dashboard is your control center! Here's what you can do:\n\n📊 Dashboard Features:\n• View and edit your profile\n• See your connections\n• Check messages and notifications\n• View your ratings and reviews\n• Manage your listings (for land owners)\n• Update your professional details\n\n✏️ To access:\n1. Login to your account\n2. Click 'Dashboard' in navigation\n3. Explore all your options!\n\nWhat would you like to manage?";
    }

    // Pricing/Cost
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("fee") || 
        lowerMessage.includes("charge") || lowerMessage.includes("how much")) {
      return "About pricing on CivilConnect:\n\n💰 Platform Usage:\n• CivilConnect is FREE to join and use\n• No subscription fees\n• Free to browse and connect\n\n💵 Professional Rates:\n• Each professional sets their own rates\n• Usually shown as price per sq ft\n• You can see rates on their profiles\n• Negotiate directly with professionals\n\n📞 Contact professionals directly to discuss:\n• Project-specific pricing\n• Payment terms\n• Timeline and deliverables\n\nAny specific service you're interested in?";
    }

    // Admin/Management
    if (lowerMessage.includes("admin") || lowerMessage.includes("manage") || lowerMessage.includes("delete") || 
        lowerMessage.includes("edit profile") || lowerMessage.includes("remove")) {
      return "Admin and profile management:\n\n👤 For Users:\n• Edit your profile from Dashboard\n• Update your details anytime\n• Manage your connections\n• Control your visibility\n\n🛡️ Admin Panel (for administrators):\n• View all user profiles\n• Edit or remove profiles if needed\n• Review contact messages\n• Monitor platform activity\n• Ensure quality standards\n\nNeed help with your profile?";
    }

    // Problems/Issues
    if (lowerMessage.includes("problem") || lowerMessage.includes("issue") || lowerMessage.includes("bug") || 
        lowerMessage.includes("error") || lowerMessage.includes("not working") || lowerMessage.includes("broken") ||
        lowerMessage.includes("can't") || lowerMessage.includes("won't") || lowerMessage.includes("doesn't work")) {
      return "I'm sorry you're experiencing an issue! 😟 Let's fix it:\n\n🔍 Please tell me:\n1. Which page are you on?\n2. What were you trying to do?\n3. What happened (or didn't happen)?\n4. Any error messages you saw?\n\n📧 You can also:\n• Go to the Contact page\n• Send us a detailed message\n• We'll respond within 24 hours\n\n💡 Common fixes:\n• Try refreshing the page\n• Clear your browser cache\n• Check your internet connection\n• Try a different browser\n\nWhat specific issue are you facing?";
    }

    // Services page
    if (lowerMessage.includes("service") || lowerMessage.includes("explore") || lowerMessage.includes("browse all")) {
      return "The Explore Services page is your gateway to all professionals!\n\n🎯 What you can do:\n• View ALL professionals in one place\n• Filter by category (Engineers, Architects, etc.)\n• See profiles with ratings and experience\n• Connect directly from the page\n• Compare different professionals\n\n📍 To access:\n1. Click 'Services' in the navigation\n2. Use category filters at the top\n3. Browse through profiles\n4. Click 'Connect' or 'View' on any profile\n\nIt's the fastest way to find what you need!";
    }

    // Notifications
    if (lowerMessage.includes("notification") || lowerMessage.includes("alert") || lowerMessage.includes("bell icon")) {
      return "Stay updated with CivilConnect notifications! 🔔\n\nYou'll receive notifications for:\n• New connection requests\n• Accepted connections\n• New messages\n• Ratings and reviews\n• Important updates\n\n📱 To check notifications:\n1. Look for the bell icon (🔔) in navigation\n2. Click it to see all notifications\n3. Click any notification to view details\n\nNote: You must be logged in to receive notifications!";
    }

    // Contact/Support
    if (lowerMessage.includes("contact") || lowerMessage.includes("support") || lowerMessage.includes("help team") || 
        lowerMessage.includes("customer service")) {
      return "Need to reach our team? Here's how:\n\n📧 Contact Page:\n1. Go to 'Contact' in navigation\n2. Fill out the form with:\n   • Your name\n   • Email\n   • Subject\n   • Your message\n3. Click 'Send Message'\n4. We'll respond within 24 hours!\n\n📍 Our Details:\n• Email: itzprabhakar8919@gmail.com\n• Location: Hyderabad, Telangana\n• Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM\n\nHow can we help you?";
    }

    // General help
    if (lowerMessage.includes("help") || lowerMessage.includes("what can you do") || lowerMessage.includes("assist")) {
      return "I'm here to help you with everything about CivilConnect! 🤝\n\nI can assist with:\n\n✅ Getting Started:\n• Creating an account\n• Setting up your profile\n• Understanding user roles\n\n✅ Using Features:\n• Finding professionals\n• Connecting and chatting\n• Rating system\n• Language switching\n\n✅ Troubleshooting:\n• Login issues\n• Technical problems\n• Bug reporting\n\n✅ Information:\n• How features work\n• Platform policies\n• Best practices\n\nWhat would you like help with?";
    }

    // Check for out-of-scope questions
    if (
      lowerMessage.includes("weather") ||
      lowerMessage.includes("news") ||
      lowerMessage.includes("recipe") ||
      lowerMessage.includes("movie") ||
      lowerMessage.includes("game") ||
      lowerMessage.includes("sports") ||
      lowerMessage.includes("stock") ||
      lowerMessage.includes("politics")
    ) {
      return "I appreciate your question, but I'm specifically designed to help with CivilConnect platform queries only. 😊\n\nI can help you with:\n• Platform features and navigation\n• Registration and profiles\n• Connecting with professionals\n• Technical issues\n• And much more about CivilConnect!\n\nWhat would you like to know about CivilConnect?";
    }

    // Default - More friendly (multi-language)
    return langResponses.default;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group">
        {/* Animated glow rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-40 blur-xl animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Tooltip - responsive positioning */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 sm:px-4 rounded-lg shadow-2xl whitespace-nowrap text-xs sm:text-sm font-semibold">
            💬 How can I help you?
            <div className="absolute top-full right-4 w-0 h-0 border-l-6 border-r-6 border-t-6 sm:border-l-8 sm:border-r-8 sm:border-t-8 border-transparent border-t-purple-600" />
          </div>
        </div>

        {/* Main button - responsive size */}
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden group/btn border-2 border-white/20"
          size="icon"
        >
          {/* Rotating shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          
          {/* Orbiting sparkles */}
          <div className="absolute top-1 right-1 h-2 w-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" style={{ animation: 'orbit 3s linear infinite' }} />
          <div className="absolute bottom-1 left-1 h-2 w-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" style={{ animation: 'orbit 3s linear infinite reverse', animationDelay: '1.5s' }} />
          
          {/* Icon with float animation */}
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-2xl relative z-10" style={{ animation: 'float 3s ease-in-out infinite' }} />
          
          {/* Enhanced AI Badge */}
          <div className="absolute -top-2 -right-2 sm:-top-2 sm:-right-2">
            <div className="relative">
              {/* Pulsing background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-full animate-ping opacity-75" />
              {/* Main badge */}
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-red-500 via-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                <span className="text-white text-[10px] sm:text-xs font-black tracking-tight drop-shadow-md">AI</span>
              </div>
            </div>
          </div>
        </Button>

        {/* CSS animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(20px) rotate(0deg); opacity: 1; }
            50% { opacity: 0.5; }
            100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-3">
            {/* Animated avatar */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" />
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-xl shadow-lg relative">
                <span className="text-blue-600">C</span>
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                CivilConnect
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">AI</span>
              </h3>
              <p className="text-sm text-white/80 flex items-center gap-1">
                <span className="inline-block h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                {t('readyToHelp')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full transition-all hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-white/90 relative z-10">
          {t('howCanIHelp')}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-gray-900 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "assistant" && (
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white">AI</span>
                    </div>
                    <div className="bg-gray-800 text-white rounded-2xl rounded-tl-none px-4 py-3 max-w-[280px]">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
                {message.sender === "user" && (
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[280px]">
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <span className="text-xs text-blue-200 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white">AI</span>
                </div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="bg-gray-900 border-t border-gray-800 relative">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-2 z-50">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              width={320}
              height={400}
              theme="dark"
            />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-gray-800 rounded-full flex-shrink-0"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('replyPlaceholder')}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-full"
            />
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 rounded-full flex-shrink-0">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSend}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 rounded-full flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
