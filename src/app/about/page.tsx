"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Target, 
  Users, 
  Shield, 
  Clock, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserCheck,
  FileText,
  Zap,
  ArrowRight,
  Play
} from "lucide-react";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section with Medical Equipment Background */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/images/national-cancer-institute-L8tWZT4CcVQ-unsplash.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Animated Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              About <span className="text-[#06A3DA]">DocTime</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 opacity-90">
              Revolutionizing healthcare access through innovative appointment scheduling and seamless patient-doctor connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group px-8 py-4 bg-[#06A3DA] hover:bg-[#057bb5] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <Play className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                Watch Our Story
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#06A3DA] transition-all duration-300 group">
                <span className="flex items-center gap-2">
                  Learn More
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section with Doctor Background */}
      <div className="relative py-20 overflow-hidden">
        {/* Background Image */}

        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Our Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Driving the future of healthcare through technology and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-900 dark:text-white">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  To democratize healthcare access by providing a seamless, user-friendly platform that connects patients with healthcare providers, 
                  making quality medical care accessible to everyone, everywhere.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-900 dark:text-white">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  A world where healthcare appointments are as simple as ordering food online - instant, transparent, and accessible to all, 
                  regardless of location or socioeconomic status.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Trust & Security</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your health data is protected with enterprise-grade security measures and HIPAA compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Available 24/7, making healthcare accessible whenever you need it, wherever you are.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Patient-Centric</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every feature is designed with patient experience and healthcare outcomes in mind.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Continuously evolving to meet modern healthcare needs with cutting-edge technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/assets/images/marcelo-leal-k7ll1hpdhFA-unsplash.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transforming healthcare delivery through innovative solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Advanced appointment scheduling system that matches patients with available doctors based on specialty, location, and availability with AI-powered recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Provider Management</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Comprehensive tools for healthcare providers to manage their schedules, patient records, and practice operations efficiently with real-time analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Digital Records</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Secure digital storage of appointment history, medical records, and communication logs for seamless healthcare delivery and continuity of care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

     
      {/* Contact Information Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Get in Touch
            </h2>
                             <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
               We&apos;re here to help you on your healthcare journey
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Phone Support</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Mon-Fri: 9AM-6PM EST</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Email Support</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">support@doctime.com</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">24/7 Support Available</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Headquarters</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">123 Healthcare Ave</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">New York, NY 10001</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#06A3DA] to-[#057bb5] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-transparent border-0 text-white shadow-none">
            <CardContent className="p-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
                Join thousands of patients and healthcare providers who trust DocTime for their appointment scheduling needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="group px-10 py-5 bg-white text-[#06A3DA] font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl flex items-center gap-3">
                  <Calendar className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  Book Your First Appointment
                </button>
                <button className="px-10 py-5 border-3 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-[#06A3DA] transition-all duration-300 group shadow-2xl">
                  <span className="flex items-center gap-3">
                    Learn More
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
