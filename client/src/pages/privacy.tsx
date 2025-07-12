export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-faith-text mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">Effective Date: July 12, 2025</p>
      
      <div className="prose prose-lg max-w-none">
        <h2>Overview</h2>
        <p>
          Proof of a Miracle ("we," "our," or "us") operates the mobile application and website at proofofamiracle.com. 
          We are committed to protecting your privacy and the privacy of children who may use our service.
        </p>

        <h2>Information We Collect</h2>
        <h3>Personal Information</h3>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, profile picture (when you create an account)</li>
          <li><strong>User Content:</strong> Posts, comments, photos, and testimonies you share</li>
          <li><strong>Location Data:</strong> Geographic location when you choose to share miracle locations (optional)</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li><strong>Usage Data:</strong> How you interact with our app</li>
          <li><strong>Device Information:</strong> Device type, operating system, app version</li>
          <li><strong>Log Data:</strong> IP address, access times, pages viewed</li>
        </ul>

        <h2>Children Under 13</h2>
        <p>Our service is intended for users of all ages, including families and children interested in faith content.</p>
        
        <h3>For Children Under 13:</h3>
        <ul>
          <li>We require verifiable parental consent before collecting personal information</li>
          <li>We collect only the minimum information necessary for the service</li>
          <li>Parents can review, delete, or refuse further collection of their child's information</li>
          <li>We do not allow children under 13 to publicly share personal information</li>
        </ul>

        <h3>Parental Rights:</h3>
        <ul>
          <li>Review your child's personal information</li>
          <li>Delete your child's account and information</li>
          <li>Refuse further collection or use of your child's information</li>
          <li>Contact us at privacy@proofofamiracle.com for any requests</li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li><strong>Service Provision:</strong> Enable account creation, posting, and community features</li>
          <li><strong>Communication:</strong> Send notifications about your account and app updates</li>
          <li><strong>Improvement:</strong> Analyze usage to improve our service</li>
          <li><strong>Safety:</strong> Prevent abuse and maintain community guidelines</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties.</p>
        <p><strong>We may share information only when:</strong></p>
        <ul>
          <li>Required by law or legal process</li>
          <li>To protect our rights or prevent harm</li>
          <li>With your explicit consent</li>
          <li>In connection with a business transfer (with notice)</li>
        </ul>

        <h2>Data Security</h2>
        <ul>
          <li>All data transmitted using HTTPS encryption</li>
          <li>Secure authentication through Replit Auth</li>
          <li>Regular security updates and monitoring</li>
          <li>Limited access to personal information by staff</li>
        </ul>

        <h2>Your Rights & Account Deletion</h2>
        <ul>
          <li><strong>Access:</strong> View your personal information</li>
          <li><strong>Correction:</strong> Update incorrect information</li>
          <li><strong>Deletion:</strong> Delete your account and associated data</li>
          <li><strong>Portability:</strong> Export your data in a readable format</li>
        </ul>
        
        <h3>Account Deletion Process</h3>
        <p>You can request complete deletion of your account and all associated data through:</p>
        <ul>
          <li><strong>In-App:</strong> Settings menu → "Delete Account"</li>
          <li><strong>Direct Link:</strong> <a href="/delete-account" className="text-faith-blue underline">proofofamiracle.com/delete-account</a></li>
          <li><strong>Email:</strong> Contact support@proofofamiracle.com</li>
        </ul>
        <p><strong>Important:</strong> Account deletion is permanent and cannot be undone. All your posts, messages, and personal data will be completely removed within 30 days.</p>

        <h2>Contact Information</h2>
        <p><strong>Privacy Officer:</strong> Rudy Ced</p>
        <p><strong>Email:</strong> privacy@proofofamiracle.com</p>
        
        <p className="bg-yellow-50 p-4 border-l-4 border-yellow-400 mt-8">
          <strong>Note for Parents:</strong> If you believe your child under 13 has provided personal information 
          without your consent, please contact us immediately and we will delete the information.
        </p>
        
        <p className="text-sm text-gray-600 mt-8">
          This privacy policy complies with COPPA, GDPR, and Google Play Store requirements.
        </p>
      </div>
    </div>
  );
}