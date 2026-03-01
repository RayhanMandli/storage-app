import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent tracking-tight py-2">
            Making file storage simple and secure
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            We're on a mission to provide reliable, secure cloud storage that anyone can use. 
            Your data security and privacy are at the heart of everything we do.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">
              G Drive Express was founded with a simple goal: to create a cloud storage solution 
              that combines enterprise-level security with consumer-friendly simplicity. We believe 
              everyone deserves access to secure, reliable file storage without complexity or 
              compromise.
            </p>
            <p className="text-gray-400 font-light leading-relaxed">
              Today, we serve thousands of users worldwide, from individuals to large enterprises, 
              helping them store, share, and protect their most important files. Our commitment to 
              security, privacy, and user experience guides every decision we make.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold mb-2">2020</div>
              <div className="text-gray-400 text-sm font-light">Founded</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-gray-400 text-sm font-light">Active Users</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold mb-2">5PB+</div>
              <div className="text-gray-400 text-sm font-light">Data Secured</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold mb-2">99.99%</div>
              <div className="text-gray-400 text-sm font-light">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            These principles guide our work and our relationships with customers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Security First</h3>
            <p className="text-gray-400 font-light">
              Your data security is our top priority. We use industry-leading encryption and 
              security practices to keep your files safe.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Privacy Matters</h3>
            <p className="text-gray-400 font-light">
              We respect your privacy. Your files are yours, and we'll never share or sell 
              your data to third parties.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
            <p className="text-gray-400 font-light">
              Our users come first. We continuously improve our platform based on feedback 
              and evolving needs.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            We're a diverse team of engineers, designers, and problem-solvers passionate about 
            building the best cloud storage experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-semibold">JD</span>
            </div>
            <h3 className="font-semibold mb-1">John Davis</h3>
            <p className="text-gray-400 text-sm font-light mb-2">CEO & Founder</p>
            <p className="text-gray-500 text-sm font-light">Former engineer at Google Drive</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-semibold">AL</span>
            </div>
            <h3 className="font-semibold mb-1">Alex Lee</h3>
            <p className="text-gray-400 text-sm font-light mb-2">CTO</p>
            <p className="text-gray-500 text-sm font-light">Security expert, ex-Microsoft</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-semibold">SP</span>
            </div>
            <h3 className="font-semibold mb-1">Sarah Parker</h3>
            <p className="text-gray-400 text-sm font-light mb-2">Head of Design</p>
            <p className="text-gray-500 text-sm font-light">Previously at Dropbox</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-semibold">MR</span>
            </div>
            <h3 className="font-semibold mb-1">Maria Rodriguez</h3>
            <p className="text-gray-400 text-sm font-light mb-2">Head of Support</p>
            <p className="text-gray-500 text-sm font-light">Customer success specialist</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join us on our journey</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto font-light">
            Be part of the future of cloud storage. Start storing your files securely today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="px-10 py-4 bg-transparent border-2 border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
