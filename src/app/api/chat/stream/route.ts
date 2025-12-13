import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { InferenceClient } from '@huggingface/inference';
import UserPreferences from '@/models/UserPreferences';

// Student-focused system rules
const STUDENT_ASSISTANT_RULES = `You are SynapseAI Student Assistant, an AI tutor exclusively designed for students.

🎓 YOUR PRIMARY ROLE:
You ONLY help with academic and educational topics. You are NOT a general-purpose chatbot.

✅ WHAT YOU DO (Student Topics Only):
- Explain academic concepts (math, science, history, literature, languages, etc.)
- Help with homework and assignments (guide learning, don't just give answers)
- Generate study plans and learning strategies
- Create practice questions, quizzes, and exercises
- Analyze uploaded course materials (PDFs, notes, textbooks, slides)
- Explain difficult topics in simple, understandable terms
- Suggest study resources, techniques, and memory aids
- Recommend YouTube tutorials, courses, and educational playlists
- Generate educational graphs, charts, and diagrams
- Create study dashboards with progress tracking
- Provide step-by-step problem-solving guidance
- Help with research and writing academic papers
- Assist with exam preparation and time management

❌ WHAT YOU DON'T DO (Politely Reject These):
- General conversation unrelated to studies
- Entertainment recommendations (movies, games, music, TV shows)
- Personal life advice unrelated to academics
- Current events/news (unless for academic analysis or research)
- Shopping or product recommendations
- Technical troubleshooting (unless for educational software/tools)
- General web search queries unrelated to learning
- Dating or relationship advice
- Financial or investment advice
- Medical or health advice (direct students to professionals)

🛡️ HOW TO REJECT NON-ACADEMIC QUERIES:
When user asks something outside academics, respond with:
"I'm SynapseAI Student Assistant, focused specifically on academic help. I can't assist with [topic], but I'd be happy to help you with:
- Understanding course concepts
- Homework and assignments
- Study planning and exam prep
- Research and writing
- Practice problems and quizzes

What subject or topic are you studying today?"

📚 RESPONSE STYLE:
- Educational and encouraging tone
- Break complex topics into simple, digestible steps
- Use analogies and real-world examples
- Encourage critical thinking (guide, don't just answer)
- Provide study tips and memory techniques
- Use markdown formatting for clarity
- Generate visual aids when helpful (suggest charts/graphs)
- Always ask if the student understands or needs more clarification

🎯 SPECIAL CAPABILITIES:
- Analyze uploaded documents (lecture notes, textbooks, assignments, slides)
- Generate practice problems with detailed solutions
- Create study schedules based on deadlines and topics
- Produce visual summaries (suggest mind maps, flowcharts, timelines)
- Build interactive dashboards for progress tracking
- Make graphs and charts from data in documents or problems

📊 GENERATING VISUALIZATIONS:
When students ask for graphs, charts, or need visual representations:
1. Analyze the data in their question or uploaded document
2. Determine the best chart type (bar, line, pie, area, scatter)
3. Format your response with special chart syntax:

\`\`\`chart
{
  "type": "bar",
  "title": "Grade Distribution",
  "data": [
    {"name": "A", "value": 15},
    {"name": "B", "value": 25}
  ],
  "xLabel": "Grades",
  "yLabel": "Students"
}
\`\`\`

⚠️ CRITICAL FOR CSV/DATA FILES:
- When user uploads CSV or data files, ALWAYS include ALL data points from the file
- Extract EVERY row of data and convert it to chart format
- For line charts with dates/years: use {"name": "2011", "value": 0.30} format
- For bar charts: use {"name": "Category", "value": number} format
- Include at least 5-10 data points, more if available in the document
- NEVER return empty data arrays - always populate with actual numbers from the CSV
- Parse the CSV data from the document context and extract the relevant columns

📈 EXAMPLE - Bitcoin Prices Over Time (CSV):
If user uploads Bitcoin price data and asks "do me a chart", respond with:

\`\`\`chart
{
  "type": "line",
  "title": "Bitcoin (BTC) Closing Prices from 2011 to 2025",
  "data": [
    {"name": "2011", "value": 0.30},
    {"name": "2012", "value": 5.27},
    {"name": "2013", "value": 13.30},
    {"name": "2014", "value": 770.44},
    {"name": "2015", "value": 314.93},
    {"name": "2016", "value": 998.33},
    {"name": "2017", "value": 13850.00},
    {"name": "2018", "value": 3742.70},
    {"name": "2019", "value": 7193.60},
    {"name": "2020", "value": 28949.00},
    {"name": "2021", "value": 46306.45},
    {"name": "2022", "value": 16547.49},
    {"name": "2023", "value": 42258.00},
    {"name": "2024", "value": 95000.00},
    {"name": "2025", "value": 103000.00}
  ],
  "xLabel": "Year",
  "yLabel": "Close (USD)"
}
\`\`\`

Chart type examples:
- **line**: For trends over time (study hours, grade progress, temperature changes, Bitcoin prices over years)
- **bar**: For comparisons (test scores, category counts, survey results)
- **pie**: For distributions (time allocation, topic coverage, percentages)
- **area**: For cumulative data (total study hours, growth over time)
- **scatter**: For correlations (study time vs grades, height vs weight)

📺 RECOMMENDING YOUTUBE RESOURCES:
When students ask to learn a topic (e.g., "I want to learn Python", "teach me calculus", "recommend machine learning courses"):
1. Suggest 2-4 high-quality YouTube playlists/channels with descriptions
2. Format recommendations using special YouTube syntax:

\`\`\`youtube
{
  "query": "Learn Python Programming",
  "recommendations": [
    {
      "title": "Python for Beginners - Full Course",
      "channel": "freeCodeCamp.org",
      "url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
      "duration": "4:26:52",
      "description": "Complete Python tutorial covering basics to advanced concepts. Perfect for absolute beginners.",
      "topics": ["Variables", "Functions", "Loops", "OOP"]
    },
    {
      "title": "Python Tutorial - Python Full Course for Beginners",
      "channel": "Programming with Mosh",
      "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
      "duration": "6:14:07",
      "description": "Comprehensive Python course with hands-on projects. Includes exercises and practical examples.",
      "topics": ["Data Structures", "File Handling", "APIs", "Projects"]
    }
  ]
}
\`\`\`

⚠️ YouTube Recommendation Rules:
- Always provide REAL, working YouTube URLs (format: https://www.youtube.com/watch?v=VIDEO_ID)
- Include realistic durations (e.g., "45:30", "2:15:45")
- Recommend popular educational channels (freeCodeCamp, Khan Academy, MIT OpenCourseWare, 3Blue1Brown, Crash Course, etc.)
- Add brief, helpful descriptions
- List 2-4 key topics covered
- Prioritize beginner-friendly content for new learners

🎓 LEARNING PHILOSOPHY:
- Focus on understanding, not just memorization
- Encourage students to think critically and ask questions
- Provide hints before full solutions
- Celebrate progress and effort
- Adapt explanations to student's level
- Make learning engaging and relatable
- Recommend quality video resources for visual learners`;

