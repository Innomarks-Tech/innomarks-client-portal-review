import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PrivacyPage() {
  return <>
    <SiteHeader />
    <main id="main-content" tabIndex={-1} className="container prose">
      <span className="eyebrow purple">YOUR INFORMATION</span>
      <h1>Enquiry privacy notice</h1>
      <p><strong>Last updated: 9 September 2026.</strong> This notice covers the Innomarks Technology Consulting website prototype and its Project Discovery enquiry form.</p>

      <h2>Information we collect</h2>
      <p>The form asks for your name, email address, optional organisation, selected services, project description, approximate budget range, and preferred timeframe. Please do not submit passwords, identity documents, payment details, health information, or other sensitive personal information.</p>

      <h2>Why we use it</h2>
      <p>Innomarks uses the information to review your request, decide how the team may be able to help, contact you about the enquiry, and keep a record of the conversation. Submitting the form does not subscribe you to marketing and does not create a contract, booking, or quote.</p>

      <h2>Drafts and submitted enquiries</h2>
      <p>Your unfinished draft stays in the current browser tab while you move between steps. It is not written to browser storage, and refreshing or closing the page clears it. When you send the form, the website stores a private enquiry record and gives you a reference number.</p>

      <h2>Who can access it</h2>
      <p>Access is limited to authorised Innomarks staff who need the information to review and respond to enquiries. The website is hosted by Vercel, and enquiry records and staff access are managed through Supabase. These providers process information to operate the prototype on behalf of Innomarks.</p>

      <h2>How long it is kept</h2>
      <p>Enquiry information is kept only for as long as it is reasonably needed to evaluate and respond to the request, maintain the resulting business record, or meet legal obligations. Prototype and test records may be removed during development. A fixed retention schedule must be approved before the site is used as a public production service.</p>

      <h2>Your choices</h2>
      <p>You may ask what enquiry information Innomarks holds about you, request a correction, or ask for deletion where the information no longer needs to be kept. Innomarks may need to retain limited records where the law or an active business relationship requires it.</p>

      <h2>Contact</h2>
      <p>For privacy questions or requests, email <a href="mailto:info@innomarkstech.co.za">info@innomarkstech.co.za</a>. Include your enquiry reference if you have one, but do not email sensitive information.</p>
    </main>
    <SiteFooter />
  </>;
}
