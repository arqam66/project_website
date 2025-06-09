"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Book,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Target,
  Quote,
  Timer,
  TrendingUp,
  Plus,
  Star,
  Clock,
  Bookmark,
  Archive,
  Edit,
  Trash2,
  Search,
  BookMarked,
  Moon,
  Sun,
} from "lucide-react"
import { format } from "date-fns"

// Enhanced book interface with more data
interface BookData {
  id: number
  title: string
  author: string
  genre: string
  excerpt: string
  pages: number
  dateAdded: Date
  dateStarted?: Date
  dateFinished?: Date
  rating?: number
  status: "to-read" | "reading" | "completed" | "paused"
  notes: string
  readingProgress: number
  timeSpent: number // in minutes
  tags: string[]
}

interface ReadingSession {
  id: number
  bookId: number
  date: Date
  duration: number // in minutes
  pagesRead: number
  notes: string
}

interface QuoteData {
  id: number
  text: string
  author: string
  book: string
  bookId?: number
  dateAdded: Date
  page?: number
  tags: string[]
}

// Custom hooks
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    },
    [key, storedValue],
  )

  return [storedValue, setValue] as const
}

const useReadingTimer = () => {
  const [isActive, setIsActive] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  const start = useCallback(() => setIsActive(true), [])
  const pause = useCallback(() => setIsActive(false), [])
  const reset = useCallback(() => {
    setSeconds(0)
    setIsActive(false)
  }, [])

  return { seconds, isActive, start, pause, reset }
}

// Enhanced sample data
const initialBooks: BookData[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    pages: 180,
    dateAdded: new Date("2024-01-15"),
    dateStarted: new Date("2024-01-20"),
    dateFinished: new Date("2024-02-05"),
    rating: 5,
    status: "completed",
    readingProgress: 100,
    timeSpent: 420,
    notes: "A masterpiece of American literature. The symbolism and themes are incredibly deep.",
    tags: ["classic", "american", "symbolism"],
    excerpt:
      "In my younger and more vulnerable years my father gave me some advice that I've carried with me ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'",
  },
  {
    id: 2,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    pages: 432,
    dateAdded: new Date("2024-02-10"),
    dateStarted: new Date("2024-02-15"),
    rating: 4,
    status: "reading",
    readingProgress: 65,
    timeSpent: 280,
    notes: "Enjoying the wit and social commentary. Elizabeth Bennet is a fantastic character.",
    tags: ["romance", "classic", "british"],
    excerpt:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families.",
  },
  {
    id: 3,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    pages: 310,
    dateAdded: new Date("2024-03-01"),
    status: "to-read",
    readingProgress: 0,
    timeSpent: 0,
    notes: "Looking forward to this adventure!",
    tags: ["fantasy", "adventure", "tolkien"],
    excerpt:
      "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
  },
  {
    id: 4,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    pages: 320,
    dateAdded: new Date("2024-01-05"),
    dateStarted: new Date("2024-01-10"),
    rating: 5,
    status: "completed",
    readingProgress: 100,
    timeSpent: 380,
    notes: "Life-changing book about building good habits and breaking bad ones.",
    tags: ["self-help", "productivity", "habits"],
    excerpt:
      "The aggregation of marginal gains is a philosophy that emphasizes the incredible power of making small improvements consistently. If you can get 1% better each day for one year, you'll end up thirty-seven times better by the time you're done.",
  },
  {
    id: 5,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    pages: 688,
    dateAdded: new Date("2024-02-20"),
    dateStarted: new Date("2024-03-01"),
    status: "reading",
    readingProgress: 25,
    timeSpent: 180,
    notes: "Complex world-building. Taking notes to keep track of all the factions and terminology.",
    tags: ["sci-fi", "epic", "politics"],
    excerpt:
      "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path.",
  },
  {
    id: 6,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance",
    pages: 256,
    dateAdded: new Date("2024-03-10"),
    status: "to-read",
    readingProgress: 0,
    timeSpent: 0,
    notes: "Recommended by a friend. Excited to learn about behavioral finance.",
    tags: ["finance", "psychology", "investing"],
    excerpt:
      "The premise of this book is that doing well with money has a little to do with how smart you are and a lot to do with how you behave. And behavior is hard to teach, even to really smart people.",
  },
]

