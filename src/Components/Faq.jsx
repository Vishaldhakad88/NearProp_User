import React from 'react';
import './faq.css';

function Faq() {
  return (
    <>
      <section className="about-section">
        <div className="about-banner">
          <div className='nav justify-content-center'>
            <h1>Frequently Asked Questions</h1>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          {/* Selling FAQs */}
          <div className="faq-category">
            <h2 className="category-title">Selling FAQs</h2>
            <div className="accordion" id="accordionSelling">
              <div className="accordion-item">
                <h3 className="accordion-header" id="headingOneSelling">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOneSelling" aria-expanded="true" aria-controls="collapseOneSelling">
                    Q1. How do I list my property for sale on NearProp?
                  </button>
                </h3>
                <div id="collapseOneSelling" className="accordion-collapse collapse show" aria-labelledby="headingOneSelling" data-bs-parent="#accordionSelling">
                  <div className="accordion-body">
                    You can create an account, log in, and use the "List Property" option to upload details, images, and pricing of your property.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingTwoSelling">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwoSelling" aria-expanded="false" aria-controls="collapseTwoSelling">
                    Q2. Are there any charges for listing my property?
                  </button>
                </h3>
                <div id="collapseTwoSelling" className="accordion-collapse collapse" aria-labelledby="headingTwoSelling" data-bs-parent="#accordionSelling">
                  <div className="accordion-body">
                    Yes, there's a basic listing fee of ₹300/- only.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingThreeSelling">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThreeSelling" aria-expanded="false" aria-controls="collapseThreeSelling">
                    Q3. How do I ensure my property attracts buyers quickly?
                  </button>
                </h3>
                <div id="collapseThreeSelling" className="accordion-collapse collapse" aria-labelledby="headingThreeSelling" data-bs-parent="#accordionSelling">
                  <div className="accordion-body">
                    Make sure to upload high-quality images, write a clear description, and keep your pricing competitive with the market.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingFourSelling">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFourSelling" aria-expanded="false" aria-controls="collapseFourSelling">
                    Q4. Can I edit or remove my property listing later?
                  </button>
                </h3>
                <div id="collapseFourSelling" className="accordion-collapse collapse" aria-labelledby="headingFourSelling" data-bs-parent="#accordionSelling">
                  <div className="accordion-body">
                    Yes, you can manage, edit, or delete your property anytime from your account dashboard.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingFiveSelling">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFiveSelling" aria-expanded="false" aria-controls="collapseFiveSelling">
                    Q5. Does NearProp guarantee the sale of my property?
                  </button>
                </h3>
                <div id="collapseFiveSelling" className="accordion-collapse collapse" aria-labelledby="headingFiveSelling" data-bs-parent="#accordionSelling">
                  <div className="accordion-body">
                    NearProp provides a platform to connect sellers with buyers but does not guarantee a sale. The process depends on market conditions and buyer interest.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Renting FAQs */}
          <div className="faq-category">
            <h2 className="category-title">Renting FAQs</h2>
            <div className="accordion" id="accordionRenting">
              <div className="accordion-item">
                <h3 className="accordion-header" id="headingOneRenting">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOneRenting" aria-expanded="true" aria-controls="collapseOneRenting">
                    Q1. How do I list my property for rent on NearProp?
                  </button>
                </h3>
                <div id="collapseOneRenting" className="accordion-collapse collapse show" aria-labelledby="headingOneRenting" data-bs-parent="#accordionRenting">
                  <div className="accordion-body">
                    Sign up, log in, and use the "List Property" option. Select For Rent, then upload property details, rental price, and amenities.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingTwoRenting">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwoRenting" aria-expanded="false" aria-controls="collapseTwoRenting">
                    Q2. Can I list my property for both sale and rent at the same time?
                  </button>
                </h3>
                <div id="collapseTwoRenting" className="accordion-collapse collapse" aria-labelledby="headingTwoRenting" data-bs-parent="#accordionRenting">
                  <div className="accordion-body">
                    Yes, you can choose both options when creating your listing. Interested users will contact you based on their needs.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingThreeRenting">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThreeRenting" aria-expanded="false" aria-controls="collapseThreeRenting">
                    Q3. How do I find tenants through NearProp?
                  </button>
                </h3>
                <div id="collapseThreeRenting" className="accordion-collapse collapse" aria-labelledby="headingThreeRenting" data-bs-parent="#accordionRenting">
                  <div className="accordion-body">
                    Interested tenants can contact you directly via the platform. You can also respond to inquiries through your dashboard.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingFourRenting">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFourRenting" aria-expanded="false" aria-controls="collapseFourRenting">
                    Q4. Is tenant verification available on NearProp?
                  </button>
                </h3>
                <div id="collapseFourRenting" className="accordion-collapse collapse" aria-labelledby="headingFourRenting" data-bs-parent="#accordionRenting">
                  <div className="accordion-body">
                    NearProp facilitates connections, but tenant verification should be conducted independently by the property owner/agent.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingFiveRenting">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFiveRenting" aria-expanded="false" aria-controls="collapseFiveRenting">
                    Q5. Can I change the rental price after listing?
                  </button>
                </h3>
                <div id="collapseFiveRenting" className="accordion-collapse collapse" aria-labelledby="headingFiveRenting" data-bs-parent="#accordionRenting">
                  <div className="accordion-body">
                    Yes, you can update rental prices or terms anytime from your account dashboard.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Faq;