import React from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white pt-20 pb-16 lg:pt-16 lg:pb-28 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-700 mb-4">
              <span className="flex items-center text-sm font-bold tracking-wide uppercase">
                <Star className="h-4 w-4 mr-2 text-sky-500 fill-current" />
                #1 Voted Pet Training Platform
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              Master Pet Training <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-600">
                From Home
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Professional dog training, behavior correction, and nutritional guidance. 
              Join over 10,000+ happy pet parents transforming their relationship with their pets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/course')}
                className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center font-bold text-lg"
              >
                Start Training Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              {/* <button 
                className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200 flex items-center justify-center font-bold text-lg group"
              >
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center mr-3 group-hover:bg-sky-100 transition-colors">
                  <Play className="h-4 w-4 text-sky-600 ml-1" />
                </div>
                Watch Demo
              </button> */}
            </div>
{/* 
            <div className="pt-8 flex items-center gap-8 border-t border-gray-100">
               <div>
                  <p className="text-3xl font-bold text-gray-900">10k+</p>
                  <p className="text-gray-500 text-sm">Active Students</p>
               </div>
               <div className="w-px h-10 bg-gray-200"></div>
               <div>
                  <p className="text-3xl font-bold text-gray-900">4.9</p>
                   <div className="flex items-center">
                     <div className="flex text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                     </div>
                   </div>
                  <p className="text-gray-500 text-sm mt-1">User Rating</p>
               </div>
            </div> */}
          </div>

          {/* Image Content */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Abstract shapes/blobs behind image */}
              <div className="absolute top-0 right-0 -mr-12 w-72 h-72 bg-sky-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 left-0 -ml-12 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                alt="Happy dog with owner" 
                className="relative z-10 rounded-[2.5rem] shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 object-cover w-full h-full border-4 border-white"
              />

              {/* Float Cards */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl animate-float border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Star className="h-6 w-6 text-sky-600 fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Training Complete!</p>
                    <p className="text-sm text-gray-500">Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;