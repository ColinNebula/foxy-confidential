import React, { useState } from 'react';
import { Card, Form, Button, Modal, Row, Col, Badge, Alert, Dropdown } from 'react-bootstrap';
import { FaStar, FaUser, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaFlag, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import StarRating from '../StarRating';
import './Reviews.css';

const Reviews = ({ restaurant, userReviews = [], onAddReview, onUpdateReview, onDeleteReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [helpfulReactions, setHelpfulReactions] = useState({});
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
    wouldRecommend: true
  });

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
    
    // Category filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'positive':
          filtered = filtered.filter(review => review.overallRating >= 4);
          break;
        case 'negative':
          filtered = filtered.filter(review => review.overallRating < 3);
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

        {/* Filters and Sorting */}
        <div className="review-controls mb-4">
          <Row className="align-items-center">
            <Col md={4}>
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
            <Col md={4}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" size="sm" className="filter-dropdown">
                  Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSortBy('newest')}>Newest First</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('oldest')}>Oldest First</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('highest')}>Highest Rated</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('lowest')}>Lowest Rated</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('helpful')}>Most Helpful</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={4}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm" className="filter-dropdown">
                  Filter: {filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterBy('all')}>All Reviews</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterBy('positive')}>Positive (4+ stars)</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterBy('negative')}>Critical (&lt; 3 stars)</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterBy('verified')}>Verified Only</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
    </div>
  );
};

export default Reviews;