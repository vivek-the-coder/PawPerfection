import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit,
  Trash2,
  Heart,
  PawPrint,
  User,
  Calendar,
  AlertCircle,
  Check,
  X,
  Dog,
  Activity,
} from "lucide-react";
import toast from 'react-hot-toast';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  createPet,
  fetchPets,
  updatePet,
  deletePet,
  clearError,
  clearSuccess,
} from "../features/pets/petSlice";

export default function PetManagement() {
  const dispatch = useDispatch();
  const { pets, loading, error, success } = useSelector((state) => state.pets);
  const { user } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petForm, setPetForm] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "",
    description: "",
  });

  // Clear messages when component mounts
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
    dispatch(fetchPets());
  }, [dispatch]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPet) {
        await toast.promise(
          dispatch(updatePet({ petId: editingPet._id, petData: petForm })).unwrap(),
          {
            loading: 'Updating profile...',
            success: 'Pet profile updated successfully!',
            error: (err) => err.message || "Failed to update profile."
          }
        );
      } else {
        await toast.promise(
          dispatch(createPet(petForm)).unwrap(),
          {
            loading: 'Creating profile...',
            success: 'Pet profile created successfully!',
            error: (err) => err.message || "Failed to create profile."
          }
        );
      }
      
      // Reset form on success
      setPetForm({
        name: "",
        breed: "",
        age: "",
        gender: "",
        description: "",
      });
      setEditingPet(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      // Toast handles error display
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setPetForm({
      name: pet.name,
      breed: pet.breed,
      age: pet.age.toString(),
      gender: pet.gender,
      description: pet.description,
    });
    setShowForm(true);
  };

  const handleDelete = (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      dispatch(deletePet(petId));
    }
  };

  const resetForm = () => {
    setPetForm({
      name: "",
      breed: "",
      age: "",
      gender: "",
      description: "",
    });
    setEditingPet(null);
    setShowForm(false);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-8">
            <div className="w-full md:w-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-sky-50 text-sky-700 mb-6 border border-sky-100">
                <PawPrint className="h-4 w-4 mr-2" />
                <span className="text-sm font-bold uppercase tracking-wide">Pet Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                My Pets
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
                Manage your furry friends' profiles and track their progress in one place.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 md:mt-0 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Add New Pet
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-8 animate-fade-in">
              <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
              <button onClick={() => dispatch(clearError())} className="ml-auto hover:bg-red-100 p-1 rounded-full transition-colors">
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-8 animate-fade-in">
              <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
              <p className="text-green-700 font-medium">{success}</p>
              <button onClick={() => dispatch(clearSuccess())} className="ml-auto hover:bg-green-100 p-1 rounded-full transition-colors">
                <X className="w-4 h-4 text-green-500" />
              </button>
            </div>
          )}

          {/* Pets Grid */}
          {loading && pets.length === 0 ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-sky-500"></div>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Dog className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No pets added yet
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Create a profile for your pet to start tracking their training journey and health records.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gray-900 hover:bg-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg text-white mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Pet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map((pet) => (
                <div
                  key={pet._id}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => handleEdit(pet)}
                      className="p-2 bg-white text-gray-600 hover:text-sky-600 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
                      title="Edit pet"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pet._id)}
                      className="p-2 bg-white text-gray-600 hover:text-red-600 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
                      title="Delete pet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <PawPrint className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
                        {pet.name}
                      </h3>
                      <p className="text-sky-600 font-medium bg-sky-50 px-3 py-0.5 rounded-full text-sm inline-block">
                        {pet.breed}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                          <Calendar className="w-3 h-3" />
                          Age
                        </div>
                        <p className="text-gray-900 font-bold text-lg">{pet.age} <span className="text-sm font-medium text-gray-400">yrs</span></p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                          <Activity className="w-3 h-3" />
                          Gender
                        </div>
                        <p className="text-gray-900 font-bold text-lg">{pet.gender}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-50">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 italic">
                        "{pet.description}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pet Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingPet ? "Edit Pet Profile" : "Add New Pet"}
                  </h2>
                  <p className="text-gray-500 mt-1">Fill in the details below</p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Breed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={petForm.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Max"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm text-gray-900 font-medium placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Breed
                    </label>
                    <input
                      type="text"
                      name="breed"
                      value={petForm.breed}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Golden Retriever"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm text-gray-900 font-medium placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={petForm.age}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="e.g. 3"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm text-gray-900 font-medium placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={petForm.gender}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm text-gray-900 font-medium"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description & Notes
                  </label>
                  <textarea
                    name="description"
                    value={petForm.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe your pet's personality, behavior quirks, or any special training needs..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm text-gray-900 font-medium placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-100 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg text-white transform hover:-translate-y-0.5"
                  >
                    {loading ? "Saving..." : editingPet ? "Save Changes" : "Create Profile"}
                    {!loading && <Check className="w-5 h-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-4 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
