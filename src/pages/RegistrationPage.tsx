import React, { useState, useEffect } from 'react';
import { CheckCircle, User, Mail, Phone, Building, Tag, Info, ArrowRight, Calendar } from 'lucide-react';
import { uploadToS3 } from '../services/s3Service';
import { jwtDecode } from "jwt-decode";

const CLIENT_ID = "793546815543-s23djv3pm02c9pv1ku1kuap2luks1jrh.apps.googleusercontent.com";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  interests: string[];
  hearAbout: string;
  specialRequirements: string;
}



const RegistrationPage = () => {
  // Add this new state variable at the top of your component
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    if (!window.google) {
      return
    };

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button") as HTMLElement,
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response: google.accounts.id.CredentialResponse) => {
    const decoded: GoogleUser = jwtDecode(response.credential);
    console.log("User Info:", decoded);
    setGoogleUser(decoded);
    setFormData(prev => ({ ...prev, email: decoded.email }));
  };

  // const handleCredentialResponse = (response: google.accounts.id.CredentialResponse) => {
  //   const decoded: GoogleUser = jwtDecode(response.credential);
  //   console.log("User Info:", decoded);
  //   setGoogleUser(decoded); // Store user data to track authentication
  // };
  



  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    interests: [],
    hearAbout: '',
    specialRequirements: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // New state variable for final submission confirmation
  const [isFinalStepFlagged, setIsFinalStepFlagged] = useState(false);
  const totalSteps = 3;

  const interestOptions = [
    'Robotics',
    'Autonomous Vehicles',
    'Rocketry',
    'AI & Machine Learning',
    'Electronics',
    'Mechanical Engineering',
    'Biomedical Engineering',
    'Sustainable Technologies'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value)
    }));

    if (checked && errors.interests) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.interests;
        return newErrors;
      });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    } else if (step === 2) {
      if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
      if (!formData.role) newErrors.role = 'Role is required';
      if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      const newStep = prev - 1;
      // Reset the final step flag if leaving step 3
      if (newStep < totalSteps) {
        setIsFinalStepFlagged(false);
      }
      return newStep;
    });
    window.scrollTo(0, 0);
  };

  const validate = () => {
    const step1Valid = validateStep(1);
    if (!step1Valid) {
      setCurrentStep(1);
      return false;
    }

    const step2Valid = validateStep(2);
    if (!step2Valid) {
      setCurrentStep(2);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== totalSteps) return;

    if (!googleUser) {
      alert("Please sign in with Google to verify your email before submitting the form.");
      return;
    }
    if (googleUser.email !== formData.email) {
      alert("The email provided does not match your Google account email. Please verify your email.");
      return;
    }

    // Validate entire form before proceeding
    if (!validate()) {
      return;
    }

    // If the final step hasn't been confirmed yet, mark it and return
    if (!isFinalStepFlagged) {
      setIsFinalStepFlagged(true);
      return;
    }

    // If flag is already set, proceed with submission
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const registrationData = {
        ...formData,
        registrationDate: new Date().toISOString(),
        registrationId: `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };

      const key = `${registrationData.registrationId}.json`;

      console.log("🚀 Uploading to S3:", key, registrationData);
      await uploadToS3(registrationData, key);

      console.log("✅ Registration submitted successfully:", registrationData);
      setSubmitted(true);
    } catch (error: any) {
      console.error("❌ Error submitting registration:", error);
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent accidental form submission via Enter key on non-final steps.
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && currentStep !== totalSteps) {
      e.preventDefault();
    }
  };

  // Function to generate and download the ICS file
  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VTIMEZONE
TZID:Asia/Kolkata
X-LIC-LOCATION:Asia/Kolkata
BEGIN:STANDARD
TZOFFSETFROM:+0530
TZOFFSETTO:+0530
TZNAME:GMT+5:30
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:20250315T090000
DTEND;TZID=Asia/Kolkata:20250315T170000
DTSTAMP:20250217T181836Z
ORGANIZER;CN="Branding and Engagement Team, CFI IIT Madras":mailto:cfi.iitmadras@gmail.com
UID:3qjr05nfqkdbram242amijrj9l@google.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE;CN="Branding and Engagement Team, CFI IIT Madras";X-NUM-GUESTS=0:mailto:cfi.iitmadras@gmail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=cfi@smail.iitm.ac.in;X-NUM-GUESTS=0:mailto:cfi@smail.iitm.ac.in
X-GOOGLE-CONFERENCE:https://meet.google.com/gqf-uzhx-rfk
X-MICROSOFT-CDO-OWNERAPPTID:-846267892
CREATED:20250217T181742Z
DESCRIPTION:-::~:~::~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~::~:~::-
Join with Google Meet: https://meet.google.com/gqf-uzhx-rfk

Learn more about Meet at: https://support.google.com/a/users/answer/9282720

Please do not edit this section.
-::~:~::~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~:~::~:~::-
LAST-MODIFIED:20250217T181835Z
LOCATION:NAC 2 rooftop\\, X6RH+H5J\\, Indian Institute Of Technology\\, Chennai\\, Tamil Nadu 600036\\, India
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:CFI Open House 2025 || IIT Madras
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CFI_Open_House_2025.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 bg-gradient-to-b from-black via-purple-900/30 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900/80 to-black/90 p-10 rounded-2xl shadow-2xl border border-purple-500/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 animate-pulse blur-xl"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Registration Successful!
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Thank you for registering for the CFI Open House 2025. We're excited to have you join us!
              </p>
              <div className="mt-8 flex flex-col items-center gap-4">
                <a
                  href="/"
                  className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Return to Home
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                <button
                  type="button"
                  onClick={handleDownloadICS}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-10">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep > index + 1
                  ? 'border-purple-500 bg-purple-500 text-white'
                  : currentStep === index + 1
                    ? 'border-purple-500 bg-transparent text-purple-500'
                    : 'border-gray-600 bg-transparent text-gray-600'
                } transition-all duration-300`}
            >
              {currentStep > index + 1 ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-bold">{index + 1}</span>
              )}
              {index + 1 !== totalSteps && (
                <div
                  className={`absolute top-1/2 left-full w-12 h-0.5 -translate-y-1/2 ${currentStep > index + 1 ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                ></div>
              )}
            </div>
            {index + 1 !== totalSteps && <div className="w-12"></div>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Personal Information
            </h3>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <User className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-800/70 border ${errors.name ? 'border-red-500' : 'border-purple-500/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true}  // Disable if a googleUser exists
                    className={`w-full pl-12 pr-4 py-3 bg-gray-800/70 border ${errors.email ? 'border-red-500' : 'border-purple-500/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300`}
                    placeholder="Sign In with Google to enter email address"
                  />

                </div>
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Phone className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-800/70 border ${errors.phone ? 'border-red-500' : 'border-purple-500/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Professional Details
            </h3>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">
                  Organization/Institution *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Building className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-800/70 border ${errors.organization ? 'border-red-500' : 'border-purple-500/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300`}
                    placeholder="Enter your organization"
                  />
                </div>
                {errors.organization && <p className="mt-1 text-red-500 text-sm">{errors.organization}</p>}
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">Role/Designation *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Tag className="w-5 h-5 text-purple-500" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-800/70 border ${errors.role ? 'border-red-500' : 'border-purple-500/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300 appearance-none`}
                  >
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="professional">Industry Professional</option>
                    <option value="academic">Academic/Faculty</option>
                    <option value="researcher">Researcher</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {errors.role && <p className="mt-1 text-red-500 text-sm">{errors.role}</p>}
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">Areas of Interest *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
                  {interestOptions.map(interest => (
                    <div key={interest} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={interest}
                        name="interests"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleInterestChange}
                        className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor={interest} className="text-gray-300 select-none">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.interests && <p className="mt-1 text-red-500 text-sm">{errors.interests}</p>}
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Additional Information
            </h3>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">
                  How did you hear about the Open House?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Info className="w-5 h-5 text-purple-500" />
                  </div>
                  <select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/70 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300 appearance-none"
                  >
                    <option value="">Select an option</option>
                    <option value="social">Social Media</option>
                    <option value="website">IIT Madras Website</option>
                    <option value="friend">Friend/Colleague</option>
                    <option value="email">Email Newsletter</option>
                    <option value="news">News/Press</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-300 mb-2 font-medium">
                  Special Requirements or Questions
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300"
                  placeholder="Let us know if you have any special requirements or questions"
                ></textarea>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/20">
                <h4 className="text-lg font-semibold mb-4 text-purple-300">Registration Summary</h4>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Name:</span> {formData.name}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Email:</span> {formData.email}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Phone:</span> {formData.phone}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Organization:</span> {formData.organization}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Role:</span> {formData.role}
                  </p>
                  <div>
                    <p className="text-gray-400">Interests:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.interests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-900/30 rounded-full text-purple-300 text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20">
                <p className="text-blue-300 text-sm">
                  <strong>Note:</strong> Your registration data will be securely stored in our database.
                  You'll receive a confirmation email with calendar details once your registration is processed.
                </p>
              </div>
              {submitError && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
                  <p className="text-red-300 text-sm">Some Error Occured</p>
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-black via-purple-900/30 to-black">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Register for Open House 2025
            </h1>
            <p className="text-xl text-gray-300">
              Join us at IIT Madras for an extraordinary showcase of innovation
            </p>
          </div>

          <div className="flex justify-center mb-6">
          {!googleUser && <div id="google-login-button"></div>}
          </div>

          {renderStepIndicator()}
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 p-8 md:p-10 rounded-2xl shadow-2xl border border-purple-500/30 backdrop-blur-sm">
            <form onKeyDown={handleFormKeyDown} onSubmit={handleSubmit}>
              {renderFormStep()}
              <div className="mt-10 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>{isFinalStepFlagged ? "Confirm Registration" : "Complete Registration"}</span>
                        <ArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle className="w-6 h-6 text-purple-400" />,
                title: "Simple Process",
                description: "Easy 3-step registration process that takes just minutes to complete"
              },
              {
                icon: <User className="w-6 h-6 text-blue-400" />,
                title: "Personalized Experience",
                description: "Customize your Open House experience based on your interests"
              },
              {
                icon: <Calendar className="w-6 h-6 text-purple-400" />,
                title: "Calendar Integration",
                description: "Receive event details with calendar invitation for easy scheduling"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
                <div className="flex items-center mb-3">
                  {feature.icon}
                  <h3 className="ml-3 text-lg font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
