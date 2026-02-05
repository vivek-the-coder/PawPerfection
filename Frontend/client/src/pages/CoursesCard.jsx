import React, { useState } from "react";
import { Book, Calendar, Check, X, IndianRupee, Clock, Award, ChevronRight, Star, ShieldCheck } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import api from "../utils/api";

const CourseCard = ({ course }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = async () => {
    // Prevent multiple clicks if already paying (though toast.promise handles UI feedback well)
    if (isPaying) return;
    
    setIsPaying(true);
    
    try {
      const paymentPromise = (async () => {
        const payload = {
          price: course.price,
          trainingProgramId: course._id,
        };
        
        const { data } = await api.post("/payment/create-payment", payload, {
          headers: {
            'Idempotency-Key': uuidv4()
          }
        });

        if (data.success && data.data && data.data.url) {
          window.location.href = data.data.url;
          // Return a message for the success toast, though redirect happens fast
          return "Redirecting to payment...";
        }

        throw new Error("Unable to start checkout.");
      })();

      await toast.promise(paymentPromise, {
        loading: 'Initializing payment...',
        success: (msg) => msg,
        error: (err) => err.response?.data?.msg || err.message || "Payment failed to initialize."
      });

    } catch (error) {
      console.error("Payment error:", error);
      // Toast is handled by promise rejection logic above
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      <div className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-2">
        
        {/* Decorative Background Header */}
        <div className="relative h-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-sky-500/20 rounded-full blur-2xl"></div>
          
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold rounded-lg uppercase tracking-wider">
               <Calendar className="w-3 h-3" />
               Week {course.week}
            </span>
            <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
               <Award className="w-5 h-5 text-sky-400" />
            </div>
          </div>
        </div>
        
        <div className="p-6 flex-grow flex flex-col space-y-5 -mt-6">
          
          {/* Main Card Content */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative z-10">
             <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-sky-600 transition-colors">
              {course.title}
            </h3>
             <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
                <span className="text-sm text-gray-500 font-medium mb-1">/ program</span>
            </div>
          </div>

          <div className="flex-grow px-2">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Highlights</p>
             <TasksList tasks={course.task} />
          </div>

          <div className="pt-4 mt-auto">
            <button
               onClick={() => setIsOpen(true)}
               className="w-full py-4 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-all duration-300 flex items-center justify-between group/btn border border-gray-200"
            >
              <span>View Details</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover/btn:bg-sky-500 group-hover/btn:text-white transition-colors">
                 <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modal - Bottom to Top / Centered */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Panel */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slideUp overflow-hidden">
            
            {/* Header - White & Blue Theme */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r from-sky-50 to-white">
               <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full uppercase tracking-wide mb-3">
                    <Star className="w-3 h-3 fill-current" />
                    Premium Course
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {course.title}
                  </h2>
               </div>
               <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-full transition-colors shadow-sm border border-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-sky-50 rounded-2xl border border-sky-100 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-white rounded-lg shadow-sm text-sky-600">
                          <Clock className="w-5 h-5" />
                       </div>
                       <p className="text-sm text-sky-800 font-bold">Duration</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">Week {course.week}</p>
                 </div>
                 <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                          <IndianRupee className="w-5 h-5" />
                       </div>
                       <p className="text-sm text-blue-800 font-bold">Price</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹{course.price}</p>
                 </div>
              </div>

              {/* Curriculum Section */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                  What You'll Learn
                </h4>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <ul className="space-y-4">
                    {course.task.map((task, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full bg-sky-500 text-white font-bold text-xs shadow-sm">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 font-medium leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-10">
               <div className="flex items-center justify-between gap-4">
                 <div className="hidden md:block">
                    <p className="text-sm text-gray-500 font-medium">Total Investment</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">₹{course.price}</p>
                 </div>
                 <button 
                    onClick={handlePay}
                    disabled={isPaying}
                    className="flex-1 md:flex-none md:w-auto md:min-w-[200px] py-4 px-8 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform active:scale-[0.98]"
                  >
                    {isPaying ? (
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         Processing...
                      </div>
                    ) : (
                      <>
                        <span>Enroll Now</span>
                        <Book className="w-5 h-5" />
                      </>
                    )}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TasksList = ({ tasks }) => {
  const previewTasks = tasks.slice(0, 3); 

  return (
    <ul className="space-y-3">
      {previewTasks.map((task, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></div>
          <span className="text-sm text-gray-600 font-medium line-clamp-2">{task}</span>
        </li>
      ))}
      {tasks.length > 3 && (
        <li className="text-sky-600 text-xs font-bold pl-4.5 pt-1 uppercase tracking-wide flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          +{tasks.length - 3} more topics
        </li>
      )}
    </ul>
  );
};

export default CourseCard;
