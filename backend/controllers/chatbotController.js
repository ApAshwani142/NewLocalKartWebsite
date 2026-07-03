let cachedModelName = null;

const findWorkingModel = async (apiKey) => {
  if (cachedModelName) {
    return cachedModelName;
  }

  // List of models to test, in order of preference
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-2.5-flash",
    "gemini-1.5-pro",
    "gemini-2.5-pro",
    "gemini-flash-latest"
  ];

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'test' }] }]
          })
        }
      );

      if (response.ok) {
        cachedModelName = modelName;
        console.log(`Found working Gemini model: ${modelName}`);
        return modelName;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log(`Model ${modelName} check returned status ${response.status}:`, errorData.error?.message || response.statusText);
      }
    } catch (testError) {
      console.log(`Model ${modelName} check failed:`, testError.message);
    }
  }

  // Fallback default
  cachedModelName = "gemini-1.5-flash";
  console.log(`No verified model found. Defaulting to: ${cachedModelName}`);
  return cachedModelName;
};

const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is missing in backend env');
      return res.status(500).json({ message: 'Chatbot service key is not configured.' });
    }

    // Map history to Gemini format: roles must be 'user' or 'model'
    const formattedHistory = (history || []).map((msg) => {
      // Map 'bot' or 'assistant' role to 'model'
      const role = (msg.role === 'bot' || msg.role === 'assistant' || msg.role === 'model') ? 'model' : 'user';
      return {
        role,
        parts: [{ text: msg.text || '' }]
      };
    });

    // Add current user message to the end of history
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Detailed system instructions to train the AI specifically on e-LocalKart
    const systemInstructionText = `
You are KartBot, a friendly and helpful AI customer assistant for e-LocalKart, a premium quick commerce shopping website.
e-LocalKart details to use for answering questions:
- Service Area: e-LocalKart strictly serves Ara, Bihar, India. We do not deliver outside Ara.
- Core Offerings: We deliver fresh groceries and daily essentials directly from 50+ local neighborhood shops in Ara.
- Key Product Categories:
  1. Vegetables (e.g. Organic Green Broccoli at ₹80/500g, Fresh Red Tomatoes at ₹40/1kg, Fresh Potatoes at ₹32/1kg).
  2. Fruits (e.g. Red Delicious Apples at ₹120/1kg).
  3. Dairy & Eggs (e.g. Fresh Milk Bottle at ₹60/1L, Farm Fresh Eggs at ₹90/12 items).
  4. Meat & Fish (e.g. Fresh Tender Chicken Breast at ₹240/1kg).
  5. Fresh Bread (e.g. Whole Wheat Sandwich Bread at ₹45/400g).
  6. Snacks (e.g. Salted Popcorn at ₹50/150g).
  7. Beverages (e.g. Pure Orange Juice at ₹90/1L, Pressed Apple Juice at ₹105/1L, Organic Pomegranate Juice at ₹120/1L).
  8. Personal Care, Home Care, Organics.
- Promos & Offers:
  - Up to 50% Off on select farm picks (Fresh Produce Sale).
  - 30% Off on Organic Juices.
  - Free delivery for all orders above ₹200.
- Delivery Speed: Average delivery time is 60 minutes (same-hour shipping) because we source from local shops close to the customer.
- Payment Options: Cash on Delivery (COD) and all UPI apps are fully accepted.
- Return/Support: Customers can contact support by submitting the contact form on our website. We offer instant resolution for missing or damaged fresh products.
- Guidelines for your replies:
  1. Answer questions in a very simple, easy, and warm language.
  2. Keep your answers concise, structured, and helpful. Don't write walls of text. Use bullet points where appropriate.
  3. If asked about items we don't sell, explain politely that we focus on fresh groceries, beverages, and daily essentials from local shops in Ara.
  4. Never assume or make up facts not listed above. If you don't know the answer, politely tell the customer to contact our support team.
    `.trim();

    // Resolve working model
    const modelName = await findWorkingModel(geminiApiKey);

    // Call Gemini API using native Node fetch with resolved model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: formattedHistory,
          systemInstruction: {
            parts: [{ text: systemInstructionText }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error details:', data);
      throw new Error(data.error?.message || 'Failed to fetch response from Gemini');
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that. Can you please try again?";

    return res.status(200).json({ message: replyText });
  } catch (error) {
    console.error('Chatbot Controller Error:', error.message);
    if (cachedModelName) {
      console.log(`Clearing cached model ${cachedModelName} due to error`);
      cachedModelName = null;
    }
    return res.status(500).json({ message: 'Server error handling chat: ' + error.message });
  }
};

module.exports = {
  handleChat
};
