import './Banner.css'

function Banner() {
  return (
    <div className="banner">
      <div className="container banner__inner">
        <span className="banner__icon">🎉</span>
        <p className="banner__text">
          <strong>Introductory Offer:</strong> We're rewarding referrals with a special bonus for our clients. Contact us to learn more.
        </p>
        <a href="#contact" className="banner__link">
          Get in Touch
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default Banner
