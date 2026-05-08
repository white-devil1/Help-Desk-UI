// // Help-Desk-UI/src/utils/api.js

// // ✅ Create API instance
// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8002',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add auth token interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ ADD THIS - Function to call your custom AI backend
// export const callCustomAssetAI = async (message, userId = 1, companyId = 1) => {
//   try {
//     console.log('🤖 Calling AI at http://localhost:8003/v1/chat');
    
//     const response = await fetch('http://localhost:8003/v1/chat', {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({
//         message: message,
//         user_id: userId,
//         company_id: companyId
//       }),
//     });
    
//     if (!response.ok) {
//       throw new Error(`AI service error: ${response.status}`);
//     }
    
//     const data = await response.json();
//     console.log('✅ AI Response:', data);
//     return data;
    
//   } catch (error) {
//     console.error('❌ AI call failed:', error);
//     return {
//       response: '⚠️ AI service unavailable. Please contact IT support.',
//       action: 'error',
//       confidence: 0.0
//     };
//   }
// };

// // ✅ ADD DEFAULT EXPORT (This fixes your error!)
// export default api;


// // Help-Desk-UI/src/utils/api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8002',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ✅ DEMO-READY MOCK AI - 100% RELIABLE
// export const callCustomAssetAI = async (message, userId = 1, companyId = 1) => {
//   const msg = message.toLowerCase();
  
//   // Pre-written intelligent responses
//   const responses = {
//     'not working': {
//       response: "I understand your system is not working. I'll create an urgent support ticket for you.\n\n🎫 **Ticket Created: TKT-2026-001**\n\n**Priority:** High\n**Category:** Hardware Failure\n\nIT Support will contact you within 2 hours. Please keep your asset tag number ready.",
//       action: "create_ticket",
//       confidence: 0.95
//     },
//     'upgrade': {
//       response: "I can help you with a system upgrade. Based on company policy:\n\n✅ Devices older than 2 years are eligible\n✅ RAM upgrades up to 32GB allowed\n✅ SSD upgrades from 256GB to 512GB allowed\n\nWhat specific upgrade do you need?",
//       action: "clarify",
//       confidence: 0.92
//     },
//     'laptop': {
//       response: "I see you need assistance with your laptop. Can you please specify:\n\n1. Is it a hardware issue (won't turn on, broken screen, keyboard problem)?\n2. Or do you need a replacement/upgrade?\n3. What is your current laptop model?",
//       action: "clarify",
//       confidence: 0.90
//     },
//     'slow': {
//       response: "I understand your system is running slow. Before creating a replacement ticket, please try:\n\n1. **Restart your computer** (clears memory)\n2. **Close unused applications**\n3. **Run Disk Cleanup** (search in Start menu)\n4. **Check for Windows Updates**\n\nIf performance is still poor after these steps, I can create a ticket for IT diagnostics.",
//       action: "answer",
//       confidence: 0.88
//     },
//     'monitor': {
//       response: "For monitor issues, I can help. Please specify:\n\n• **No display** - Check cable connections\n• **Flickering** - May need cable or monitor replacement\n• **Physical damage** - Requires replacement\n• **Need additional monitor** - Submit request for dual monitor setup\n\nWhat issue are you experiencing?",
//       action: "clarify",
//       confidence: 0.89
//     },
//     'ticket': {
//       response: "🎫 **Ticket Created Successfully!**\n\n**Ticket Number:** TKT-2026-002\n**Status:** Open\n**Priority:** Normal\n\nYou will receive an email confirmation shortly. The IT team will contact you within 24 hours.\n\nYou can track your ticket in the 'All Tickets' section.",
//       action: "create_ticket",
//       confidence: 0.96
//     },
//     'broken': {
//       response: "I'm sorry your device is broken. I'll create an urgent replacement ticket.\n\nPlease confirm:\n1. **Device type:** Laptop/Desktop/Monitor\n2. **When did it break?**\n3. **Any physical damage visible?**\n\nOnce confirmed, I'll create the ticket immediately.",
//       action: "ask_permission",
//       confidence: 0.91
//     },
//     'replace': {
//       response: "I can process a replacement request. Based on company policy:\n\n✅ Replacements approved for:\n   - Hardware failures\n   - Devices older than 3 years\n   - Irreparable damage\n\n📋 **Required information:**\n- Current asset tag number\n- Reason for replacement\n- Preferred replacement specs\n\nShall I create the ticket?",
//       action: "ask_permission",
//       confidence: 0.93
//     },
//     'hello': {
//       response: "👋 Hello! I'm your AI Asset Management Assistant.\n\nI can help you with:\n• Asset replacement requests\n• Upgrade eligibility checks\n• Troubleshooting hardware issues\n• Creating support tickets\n• Checking ticket status\n\nHow can I assist you today?",
//       action: "answer",
//       confidence: 0.94
//     },
//     'default': {
//       response: "Thank you for your request. I understand you need assistance.\n\n🎫 **Creating support ticket...**\n\n**Ticket Number:** TKT-2026-003\n\nIT Support will review your request and contact you within 24 hours with a solution.",
//       action: "create_ticket",
//       confidence: 0.85
//     }
//   };
  
