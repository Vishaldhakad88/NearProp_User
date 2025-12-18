import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./About.css"; // your CSS file with the styles you shared

function Testimonial() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Cards data (to avoid repeating markup)
  const testimonials = [
    {
      text: `"NearProp made my home search so simple and stress-free. The team understood my exact needs and helped me find the perfect apartment within my budget. Truly a reliable and professional service!"`,
      img: "https://randomuser.me/api/portraits/men/69.jpg",
      name: "Rohit Agarwal (Patna)",
    },
    {
      text: `"I was looking for a rental property and had almost given up hope. NearProp’s app gave me multiple options instantly, and their agent closed the deal much faster than I expected. Highly recommend their service!"`,
      img: "https://t4.ftcdn.net/jpg/03/17/72/03/240_F_317720355_sn87YEwDHHGMMYYmxiS3o3Hinkt1T3sB.jpg",
      name: "Shreya Mishra (Gaya)",
    },
    {
      text: `"NearProp ne ghar dhoondhna mere liye bahut easy bana diya. Team ne meri zarurat ko samajhkar ekdum budget-friendly flat dilwaya. Aaj main apne naye ghar mein bahut khush hoon. Dhanyavaad NearProp!"`,
      img: "https://t4.ftcdn.net/jpg/05/35/28/93/240_F_535289317_lrX9mbQwwRd4Bn3kvxL442XjtNJtZxjy.jpg",
      name: "Pooja Singh (Patna)",
    },
    {
      text: `"Property kharidna hamesha complicated lagta tha, lekin NearProp ke agents ne sab process smooth aur clear bana diya. Documents se lekar registration tak har step pe support mila. Yeh sach mein trustworthy service hai."`,
      img: "data:image/jpeg;base64,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",
      name: "Amit Tiwari (Darbhanga)",
    },
  ];

  return (
    <section className="testimonials-section">
      <h2 style={{ fontSize: "40px", fontWeight: "400" }}>Testimonials</h2>
      <p className="subtitle">
        Discover what our clients say about their seamless experience with NearProp’s expert real estate services.
      </p>

      {/* Desktop / Tablet layout */}
      <div className="testimonial-cards desktop-view">
        {testimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <p>{t.text}</p>
            <div className="profile">
              <img src={t.img} alt={t.name} />
              <div className="name">{t.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile slider */}
      <div className="mobile-slider">
        <Slider {...settings}>
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <p>{t.text}</p>
              <div className="profile">
                <img src={t.img} alt={t.name} />
                <div className="name">{t.name}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Testimonial;