import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Pagination } from "../components/Pagination"
import { formatDistanceToNow } from "date-fns"





const popularTags = [
  { name: "React", count: 1234 },
  { name: "Next.js", count: 987 },
  { name: "JavaScript", count: 2156 },
  { name: "TypeScript", count: 876 },
  { name: "Node.js", count: 654 },
  { name: "PostgreSQL", count: 432 },
]

const QUESTIONS_PER_PAGE = 10

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredQuestions, setFilteredQuestions] = useState([]); //mockQuestions
  const [questions, setQuestions] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions"); // Replace with real endpoint
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []); // only fetch once on mount

  useEffect(() => {
    // Filter questions based on search query
    const filtered = questions.filter(
      (q) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Sort filtered questions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.votes - a.votes;
        case "answers":
          return b.answers - a.answers;
        case "views":
          return b.views - a.views;
        default: // "newest"
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [questions, searchQuery, sortBy]); 


  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE)
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE
  const endIndex = startIndex + QUESTIONS_PER_PAGE
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Questions</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredQuestions.length} questions found
                {currentPage > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
            <Link to="/ask">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105">
                Ask Question
              </button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["newest", "votes", "answers", "views"].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-3 py-2 text-sm rounded-md capitalize transition-colors flex items-center gap-1 ${
                    sortBy === sort
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {sort === "newest" && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  {sort === "votes" && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  )}
                  {sort === "answers" && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  )}
                  {sort === "views" && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  )}
                  {sort}
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {currentQuestions.length > 0 ? (
              currentQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.01] animate-fade-in"
                >
                  <div className="flex gap-4">
                    {/* Vote and Stats */}
                    <div className="flex flex-col items-center space-y-2 text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-lg">{question.votes}</span>
                        <span>votes</span>
                      </div>
                      <div
                        className={`flex flex-col items-center ${question.hasAcceptedAnswer ? "text-green-600" : ""}`}
                      >
                        <span className="font-semibold text-lg">{question.answers}</span>
                        <span>answers</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{question.views}</span>
                        <span>views</span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/questions/${question.id}`}>
                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer mb-2 line-clamp-2">
                          {question.title}
                        </h3>
                      </Link>
                      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{question.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Author and Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {question.author.name[0]}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{question.author.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No questions found matching your search.</p>
                <Link to="/ask">
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Ask the first question
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Popular Tags</h3>
            <div className="space-y-2">
              {popularTags.map((tag) => (
                <div
                  key={tag.name}
                  className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setSearchQuery(tag.name)}
                >
                  <span className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300">
                    {tag.name}
                  </span>
                  <span className="text-sm text-gray-500">{tag.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Community Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Questions</span>
                <span className="font-semibold text-gray-900 dark:text-white">{mockQuestions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Answers</span>
                <span className="font-semibold text-gray-900 dark:text-white">8,291</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Users</span>
                <span className="font-semibold text-gray-900 dark:text-white">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tags</span>
                <span className="font-semibold text-gray-900 dark:text-white">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
