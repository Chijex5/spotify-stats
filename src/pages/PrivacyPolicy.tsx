import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ShieldIcon } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
          <ShieldIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
          Privacy Policy
        </h1>
      </header>
      
      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Introduction</h2>
          <p>
            This Privacy Policy explains how Spotify Stats ("we", "our", or "us") collects, uses, and protects your information when you use our service.
            We respect your privacy and are committed to protecting your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Information We Collect</h2>
          <p className="mb-3">
            When you use Spotify Stats, we collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Information from your Spotify account that you authorize us to access, including your listening history, playlists, saved tracks, and user profile information.</li>
            <li>Usage data such as how you interact with our application, features you use, and time spent on the application.</li>
            <li>Device information including your IP address, browser type, and operating system.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">How We Use Your Information</h2>
          <p className="mb-3">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our service, including generating personalized music insights and statistics.</li>
            <li>To improve and optimize our application based on your usage patterns.</li>
            <li>To detect and prevent technical issues or unauthorized access.</li>
            <li>To communicate with you about updates or changes to our service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Data Storage and Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Third-Party Services</h2>
          <p>
            Our service integrates with Spotify's API. Your use of Spotify Stats is also subject to Spotify's Privacy Policy. We do not share your information with any other third parties except as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Your Rights</h2>
          <p className="mb-3">
            You have the following rights regarding your personal data:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access the personal data we hold about you.</li>
            <li>The right to request correction of inaccurate data.</li>
            <li>The right to request deletion of your data.</li>
            <li>The right to withdraw consent at any time.</li>
            <li>The right to lodge a complaint with a supervisory authority.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@spotifystats.com.
          </p>
        </section>

        <div className="flex items-center mt-8 py-4 px-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
          <div className="mr-4 rounded-full bg-white bg-opacity-20 p-2">
            <ShieldIcon className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-sm text-gray-300">
            We're committed to protecting your data and providing transparency about how your information is used. Your privacy is important to us.
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          Last Updated: June 15, 2024
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;