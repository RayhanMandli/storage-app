import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Choose the perfect plan for your needs. All plans include our core features with no hidden fees.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400 font-light">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">10 GB storage</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Basic file sharing</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">2 GB upload limit</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">30-day file history</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Web access only</span>
              </li>
            </ul>
            
            <Link
              to="/register"
              className="block text-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-white relative hover:border-gray-300 transition-all duration-300 transform scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-400 font-light">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">1 TB storage</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Advanced sharing & permissions</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">20 GB upload limit</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Unlimited file history</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Desktop & mobile apps</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Priority support</span>
              </li>
            </ul>
            
            <Link
              to="/register"
              className="block text-center px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Unlimited storage</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Advanced team management</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Unlimited upload size</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Advanced security & compliance</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-light">24/7 phone support</span>
              </li>
            </ul>
            
            <button className="block w-full text-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently asked questions</h2>
          <p className="text-gray-400 font-light">Can't find the answer you're looking for? Contact our support team.</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-gray-400 font-light">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Is there a free trial for Pro plan?</h3>
            <p className="text-gray-400 font-light">Yes, we offer a 14-day free trial for the Pro plan with no credit card required.</p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-400 font-light">We accept all major credit cards, PayPal, and wire transfers for Enterprise customers.</p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">What happens if I exceed my storage limit?</h3>
            <p className="text-gray-400 font-light">We'll notify you when you're approaching your limit. You can either upgrade your plan or remove some files to free up space.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto font-light">
            Join thousands of users and start securing your files today
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Pricing
