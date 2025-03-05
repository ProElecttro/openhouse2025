import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, Cpu, Zap, Brain, Calendar, Users, Award } from 'lucide-react';

const HomePage = () => {
  const lettersRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating letters animation
    const letters = lettersRef.current?.querySelectorAll('.floating-letter');
    if (!letters) return;

    letters.forEach((letter, index) => {
      const element = letter as HTMLElement;
      element.style.animationDelay = `${index * 0.1}s`;
    });

    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      letters.forEach((letter) => {
        const element = letter as HTMLElement;
        const depth = parseFloat(element.getAttribute('data-depth') || '1');
        element.style.transform = `translate(${xPos * depth}px, ${yPos * depth}px)`;
      });

      // Parallax for hero background
      if (heroRef.current) {
        heroRef.current.style.backgroundPosition = `${50 + xPos * 0.05}% ${50 + yPos * 0.05}%`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Particle animation
    const createParticles = () => {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;
      
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        
        // Random animation duration
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        heroSection.appendChild(particle);
      }
    };
    
    createParticles();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-purple-900/40 to-black"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20 transition-all duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        {/* Glowing orb */}
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-[100px] animate-pulse"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM4QjVDRjYiIHN0cm9rZS13aWR0aD0iMC4yIiBvcGFjaXR5PSIwLjIiLz4KICA8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-10"></div>
        
        {/* Main content container with adjusted spacing */}
        <div className="absolute flex flex-col items-center z-10 space-y-8">
          {/* OPEN text */}
          <div ref={lettersRef} className="flex text-8xl md:text-[10rem] font-extrabold tracking-wider">
            {'OPEN'.split('').map((letter, index) => (
              <span 
                key={`open-${index}`} 
                className="floating-letter transition-transform duration-300 ease-out text-purple-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                data-depth={(Math.random() * 0.8 + 0.6).toFixed(1)}
                style={{
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                {letter}
              </span>
            ))}
          </div>
          
          {/* HOUSE text - consistent spacing with OPEN */}
          <div className="flex text-8xl md:text-[10rem] font-extrabold tracking-wider -mt-4">
            {'HOUSE'.split('').map((letter, index) => (
              <span 
                key={`house-${index}`} 
                className="floating-letter transition-transform duration-300 ease-out text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                data-depth={(Math.random() * 0.8 + 0.6).toFixed(1)}
                style={{
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${(index + 4) * 0.1}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
          
          {/* Year with glow effect - consistent spacing */}
          <div className="text-8xl md:text-9xl font-black -mt-4">
            <span className="relative">
              <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">2025</span>
            </span>
          </div>
          
          {/* Registration buttons - increased spacing from text */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
            >
              <span className="relative z-10 flex items-center">
                Register Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <a 
              href="#about" 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white border border-purple-500/30 rounded-full overflow-hidden transition-all duration-300 ease-out hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <span className="relative z-10 flex items-center">
                Learn More
              </span>
            </a>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
        
        {/* Event date badge */}
        <div className="absolute top-32 right-8 md:right-16 bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg transform rotate-3 z-20">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-200" />
            <span className="text-white font-medium">March 15, 2025</span>
          </div>
        </div>
      </section>

      {/* Event highlights */}
      <section className="py-16 bg-gradient-to-b from-black to-purple-950/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTU0LjUgNDkuNUw1NC41IDU0LjUgNDkuNSA1NC41IiBzdHJva2U9IiM4QjVDRjYiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjMiLz4KPHBhdGggZD0iTTU0LjUgMTAuNUw1NC41IDUuNSA0OS41IDUuNSIgc3Ryb2tlPSIjOEI1Q0Y2IiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC4zIi8+CjxwYXRoIGQ9Ik01LjUgNDkuNUw1LjUgNTQuNSAxMC41IDU0LjUiIHN0cm9rZT0iIzhCNUNGNiIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMyIvPgo8cGF0aCBkPSJNNS41IDEwLjVMNS41IDUuNSAxMC41IDUuNSIgc3Ryb2tlPSIjOEI1Q0Y2IiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap -mx-4">
            {[
              { 
                icon: <Users className="w-8 h-8 text-purple-400" />, 
                number: "5,000+", 
                text: "Expected Attendees" 
              },
              { 
                icon: <Award className="w-8 h-8 text-blue-400" />, 
                number: "60+", 
                text: "Innovative Projects" 
              },
              { 
                icon: <Cpu className="w-8 h-8 text-indigo-400" />, 
                number: "14", 
                text: "Innovation Clubs" 
              }
            ].map((stat, index) => (
              <div key={index} className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 h-full transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 p-3 bg-purple-900/30 rounded-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{stat.number}</h3>
                      <p className="text-gray-400">{stat.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-purple-950/50 to-black relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-400">About the Event</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6">
                The Centre for Innovation (CFI) at the Indian Institute of Technology Madras (IIT Madras) is a student-driven hub established in 2008 to foster creativity and technological innovation among students.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                Each year, CFI organizes its flagship event, the Open House, where students showcase their innovative projects to the public, industry professionals, and academia.
              </p>
              <p className="text-lg text-gray-300">
                The Open House serves as a bridge between academia and industry, fostering collaborations and providing students with exposure to real-world applications of their work.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                {['Innovation', 'Technology', 'Robotics', 'AI', 'Engineering'].map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-purple-900/30 rounded-full text-purple-300 text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-30 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Innovation showcase" 
                className="rounded-lg shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-lg shadow-xl z-20">
                <div className="text-white font-bold">Since 2008</div>
                <div className="text-blue-200 text-sm">Fostering Innovation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-purple-950/30 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0iIzhCNUNGNiIgb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-400">What to Expect</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Rocket className="w-12 h-12 text-purple-500" />, 
                title: "Cutting-Edge Projects", 
                description: "Explore reusable sounding rockets, autonomous vehicles, and more groundbreaking innovations." 
              },
              { 
                icon: <Cpu className="w-12 h-12 text-blue-500" />, 
                title: "13 Innovation Clubs", 
                description: "Discover projects from robotics, electronics, programming, and various engineering domains." 
              },
              { 
                icon: <Brain className="w-12 h-12 text-indigo-500" />, 
                title: "Interactive Demos", 
                description: "Experience hands-on demonstrations of the latest technological advancements." 
              },
              { 
                icon: <Zap className="w-12 h-12 text-purple-500" />, 
                title: "Networking", 
                description: "Connect with brilliant minds, industry professionals, and academic experts." 
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 border border-purple-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="mb-4 relative z-10">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white relative z-10">{feature.title}</h3>
                <p className="text-gray-400 relative z-10">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, index) => (
            <div 
              key={index}
              className="absolute w-2 h-2 rounded-full bg-purple-500 opacity-30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">Be Part of the Innovation Revolution</h2>
            <p className="text-xl text-gray-300 mb-10">
              Join us at IIT Madras for an unforgettable showcase of student innovation and technological breakthroughs.
            </p>
            <Link 
              to="/register" 
              className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 text-lg"
            >
              <span className="relative z-10 flex items-center">
                Register for Open House 2025
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;