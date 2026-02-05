import { useState } from "react";
import { PawPrint, Camera, Heart, Sparkles } from "lucide-react";

const PetPage = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    notes: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      console.log("Pet Registered:", formData);
      setFormData({
        name: "",
        type: "",
        breed: "",
        age: "",
        gender: "",
        notes: "",
        image: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-[url('./assets/ThemePage.avif')] bg-cover
 bg-center-y bg-no-repeat bg-fixed "
    >
      {/* Content Container with Semi-Transparent Overlay */}
      <div className="relative z-10 backdrop-blur-sm min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-6 shadow-lg animate-fade-in-up">
              <PawPrint className="w-10 h-10 text-sky-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2 drop-shadow-md tracking-tight">
              Register Your Pet
            </h2>
            <p className="text-xl text-gray-800 font-medium">
              Join our loving community of pet owners
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Pet Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all bg-white/50 focus:bg-white text-gray-900 placeholder-gray-500"
                      placeholder="What's your pet's name?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all bg-white/50 focus:bg-white text-gray-900"
                  >
                    <option value="">Select pet type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all bg-white/50 focus:bg-white text-gray-900 placeholder-gray-500"
                    placeholder="E.g., Golden Retriever"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all bg-white/50 focus:bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Age in months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all bg-white/50 focus:bg-white text-gray-900"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full py-4 px-6 rounded-xl text-white font-bold text-lg
                    flex items-center justify-center space-x-2
                    transform transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1
                    ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-900 hover:bg-black"
                    }
                  `}
                >
                  <PawPrint className="w-5 h-5" />
                  <span>
                    {isSubmitting ? "Registering..." : "Register Pet"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-6 text-sm font-medium text-gray-100 drop-shadow-md">
            <p>Need help? Contact our support team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetPage;
