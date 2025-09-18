import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Modal, Row, Col, Badge, Alert, Dropdown } from 'react-bootstrap';
import { FaStar, FaUser, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaFlag, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import StarRating from '../StarRating';
import './Reviews.css';

const Reviews = ({ restaurant, userReviews = [], onAddReview, onUpdateReview, onDeleteReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [helpfulReactions, setHelpfulReactions] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: userReviews.length,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    ratings: {
      food: 0,
      taste: 0,
      ambiance: 0,
      creativity: 0,
      uniqueness: 0
    },
    userName: '',
    visitDate: '',
    wouldRecommend: true,
    images: [],
    tags: [],
    dishes: '',
    priceRange: '',
    waitTime: '',
    serviceRatings: {
      speed: 0,
      friendliness: 0,
      knowledge: 0,
      attentiveness: 0
    },
    verified: false,
    helpful: 0
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const categoryLabels = {
    food: 'Food Quality',
    taste: 'Taste',
    ambiance: 'Ambiance',
    creativity: 'Creativity',
    uniqueness: 'Uniqueness'
  };

  const handleRatingChange = (category, rating) => {
    setNewReview(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: rating
      }
    }));
  };

  const calculateOverallRating = (ratings) => {
    const sum = Object.values(ratings).reduce((acc, rating) => acc + rating, 0);
    return sum / Object.keys(ratings).length;
  };

  // Calculate review statistics
  const calculateReviewStats = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedCount: 0,
        recommendedCount: 0
      };
    }

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + calculateOverallRating(review.ratings), 0);
    const averageRating = totalRating / totalReviews;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const verifiedCount = reviews.filter(review => review.verified).length;
    const recommendedCount = reviews.filter(review => review.wouldRecommend).length;
    
    reviews.forEach(review => {
      const rating = Math.round(calculateOverallRating(review.ratings));
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    return { 
      totalReviews, 
      averageRating, 
      ratingDistribution, 
      verifiedCount, 
      recommendedCount 
    };
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newReview.userName.trim()) {
      errors.userName = 'Name is required';
    } else if (newReview.userName.length < 2) {
      errors.userName = 'Name must be at least 2 characters';
    }
    
    if (!newReview.title.trim()) {
      errors.title = 'Review title is required';
    } else if (newReview.title.length < 10) {
      errors.title = 'Title must be at least 10 characters';
    }
    
    if (!newReview.content.trim()) {
      errors.content = 'Review content is required';
    } else if (newReview.content.length < 50) {
      errors.content = 'Review must be at least 50 characters';
    }
    
    const hasRatings = Object.values(newReview.ratings).some(rating => rating > 0);
    if (!hasRatings) {
      errors.ratings = 'Please provide at least one rating';
    }
    
    if (newReview.visitDate) {
      const visitDate = new Date(newReview.visitDate);
      const today = new Date();
      if (visitDate > today) {
        errors.visitDate = 'Visit date cannot be in the future';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function for price level indicator
  const getPriceLevel = (priceRange) => {
    const priceLevels = {
      '$': 1,
      '$$': 2,
      '$$$': 3,
      '$$$$': 4,
      'Budget': 1,
      'Moderate': 2,
      'Expensive': 3,
      'Very Expensive': 4
    };
    return priceLevels[priceRange] || 1;
  };

  // Helper function for image modal
  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  // Update review statistics when reviews change
  useEffect(() => {
    const stats = calculateReviewStats(userReviews);
    setReviewStats(stats);
  }, [userReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reviewData = {
        ...newReview,
        id: editingReview ? editingReview.id : Date.now(),
        date: new Date().toISOString(),
        overallRating: calculateOverallRating(newReview.ratings),
        helpful: editingReview ? editingReview.helpful : 0,
        verified: true
      };

      if (editingReview) {
        await onUpdateReview(reviewData);
      } else {
        await onAddReview(reviewData);
      }

      resetForm();
    } catch (error) {
      console.error('Error submitting review:', error);
      setFormErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewReview({
      title: '',
      content: '',
      ratings: {
        food: 0,
        taste: 0,
        ambiance: 0,
        creativity: 0,
        uniqueness: 0
      },
      userName: '',
      visitDate: '',
      wouldRecommend: true
    });
    setFormErrors({});
    setShowReviewForm(false);
    setEditingReview(null);
    setIsSubmitting(false);
  };

  const handleEditReview = (review) => {
    setNewReview(review);
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const getSortedAndFilteredReviews = () => {
    let filtered = [...userReviews];
    
    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Enhanced rating filter
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => {
        const overallRating = Math.round(calculateOverallRating(review.ratings));
        switch (ratingFilter) {
          case '5': return overallRating === 5;
          case '4+': return overallRating >= 4;
          case '3+': return overallRating >= 3;
          case '2-': return overallRating <= 2;
          default: return true;
        }
      });
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(review => {
        const reviewDate = new Date(review.date);
        const daysDiff = (now - reviewDate) / (1000 * 60 * 60 * 24);
        
        switch (dateFilter) {
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          case '3months': return daysDiff <= 90;
          case 'year': return daysDiff <= 365;
          default: return true;
        }
      });
    }

    // Verified only filter
    if (verifiedOnly) {
      filtered = filtered.filter(review => review.verified);
    }
    
    // Category filter (keeping existing logic)
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'positive':
          filtered = filtered.filter(review => calculateOverallRating(review.ratings) >= 4);
          break;
        case 'negative':
          filtered = filtered.filter(review => calculateOverallRating(review.ratings) < 3);
          break;
        case 'verified':
          filtered = filtered.filter(review => review.verified);
          break;
        default:
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.overallRating - a.overallRating;
        case 'lowest':
          return a.overallRating - b.overallRating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleHelpfulReaction = (reviewId, isHelpful) => {
    setHelpfulReactions(prev => ({
      ...prev,
      [reviewId]: isHelpful
    }));
  };

  return (
    <div className="reviews-container">
      {/* Reviews Header */}
      <div className="reviews-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="reviews-title">
            Customer Reviews ({userReviews.length})
          </h3>
          <Button 
            variant="primary" 
            onClick={() => setShowReviewForm(true)}
            className="add-review-btn"
          >
            <FaPlus className="me-2" />
            Write Review
          </Button>
        </div>

        {/* Review Statistics */}
        <div className="review-stats mb-4">
          <Row>
            <Col md={6}>
              <div className="average-rating">
                <div className="avg-score">
                  {userReviews.length > 0 
                    ? (userReviews.reduce((sum, r) => sum + r.overallRating, 0) / userReviews.length).toFixed(1)
                    : 'N/A'
                  }
                </div>
                <StarRating 
                  rating={userReviews.length > 0 
                    ? userReviews.reduce((sum, r) => sum + r.overallRating, 0) / userReviews.length
                    : 0
                  } 
                  size="large" 
                  color="primary"
                />
                <div className="total-reviews">{userReviews.length} reviews</div>
              </div>
            </Col>
            <Col md={6}>
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = userReviews.filter(r => Math.floor(r.overallRating) === stars).length;
                  const percentage = userReviews.length > 0 ? (count / userReviews.length) * 100 : 0;
                  
                  return (
                    <div key={stars} className="rating-bar">
                      <span className="stars">{stars} ★</span>
                      <div className="progress-container">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="count">({count})</span>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </div>

        {/* Enhanced Filters and Sorting */}
        <div className="review-controls mb-4">
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="🔍 Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="me-2"
              >
                🎛️ Advanced Filters
              </Button>
            </Col>
          </Row>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="advanced-filters-panel p-3 mb-3">
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="filter-label">Rating</Form.Label>
                    <Form.Select 
                      value={ratingFilter} 
                      onChange={(e) => setRatingFilter(e.target.value)}
                      size="sm"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars Only</option>
                      <option value="4+">4+ Stars</option>
                      <option value="3+">3+ Stars</option>
                      <option value="2-">2 Stars or Less</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="filter-label">Date</Form.Label>
                    <Form.Select 
                      value={dateFilter} 
                      onChange={(e) => setDateFilter(e.target.value)}
                      size="sm"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                      <option value="3months">Past 3 Months</option>
                      <option value="year">Past Year</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="filter-label">Type</Form.Label>
                    <Form.Select 
                      value={filterBy} 
                      onChange={(e) => setFilterBy(e.target.value)}
                      size="sm"
                    >
                      <option value="all">All Reviews</option>
                      <option value="positive">Positive (4+)</option>
                      <option value="negative">Negative (1-3)</option>
                      <option value="verified">Verified Only</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="filter-label">Sort By</Form.Label>
                    <Form.Select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      size="sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="✅ Show verified reviews only"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="verified-filter"
                  />
                </Col>
              </Row>
            </div>
          )}

          {/* Quick Filter Buttons */}
          <Row className="align-items-center">
            <Col md={8}>
              <div className="quick-filters d-flex flex-wrap gap-2">
                <Badge 
                  bg={filterBy === 'all' ? 'primary' : 'light'} 
                  text={filterBy === 'all' ? 'white' : 'dark'}
                  className="filter-badge"
                  onClick={() => setFilterBy('all')}
                >
                  All ({userReviews.length})
                </Badge>
                <Badge 
                  bg={filterBy === 'positive' ? 'success' : 'light'} 
                  text={filterBy === 'positive' ? 'white' : 'dark'}
                  className="filter-badge"
                  onClick={() => setFilterBy('positive')}
                >
                  Positive ({userReviews.filter(r => calculateOverallRating(r.ratings) >= 4).length})
                </Badge>
                <Badge 
                  bg={filterBy === 'negative' ? 'warning' : 'light'} 
                  text={filterBy === 'negative' ? 'white' : 'dark'}
                  className="filter-badge"
                  onClick={() => setFilterBy('negative')}
                >
                  Critical ({userReviews.filter(r => calculateOverallRating(r.ratings) < 3).length})
                </Badge>
                <Badge 
                  bg={filterBy === 'verified' ? 'info' : 'light'} 
                  text={filterBy === 'verified' ? 'white' : 'dark'}
                  className="filter-badge"
                  onClick={() => setFilterBy('verified')}
                >
                  Verified ({userReviews.filter(r => r.verified).length})
                </Badge>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <small className="text-muted">
                Showing {getSortedAndFilteredReviews().length} of {userReviews.length} reviews
              </small>
            </Col>
          </Row>
        </div>

      {/* Review Statistics Dashboard */}
      <div className="review-stats-dashboard mb-4">
        <Row>
          <Col md={3}>
            <div className="stat-card">
              <div className="stat-number">{reviewStats.totalReviews}</div>
              <div className="stat-label">Total Reviews</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              <div className="stat-number">{reviewStats.averageRating.toFixed(1)}</div>
              <div className="stat-label">Average Rating</div>
              <div className="stat-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < Math.round(reviewStats.averageRating) ? 'filled' : ''}`}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              <div className="stat-number">{reviewStats.verifiedCount}</div>
              <div className="stat-label">Verified Reviews</div>
              <div className="stat-percentage">
                {((reviewStats.verifiedCount / reviewStats.totalReviews) * 100).toFixed(0)}%
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-card">
              <div className="stat-number">{reviewStats.recommendedCount}</div>
              <div className="stat-label">Recommended</div>
              <div className="stat-percentage">
                {((reviewStats.recommendedCount / reviewStats.totalReviews) * 100).toFixed(0)}%
              </div>
            </div>
          </Col>
        </Row>

        {/* Rating Distribution */}
        <Row className="mt-3">
          <Col>
            <div className="rating-distribution">
              <h6 className="distribution-title">Rating Distribution</h6>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviewStats.ratingDistribution[rating] || 0;
                const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="rating-bar-container">
                    <span className="rating-label">{rating} ⭐</span>
                    <div className="rating-bar">
                      <div 
                        className="rating-bar-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="rating-count">({count})</span>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {getSortedAndFilteredReviews().length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          getSortedAndFilteredReviews().map(review => (
            <Card key={review.id} className="review-card mb-3">
              <Card.Body>
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      <FaUser />
                    </div>
                    <div className="reviewer-details">
                      <h6 className="reviewer-name">
                        {review.userName}
                        {review.verified && (
                          <Badge bg="success" className="ms-2 verified-badge">
                            Verified
                          </Badge>
                        )}
                      </h6>
                      <div className="review-meta">
                        <span className="review-date">
                          <FaCalendarAlt className="me-1" />
                          {formatDate(review.date)}
                        </span>
                        {review.visitDate && (
                          <span className="visit-date ms-3">
                            Visited: {formatDate(review.visitDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    <StarRating 
                      rating={review.overallRating} 
                      size="medium" 
                      color="primary"
                      showValue={true}
                    />
                  </div>
                </div>

                <div className="review-content">
                  <h5 className="review-title">{review.title}</h5>
                  <p className="review-text">{review.content}</p>
                  
                  {/* Review Images Gallery */}
                  {review.images && review.images.length > 0 && (
                    <div className="review-images mt-3">
                      <Row className="g-2">
                        {review.images.slice(0, 4).map((image, index) => (
                          <Col xs={6} md={3} key={index}>
                            <div className="review-image-container">
                              <img 
                                src={image} 
                                alt={`Review photo ${index + 1}`} 
                                className="review-image"
                                onClick={() => openImageModal(image)}
                              />
                              {index === 3 && review.images.length > 4 && (
                                <div className="image-overlay">
                                  <span>+{review.images.length - 4} more</span>
                                </div>
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  {/* Service Ratings */}
                  {review.serviceRatings && Object.keys(review.serviceRatings).length > 0 && (
                    <div className="service-ratings mt-3">
                      <h6 className="service-title">Service Quality</h6>
                      <Row className="g-2">
                        {Object.entries(review.serviceRatings).map(([service, rating]) => (
                          <Col xs={6} md={4} key={service}>
                            <div className="service-rating-item">
                              <span className="service-name">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <StarRating rating={rating} size="mini" color="accent" />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  {/* Dishes & Price Range */}
                  {(review.dishes || review.priceRange) && (
                    <div className="review-details mt-3">
                      <Row>
                        {review.dishes && (
                          <Col md={6}>
                            <div className="dishes-section">
                              <h6 className="details-title">Dishes Tried</h6>
                              <div className="dishes-list">
                                {review.dishes.split(',').map((dish, index) => (
                                  <Badge key={index} bg="secondary" className="me-1 mb-1 dish-badge">
                                    {dish.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </Col>
                        )}
                        {review.priceRange && (
                          <Col md={6}>
                            <div className="price-section">
                              <h6 className="details-title">Price Range</h6>
                              <div className="price-indicator">
                                {[...Array(4)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`price-symbol ${i < getPriceLevel(review.priceRange) ? 'active' : ''}`}
                                  >
                                    $
                                  </span>
                                ))}
                                <span className="price-text">({review.priceRange})</span>
                              </div>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>
                  )}
                  
                  {/* Category Ratings */}
                  <div className="category-ratings mt-3">
                    <Row>
                      {Object.entries(review.ratings).map(([category, rating]) => (
                        <Col xs={6} md={4} lg={2} key={category} className="mb-2">
                          <div className="category-rating-small">
                            <div className="category-label">{categoryLabels[category]}</div>
                            <StarRating rating={rating} size="small" color="secondary" />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Recommendation */}
                  {review.wouldRecommend !== undefined && (
                    <div className="recommendation mt-2">
                      {review.wouldRecommend ? (
                        <Badge bg="success">
                          <FaThumbsUp className="me-1" />
                          Recommends
                        </Badge>
                      ) : (
                        <Badge bg="warning">
                          <FaThumbsDown className="me-1" />
                          Does not recommend
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="review-actions mt-3">
                  <Button 
                    variant="link" 
                    size="sm"
                    className={`helpful-btn ${helpfulReactions[review.id] === true ? 'active' : ''}`}
                    onClick={() => handleHelpfulReaction(review.id, true)}
                  >
                    <FaThumbsUp className="me-1" />
                    Helpful ({(review.helpful || 0) + (helpfulReactions[review.id] === true ? 1 : 0)})
                  </Button>
                  <Button 
                    variant="link" 
                    size="sm"
                    className={`unhelpful-btn ${helpfulReactions[review.id] === false ? 'active' : ''}`}
                    onClick={() => handleHelpfulReaction(review.id, false)}
                  >
                    <FaThumbsDown className="me-1" />
                    Not Helpful
                  </Button>
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => handleEditReview(review)}
                    className="edit-btn"
                  >
                    <FaEdit className="me-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => onDeleteReview(review.id)}
                    className="delete-btn text-danger"
                  >
                    <FaTrash className="me-1" />
                    Delete
                  </Button>
                  <Button 
                    variant="link" 
                    size="sm"
                    className="report-btn"
                  >
                    <FaFlag className="me-1" />
                    Report
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      <Modal 
        show={showReviewForm} 
        onHide={resetForm}
        size="lg"
        className="review-form-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingReview ? 'Edit Review' : 'Write a Review'} - {restaurant?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formErrors.submit && (
            <Alert variant="danger" className="mb-3">
              {formErrors.submit}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmitReview}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newReview.userName}
                    onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                    isInvalid={!!formErrors.userName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.userName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Visit Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newReview.visitDate}
                    onChange={(e) => setNewReview(prev => ({ ...prev, visitDate: e.target.value }))}
                    isInvalid={!!formErrors.visitDate}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.visitDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Review Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Summarize your experience (min 10 characters)"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                isInvalid={!!formErrors.title}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.title}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {newReview.title.length}/100 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Your Review *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your detailed experience (min 50 characters)..."
                value={newReview.content}
                onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                isInvalid={!!formErrors.content}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.content}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {newReview.content.length}/1000 characters (minimum 50)
              </Form.Text>
            </Form.Group>

            {/* Rating Categories */}
            <div className={`rating-section mb-4 ${formErrors.ratings ? 'border-danger' : ''}`}>
              <h6>Rate Your Experience *</h6>
              {formErrors.ratings && (
                <div className="text-danger mb-2 small">
                  {formErrors.ratings}
                </div>
              )}
              {Object.entries(categoryLabels).map(([category, label]) => (
                <div key={category} className="rating-input mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label className="mb-0">{label}</Form.Label>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FaStar
                          key={star}
                          className={`rating-star ${star <= newReview.ratings[category] ? 'active' : ''}`}
                          onClick={() => handleRatingChange(category, star)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Details Section */}
            <div className="additional-details-section mb-4">
              <h6 className="section-title">Additional Details</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dishes Tried</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Pizza Margherita, Caesar Salad"
                      value={newReview.dishes}
                      onChange={(e) => setNewReview(prev => ({ ...prev, dishes: e.target.value }))}
                    />
                    <Form.Text className="text-muted">
                      Separate multiple dishes with commas
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price Range</Form.Label>
                    <Form.Select
                      value={newReview.priceRange}
                      onChange={(e) => setNewReview(prev => ({ ...prev, priceRange: e.target.value }))}
                    >
                      <option value="">Select price range</option>
                      <option value="$">$ - Budget (Under $15)</option>
                      <option value="$$">$$ - Moderate ($15-30)</option>
                      <option value="$$$">$$$ - Expensive ($30-50)</option>
                      <option value="$$$$">$$$$ - Very Expensive ($50+)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Service Ratings Section */}
            <div className="service-ratings-section mb-4">
              <h6 className="section-title">Service Quality (Optional)</h6>
              <Row>
                {Object.entries({
                  speed: 'Service Speed',
                  friendliness: 'Staff Friendliness',
                  knowledge: 'Staff Knowledge',
                  attentiveness: 'Attentiveness'
                }).map(([service, label]) => (
                  <Col md={6} key={service} className="mb-3">
                    <div className="service-rating-input">
                      <div className="d-flex justify-content-between align-items-center">
                        <Form.Label className="mb-0">{label}</Form.Label>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar
                              key={star}
                              className={`star ${star <= (newReview.serviceRatings[service] || 0) ? 'filled' : ''}`}
                              onClick={() => setNewReview(prev => ({
                                ...prev,
                                serviceRatings: {
                                  ...prev.serviceRatings,
                                  [service]: star
                                }
                              }))}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="I would recommend this restaurant"
                checked={newReview.wouldRecommend}
                onChange={(e) => setNewReview(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={resetForm} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {editingReview ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  editingReview ? 'Update Review' : 'Submit Review'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Image Modal */}
      <Modal 
        show={showImageModal} 
        onHide={closeImageModal}
        size="lg"
        centered
        className="image-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Review Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <img 
            src={selectedImage} 
            alt="Review photo" 
            className="modal-image"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reviews;