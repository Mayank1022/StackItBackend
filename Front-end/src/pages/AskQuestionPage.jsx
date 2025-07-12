import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { RichTextEditor } from "../components/RichTextEditor"
import { TagInput } from "../components/TagInput"
import { useToast } from "../hooks/useToast"
import { sendData } from "../utils/Data" 

export function AskQuestionPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your question.",
        variant: "destructive",
      })
      return
    }

    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description for your question.",
        variant: "destructive",
      })
      return
    }

    if (tags.length === 0) {
      toast({
        title: "Tags required",
        description: "Please add at least one tag to your question.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const data = {
      title: title.trim(),
      description: description.trim(),
      tags,
      createdAt: new Date().toISOString(), // Optional
    };

    sendData("/api/questions", data);

    setIsSubmitting(false)
    
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ask a Question</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Get help from the community by asking a detailed question
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Question Title</h3>
              </div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Be specific and imagine you're asking a question to another person
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How to implement JWT authentication in Next.js?"
                maxLength={150}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-500 mt-1">{title.length}/150 characters</div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question Details</h3>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Provide all the details someone would need to understand and answer your question
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Describe your question in detail..."
              />
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add up to 5 tags to describe what your question is about
              </label>
              <TagInput tags={tags} onChange={setTags} placeholder="e.g., react, javascript, next.js" maxTags={5} />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg transition-colors"
              >
                {isSubmitting ? "Posting..." : "Post Question"}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Writing a good question</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Steps to write a great question:</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Summarize your problem in a one-line title</li>
                  <li>• Describe your problem in more detail</li>
                  <li>• Describe what you tried and what you expected to happen</li>
                  <li>• Add relevant tags to help others find your question</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "JavaScript", "Next.js", "TypeScript", "Node.js", "CSS"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (!tags.includes(tag) && tags.length < 5) {
                      setTags([...tags, tag])
                    }
                  }}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
