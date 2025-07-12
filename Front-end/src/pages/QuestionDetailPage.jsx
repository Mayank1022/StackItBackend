import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { RichTextEditor } from "../components/RichTextEditor"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "../hooks/useToast"

// Mock question data
const mockQuestion = {
  id: 1,
  title: "How to implement JWT authentication in Next.js?",
  description: `I'm trying to set up JWT authentication in my Next.js application but running into issues with token storage and validation.

Here's what I've tried so far:

1. **Server-side token generation**: I'm using the \`jsonwebtoken\` library to create tokens
2. **Client-side storage**: Storing tokens in localStorage
3. **API route protection**: Using middleware to verify tokens

**The Problem:**
The tokens seem to be generated correctly, but when I try to verify them in my API routes, I get an "invalid token" error.

**My current code:**

\`\`\`javascript
// pages/api/auth/login.js
import jwt from 'jsonwebtoken'

export default function handler(req, res) {
  // ... validation logic
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
  
  res.json({ token })
}
\`\`\`

**What am I missing?** Any help would be greatly appreciated! 🙏`,
  author: {
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 1250,
    badges: ["Contributor", "Active"],
  },
  tags: ["Next.js", "JWT", "Authentication", "JavaScript"],
  votes: 15,
  views: 234,
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
}

const mockAnswers = [
  {
    id: 1,
    content: `The issue you're experiencing is likely due to how you're handling the JWT secret or token verification. Here are a few things to check:

## 1. Environment Variables
Make sure your \`JWT_SECRET\` is properly set in your \`.env.local\` file:

\`\`\`
JWT_SECRET=your-super-secret-key-here
\`\`\`

## 2. Token Verification
In your API routes, verify the token like this:

\`\`\`javascript
import jwt from 'jsonwebtoken'

export default function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Token is valid, proceed with your logic
    res.json({ user: decoded })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
\`\`\`

## 3. Client-side Token Sending
Make sure you're sending the token correctly from the client:

\`\`\`javascript
const token = localStorage.getItem('token')
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
})
\`\`\`

This should resolve your authentication issues! Let me know if you need any clarification.`,
    author: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      reputation: 3420,
      badges: ["Expert", "Top Contributor"],
    },
    votes: 23,
    isAccepted: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    comments: [
      {
        id: 1,
        content: "This worked perfectly! Thank you so much for the detailed explanation.",
        author: { name: "John Doe", avatar: "/placeholder.svg?height=24&width=24" },
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
  },
  {
    id: 2,
    content: `Another approach you might consider is using **NextAuth.js** which handles JWT authentication (and much more) out of the box.

Here's a quick setup:

\`\`\`bash
npm install next-auth
\`\`\`

Then create \`pages/api/auth/[...nextauth].js\`:

\`\`\`javascript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Add your own logic here to validate credentials
        const user = await validateUser(credentials)
        return user ? { id: user.id, email: user.email } : null
      }
    })
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  session: {
    strategy: 'jwt',
  }
})
\`\`\`

This might be overkill for your use case, but it's very robust and handles edge cases you might not think of.`,
    author: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      reputation: 2100,
      badges: ["Helper"],
    },
    votes: 8,
    isAccepted: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    comments: [],
  },
]