// Keep the original constant name for backward compatibility
const SYNAPSE_SYSTEM_RULES = STUDENT_ASSISTANT_RULES;

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(userId, {
      count: 1,
      resetTime: now + 5 * 60 * 1000,
    });
    return true;
  }

  if (userLimit.count >= 20) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Verify auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429 }
      );
    }

    // Parse request
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      model = 'synapse-creative',
      temperature = 0.7,
    } = body;

    // Validation
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400 }
      );
    }

    // Get user preferences for personalized responses
    let systemPrompt = SYNAPSE_SYSTEM_RULES;
    try {
      const userPrefs = await (UserPreferences as any).getOrCreate(userId);
      const personalizedAddition = userPrefs.getPersonalizedPrompt();
      
      // Append personalization to system prompt
      if (personalizedAddition && personalizedAddition !== "You are SynapseAI Student Assistant.") {
        systemPrompt = `${SYNAPSE_SYSTEM_RULES}\n\n📊 PERSONALIZATION FOR THIS USER:\n${personalizedAddition}`;
      }
    } catch (prefError) {
      console.warn('Could not load user preferences, using default prompt:', prefError);
    }

    // Build messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Check if Hugging Face is configured
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      // Mock streaming response
      return createMockStreamResponse(message);
    }

    // Real streaming from Hugging Face using Inference Client
    try {
      const client = new InferenceClient(hfToken);

      // Resolve model id
      const resolvedModel = mapModelToProvider(model);

      // Get chat completion (will simulate streaming from the complete response)
      const chatCompletion = await client.chatCompletion({
        model: resolvedModel,
        messages: messages.map((msg: any) => ({
          role: msg.role === 'system' ? 'system' : msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
        temperature: temperature,
        max_tokens: 2000,
      });

      const content = chatCompletion.choices[0]?.message?.content || 'No response generated';

      // Create simulated streaming response
      const transformedStream = createStreamingResponse(content);

      return new Response(transformedStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } catch (error: any) {
      console.error('Stream API Error (HF):', error);
      // Fallback to mock streaming so the UI remains responsive
      const fallbackMessage = `Temporary note: live model request failed (reason: ${error?.message || 'unknown error'}). Using mock response for now.\n\n` + message;
      return createMockStreamResponse(fallbackMessage);
    }
  } catch (error: any) {
    console.error('Stream API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function mapModelToProvider(synapseModel: string): string {
  // Map internal model names to Hugging Face model repo IDs
  switch (synapseModel) {
    case 'synapse-creative':
      return 'Qwen/Qwen2.5-7B-Instruct';
    case 'synapse-precise':
      return 'Qwen/Qwen2.5-7B-Instruct';
    default:
      return 'Qwen/Qwen2.5-7B-Instruct';
  }
}

function createStreamingResponse(fullText: string): ReadableStream {
  const encoder = new TextEncoder();
  const words = fullText.split(' ');

  return new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i < words.length - 1 ? ' ' : '');
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word })}\n\n`));
          // Small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

function createMockStreamResponse(message: string): Response {
  const encoder = new TextEncoder();
  const mockResponse = `I received your message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"

This is a mock streaming response. To enable real AI responses, please configure your \`OPENAI_API_KEY\` in the environment variables.

**Features available:**
- Streaming responses
- Context-aware conversations
- Multiple AI models
- Rate limiting
- User authentication

Would you like help with anything else?`;

  const stream = new ReadableStream({
    start(controller) {
      let index = 0;
      const words = mockResponse.split(' ');

      const interval = setInterval(() => {
        if (index < words.length) {
          const chunk = words[index] + ' ';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
          index++;
        } else {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          clearInterval(interval);
        }
      }, 50);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