//   // Find best matching response
//   let bestMatch = responses.default;
//   for (const [keyword, response] of Object.entries(responses)) {
//     if (msg.includes(keyword)) {
//       bestMatch = response;
//       break;
//     }
//   }
  
//   console.log('✅ AI Response:', bestMatch);
//   return bestMatch;
// };

// // Default export
// export default api;


// Help-Desk-UI/src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8002',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ DEMO-READY MOCK AI - 100% RELIABLE (NO JSX HERE!)
export const callCustomAssetAI = async (message, userId = 1, companyId = 1) => {
  const msg = message.toLowerCase();
  
  // Priority-based responses (most specific first)
  const intents = [
    {
      keyword: 'ram',
      response: "I can help with your **RAM upgrade**. \n\nBased on your profile, you are eligible for an upgrade to **32GB**. \n\nPlease provide your **Asset Tag Number** (located on the bottom of your laptop) so I can verify the exact memory modules needed.",
      action: "clarify"
    },
    {
      keyword: 'ssd',
      response: "I can help with your **SSD upgrade**. \n\nYou are eligible for an upgrade to **512GB**. \n\n**Note:** This will require a fresh installation. Do you need the IT team to backup your data first?",
      action: "clarify"
    },
    {
      keyword: 'not working',
      response: "I understand your system is not working. I'll create an urgent support ticket for you.\n\n🎫 **Ticket Created: TKT-2026-001**\n\n**Priority:** High\n**Category:** Hardware Failure\n\nIT Support will contact you within 2 hours.",
      action: "create_ticket"
    },
    {
      keyword: 'upgrade',
      response: "I can help you with a system upgrade. Based on company policy:\n\n✅ Devices older than 2 years are eligible\n✅ RAM upgrades up to 32GB allowed\n✅ SSD upgrades from 256GB to 512GB allowed\n\nWhat specific upgrade do you need?",
      action: "clarify"
    },
    {
      keyword: 'eligible',
      response: "To check your **upgrade eligibility**, I need your **Employee ID** and the **Asset Tag** of your current device. \n\nStandard policy requires the device to be at least **2 years old**.",
      action: "clarify"
    },
    {
      keyword: 'laptop',
      response: "I see you need assistance with your laptop. Can you please specify:\n\n1. Is it a hardware issue (won't turn on, broken screen, keyboard problem)?\n2. Or do you need a replacement/upgrade?\n3. What is your current laptop model?",
      action: "clarify"
    },
    {
      keyword: 'slow',
      response: "I understand your system is running slow. Before creating a replacement ticket, please try:\n\n1. **Restart your computer** (clears memory)\n2. **Close unused applications**\n3. **Run Disk Cleanup** (search in Start menu)\n4. **Check for Windows Updates**\n\nIf performance is still poor after these steps, I can create a ticket for IT diagnostics.",
      action: "answer"
    },
    {
      keyword: 'monitor',
      response: "For monitor issues, I can help. Please specify:\n\n• **No display** - Check cable connections\n• **Flickering** - May need cable or monitor replacement\n• **Physical damage** - Requires replacement\n• **Need additional monitor** - Submit request for dual monitor setup\n\nWhat issue are you experiencing?",
      action: "clarify"
    },
    {
      keyword: 'ticket',
      response: "🎫 **Ticket Created Successfully!**\n\n**Ticket Number:** TKT-2026-002\n**Status:** Open\n**Priority:** Normal\n\nYou will receive an email confirmation shortly. The IT team will contact you within 24 hours.",
      action: "create_ticket"
    },
    {
      keyword: 'broken',
      response: "I'm sorry your device is broken. I'll create an urgent replacement ticket.\n\nPlease confirm:\n1. **Device type:** Laptop/Desktop/Monitor\n2. **When did it break?**\n3. **Any physical damage visible?**\n\nOnce confirmed, I'll create the ticket immediately.",
      action: "ask_permission"
    },
    {
      keyword: 'replace',
      response: "I can process a replacement request. Based on company policy:\n\n✅ Replacements approved for:\n   - Hardware failures\n   - Devices older than 3 years\n   - Irreparable damage\n\n📋 **Required information:**\n- Current asset tag number\n- Reason for replacement\n- Preferred replacement specs\n\nShall I create the ticket?",
      action: "ask_permission"
    },
    {
      keyword: 'hello',
      response: "👋 Hello! I'm your AI Asset Management Assistant.\n\nI can help you with:\n• Asset replacement requests\n• Upgrade eligibility checks\n• Troubleshooting hardware issues\n• Creating support tickets\n• Checking ticket status\n\nHow can I assist you today?",
      action: "answer"
    }
  ];

  // Default response if no keyword matches
  const defaultResponse = {
    response: "Thank you for your request. I understand you need assistance.\n\n🎫 **Creating support ticket...**\n\n**Ticket Number:** TKT-2026-003\n\nIT Support will review your request and contact you within 24 hours with a solution.",
    action: "create_ticket"
  };
  
  // Find first matching intent (priority is defined by order in the array)
  let bestMatch = defaultResponse;
  for (const intent of intents) {
    if (msg.includes(intent.keyword)) {
      bestMatch = intent;
      break;
    }
  }
  
  console.log('✅ AI Response:', bestMatch);
  return bestMatch;
};

// ✅ DEFAULT EXPORT
export default api;