export function QuestionDetailPage() {
  const { id } = useParams()
  const [question] = useState(mockQuestion)
  const [answers, setAnswers] = useState(mockAnswers)
  const [newAnswer, setNewAnswer] = useState("")
  const [userVotes, setUserVotes] = useState({})
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { toast } = useToast()

  const handleVote = (type, targetType, targetId) => {
    const key = targetType === "question" ? "question" : `answer-${targetId}`
    const currentVote = userVotes[key]

    if (currentVote === type) {
      // Remove vote
      setUserVotes((prev) => ({ ...prev, [key]: null }))
    } else {
      // Add or change vote
      setUserVotes((prev) => ({ ...prev, [key]: type }))
    }

    toast({
      title: "Vote recorded",
      description: `Your ${type} vote has been recorded.`,
    })
  }

  const handleAcceptAnswer = (answerId) => {
    setAnswers((prev) =>
      prev.map((answer) => ({
        ...answer,
        isAccepted: answer.id === answerId ? !answer.isAccepted : false,
      })),
    )

    toast({
      title: "Answer accepted",
      description: "This answer has been marked as the accepted solution.",
    })
  }

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      })
      return
    }

    const answer = {
      id: answers.length + 1,
      content: newAnswer,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg?height=32&width=32",
        reputation: 150,
        badges: ["New Member"],
      },
      votes: 0,
      isAccepted: false,
      createdAt: new Date(),
      comments: [],
    }

    setAnswers((prev) => [...prev, answer])
    setNewAnswer("")

    toast({
      title: "Answer posted!",
      description: "Your answer has been successfully posted.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Questions
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Question */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{question.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
                  <span>Modified {formatDistanceToNow(question.updatedAt, { addSuffix: true })}</span>
                  <span>Viewed {question.views} times</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-md transition-colors ${
                    isBookmarked
                      ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill={isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Vote Controls */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleVote("up", "question")}
                  className={`p-2 rounded-md transition-colors ${
                    userVotes.question === "up"
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{question.votes}</span>
                <button
                  onClick={() => handleVote("down", "question")}
                  className={`p-2 rounded-md transition-colors ${
                    userVotes.question === "down"
                      ? "text-red-600 bg-red-50 dark:bg-red-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <div className="whitespace-pre-wrap text-gray-900 dark:text-white">{question.description}</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex justify-end">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {question.author.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{question.author.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {question.author.reputation} reputation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {answers.length} Answer{answers.length !== 1 ? "s" : ""}
              </h2>
            </div>

            {answers.map((answer) => (
              <div
                key={answer.id}
                className={`bg-white dark:bg-gray-800 rounded-lg border p-6 ${
                  answer.isAccepted ? "border-green-200 dark:border-green-800" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex gap-4">
                  {/* Vote Controls */}
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => handleVote("up", "answer", answer.id)}
                      className={`p-2 rounded-md transition-colors ${
                        userVotes[`answer-${answer.id}`] === "up"
                          ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                          : "text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{answer.votes}</span>
                    <button
                      onClick={() => handleVote("down", "answer", answer.id)}
                      className={`p-2 rounded-md transition-colors ${
                        userVotes[`answer-${answer.id}`] === "down"
                          ? "text-red-600 bg-red-50 dark:bg-red-900/20"
                          : "text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleAcceptAnswer(answer.id)}
                      className={`p-2 rounded-md transition-colors ${
                        answer.isAccepted
                          ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                          : "text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                      title="Accept this answer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Answer Content */}
                  <div className="flex-1">
                    {answer.isAccepted && (
                      <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Accepted Answer</span>
                      </div>
                    )}

                    <div className="prose dark:prose-invert max-w-none mb-6">
                      <div className="whitespace-pre-wrap text-gray-900 dark:text-white">{answer.content}</div>
                    </div>

                    {/* Author Info */}
                    <div className="flex justify-end mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {answer.author.name[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {answer.author.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {answer.author.reputation} reputation
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments */}
                    {answer.comments.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="space-y-2">
                          {answer.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2 text-sm">
                              <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {comment.author.name[0]}
                                </span>
                              </div>
                              <div className="flex-1">
                                <span className="text-gray-700 dark:text-gray-300">{comment.content}</span>
                                <span className="text-gray-500 ml-2">
                                  – {comment.author.name} {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="flex items-center gap-1 mt-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          Add a comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Your Answer */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Answer</h3>
            <RichTextEditor value={newAnswer} onChange={setNewAnswer} placeholder="Write your answer here..." />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Post Your Answer
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Question Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Question Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Asked</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Modified</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDistanceToNow(question.updatedAt, { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Viewed</span>
                <span className="text-sm text-gray-900 dark:text-white">{question.views} times</span>
              </div>
            </div>
          </div>

          {/* Related Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Related Questions</h3>
            <div className="space-y-3">
              <Link to="/questions/2" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <div className="text-sm">
                  <div className="font-medium mb-1 text-gray-900 dark:text-white">
                    Best practices for React state management in 2024?
                  </div>
                  <div className="text-gray-500">28 votes • 7 answers</div>
                </div>
              </Link>
              <hr className="border-gray-200 dark:border-gray-700" />
              <Link to="/questions/3" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <div className="text-sm">
                  <div className="font-medium mb-1 text-gray-900 dark:text-white">
                    How to optimize database queries in PostgreSQL?
                  </div>
                  <div className="text-gray-500">12 votes • 2 answers</div>
                </div>
              </Link>
              <hr className="border-gray-200 dark:border-gray-700" />
              <Link to="/questions/4" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <div className="text-sm">
                  <div className="font-medium mb-1 text-gray-900 dark:text-white">
                    Setting up authentication with NextAuth.js
                  </div>
                  <div className="text-gray-500">19 votes • 4 answers</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Hot Network Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Hot Network Questions</h3>
            <div className="space-y-3">
              <Link to="#" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Why is my React component re-rendering unnecessarily?
                </div>
              </Link>
              <Link to="#" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  What's the difference between SSR and SSG in Next.js?
                </div>
              </Link>
              <Link to="#" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  How to handle form validation in React Hook Form?
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
