import React from "react";
import "./RefundPolicy.css";

function RefundPolicy() {
  return (
    <div className="refund-container">
      <header className="refund-header">
     
      </header>

      <section>
        <h2>1. Overview</h2>
        <p>
          NearProp is a technology platform that enables users to list, promote, and discover properties. We provide subscription plans, listing packages, and promotional services to sellers, developers, and advisers. NearProp does <strong>not</strong> act as a broker, seller, landlord, or agent for any property transaction.
        </p>
      </section>

      <section>
        <h2>2. Subscriptions & Listing Fees — No Cancellations / No Refunds</h2>
        <p>
          All subscription plans and paid listing packages are considered digital services that are fulfilled immediately when purchased. Therefore, once a subscription or listing package is <strong>activated</strong>, it <strong>cannot be cancelled or refunded</strong>.
        </p>
        <ul>
          <li>Subscriptions grant instant access to platform features and resources.</li>
          <li>Service access is provided for the full purchased billing period (monthly / annual).</li>
          <li>We do not provide pro-rata refunds for mid-period cancellations.</li>
        </ul>
      </section>

      <section>
        <h2>3. Failed or Duplicate Payments</h2>
        <p>
          If a payment fails or a duplicate charge occurs due to technical issues, please contact our support team. After verification, we will process any eligible refunds within <strong>7–14 business days</strong>.
        </p>
      </section>

      <section>
        <h2>4. Service Cancellation by User</h2>
        <p>
          Users may cancel future recurring subscriptions via their account settings. Cancellation will take effect at the end of the current billing period. Cancelling a subscription does not entitle the user to a refund for the already-active billing period.
        </p>
      </section>

      <section>
        <h2>5. Disputes & Chargebacks</h2>
        <p>
          For disputes or chargebacks, please contact us immediately at the email address below. We will investigate all issues and cooperate with payment providers (such as Razorpay) to resolve them.
        </p>
      </section>

      <section>
        <h2>6. Contact</h2>
        <p>
          For refund-related queries or support, contact: <a href="mailto:support@nearprop.com">support@nearprop.com</a><br />
          Phone: <strong>+91 91551 05666</strong>
        </p>
      </section>
    </div>
  );
}

export default RefundPolicy;
