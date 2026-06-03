import Carousel from 'react-bootstrap/Carousel';

const banners = [
  {
    title: 'Fresh Plates, Fast Orders',
    caption: 'Chef-picked favorites ready for your next craving.',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Crispy, Creamy, Comforting',
    caption: 'Browse veg, non-veg, and desserts in one polished menu.',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Sweet Finishes',
    caption: 'Desserts that make the last bite feel like the first.',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Made For Sharing',
    caption: 'A modern food ordering flow for desktop and mobile.',
    image:
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1600&q=80',
  },
];

function HeroCarousel() {
  return (
    <section className="hero-shell" aria-label="Featured food carousel">
      <Carousel fade interval={3500} className="hero-carousel">
        {banners.map(banner => (
          <Carousel.Item key={banner.title}>
            <img src={banner.image} alt="" className="hero-image" />
            <Carousel.Caption>
              <h1>{banner.title}</h1>
              <p>{banner.caption}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}

export default HeroCarousel;
