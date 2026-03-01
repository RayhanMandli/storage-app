import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'

const Home = () => {
  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <Navbar/>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            {/* Logo/Title */}
            <div className="mb-8 inline-block">
              <h1 className="text-5xl sm:text-7xl font-bold mb-2 bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent animate-fade-in tracking-tight">
                G Drive Express
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent animate-shimmer"></div>
            </div>
            
            {/* Headline */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto animate-slide-up font-light">
              Your files, secured and accessible anywhere
            </p>
            
            {/* Subheadline */}
            <p className="text-base sm:text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up-delay font-light leading-relaxed">
              Store, share, and collaborate on your files with enterprise-grade security and lightning-fast performance. Experience cloud storage reimagined.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-100"
              >
                Get Started Free
              </Link>
              
              <Link
                to="/login"
                className="px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need in one place
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-gray-600 to-gray-400"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-600 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Secure Storage</h3>
            <p className="text-gray-400">
              Bank-level encryption keeps your files safe and secure with automatic backups
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-600 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Easy Sharing</h3>
            <p className="text-gray-400">
              Share files and folders with anyone instantly with customizable permissions
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-600 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Lightning Fast</h3>
            <p className="text-gray-400">
              Upload and access your files at blazing speeds with our optimized infrastructure
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">10,000+</div>
            <div className="text-gray-400 font-light">Active Users</div>
          </div>
          <div className="p-6">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">5PB+</div>
            <div className="text-gray-400 font-light">Data Stored</div>
          </div>
          <div className="p-6">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">99.99%</div>
            <div className="text-gray-400 font-light">Uptime SLA</div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, powerful, secure
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            Get started in minutes and experience the future of cloud storage
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Create Account</h3>
            <p className="text-gray-400 text-sm font-light">Sign up in seconds with your email. No credit card required.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Upload Files</h3>
            <p className="text-gray-400 text-sm font-light">Drag and drop your files or folders. It's that simple.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Share & Collaborate</h3>
            <p className="text-gray-400 text-sm font-light">Share with anyone and control who can view or edit.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
              <span className="text-2xl font-bold text-white">4</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Access Anywhere</h3>
            <p className="text-gray-400 text-sm font-light">Your files are available on any device, anytime, anywhere.</p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Enterprise-grade security for everyone
            </h2>
            <p className="text-gray-400 mb-8 font-light leading-relaxed">
              Your data security is our top priority. We use advanced encryption and security measures 
              to ensure your files are protected at all times. Every file is encrypted both in transit 
              and at rest, giving you complete peace of mind.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">End-to-end Encryption</h4>
                  <p className="text-gray-400 text-sm font-light">Military-grade AES-256 encryption protects your data</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Two-Factor Authentication</h4>
                  <p className="text-gray-400 text-sm font-light">Add an extra layer of security to your account</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Automatic Backups</h4>
                  <p className="text-gray-400 text-sm font-light">Your files are backed up automatically and redundantly</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">SSL/TLS Encryption</div>
                    <div className="text-xs text-gray-400 font-light">Active</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Data Redundancy</div>
                    <div className="text-xs text-gray-400 font-light">Multi-region backup</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Access Control</div>
                    <div className="text-xs text-gray-400 font-light">Granular permissions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by teams worldwide
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            See what our users have to say about their experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-6 font-light">
              "G Drive Express has completely transformed how our team collaborates. The speed and reliability are unmatched."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">SK</span>
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Sarah Kim</div>
                <div className="text-xs text-gray-400 font-light">Product Manager</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-6 font-light">
              "The security features give me peace of mind. I know my sensitive documents are always protected."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">MC</span>
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Michael Chen</div>
                <div className="text-xs text-gray-400 font-light">Software Engineer</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-6 font-light">
              "Best cloud storage solution we've used. The interface is intuitive and the performance is excellent."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">EP</span>
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Emily Parker</div>
                <div className="text-xs text-gray-400 font-light">Creative Director</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:px-8">
        <div className="relative bg-gray-800/30 rounded-2xl p-12 border border-gray-700 overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gray-700/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gray-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust G Drive Express for their file storage needs
            </p>
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm font-light">&copy; 2026 G Drive Express. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom animations in style tag */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s both;
        }
        .animate-slide-up-delay {
          animation: slide-up 1s ease-out 0.4s both;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}

export default Home
