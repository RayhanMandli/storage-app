import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent tracking-tight">
            Powerful features for modern teams
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Everything you need to store, share, and collaborate on your files. 
            Built for teams of all sizes with security and simplicity in mind.
          </p>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Bank-Level Security</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-4">
              Your files are protected with military-grade AES-256 encryption. All data is encrypted 
              both in transit and at rest, ensuring maximum security for your sensitive information.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                End-to-end encryption
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Two-factor authentication
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Zero-knowledge architecture
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Smart Sharing</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-4">
              Share files and folders with precise control over who can view, edit, or download. 
              Generate secure share links with expiration dates and password protection.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Granular permissions
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Password-protected links
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Link expiration dates
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Automatic Backup</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-4">
              Never lose a file again. All your data is automatically backed up across multiple 
              data centers with redundancy built in for maximum reliability.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Multi-region redundancy
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Instant file recovery
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                99.99% uptime SLA
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Version History</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-4">
              Track every change to your files with complete version history. Restore previous 
              versions with a single click and never worry about losing important changes.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited file versions
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                One-click restore
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm font-light">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                View change history
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Collaboration Features */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for collaboration</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            Work together seamlessly with real-time collaboration tools
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Team Comments</h3>
            <p className="text-gray-400 font-light text-sm">
              Leave comments on files and folders. Tag team members and keep discussions organized.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Notifications</h3>
            <p className="text-gray-400 font-light text-sm">
              Stay updated with real-time notifications when files are shared, edited, or commented on.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Team Workspaces</h3>
            <p className="text-gray-400 font-light text-sm">
              Create shared workspaces for your team with centralized file management and access control.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Access anywhere, on any device</h2>
            <p className="text-gray-400 mb-8 font-light leading-relaxed">
              Your files are always accessible whether you're on desktop, mobile, or web. 
              Native apps for all major platforms ensure a seamless experience everywhere you work.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Desktop Apps</div>
                  <div className="text-gray-400 text-sm font-light">Windows, macOS, and Linux</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Mobile Apps</div>
                  <div className="text-gray-400 text-sm font-light">iOS and Android</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Web Access</div>
                  <div className="text-gray-400 text-sm font-light">All modern browsers</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6">Sync & Storage</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400 font-light">Auto-sync across devices</span>
                  <span className="text-sm text-white font-semibold">✓</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400 font-light">Offline access</span>
                  <span className="text-sm text-white font-semibold">✓</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400 font-light">Selective sync</span>
                  <span className="text-sm text-white font-semibold">✓</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400 font-light">Smart caching</span>
                  <span className="text-sm text-white font-semibold">✓</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400 font-light">Bandwidth optimization</span>
                  <span className="text-sm text-white font-semibold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to experience the difference?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto font-light">
            Start using G Drive Express today and discover why thousands of teams trust us with their files
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

export default Features
