import React from 'react';

const Privacy = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Privacy Policy for Interview Prep</h1>

      <p className="text-muted text-center mb-5">Last updated: July 24, 2025</p> {/* Dynamic date */}

      <p>This Privacy Policy describes how Interview Prep ("we," "us," or "our") collects, uses, and discloses your information when you use our website and services (the "Service").</p>

      <h3 className="mt-4">1. Information We Collect</h3>
      <p>We collect information from you in a few ways:</p>
      <ul>
        <li>
          <strong>Information you provide to us:</strong>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your full name, gender, age, mobile number, email address, and password.</li>
            <li><strong>Profile Information:</strong> You may choose to provide additional information for your profile.</li>
            <li><strong>Questions and Folders:</strong> When you create or interact with interview questions and folders, this content is stored on our servers. This includes the question text, answers, and any categorization you apply. Some questions can be marked as "private" or "public."</li>
            <li><strong>Communications:</strong> If you contact us directly, we may receive additional information about you, such as your name, email address, phone number, the contents of the message, and any attachments you may send us.</li>
          </ul>
        </li>
        <li>
          <strong>Information we collect automatically:</strong>
          <ul>
            <li><strong>Usage Data:</strong> We may collect information about your activity on the Service, such as the pages you visit, the features you use, and the time and date of your use.</li>
            <li><strong>Device Information:</strong> We may collect information about the device you use to access the Service, including the hardware model, operating system, unique device identifiers, and mobile network information.</li>
            <li><strong>Log Data:</strong> Our servers automatically record information that your browser sends whenever you visit our Service. This log data may include your Internet Protocol ("IP") address, browser type and settings, the date and time of your request, and how you interacted with our Service.</li>
            <li><strong>Cookies and Similar Technologies:</strong> We may use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</li>
          </ul>
        </li>
      </ul>

      <h3 className="mt-4">2. How We Use Your Information</h3>
      <p>We use the information we collect for various purposes, including:</p>
      <ul>
        <li><strong>Provide and maintain our Service:</strong> To operate, maintain, and provide all features of the Service.</li>
        <li><strong>Account Management:</strong> To create and manage your user account, including authentication and password resets.</li>
        <li><strong>Personalization:</strong> To personalize your experience on the Service, such as displaying relevant content and features.</li>
        <li><strong>Communication:</strong> To communicate with you, including sending you service-related announcements, updates, security alerts, and support messages.</li>
        <li><strong>Improve and develop the Service:</strong> To understand and analyze how you use our Service and to develop new products, services, features, and functionality.</li>
        <li><strong>Security and Fraud Prevention:</strong> To detect, prevent, and address technical issues, security incidents, and fraudulent activity.</li>
        <li><strong>Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
      </ul>

      <h3 className="mt-4">3. How We Share Your Information</h3>
      <p>We may share your information in the following circumstances:</p>
      <ul>
        <li><strong>With Your Consent:</strong> We may share your information with third parties when we have your explicit consent to do so.</li>
        <li>
          <strong>Publicly Available Information:</strong>
          <ul>
            <li><strong>Public Questions and Folders:</strong> If you choose to make your interview questions or folders <strong>public</strong>, they will be accessible to all users of the Service and potentially to the general public via the internet. Please be mindful of what information you choose to make public.</li>
            <li><strong>Usernames/Profile Names:</strong> Your username or profile name may be displayed to other users in connection with public content you create or interact with.</li>
          </ul>
        </li>
        <li><strong>Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf and need access to your information to carry out their work for us. These may include payment processing, data analysis, email delivery, hosting services, customer service, and marketing efforts.</li>
        <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of all or a portion of our assets, your information may be sold or transferred as part of such a transaction.</li>
        <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to (i) comply with a legal obligation, (ii) protect and defend our rights or property, (iii) act in urgent circumstances to protect the personal safety of users of the Service or the public, or (iv) protect against legal liability.</li>
      </ul>

      <h3 className="mt-4">4. Data Security</h3>
      <p>We implement reasonable security measures designed to protect your information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

      <h3 className="mt-4">5. Data Retention</h3>
      <p>We retain personal information for as long as necessary to provide the Service and fulfill the transactions you have requested, or for other essential purposes such as complying with our legal obligations, resolving disputes, and enforcing our agreements.</p>

      <h3 className="mt-4">6. Your Choices and Rights</h3>
      <ul>
        <li><strong>Account Information:</strong> You can review and update your account information by logging into your account settings.</li>
        <li><strong>Communication Preferences:</strong> You may opt-out of receiving promotional communications from us by following the unsubscribe instructions provided in those communications. You cannot opt out of receiving service-related messages.</li>
        <li><strong>Public vs. Private Content:</strong> You have control over whether your created questions and folders are public or private within the Service.</li>
      </ul>

      <h3 className="mt-4">7. Children's Privacy</h3>
      <p>Our Service is not intended for individuals under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from a child under the age of 13 without verification of parental consent, we take steps to remove that information from our servers.</p>

      <h3 className="mt-4">8. Changes to This Privacy Policy</h3>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

      <h3 className="mt-4">9. Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
      <p><strong>support@interviewprep.com</strong></p> {/* Replace with your actual contact email */}
    </div>
  );
};

export default Privacy;