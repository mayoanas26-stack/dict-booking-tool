import React, { useRef, useState, useEffect } from 'react';
import { fetchHighlightsAPI } from '../api/apiService';

export default function Highlights() {
  const scrollRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    setIsLoading(true);
    const { data, error } = await fetchHighlightsAPI();
    if (!error && data) {
      setHighlights(data);
    }
    setIsLoading(false);
  };

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
            <style>{`
              .highlights-grid::-webkit-scrollbar { display: none; } 
              .highlight-card { scroll-snap-align: start; }
              @keyframes skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
              .skeleton-box { background-color: #e2e8f0; border-radius: 4px; }
            `}</style>
            
            {isLoading ? (
              [1, 2, 3, 4].map((n) => (
                <div className="highlight-card" key={`skel-${n}`} style={{ animation: 'skeleton-pulse 1.5s infinite', border: '1px solid #e2e8f0', background: 'white' }}>
                  <div className="highlight-image skeleton-box" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}></div>
                  <div className="highlight-content" style={{ display: 'flex', gap: '15px' }}>
                    <div className="highlight-date" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                      <div className="skeleton-box" style={{ height: '16px', width: '30px', marginBottom: '8px' }}></div>
                      <div className="skeleton-box" style={{ height: '24px', width: '30px' }}></div>
                    </div>
                    <div className="highlight-text" style={{ flex: 1, padding: '10px 0' }}>
                      <div className="skeleton-box" style={{ height: '20px', width: '90%', marginBottom: '10px' }}></div>
                      <div className="skeleton-box" style={{ height: '20px', width: '60%', marginBottom: '20px' }}></div>
                      <div className="skeleton-box" style={{ height: '16px', width: '80px', borderRadius: '20px' }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : highlights.length > 0 ? (
              highlights.map((h, i) => (
                <div className="highlight-card" key={i}>
                  <div className="highlight-image" style={{ backgroundImage: `url('${h.image_url}')` }}></div>
                  <div className="highlight-content">
                    <div className="highlight-date">
                      <span className="month">{h.month}</span>
                      <span className="day">{h.day}</span>
                    </div>
                    <div className="highlight-text">
                      <h3>{h.title}</h3>
                      <a href={h.link_url?.startsWith('http') ? h.link_url : '#'} className="read-more" target="_blank" rel="noreferrer">Read More</a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ padding: '20px' }}>No highlights available right now.</p>
            )}
          </div>
          <div className="fade-overlay left" style={{ opacity: showLeftFade ? 1 : 0, transition: 'opacity 0.3s' }}></div>
          <div className="fade-overlay right" style={{ opacity: showRightFade ? 1 : 0, transition: 'opacity 0.3s' }}></div>
        </div>
      </div>
    </section>
  );
}
