import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { createFeedback, clearError, clearSuccess } from "../features/feedback/feedbackSlice";

export default function Contact() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.feedback);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    petType: "",
    message: "",
  });

  const [feedbackForm, setFeedbackForm] = useState({
    email: "",
    message: "",
  });

  const [activeTab, setActiveTab] = useState("contact");
  const [submitted, setSubmitted] = useState(false);

  // Clear messages when component mounts or tab changes
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch, activeTab]);

  // Show success message when feedback is submitted
  useEffect(() => {
    if (success && activeTab === "feedback") {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackForm({
          email: "",
          message: "",
        });
        dispatch(clearSuccess());
      }, 3000);
    }
  }, [success, activeTab, dispatch]);

  const handleChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e, resetForm) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      resetForm();
    }, 2000);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackForm.email && feedbackForm.message) {
      dispatch(createFeedback(feedbackForm));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 mt-8">
            {/* Left Info */}
            <div className="md:w-1/3 space-y-10">
              <div>
                <h1 className="text-4xl font-bold mb-4 flex items-center text-gray-900 tracking-tight">
                  {/* <PawPrint className="mr-2 text-sky-600" /> */}
                  Get In Touch
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Connect with our expert trainers or leave us feedback about
                  your experience.
                </p>
              </div>

              {/* Contact Info */}
              {[
                {
                  icon: <Phone className="text-sky-600" />,
                  title: "Phone",
                  detail: "xxxxxxxxxxxxx",
                },
                {
                  icon: <Mail className="text-sky-600" />,
                  title: "Email",
                  detail: "training@futurepets.com",
                },
                {
                  icon: <MapPin className="text-sky-600" />,
                  title: "Location",
                  detail: "123 Training Avenue\nPet City, Vadodara 12345",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-sky-50">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-lg text-gray-600 whitespace-pre-line">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}

              {/* Hours */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Operating Hours
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span className="font-medium text-gray-900">9:00 AM - 7:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-gray-900">10:00 AM - 5:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-sky-600 font-medium">Closed</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="md:w-2/3">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                    <div className="bg-green-100 p-4 rounded-full shadow-sm animate-bounce">
                      <Check size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Submitted Successfully!
                    </h2>
                    <p className="text-gray-600 text-lg max-w-md">
                      Thank you for reaching out. Our team will process your
                      submission shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Tabs */}
                    <div className="flex mb-8 border-b border-gray-100">
                      {[
                        {
                          key: "contact",
                          label: "Contact Us",
                          icon: (
                            <Phone className="inline-block mr-2 w-5 h-5" />
                          ),
                        },
                        {
                          key: "feedback",
                          label: "Leave Feedback",
                          icon: (
                            <MessageSquare className="inline-block mr-2 w-5 h-5" />
                          ),
                        },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          className={`cursor-pointer px-6 py-3 font-bold transition-all duration-300 border-b-2 ${
                            activeTab === tab.key
                              ? "text-sky-600 border-sky-600"
                              : "text-gray-400 border-transparent hover:text-gray-600"
                          }`}
                          onClick={() => setActiveTab(tab.key)}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Contact Form */}
                    {activeTab === "contact" && (
                      <form
                        onSubmit={(e) =>
                          handleSubmit(e, () =>
                            setContactForm({
                              name: "",
                              email: "",
                              phone: "",
                              petType: "",
                              message: "",
                            })
                          )
                        }
                        className="space-y-6"
                      >
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">
                          Send Us a Message
                        </h2>

                        {/* Name + Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            {
                              id: "contact-name",
                              name: "name",
                              type: "text",
                              placeholder: "Name",
                              value: contactForm.name,
                            },
                            {
                              id: "contact-email",
                              name: "email",
                              type: "email",
                              placeholder: "your@email.com",
                              value: contactForm.email,
                            },
                          ].map((field) => (
                            <div key={field.id}>
                              <input
                                {...field}
                                required
                                onChange={(e) =>
                                  handleChange(e, setContactForm)
                                }
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Phone + Pet Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <input
                            type="tel"
                            name="phone"
                            placeholder="xxxxxxxxxxxxx"
                            value={contactForm.phone}
                            onChange={(e) => handleChange(e, setContactForm)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                          />
                          <select
                            name="petType"
                            value={contactForm.petType}
                            onChange={(e) => handleChange(e, setContactForm)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-gray-900"
                          >
                            <option value="">Select your pet</option>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="bird">Bird</option>
                            <option value="exotic">Exotic</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Message */}
                        <textarea
                          name="message"
                          value={contactForm.message}
                          onChange={(e) => handleChange(e, setContactForm)}
                          required
                          rows="5"
                          placeholder="Tell us about your training needs..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                        ></textarea>

                        <button
                          type="submit"
                          className="bg-gray-900 hover:bg-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 hover:shadow-lg text-white transform hover:-translate-y-0.5"
                        >
                          Send Message
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                    )}

                    {/* Feedback Form */}
                    {activeTab === "feedback" && (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">
                          Share Your Experience
                        </h2>

                        {/* Error Message */}
                        {error && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle className="text-red-500 w-5 h-5" />
                            <p className="text-red-700">{error}</p>
                          </div>
                        )}

                        {/* Success Message */}
                        {success && (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <Check className="text-green-500 w-5 h-5" />
                            <p className="text-green-700">{success}</p>
                          </div>
                        )}

                        {/* Email */}
                        <input
                          type="email"
                          name="email"
                          placeholder="xyz@gmail.com"
                          value={feedbackForm.email}
                          onChange={(e) => handleChange(e, setFeedbackForm)}
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                        />

                        {/* Message */}
                        <textarea
                          name="message"
                          value={feedbackForm.message}
                          onChange={(e) => handleChange(e, setFeedbackForm)}
                          required
                          rows="4"
                          placeholder="Tell us about your experience (max 100 characters)..."
                          maxLength="100"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                        ></textarea>

                        <div className="text-sm text-gray-500 text-right">
                          {feedbackForm.message.length}/100 characters
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 hover:shadow-lg text-white transform hover:-translate-y-0.5"
                        >
                          {loading ? "Submitting..." : "Submit Feedback"}
                          <MessageSquare className="w-5 h-5" />
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer stays at bottom */}
      <Footer />
    </div>
  );
}
