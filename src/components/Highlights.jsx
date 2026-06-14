import React, { useRef, useState, useEffect } from 'react';

export default function Highlights() {
  const scrollRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const highlights = [
    {
      img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80',
      month: 'OCT', day: '15', title: 'Regional Assembly 2026', link: '#'
    },
    {
      img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80',
      month: 'NOV', day: '02', title: 'Tech Summit & Expo', link: '#'
    },
    {
      img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80',
      month: 'DEC', day: '10', title: 'Year-End Conference', link: '#'
    },
    {
      img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80',
      month: 'JAN', day: '25', title: 'Innovation Workshop', link: '#'
    },
    {
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      month: 'FEB', day: '14', title: 'Networking Meetup', link: '#'
    }
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    setShowLeftFade(scrollLeft > 10);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollHighlights = (direction) => {
    if (scrollRef.current) {
      const cardWidth = 340; // 320 card width + 20 gap
      scrollRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    }
  };

  // Run initial check once mounted in case content doesn't overflow
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <section id="highlights" className="section-padding" style={{ background: 'var(--bg-light)', position: 'relative' }}>
      <div className="container">
        <div className="section-heading">
          <h2>Highlights</h2>
        </div>
        <div className="carousel-container" id="highlights-carousel" style={{ position: 'relative' }}>
          
          <button 
            onClick={() => scrollHighlights(-1)}
            style={{
              position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              background: 'white', border: '1px solid var(--border)', borderRadius: '50%',
              width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', opacity: showLeftFade ? 1 : 0, pointerEvents: showLeftFade ? 'auto' : 'none', transition: 'all 0.3s',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
            }}
            disabled={!showLeftFade}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--navy-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button 
            onClick={() => scrollHighlights(1)}
            style={{
              position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              background: 'white', border: '1px solid var(--border)', borderRadius: '50%',
              width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', opacity: showRightFade ? 1 : 0, pointerEvents: showRightFade ? 'auto' : 'none', transition: 'all 0.3s',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
            }}
            disabled={!showRightFade}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--navy-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
          <div 
            className="highlights-grid" 
            id="highlights-grid" 
            ref={scrollRef} 
            onScroll={handleScroll}
            style={{ 
              overflowX: 'auto', 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory'
            }}
          >
            {/* CSS to hide webkit scrollbar inline for simplicity */}
            <style>{`.highlights-grid::-webkit-scrollbar { display: none; } .highlight-card { scroll-snap-align: start; }`}</style>
            
            {highlights.map((h, i) => (
              <div className="highlight-card" key={i}>
                <div className="highlight-image" style={{ backgroundImage: `url('${h.img}')` }}></div>
                <div className="highlight-content">
                  <div className="highlight-date">
                    <span className="month">{h.month}</span>
                    <span className="day">{h.day}</span>
                  </div>
                  <div className="highlight-text">
                    <h3>{h.title}</h3>
                    <a href={h.link} className="read-more" target="_blank" rel="noreferrer">Read More</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="fade-overlay left" style={{ opacity: showLeftFade ? 1 : 0, transition: 'opacity 0.3s' }}></div>
          <div className="fade-overlay right" style={{ opacity: showRightFade ? 1 : 0, transition: 'opacity 0.3s' }}></div>
        </div>
      </div>
    </section>
  );
}