const initialQuotes: QuoteData[] = [
  {
    id: 1,
    text: "So we beat on, boats against the current, borne back ceaselessly into the past.",
    author: "F. Scott Fitzgerald",
    book: "The Great Gatsby",
    bookId: 1,
    dateAdded: new Date("2024-02-05"),
    page: 180,
    tags: ["philosophy", "time", "struggle"],
  },
  {
    id: 2,
    text: "I must not fear. Fear is the mind-killer.",
    author: "Frank Herbert",
    book: "Dune",
    bookId: 5,
    dateAdded: new Date("2024-03-05"),
    page: 8,
    tags: ["courage", "fear", "mental-strength"],
  },
  {
    id: 3,
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    book: "Atomic Habits",
    bookId: 4,
    dateAdded: new Date("2024-01-25"),
    page: 27,
    tags: ["habits", "systems", "goals"],
  },
]

export default function ReadingApp() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useLocalStorage("reading-app-dark-mode", false)

  // Core state management with localStorage
  const [books, setBooks] = useLocalStorage<BookData[]>("reading-app-books", initialBooks)
  const [quotes, setQuotes] = useLocalStorage<QuoteData[]>("reading-app-quotes", initialQuotes)
  const [readingSessions, setReadingSessions] = useLocalStorage<ReadingSession[]>("reading-sessions", [])

  // Reader tab state
  const [selectedBook, setSelectedBook] = useState<number | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [readingSpeed, setReadingSpeed] = useState([100])
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Book Keeper state
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterGenre, setFilterGenre] = useState<string>("all")
  const [editingBook, setEditingBook] = useState<BookData | null>(null)
  const [newBook, setNewBook] = useState<Partial<BookData>>({
    title: "",
    author: "",
    genre: "",
    excerpt: "",
    pages: 0,
    notes: "",
    tags: [],
  })

  // Quote management
  const [newQuote, setNewQuote] = useState<Partial<QuoteData>>({
    text: "",
    author: "",
    book: "",
    page: 0,
    tags: [],
  })

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [timerActive, setTimerActive] = useState(false)
  const [currentReadingSession, setCurrentReadingSession] = useState<Partial<ReadingSession> | null>(null)

  // Custom reading timer hook
  const readingTimer = useReadingTimer()

  // Date state
  const [currentDate] = useState(new Date())

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Typewriter effect
  useEffect(() => {
    if (isReading && selectedBook && currentIndex < getCurrentExcerpt().length) {
      intervalRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev + getCurrentExcerpt()[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, readingSpeed[0])
    } else if (currentIndex >= getCurrentExcerpt().length && selectedBook) {
      setIsComplete(true)
      setIsReading(false)
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isReading, currentIndex, readingSpeed, selectedBook])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
      // Save reading session when timer completes
      if (currentReadingSession && selectedBook) {
        const session: ReadingSession = {
          id: Date.now(),
          bookId: selectedBook,
          date: new Date(),
          duration: timerMinutes,
          pagesRead: currentReadingSession.pagesRead || 0,
          notes: currentReadingSession.notes || "",
        }
        setReadingSessions((prev) => [...prev, session])
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeLeft, timerMinutes, currentReadingSession, selectedBook])

  // Auto-save effect for reading progress
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (readingTimer.isActive && selectedBook) {
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === selectedBook ? { ...book, timeSpent: book.timeSpent + 1 } : book)),
        )
      }
    }, 60000) // Save every minute

    return () => clearInterval(saveInterval)
  }, [readingTimer.isActive, selectedBook, setBooks])

  // Memoized filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || book.status === filterStatus
      const matchesGenre = filterGenre === "all" || book.genre === filterGenre
      return matchesSearch && matchesStatus && matchesGenre
    })
  }, [books, searchTerm, filterStatus, filterGenre])

  // Memoized statistics
  const statistics = useMemo(() => {
    const completedBooks = books.filter((book) => book.status === "completed")
    const totalPages = completedBooks.reduce((sum, book) => sum + book.pages, 0)
    const totalTime = books.reduce((sum, book) => sum + book.timeSpent, 0)
    const averageRating =
      completedBooks.length > 0
        ? completedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / completedBooks.length
        : 0

    return {
      booksRead: completedBooks.length,
      pagesRead: totalPages,
      totalTime: Math.round(totalTime / 60), // Convert to hours
      averageRating: Math.round(averageRating * 10) / 10,
      currentlyReading: books.filter((book) => book.status === "reading").length,
      toRead: books.filter((book) => book.status === "to-read").length,
    }
  }, [books])

  // Helper functions
  const getCurrentExcerpt = useCallback(() => {
    if (!selectedBook) return ""
    const book = books.find((b) => b.id === selectedBook)
    return book?.excerpt || ""
  }, [selectedBook, books])

  const startReading = useCallback(() => {
    if (!selectedBook) return
    setIsReading(true)
    setIsComplete(false)
    readingTimer.start()
  }, [selectedBook, readingTimer])

  const pauseReading = useCallback(() => {
    setIsReading(false)
    readingTimer.pause()
  }, [readingTimer])

  const resetReading = useCallback(() => {
    setIsReading(false)
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
    readingTimer.reset()
  }, [readingTimer])

  const addBook = useCallback(() => {
    if (newBook.title && newBook.author) {
      const book: BookData = {
        id: Date.now(),
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre || "Uncategorized",
        excerpt: newBook.excerpt || "",
        pages: newBook.pages || 0,
        dateAdded: new Date(),
        status: "to-read",
        readingProgress: 0,
        timeSpent: 0,
        notes: newBook.notes || "",
        tags: newBook.tags || [],
      }
      setBooks((prev) => [...prev, book])
      setNewBook({ title: "", author: "", genre: "", excerpt: "", pages: 0, notes: "", tags: [] })
    }
  }, [newBook, setBooks])

  const updateBook = useCallback(
    (updatedBook: BookData) => {
      setBooks((prev) => prev.map((book) => (book.id === updatedBook.id ? updatedBook : book)))
      setEditingBook(null)
    },
    [setBooks],
  )

  const deleteBook = useCallback(
    (bookId: number) => {
      setBooks((prev) => prev.filter((book) => book.id !== bookId))
    },
    [setBooks],
  )

  const addQuote = useCallback(() => {
    if (newQuote.text && newQuote.author) {
      const quote: QuoteData = {
        id: Date.now(),
        text: newQuote.text,
        author: newQuote.author,
        book: newQuote.book || "",
        bookId: newQuote.bookId,
        dateAdded: new Date(),
        page: newQuote.page,
        tags: newQuote.tags || [],
      }
      setQuotes((prev) => [...prev, quote])
      setNewQuote({ text: "", author: "", book: "", page: 0, tags: [] })
    }
  }, [newQuote, setQuotes])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }, [])

  const getUniqueGenres = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.genre)))
  }, [books])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      } p-2 sm:p-4 lg:p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Theme Toggle */}
        <div className="text-center mb-6 sm:mb-8 relative">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <Sun className={`w-4 h-4 transition-colors ${isDarkMode ? "text-gray-400" : "text-yellow-500"}`} />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-blue-200"
            />
            <Moon className={`w-4 h-4 transition-colors ${isDarkMode ? "text-blue-400" : "text-gray-400"}`} />
          </div>

          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 transition-colors ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Reading Companion
          </h1>
          <p
            className={`text-sm sm:text-base lg:text-lg transition-colors ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your complete reading experience toolkit
          </p>
          <div
            className={`mt-2 text-xs sm:text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {format(currentDate, "EEEE, MMMM do, yyyy")}
          </div>
        </div>

        <Tabs defaultValue="reader" className="w-full">
          <TabsList
            className={`grid w-full grid-cols-3 sm:grid-cols-6 lg:grid-cols-7 mb-6 sm:mb-8 h-auto p-1 rounded-xl transition-colors ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-sm border-gray-200"
            }`}
          >
            {[
              { value: "library", icon: Book, label: "Library" },
              { value: "reader", icon: BookOpen, label: "Reader" },
              { value: "bookkeeper", icon: BookMarked, label: "Keeper" },
              { value: "statistics", icon: TrendingUp, label: "Stats" },
              { value: "challenges", icon: Target, label: "Goals" },
              { value: "quotes", icon: Quote, label: "Quotes" },
              { value: "timer", icon: Timer, label: "Timer" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-700/50 text-gray-300"
                    : "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <Card
              className={`transition-colors border-2 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 backdrop-blur-sm"
              }`}
            >
              <CardHeader>
                <CardTitle className={`transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Add New Book
                </CardTitle>
                <CardDescription className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Add books to your personal library
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Book title"
                    value={newBook.title || ""}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className={`transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <Input
                    placeholder="Author"
                    value={newBook.author || ""}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className={`transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Genre"
                    value={newBook.genre || ""}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    className={`transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <Input
                    type="number"
                    placeholder="Number of pages"
                    value={newBook.pages || ""}
                    onChange={(e) => setNewBook({ ...newBook, pages: Number.parseInt(e.target.value) || 0 })}
                    className={`transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <Textarea
                  placeholder="Add an excerpt or description"
                  value={newBook.excerpt || ""}
                  onChange={(e) => setNewBook({ ...newBook, excerpt: e.target.value })}
                  className={`transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      : "bg-white border-gray-300"
                  }`}
                />
                <Textarea
                  placeholder="Personal notes"
                  value={newBook.notes || ""}
                  onChange={(e) => setNewBook({ ...newBook, notes: e.target.value })}
                  className={`transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      : "bg-white border-gray-300"
                  }`}
                />
                <Button
                  onClick={addBook}
                  className={`w-full transition-all duration-200 transform hover:scale-105 ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className={`text-2xl font-semibold transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Your Library ({books.length} books)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.map((book) => (
                  <Card
                    key={book.id}
                    className={`hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 ${
                      isDarkMode
                        ? "bg-gray-800/50 border-gray-700 hover:border-gray-600 backdrop-blur-sm"
                        : "bg-white/80 border-gray-200 hover:border-gray-300 backdrop-blur-sm"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle
                            className={`text-lg line-clamp-2 transition-colors ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {book.title}
                          </CardTitle>
                          <CardDescription
                            className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                          >
                            by {book.author}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            book.status === "completed"
                              ? "default"
                              : book.status === "reading"
                                ? "secondary"
                                : "outline"
                          }
                          className={`transition-colors ${
                            isDarkMode && book.status === "completed"
                              ? "bg-green-600 text-white"
                              : isDarkMode && book.status === "reading"
                                ? "bg-blue-600 text-white"
                                : ""
                          }`}
                        >
                          {book.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          variant="outline"
                          className={`text-xs transition-colors ${
                            isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
                          }`}
                        >
                          {book.genre}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs transition-colors ${
                            isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
                          }`}
                        >
                          {book.pages} pages
                        </Badge>
                      </div>
                      {book.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 transition-colors ${
                                i < book.rating!
                                  ? "fill-yellow-400 text-yellow-400"
                                  : isDarkMode
                                    ? "text-gray-600"
                                    : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {book.readingProgress > 0 && (
                        <div className="space-y-1">
                          <div
                            className={`flex justify-between text-sm transition-colors ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            <span>Progress</span>
                            <span>{book.readingProgress}%</span>
                          </div>
                          <Progress value={book.readingProgress} className="h-2" />
                        </div>
                      )}
                      <p
                        className={`text-sm line-clamp-2 transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {book.excerpt}
                      </p>
                      <div className={`text-xs transition-colors ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Added: {format(book.dateAdded, "MMM dd, yyyy")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Book Keeper Tab */}
          <TabsContent value="bookkeeper" className="space-y-6">
            {/* Search and Filter Controls */}
            <Card
              className={`transition-colors border-2 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 backdrop-blur-sm"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  <BookMarked className="w-5 h-5" />
                  Book Keeper Dashboard
                </CardTitle>
                <CardDescription className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Manage and track your reading journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors ${
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <Input
                      placeholder="Search books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger
                      className={`transition-colors ${
                        isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="to-read">To Read</SelectItem>
                      <SelectItem value="reading">Currently Reading</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterGenre} onValueChange={setFilterGenre}>
                    <SelectTrigger
                      className={`transition-colors ${
                        isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Filter by genre" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                      <SelectItem value="all">All Genres</SelectItem>
                      {getUniqueGenres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Completed", value: statistics.booksRead, color: "green" },
                { label: "Reading", value: statistics.currentlyReading, color: "blue" },
                { label: "To Read", value: statistics.toRead, color: "orange" },
                { label: "Avg Rating", value: statistics.averageRating, color: "purple" },
              ].map(({ label, value, color }) => (
                <Card
                  key={label}
                  className={`transition-all duration-300 hover:scale-105 border-2 ${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                      : "bg-white/80 border-gray-200 backdrop-blur-sm"
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`text-2xl font-bold transition-colors ${
                        color === "green"
                          ? isDarkMode
                            ? "text-green-400"
                            : "text-green-600"
                          : color === "blue"
                            ? (isDarkMode ? "text-blue-400" : "text-blue-600")
                            : color === "orange"
                              ? isDarkMode
                                ? "text-orange-400"
                                : "text-orange-600"
                              : isDarkMode
                                ? "text-purple-400"
                                : "text-purple-600"
                      }`}
                    >
                      {value}
                    </div>
                    <div className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Book List */}
            <Card
              className={`transition-colors border-2 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 backdrop-blur-sm"
              }`}
            >
              <CardHeader>
                <CardTitle className={`transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Book Details ({filteredBooks.length} books)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className={`border rounded-lg p-4 transition-all duration-200 hover:scale-[1.02] ${
                        isDarkMode
                          ? "border-gray-700 hover:bg-gray-700/30 bg-gray-800/30"
                          : "border-gray-200 hover:bg-gray-50 bg-white/50"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3
                              className={`font-semibold text-lg transition-colors ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {book.title}
                            </h3>
                            <Badge
                              variant={
                                book.status === "completed"
                                  ? "default"
                                  : book.status === "reading"
                                    ? "secondary"
                                    : "outline"
                              }
                              className={`transition-colors ${
                                isDarkMode && book.status === "completed"
                                  ? "bg-green-600 text-white"
                                  : isDarkMode && book.status === "reading"
                                    ? "bg-blue-600 text-white"
                                    : ""
                              }`}
                            >
                              {book.status}
                            </Badge>
                          </div>
                          <p className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            by {book.author} • {book.genre} • {book.pages} pages
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className={`transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                              <span className="font-medium">Added:</span> {format(book.dateAdded, "MMM dd, yyyy")}
                            </div>
                            {book.dateStarted && (
                              <div className={`transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                <span className="font-medium">Started:</span> {format(book.dateStarted, "MMM dd, yyyy")}
                              </div>
                            )}
                            {book.dateFinished && (
                              <div className={`transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                <span className="font-medium">Finished:</span>{" "}
                                {format(book.dateFinished, "MMM dd, yyyy")}
                              </div>
                            )}
                          </div>

                          {book.readingProgress > 0 && (
                            <div className="space-y-1">
                              <div
                                className={`flex justify-between text-sm transition-colors ${
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                <span>Reading Progress</span>
                                <span>{book.readingProgress}%</span>
                              </div>
                              <Progress value={book.readingProgress} className="h-2" />
                            </div>
                          )}

                          <div
                            className={`flex items-center gap-4 text-sm transition-colors ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDuration(book.timeSpent)}
                            </div>
                            {book.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {book.rating}/5
                              </div>
                            )}
                          </div>

                          {book.notes && (
                            <p
                              className={`text-sm p-2 rounded transition-colors ${
                                isDarkMode ? "text-gray-300 bg-gray-700/50" : "text-gray-700 bg-gray-100"
                              }`}
                            >
                              <strong>Notes:</strong> {book.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBook(book)}
                            className={`transition-all duration-200 hover:scale-105 ${
                              isDarkMode
                                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteBook(book.id)}
                            className={`transition-all duration-200 hover:scale-105 ${
                              isDarkMode
                                ? "border-red-600 text-red-400 hover:bg-red-900/20"
                                : "border-red-300 text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reading Sessions */}
            {readingSessions.length > 0 && (
              <Card
                className={`transition-colors border-2 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                    : "bg-white/80 border-gray-200 backdrop-blur-sm"
                }`}
              >
                <CardHeader>
                  <CardTitle className={`transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Recent Reading Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {readingSessions
                      .slice(-5)
                      .reverse()
                      .map((session) => {
                        const book = books.find((b) => b.id === session.bookId)
                        return (
                          <div
                            key={session.id}
                            className={`flex justify-between items-center p-3 rounded transition-colors ${
                              isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                            }`}
                          >
                            <div>
                              <div
                                className={`font-medium transition-colors ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {book?.title || "Unknown Book"}
                              </div>
                              <div
                                className={`text-sm transition-colors ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {format(session.date, "MMM dd, yyyy")} • {formatDuration(session.duration)}
                                {session.pagesRead > 0 && ` • ${session.pagesRead} pages`}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reader Tab */}
          <TabsContent value="reader" className="space-y-6">
            <Card
              className={`transition-colors border-2 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 backdrop-blur-sm"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  <BookOpen className="w-5 h-5" />
                  Immersive Reading Experience
                </CardTitle>
                <CardDescription className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Experience mindful reading with our typewriter effect
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Book Selection */}
                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Select a Book
                  </label>
                  <Select
                    value={selectedBook?.toString()}
                    onValueChange={(value) => {
                      setSelectedBook(Number.parseInt(value))
                      resetReading()
                    }}
                  >
                    <SelectTrigger
                      className={`transition-colors ${
                        isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Choose a book to read" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id.toString()}>
                          {book.title} by {book.author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Reading Speed: {readingSpeed[0]}ms per character
                  </label>
                  <Slider
                    value={readingSpeed}
                    onValueChange={setReadingSpeed}
                    max={200}
                    min={20}
                    step={10}
                    className="w-full"
                  />
                  <div
                    className={`flex justify-between text-xs transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>Fast (20ms)</span>
                    <span>Slow (200ms)</span>
                  </div>
                </div>

                {/* Reading Controls */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={startReading}
                    disabled={!selectedBook || isReading}
                    className={`flex items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
                      isDarkMode
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25"
                        : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25"
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    Start Reading
                  </Button>
                  <Button
                    onClick={pauseReading}
                    disabled={!isReading}
                    variant="outline"
                    className={`flex items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                  <Button
                    onClick={resetReading}
                    variant="outline"
                    className={`flex items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>

                {/* Reading Status */}
                {selectedBook && (
                  <div className="text-center space-y-2">
                    <div className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {isReading ? "Reading..." : isComplete ? "Complete!" : "Ready to read"}
                    </div>
                    <Progress value={(currentIndex / getCurrentExcerpt().length) * 100} className="w-full" />
                    <div className={`text-xs transition-colors ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                      Reading Time: {formatTime(readingTimer.seconds)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reading Area */}
            {selectedBook && (
              <Card
                className={`border-2 transition-colors ${
                  isDarkMode
                    ? "bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-700/50 backdrop-blur-sm"
                    : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                }`}
              >
                <CardHeader>
                  <CardTitle className={`text-center transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {books.find((b) => b.id === selectedBook)?.title}
                  </CardTitle>
                  <CardDescription
                    className={`text-center transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    by {books.find((b) => b.id === selectedBook)?.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`min-h-[200px] p-4 sm:p-6 rounded-lg shadow-inner transition-colors ${
                      isDarkMode ? "bg-gray-800/50" : "bg-white"
                    }`}
                  >
                    <p
                      className={`text-base sm:text-lg leading-relaxed font-serif transition-colors ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {displayedText}
                      {isReading && <span className="animate-pulse">|</span>}
                    </p>
                    {isComplete && (
                      <div
                        className={`mt-4 p-4 rounded-lg text-center transition-colors ${
                          isDarkMode ? "bg-green-900/30 border border-green-700" : "bg-green-50"
                        }`}
                      >
                        <p
                          className={`font-medium transition-colors ${
                            isDarkMode ? "text-green-300" : "text-green-800"
                          }`}
                        >
                          ✨ Reading complete! Take a moment to reflect on what you've read.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reading Tips */}
            <Card
              className={`border-2 transition-colors ${
                isDarkMode ? "bg-blue-900/20 border-blue-700/50 backdrop-blur-sm" : "bg-blue-50 border-blue-200"
              }`}
            >
              <CardHeader>
                <CardTitle className={`transition-colors ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}>
                  Reading Tips
                </CardTitle>
              </CardHeader>
              <CardContent className={`transition-colors ${isDarkMode ? "text-blue-200" : "text-blue-700"}`}>
                <ul className="space-y-2 text-sm">
                  <li>• Find a quiet, comfortable space for your reading session</li>
                  <li>• Adjust the speed to match your natural reading pace</li>
                  <li>• Use the pause feature to reflect on important passages</li>
                  <li>• The typewriter effect helps improve focus and comprehension</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Books Read", value: statistics.booksRead, desc: "Completed this year", icon: Book },
                  { title: "Pages Read", value: statistics.pagesRead, desc: "Total pages", icon: BookOpen },
                  { title: "Reading Time", value: `${statistics.totalTime}h`, desc: "Total time spent", icon: Clock },
                  { title: "Average Rating", value: statistics.averageRating, desc: "Out of 5 stars", icon: Star },
                  {
                    title: "Currently Reading",
                    value: statistics.currentlyReading,
                    desc: "Active books",
                    icon: Bookmark,
                  },
                  { title: "To Read", value: statistics.toRead, desc: "In your queue", icon: Archive },
                ].map(({ title, value, desc, icon: Icon }) => (
                  <Card
                    key={title}
                    className={`transition-all duration-300 hover:scale-105 border-2 ${
                      isDarkMode
                        ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                        : "bg-white/80 border-gray-200 backdrop-blur-sm"
                    }`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle
                        className={`text-sm font-medium transition-colors ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {title}
                      </CardTitle>
                      <Icon className={`h-4 w-4 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold transition-colors ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {value}
                      </div>
                      <p className={`text-xs transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Reading Progress Chart */}
              <Card
                className={`transition-colors border-2 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                    : "bg-white/80 border-gray-200 backdrop-blur-sm"
                }`}
              >
                <CardHeader>
                  <CardTitle className={`transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Reading Progress by Genre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getUniqueGenres.map((genre) => {
                      const genreBooks = books.filter((book) => book.genre === genre)
                      const completedInGenre = genreBooks.filter((book) => book.status === "completed").length
                      const percentage = genreBooks.length > 0 ? (completedInGenre / genreBooks.length) * 100 : 0

                      return (
                        <div key={genre} className="space-y-2">
                          <div
                            className={`flex justify-between text-sm transition-colors ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <span>{genre}</span>
                            <span>
                              {completedInGenre}/{genreBooks.length} books
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <Card
              className={`transition-colors border-2 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 backdrop-blur-sm"
              }`}
            >
              <CardHeader>
                <CardTitle className={`transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Reading Challenges
                </CardTitle>
                <CardDescription className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Track your reading goals and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: `Read ${statistics.booksRead + 8} books this year`,
                    current: statistics.booksRead,
                    target: 20,
                  },
                  { title: `Read ${statistics.pagesRead + 1153} pages`, current: statistics.pagesRead, target: 5000 },
                  {
                    title: `Explore ${getUniqueGenres.length} different genres`,
                    current: getUniqueGenres.length,
                    target: 10,
                  },
                ].map(({ title, current, target }) => {
                  const percentage = Math.round((current / target) * 100)
                  return (
                    <div key={title} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {title}
                        </h3>
                        <Badge
                          variant={percentage >= 100 ? "default" : "secondary"}
                          className={`transition-colors ${
                            isDarkMode && percentage >= 100 ? "bg-green-600 text-white" : ""
                          }`}
                        >
                          {current}/{target}
                        </Badge>
                      </div>
                      <Progress value={percentage} className="w-full" />
                      <p className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {percentage}% complete
                      </p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <Card
              className={`transition-colors border-2 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 backdrop-blur-sm"
              }`}
            >
              <CardHeader>
                <CardTitle className={`transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Add New Quote
                </CardTitle>
                <CardDescription className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Save your favorite quotes from books
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter the quote"
                  value={newQuote.text || ""}
                  onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                  className={`transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      : "bg-white border-gray-300"
                  }`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Author"
                    value={newQuote.author || ""}
                    onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                    className={`transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <Input
                    placeholder="Book title"
                    value={newQuote.book || ""}
                    onChange={(e) => setNewQuote({ ...newQuote, book: e.target.value })}
                    className={`transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Page number (optional)"
                    value={newQuote.page || ""}
                    onChange={(e) => setNewQuote({ ...newQuote, page: Number.parseInt(e.target.value) || 0 })}
                    className={`transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <Select
                    value={newQuote.bookId?.toString() || ""}
                    onValueChange={(value) => setNewQuote({ ...newQuote, bookId: Number.parseInt(value) })}
                  >
                    <SelectTrigger
                      className={`transition-colors ${
                        isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Link to book (optional)" />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id.toString()}>
                          {book.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={addQuote}
                  className={`w-full transition-all duration-200 transform hover:scale-105 ${
                    isDarkMode
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25"
                      : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25"
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quote
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className={`text-2xl font-semibold transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Your Favorite Quotes ({quotes.length})
              </h3>
              {quotes.map((quote) => (
                <Card
                  key={quote.id}
                  className={`hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 ${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                      : "bg-white/80 border-gray-200 backdrop-blur-sm"
                  }`}
                >
                  <CardContent className="pt-6">
                    <blockquote
                      className={`text-base sm:text-lg italic mb-4 transition-colors ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      "{quote.text}"
                    </blockquote>
                    <div
                      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm transition-colors ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span>— {quote.author}</span>
                        <span className="italic">{quote.book}</span>
                        {quote.page && <span>Page {quote.page}</span>}
                      </div>
                      <span className="text-xs">{format(quote.dateAdded, "MMM dd, yyyy")}</span>
                    </div>
                    {quote.tags && quote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {quote.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`text-xs transition-colors ${
                              isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
                            }`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Timer Tab */}
          <TabsContent value="timer">
            <div className="max-w-md mx-auto space-y-6">
              <Card
                className={`transition-colors border-2 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
                    : "bg-white/80 border-gray-200 backdrop-blur-sm"
                }`}
              >
                <CardHeader className="text-center">
                  <CardTitle className={`transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Reading Timer
                  </CardTitle>
                  <CardDescription className={`transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Set focused reading sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div
                      className={`text-4xl sm:text-6xl font-mono font-bold mb-4 transition-colors ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {formatTime(timeLeft)}
                    </div>
                    <Progress
                      value={((timerMinutes * 60 - timeLeft) / (timerMinutes * 60)) * 100}
                      className="w-full mb-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`text-sm font-medium transition-colors ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Session Length: {timerMinutes} minutes
                    </label>
                    <Slider
                      value={[timerMinutes]}
                      onValueChange={(value) => {
                        setTimerMinutes(value[0])
                        if (!timerActive) {
                          setTimeLeft(value[0] * 60)
                        }
                      }}
                      max={60}
                      min={5}
                      step={5}
                      className="w-full"
                      disabled={timerActive}
                    />
                  </div>

                  {selectedBook && (
                    <div className="space-y-2">
                      <label
                        className={`text-sm font-medium transition-colors ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Reading Session for:
                      </label>
                      <div
                        className={`p-2 rounded text-sm transition-colors ${
                          isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {books.find((b) => b.id === selectedBook)?.title}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => setTimerActive(!timerActive)}
                      className={`flex items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                      }`}
                    >
                      {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {timerActive ? "Pause" : "Start"}
                    </Button>
                    <Button
                      onClick={() => {
                        setTimerActive(false)
                        setTimeLeft(timerMinutes * 60)
                      }}
                      variant="outline"
                      className={`flex items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>

                  {timeLeft === 0 && (
                    <div
                      className={`text-center p-4 rounded-lg transition-colors ${
                        isDarkMode ? "bg-green-900/30 border border-green-700" : "bg-green-50"
                      }`}
                    >
                      <p
                        className={`font-medium transition-colors ${isDarkMode ? "text-green-300" : "text-green-800"}`}
                      >
                        🎉 Session complete! Great job reading!
                      </p>
                    </div>
                  )}

                  <div
                    className={`text-center text-sm transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <p>Current session: {formatTime(readingTimer.seconds)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
