import React, { useState } from 'react';
import { Card, Col, Row, Container, Badge, Button } from 'react-bootstrap';
import { FaClock, FaUser, FaHeart, FaComment, FaUtensils, FaWineGlass, FaCoffee, FaMapMarkerAlt } from 'react-icons/fa';
import './Lifestyle.css';

function Lifestyle() {
  const [likedPosts, setLikedPosts] = useState([]);

  const lifestylePosts = [
    {
      id: 1,
      title: "The Art of Fine Dining: A Journey Through Michelin Stars",
      excerpt: "Explore the world of haute cuisine and discover what makes a restaurant worthy of the coveted Michelin stars.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      author: "Emma Gastronome",
      date: "October 5, 2025",
      readTime: "8 min read",
      category: "Fine Dining",
      icon: <FaUtensils />,
      likes: 124,
      comments: 18
    },
    {
      id: 2,
      title: "Hidden Gems: Underground Speakeasy Bars Worth Discovering",
      excerpt: "Uncover the secret world of speakeasy bars where craft cocktails meet atmospheric ambiance in the most unexpected places.",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
      author: "James Mixologist",
      date: "October 3, 2025",
      readTime: "6 min read",
      category: "Nightlife",
      icon: <FaWineGlass />,
      likes: 89,
      comments: 12
    },
    {
      id: 3,
      title: "Coffee Culture: Third Wave Coffee Shops Redefining Mornings",
      excerpt: "From single-origin beans to latte art, discover how modern coffee shops are elevating your daily caffeine ritual.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      author: "Sarah Barista",
      date: "October 1, 2025",
      readTime: "5 min read",
      category: "Coffee",
      icon: <FaCoffee />,
      likes: 156,
      comments: 23
    },
    {
      id: 4,
      title: "Farm-to-Table: Meeting the Chefs Who Grow Their Own Ingredients",
      excerpt: "Journey into the kitchens where chefs are reconnecting with the land and reimagining sustainable dining.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
      author: "Michael Green",
      date: "September 28, 2025",
      readTime: "10 min read",
      category: "Sustainability",
      icon: <FaUtensils />,
      likes: 201,
      comments: 34
    },
    {
      id: 5,
      title: "Street Food Revolution: Where Authentic Flavors Meet Urban Culture",
      excerpt: "Explore how street food vendors are becoming culinary destinations and changing the way we think about casual dining.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      author: "Carlos Rodriguez",
      date: "September 25, 2025",
      readTime: "7 min read",
      category: "Street Food",
      icon: <FaMapMarkerAlt />,
      likes: 178,
      comments: 29
    },
    {
      id: 6,
      title: "Wine Pairing Mastery: Elevating Your Dining Experience",
      excerpt: "Learn the art and science of pairing wines with food from sommeliers who've dedicated their lives to the craft.",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      author: "Victoria Sommelier",
      date: "September 22, 2025",
      readTime: "9 min read",
      category: "Wine & Spirits",
      icon: <FaWineGlass />,
      likes: 142,
      comments: 21
    }
  ];

  const toggleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="lifestyle-page">
      <Container fluid className="py-4 px-3 px-md-4">
        {/* Header Section */}
        <div className="lifestyle-header text-center mb-5">
          <h1 className="lifestyle-title">Culinary Lifestyle</h1>
          <p className="lifestyle-subtitle">
            Discover the stories, trends, and experiences that shape modern dining culture
          </p>
        </div>

        {/* Featured Categories */}
        <div className="category-badges mb-4 text-center">
          <Badge bg="primary" className="category-badge mx-2">All Stories</Badge>
          <Badge bg="secondary" className="category-badge mx-2">Fine Dining</Badge>
          <Badge bg="secondary" className="category-badge mx-2">Coffee Culture</Badge>
          <Badge bg="secondary" className="category-badge mx-2">Street Food</Badge>
          <Badge bg="secondary" className="category-badge mx-2">Wine & Spirits</Badge>
        </div>

        {/* Posts Grid */}
        <Row className="g-4 justify-content-center">
          {lifestylePosts.map((post) => (
            <Col key={post.id} xxl={4} xl={4} lg={6} md={6} sm={12} className="d-flex">
              <Card className="lifestyle-card w-100">
                <div className="lifestyle-image-container">
                  <Card.Img 
                    variant="top" 
                    src={post.image} 
                    alt={post.title}
                    className="lifestyle-image"
                  />
                  <Badge className="category-overlay">
                    {post.icon} <span className="ms-2">{post.category}</span>
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="lifestyle-card-title">
                    {post.title}
                  </Card.Title>
                  
                  <Card.Text className="lifestyle-excerpt">
                    {post.excerpt}
                  </Card.Text>
                  
                  <div className="mt-auto">
                    <div className="post-meta d-flex justify-content-between align-items-center mb-3">
                      <div className="author-info">
                        <FaUser className="me-2" size={12} />
                        <small>{post.author}</small>
                      </div>
                      <div className="date-info">
                        <FaClock className="me-2" size={12} />
                        <small>{post.readTime}</small>
                      </div>
                    </div>
                    
                    <div className="post-actions d-flex justify-content-between align-items-center">
                      <div className="action-buttons">
                        <Button 
                          variant="link" 
                          className={`action-btn ${likedPosts.includes(post.id) ? 'liked' : ''}`}
                          onClick={() => toggleLike(post.id)}
                        >
                          <FaHeart className="me-1" />
                          {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                        </Button>
                        <Button variant="link" className="action-btn">
                          <FaComment className="me-1" />
                          {post.comments}
                        </Button>
                      </div>
                      <Button variant="primary" size="sm" className="read-more-btn">
                        Read More
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Lifestyle;

