import ContactForm from './ContactForm.jsx'

const pages = {
  shipping: {
    kicker: 'Order Care',
    title: 'Shipping',
    intro: 'Each finished piece is carefully wrapped and prepared for its journey to you.',
    sections: [
      ['Processing time', 'Ready-to-ship orders are normally packaged and mailed within 1–3 business days. If an unexpected delay occurs, we will contact you at the email address provided with your order.'],
      ['Shipping rate', 'A flat $9.95 shipping charge applies to U.S. orders. At this time, Cyan Dream Creations ships only within the United States.'],
      ['Tracking', 'When your order is placed in the mail, you will receive a shipping confirmation with its USPS tracking number. Carrier delivery estimates are not guaranteed and may be affected by weather, holidays, or other delays outside our control.'],
      ['Shipping address', 'Please review your address carefully during checkout. Contact us promptly if it needs to be corrected. Once a package is in the carrier’s possession, we may not be able to redirect it.'],
    ],
  },
  returns: {
    kicker: 'Shop With Confidence',
    title: 'Returns & Refunds',
    intro: 'We want your Cyan Dream creation to arrive safely and feel right in its new home.',
    sections: [
      ['Return window', 'Contact us within 14 calendar days after tracking shows your order was delivered. Items must be unused and returned in their original condition and protective packaging.'],
      ['Starting a return', 'Use the Contact page with your order information before mailing anything back. Returns sent without contacting us first may be delayed.'],
      ['Return shipping and refunds', 'For preference-based returns, the customer is responsible for return postage. Original shipping charges are nonrefundable. Approved refunds are issued to the original payment method after the returned item is received and inspected.'],
      ['Damage or an incorrect order', 'Please email us within 3 calendar days of delivery and include clear photographs of the item and packaging. If your order arrived damaged, defective, or incorrect, we will work with you on an appropriate replacement or refund and cover any required return shipping.'],
      ['Final-sale pieces', 'Any item specifically marked final sale or made to a customer’s specifications cannot be returned unless it arrives damaged, defective, or materially different from what was ordered.'],
    ],
  },
  privacy: {
    kicker: 'Handled With Care',
    title: 'Privacy',
    intro: 'This notice explains the information Cyan Dream Creations uses to operate the shop and communicate with you.',
    sections: [
      ['Information you provide', 'We receive the contact, shipping, and order information you submit at checkout or when you contact us. If you join the Dream List, we receive the email address you submit and record your confirmation.'],
      ['Payments', 'Card information is entered into Square’s secure payment form and processed by Square. Cyan Dream Creations does not receive or store your complete card number.'],
      ['How information is used', 'We use your information to process and fulfill orders, provide customer service, send order and shipping notices, prevent misuse, and—only after confirmation—send Dream List communications.'],
      ['Service providers', 'The shop relies on service providers including Square for payments, Resend for transactional and subscription email, Vercel for website hosting, and Cloudflare for domain and email routing services. These providers process information as needed to deliver their services.'],
      ['Your choices', 'You may unsubscribe from Dream List messages using the unsubscribe option in those emails. You may also contact us to ask about, correct, or request deletion of personal information we maintain, subject to records we must retain for tax, accounting, fraud-prevention, or legal purposes.'],
      ['Local storage', 'The website may store the contents of your shopping cart in your browser so your selections remain available while you shop.'],
    ],
  },
  terms: {
    kicker: 'The Shop Agreement',
    title: 'Terms',
    intro: 'By using this website or placing an order, you agree to the following shop terms.',
    sections: [
      ['Handmade character', 'Cyan Dream creations are handmade. Small variations in color, crystal placement, finish, and appearance are natural and are not defects. Colors may also appear differently across screens and lighting conditions.'],
      ['Availability and orders', 'Products are offered while supplies last. Adding an item to a cart does not reserve it. We may cancel and refund an order if an item becomes unavailable, a price or description contains a material error, or we cannot safely fulfill the order.'],
      ['Pricing and payment', 'Prices are displayed in U.S. dollars. Applicable shipping and taxes are shown during checkout before payment is submitted. Payments are processed securely by Square.'],
      ['Shipping and returns', 'Orders are governed by the Shipping and Returns & Refunds pages available in this website’s footer.'],
      ['Safe use', 'Sun catchers contain glass, crystal, metal, wire, and small components. They are decorative objects, not toys. Keep them securely hung and away from small children and pets. Inspect the hanging point and hardware periodically.'],
      ['Website content', 'Unless otherwise stated, the artwork, photography, writing, product names, and visual design on this website belong to Cyan Dream Creations and may not be reproduced or used commercially without permission.'],
      ['Changes and contact', 'We may update these terms as the shop evolves. Questions may be sent through the Contact page. These terms are governed by the laws applicable in Wisconsin, United States.'],
    ],
  },
  contact: {
    kicker: 'Send a Note',
    title: 'Contact',
    intro: 'Questions about a creation, an order, or the Dream List are always welcome.',
    sections: [
      ['Contact Cyan Dream', 'Use the private form below. Please include your order reference when asking about an existing purchase.'],
      ['Response time', 'Messages are normally answered within 1–2 business days.'],
      ['Damaged delivery', 'For damage during shipping, contact us within 3 calendar days of delivery and attach clear photographs of the item and its packaging.'],
    ],
  },
}

function InfoPage({ page }) {
  const content = pages[page] || pages.contact

  return (
    <main className="info-page" id="top">
      <div className="container-xl">
        <article className="info-frame">
          <header className="info-heading">
            <span className="info-star" aria-hidden="true">✦</span>
            <p className="section-kicker">{content.kicker}</p>
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
          </header>
          <div className="info-sections">
            {content.sections.map(([title, body]) => (
              <section key={title}>
                <h2>{title}</h2>
                <p>{body}</p>
              </section>
            ))}
            {page === 'contact' && <ContactForm />}
          </div>
          <a className="info-home-link" href="#top">Return to the shop <span aria-hidden="true">✦</span></a>
        </article>
      </div>
    </main>
  )
}

export default InfoPage
