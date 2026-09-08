import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PrivacyPage() {
  return <><SiteHeader /><main id="main-content" tabIndex={-1} className="container prose">
    <span className="eyebrow purple">YOUR INFORMATION</span><h1>Enquiry privacy notice</h1>
    <p>This site is being prepared for Innomarks Technology Consulting. Online enquiry collection remains disabled until the business has reviewed its data-handling arrangements.</p>
    <h2>What the enquiry form asks for</h2><p>Your name, email address, optional organisation, selected services, project description, budget range, and timeframe. Please do not include passwords, identity documents, financial records, or other sensitive information.</p>
    <h2>How your information will be used</h2><p>When online enquiries are enabled, these details will be used to review and respond to your project request. Submitting an enquiry does not subscribe you to marketing.</p>
    <h2>Drafts and sending</h2><p>Your draft is held in this browser tab while you complete the steps. It is not stored in browser storage. Refreshing or closing the page clears the draft. Sending will create a private enquiry record for the team and queue an email notification.</p>
    <h2>Before online collection begins</h2><p>The business must confirm who can access enquiries, how long records are retained, how deletion requests are handled, and the service providers used for hosting, storage, and email. This notice will be updated with those details before launch.</p>
    <h2>Contact</h2><p>For questions about your enquiry or information, email <a href="mailto:info@innomarkstech.co.za">info@innomarkstech.co.za</a>.</p>
  </main><SiteFooter /></>;
}
