import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, FileTextIcon } from 'lucide-react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-white border-opacity-10">
      <div className="mb-6 flex items-center">
        <Link 
          to="/" 
          className="flex items-center text-green-400 hover:text-green-300 transition-colors mr-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <header className="flex items-center pb-4 border-b border-white border-opacity-10 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mr-4 shadow-lg">
          <FileTextIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
          Terms of Use
        </h1>
      </header>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Acceptance of Terms</h2>
          <p>
            By accessing or using Spotify Stats ("Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Description of Service</h2>
          <p className="mb-3">
            Spotify Stats provides insights and analytics based on your Spotify listening data. Our Service allows you to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>View your top tracks, artists, and genres across different time periods</li>
            <li>Analyze trends and patterns in your listening habits</li>
            <li>Generate personalized music insights</li>
            <li>Track your Spotify listening activity over time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Spotify Account and Authentication</h2>
          <p>
            To use Spotify Stats, you must have a valid Spotify account and authorize our Service to access your Spotify data. We use Spotify's official authentication protocols to access your data, and you can revoke this access at any time through your Spotify account settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">User Conduct</h2>
          <p className="mb-3">
            When using our Service, you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Attempt to bypass any security measures or authentication systems</li>
            <li>Use the Service to collect data for purposes not intended by Spotify Stats</li>
            <li>Interfere with or disrupt the Service or servers connected to the Service</li>
            <li>Use automated scripts or bots to access the Service</li>
            <li>Reproduce, duplicate, copy, sell, or exploit any portion of the Service without explicit permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Intellectual Property</h2>
          <p>
            The Service, including all content, features, and functionality, is owned by Spotify Stats and is protected by copyright, trademark, and other intellectual property laws. Our Service uses Spotify data in accordance with Spotify's Developer Terms of Service and does not claim ownership of Spotify's intellectual property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Limitation of Liability</h2>
          <p>
            Spotify Stats is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or availability of the Service. In no event shall Spotify Stats be liable for any indirect, incidental, special, or consequential damages arising out of or relating to your use of our Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Data and Privacy</h2>
          <p>
            Your use of Spotify Stats is also governed by our Privacy Policy, which explains how we collect, use, and protect your information. By using our Service, you consent to the data practices described in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Modifications to the Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We may also update these Terms of Use from time to time. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms of Use. Upon termination, your right to use the Service will immediately cease.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Contact Us</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us at terms@spotifystats.com.
          </p>
        </section>

        <div className="flex items-center mt-8 py-4 px-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
          <div className="mr-4 rounded-full bg-white bg-opacity-20 p-2">
            <FileTextIcon className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-sm text-gray-300">
            By continuing to use Spotify Stats, you acknowledge that you have read and understand our Terms of Use and agree to be bound by them.
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          Last Updated: June 15, 2024
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;