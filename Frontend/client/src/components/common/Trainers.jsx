import React from 'react';
import { BadgeCheck, PawPrint } from 'lucide-react';

const trainers = [
  {
    name: 'Amit Sharma',
    specialty: 'Obedience & Puppy Training',
    experience: '5+ years',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Priya Verma',
    specialty: 'Aggression & Behavior Correction',
    experience: '7+ years',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Ravi Khanna',
    specialty: 'Advanced Agility Training',
    experience: '6+ years',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    name: 'Sneha Iyer',
    specialty: 'Diet & Health Guidance',
    experience: '4+ years',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

const Trainers = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-sky-50 text-sky-800 mb-6">
            <PawPrint className="h-4 w-4 mr-2 text-sky-600" />
            <span className="text-sm font-semibold uppercase tracking-wide">Meet Our Trainers</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Expert Pet Trainers</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
             Our certified trainers bring years of experience and a genuine love for animals to every session, ensuring the best for your pet.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:-translate-y-2"
            >
              <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-sky-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="relative w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-md"
                  />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{trainer.name}</h3>
              <p className="text-sky-600 font-medium mb-3 text-sm uppercase tracking-wide">{trainer.specialty}</p>
              <div className="flex items-center justify-center text-gray-500 text-sm bg-gray-50 py-2 rounded-lg mx-auto w-fit px-4 border border-gray-200">
                <BadgeCheck className="h-4 w-4 text-sky-500 mr-2" />
                <span className="font-medium">{trainer.experience} experience</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
