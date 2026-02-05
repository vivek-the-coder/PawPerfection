import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseById,
  clearCurrentCourse,
} from "../features/courses/courseSlice";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Clock,
  ArrowLeft,
  Link as LinkIcon,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from 'react-hot-toast';

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, courseLoading, error } = useSelector(
    (state) => state.course
  );

  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  useEffect(() => {
    if (currentCourse && currentCourse.task) {
      const transformedLessons = currentCourse.task.map((task, index) => ({
        id: index + 1,
        title: task,
        duration: "15 min",
        content: `This lesson covers: ${task}. Follow the instructions carefully and practice with your dog.`,
        completed: false,
      }));
      setLessons(transformedLessons);
    }
  }, [currentCourse]);

  const markCompleted = (lessonId) => {
    let isCourseCompleting = false;

    setLessons((prev) => {
      const updatedLessons = prev.map((lesson) =>
        lesson.id === lessonId
          ? { ...lesson, completed: !lesson.completed }
          : lesson
      );
      
      const justCompleted = updatedLessons.find(l => l.id === lessonId)?.completed;
      const allCompleted = updatedLessons.every(l => l.completed);

      if (justCompleted) {
        if (allCompleted) {
          isCourseCompleting = true;
        } else {
           toast.success("Lesson marked as complete! Keep it up! 🐾", {
             icon: '👍',
             duration: 2000
           });
        }
      }

      return updatedLessons;
    });

    // We use a timeout to let the state update reflect first, and to separate the alerts slightly
    setTimeout(() => {
      if (isCourseCompleting) {
        toast.success("Congratulations! You've completed the course! 🏆", {
          duration: 5000,
          style: {
            border: '1px solid #10B981',
            padding: '16px',
            color: '#065F46',
            background: '#D1FAE5',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFAEE',
          },
        });
      }
    }, 100);
  };

  const goToPrevious = () => {
    if (currentLesson > 0) setCurrentLesson(currentLesson - 1);
  };

  const goToNext = () => {
    if (currentLesson < lessons.length - 1) setCurrentLesson(currentLesson + 1);
  };

  const goToLesson = (index) => {
    setCurrentLesson(index);
  };

  const handleBackToCourses = () => {
    navigate("/course");
  };

  if (courseLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen mb-4 flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Course
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleBackToCourses}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black font-bold"
            >
              Back to Courses
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!currentCourse) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen mt-4 flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course Not Found
            </h2>
            <button
              onClick={handleBackToCourses}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black font-bold"
            >
              Back to Courses
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Layout Area - Below Navbar */}
      <div className="flex flex-1 mt-20 pt-4 max-w-[1600px] mx-auto w-full items-start mb-20">
        
        {/* Sidebar - Lesson List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 hidden lg:flex sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-xl ml-4">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {currentCourse.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
               <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-xs font-bold border border-sky-100">Week {currentCourse.week}</span>
               <span className="font-medium">• {lessons.length} Lessons</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
               <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                 <span>Progress</span>
                 <span className="text-sky-600">{Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100)}%</span>
               </div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${(lessons.filter(l => l.completed).length / lessons.length) * 100}%` }}
                 ></div>
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {lessons.map((lesson, index) => (
               <div
                  key={lesson.id}
                  onClick={() => goToLesson(index)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-sky-50 ${
                    index === currentLesson ? "bg-sky-50 border-l-4 border-l-sky-500" : "border-l-4 border-l-transparent"
                  }`}
               >
                 <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                         e.stopPropagation();
                         markCompleted(lesson.id);
                      }}
                      className="mt-1 flex-shrink-0"
                    >
                      {lesson.completed ? (
                        <CheckCircle className="text-green-500 w-5 h-5" />
                      ) : (
                        <Circle className="text-gray-300 w-5 h-5 hover:text-green-500 transition-colors" />
                      )}
                    </button>
                    <div>
                       <h3 className={`font-bold text-sm leading-snug ${index === currentLesson ? 'text-sky-900' : 'text-gray-800'}`}>
                         {lesson.title}
                       </h3>
                       <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400 font-medium">
                          <Clock size={12} />
                          <span>{lesson.duration}</span>
                       </div>
                    </div>
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 bg-gray-50 p-4 lg:p-8">
           <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Mobile Header (visible only on small screens) */}
              <div className="lg:hidden mb-6">
                 <button onClick={handleBackToCourses} className="mb-4 flex items-center text-gray-600 font-medium">
                    <ArrowLeft size={16} className="mr-2"/> Back
                 </button>
                 <h1 className="text-2xl font-bold text-gray-900">{currentCourse.title}</h1>
              </div>

              {/* Video Placeholder Area Removed - Text Only Course */}
              
              {/* Lesson Navigation & Title */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
                 <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                    <div>
                      <span className="text-sm font-bold text-sky-600 tracking-wide uppercase mb-1 block">Lesson {lessons[currentLesson]?.id}</span>
                      <h2 className="text-3xl font-bold text-gray-900">
                          {lessons[currentLesson]?.title}
                      </h2>
                    </div>
                    <div className="flex gap-2">
                       <button 
                          onClick={goToPrevious} disabled={currentLesson === 0}
                          className="p-2 border rounded-full hover:bg-gray-50 disabled:opacity-30 transition-colors text-gray-600"
                       >
                          <ChevronLeft size={20} />
                       </button>
                       <button 
                          onClick={goToNext} disabled={currentLesson === lessons.length - 1}
                          className="p-2 border rounded-full hover:bg-gray-50 disabled:opacity-30 transition-colors text-gray-600"
                       >
                          <ChevronRight size={20} />
                       </button>
                    </div>
                 </div>

                 <div className="prose max-w-none text-gray-600 leading-relaxed text-lg">
                    <p>{lessons[currentLesson]?.content}</p>
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => markCompleted(lessons[currentLesson]?.id)}
                      className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                         lessons[currentLesson]?.completed 
                         ? 'bg-green-100 text-green-700 hover:bg-green-200'
                         : 'bg-gray-900 text-white hover:bg-black'
                      }`}
                    >
                      {lessons[currentLesson]?.completed ? (
                         <>
                            <CheckCircle size={18} />
                            Completed
                         </>
                      ) : (
                         <>
                            <Circle size={18} />
                            Mark as Complete
                         </>
                      )}
                    </button>
                 </div>
              </div>

              {/* Resources Section */}
              {currentCourse.resources && currentCourse.resources.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {currentCourse.resources.map((res, index) => (
                      <a 
                        key={index} 
                        href={res} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-sky-200 transition-all flex items-center gap-3 group"
                      >
                         <div className="p-2 bg-sky-50 text-sky-600 rounded-lg group-hover:bg-sky-100 transition-colors">
                            <LinkIcon size={20} />
                         </div>
                         <div className="overflow-hidden">
                            <p className="font-bold text-gray-900 truncate">Additional Resource {index + 1}</p>
                            <p className="text-sm text-gray-500 truncate group-hover:text-sky-600 transition-colors">{res}</p>
                         </div>
                      </a>
                   ))}
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default CourseViewer;
