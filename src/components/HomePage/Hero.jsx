import React from "react";
import { Shield, MapPin, Brain, Lock } from 'lucide-react';
import heroBg from "../../assets/karachi-night.jpg"

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Karachi cityscape with security elements"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Secure Crime
            <span className="block text-accent"> Reporting</span>
            <span className="block">for Karachi</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering citizens to report crimes anonymously while providing law
            enforcement with AI-powered insights for a safer Karachi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="btn-hero group">
              <Shield className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Report Crime Now
            </button>
            <button className="btn-hero-outline border-white text-white hover:bg-white hover:text-primary">
              View Crime Map
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 text-white">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Anonymous Reporting</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Analytics</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Real-time Mapping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
