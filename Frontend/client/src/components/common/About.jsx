import React from 'react';
import { PawPrint, Heart, Award, Users, Star } from 'lucide-react';

const About = () => {
  return (
    <section className="bg-white py-20 relative overflow-hidden">
        {/* Decorative background element */ }
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sky-600 font-bold tracking-wide uppercase text-sm bg-sky-50 px-3 py-1 rounded-full">About Us</span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl tracking-tight">
            Transform Your <span className="text-sky-500">Pet's Behavior</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your journey to a well-behaved pet starts here. We provide expert-guided training that you can do at home, on your schedule.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="relative mb-16">
          <div className="relative bg-gray-900 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl text-white">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 w-48 h-48 bg-sky-500/20 rounded-full blur-2xl"></div>
            <div className="absolute left-0 bottom-0 -mb-10 -ml-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
                 <Heart className="fill-current text-sky-400 text-sky-400" />
                 Our Mission
              </h3>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl">
                At PawPerfection, we believe that every pet parent should have access to professional training techniques. 
                Our platform democratizes pet training by bringing expert knowledge directly to your home, making it 
                accessible, affordable, and convenient for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-sky-50 rounded-xl mb-6 group-hover:bg-sky-500 transition-colors">
              <PawPrint className="h-7 w-7 text-sky-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Approach</h3>
            <p className="text-gray-600 leading-relaxed">
              Every pet is unique. Our training programs adapt to your pet's personality, age, and learning pace.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-gray-50 rounded-xl mb-6 group-hover:bg-gray-900 transition-colors">
              <Heart className="h-7 w-7 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Positive Training</h3>
            <p className="text-gray-600 leading-relaxed">
              We focus on reward-based methods that strengthen the bond between you and your pet.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-sky-50 rounded-xl mb-6 group-hover:bg-sky-500 transition-colors">
              <Award className="h-7 w-7 text-sky-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Access to certified trainers and a comprehensive library of training resources.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
          <div className="p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-sky-50 rounded-full mx-auto mb-4 text-sky-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-4xl font-extrabold text-gray-900 mb-1">10k+</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Happy Pet Parents</div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mx-auto mb-4 text-gray-700">
              <Star className="h-6 w-6" />
            </div>
            <div className="text-4xl font-extrabold text-gray-900 mb-1">4.9/5</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Client Rating</div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-sky-50 rounded-full mx-auto mb-4 text-sky-600">
              <PawPrint className="h-6 w-6" />
            </div>
            <div className="text-4xl font-extrabold text-gray-900 mb-1">50+</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Training Programs</div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mx-auto mb-4 text-gray-700">
              <Award className="h-6 w-6" />
            </div>
            <div className="text-4xl font-extrabold text-gray-900 mb-1">15+</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Expert Trainers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;