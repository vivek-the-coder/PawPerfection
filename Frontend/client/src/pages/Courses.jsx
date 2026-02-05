import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../features/courses/courseSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CourseCard from "./CoursesCard";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Search } from "lucide-react";

const CoursesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <CoursesContent />
      </main>
      <Footer />
    </div>
  );
};

const CoursesContent = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.course);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const filteredCourses = courses?.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      {/* Hero Section - Aligned with Home Hero.jsx */}
      <div className="relative overflow-hidden bg-white py-20 px-4 pt-24">
         {/* Decorative elements matching Hero.jsx */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-sky-50 blur-3xl opacity-60"></div>
          <div className="absolute -bottom-40 left-0 w-96 h-96 rounded-full bg-gray-50 blur-3xl opacity-60"></div>
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-700 mb-6">
            <span className="text-sm font-bold tracking-wide uppercase">
              Expert Led Training
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Master Pet Training with <span className="text-sky-500">Expert Courses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover comprehensive training programs designed to help your furry friend reach their full potential.
          </p>
          
          {/* Search Bar - Cleaner Light Theme */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-0 bg-sky-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <input
              type="text"
              placeholder="Search for a course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full py-4 px-6 pl-12 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-lg text-lg transition-all"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {!courses || !Array.isArray(courses) || courses.length === 0 ? (
          <NoCourses />
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No courses found matching "{searchTerm}"</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
              <h2 className="text-3xl font-bold text-gray-900">Available Programs</h2>
              <span className="text-sky-700 font-bold bg-sky-50 px-4 py-1.5 rounded-full border border-sky-100">{filteredCourses.length} courses</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const ErrorMessage = ({ error }) => (
  <div className="container mx-auto px-4 py-20 text-center">
    <div className="inline-block p-4 bg-red-50 text-red-600 rounded-lg">
      <p className="font-semibold">Error loading courses</p>
      <p className="text-sm mt-1">{error}</p>
    </div>
  </div>
);

const NoCourses = () => (
  <div className="text-center py-20">
    <div className="inline-block p-6 bg-yellow-50 rounded-full mb-4">
      <Search className="w-12 h-12 text-yellow-500" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No Courses Available Yet</h3>
    <p className="text-gray-500">Check back soon for new training programs!</p>
  </div>
);

export default CoursesPage;