import React from 'react';
import {
  GraduationCap,
  Video,
  MessageCircle,
  Users,
  Calendar,
  Award,
  CheckCircle,
  PawPrint,
  PersonStanding,
  Salad ,
  ShieldCheck
} from 'lucide-react';

const Services = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-sky-50 text-sky-700 mb-6 border border-sky-100">
            <PawPrint className="h-4 w-4 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wide">Our Training Solutions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Comprehensive <span className="text-sky-500">Pet Training</span> Services
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            From basic obedience to advanced skills, we offer personalized training programs 
            that fit your schedule and your pet's needs.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Personalized Training for Pet */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-sky-50 rounded-xl mb-6 group-hover:bg-sky-500 transition-colors duration-300">
              <PersonStanding className="h-7 w-7 text-sky-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Training Program</h3>
            <p className="text-gray-600 mb-6">
              Specialized custom training program tailored specifically for your Pet's needs.
            </p>
            <ul className="space-y-3">
              {['Train pet according to you', 'Check the Growth', '24/7 guidance'].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Personalized Diet for Pet */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-gray-50 rounded-xl mb-6 group-hover:bg-gray-900 transition-colors duration-300">
              <Salad className="h-7 w-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nourish the Pet</h3>
            <p className="text-gray-600 mb-6">
              Feed the pet what's perfect for them with expert nutritional guidance.
            </p>
            <ul className="space-y-3">
              {['Perfect Nutrients', 'Protein Guidance', 'Health Support'].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Unlock Achievements */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-sky-50 rounded-xl mb-6 group-hover:bg-sky-500 transition-colors duration-300">
              <Award className="h-7 w-7 text-sky-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Achievements</h3>
            <p className="text-gray-600 mb-6">
              Unlock new achievements for your pet by completing milestones.
            </p>
            <ul className="space-y-3">
              {['Training rewards', 'Physical activities', 'Health battles'].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Online Training */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-gray-50 rounded-xl mb-6 group-hover:bg-gray-900 transition-colors duration-300">
              <Video className="h-7 w-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Online Training Sessions</h3>
            <p className="text-gray-600 mb-6">
              Live, interactive training sessions with certified trainers from home.
            </p>
            <ul className="space-y-3">
              {['Personalized attention', 'Flexible scheduling', 'Real-time feedback'].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Video Library */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-sky-50 rounded-xl mb-6 group-hover:bg-sky-500 transition-colors duration-300">
              <GraduationCap className="h-7 w-7 text-sky-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Training Video Library</h3>
            <p className="text-gray-600 mb-6">
              Access our extensive library of professional training videos.
            </p>
            <ul className="space-y-3">
              {['Step-by-step guides', 'Progress tracking', 'Downloadable resources'].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Community Support */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-gray-50 rounded-xl mb-6 group-hover:bg-gray-900 transition-colors duration-300">
              <Users className="h-7 w-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Community Support</h3>
            <p className="text-gray-600 mb-6">
              Join our community of pet parents and share experiences.
            </p>
            <ul className="space-y-3">
              {['Expert advice', 'Community forums', 'Success sharing'].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-sky-500 mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Calendar className="h-6 w-6" />,
              title: 'Flexible Scheduling',
              description: 'Book sessions that fit your schedule',
              color: 'text-sky-600',
              bg: 'bg-sky-50'
            },
            {
              icon: <MessageCircle className="h-6 w-6" />,
              title: '24/7 Support',
              description: 'Get help whenever you need it',
              color: 'text-gray-900',
              bg: 'bg-gray-100'
            },
            {
              icon: <ShieldCheck className="h-6 w-6" />,
              title: 'Certified Trainers',
              description: 'Learn from the best in the field',
              color: 'text-sky-600',
              bg: 'bg-sky-50'
            },
            {
              icon: <PawPrint className="h-6 w-6" />,
              title: 'Guaranteed Results',
              description: 'See improvement or money back',
              color: 'text-gray-900',
              bg: 'bg-gray-100'
            },
          ].map((feature, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.bg} rounded-xl mb-4 transition-colors`}>
                <div className={feature.color}>{feature.icon}</div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
