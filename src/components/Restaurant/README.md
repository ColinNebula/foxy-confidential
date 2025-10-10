# Restaurant Component

## Overview
A comprehensive restaurant detail page component that displays detailed information about a restaurant including menus, photos, reviews, ratings, and operational details.

## Features

### 🎨 Hero Section
- Full-width background image with gradient overlay
- Restaurant name, cuisine type, and price range badges
- Overall rating and review count
- Action buttons:
  - Save/Favorite toggle
  - Share functionality (uses Web Share API)
  - Get Directions (opens Google Maps)

### 📊 Quick Info Bar
- Address with location icon
- Phone number with call icon
- Operating hours with open/closed status

### 📑 Tabbed Interface

#### Overview Tab
- **About Section**: Restaurant description and specialties
- **Amenities**: Visual display of available features (WiFi, parking, payment options, etc.)
- **Hours of Operation**: Complete weekly schedule
- **Rating Breakdown**: Visual progress bars showing distribution of star ratings

#### Menu Tab
- Organized by categories (Appetizers, Main Courses, Desserts)
- Each item displays:
  - Name
  - Description
  - Price
- Hover effects for better interactivity

#### Photos Tab
- Responsive grid gallery
- 4 featured photos (can be expanded)
- Image hover effects with zoom
- Supports unsplash placeholder images

#### Reviews Tab
- Integrated with existing Reviews component
- Full review functionality (add, update, delete)
- Rating breakdowns and user feedback

## Props

```javascript
{
  restaurant: {
    id: Number,
    name: String,
    cuisine: String,
    rating: Number,
    totalReviews: Number,
    priceRange: String, // "$", "$$", "$$$", "$$$$"
    address: String,
    phone: String,
    hours: Object, // { monday: "11:00 AM - 10:00 PM", ... }
    description: String,
    images: Array, // Array of image URLs
    specialties: Array, // Array of specialty strings
    amenities: Array, // Array of { icon: Component, name: String }
    menu: Object, // { appetizers: [], mainCourses: [], desserts: [] }
    ratingBreakdown: Object // { 5: 215, 4: 89, 3: 28, 2: 7, 1: 3 }
  },
  onBack: Function // Callback for back navigation
}
```

## Usage

### Basic Implementation
```javascript
import Restaurant from './components/Restaurant';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <div>
      {currentView === 'restaurant' ? (
        <Restaurant 
          restaurant={selectedRestaurant}
          onBack={() => setCurrentView('home')}
        />
      ) : (
        <RestaurantList 
          onRestaurantClick={(restaurant) => {
            setSelectedRestaurant(restaurant);
            setCurrentView('restaurant');
          }}
        />
      )}
    </div>
  );
}
```

### Integration with App.js
The component is integrated with the app's tab-based navigation system:

```javascript
// In App.js
case "restaurant":
  return <Restaurant 
    restaurant={selectedRestaurant}
    onBack={() => setCurrentTab("home")}
  />;
```

### Navigation from Dashboard/Home
Components can navigate to the restaurant page by calling the provided callback:

```javascript
// In Dashboard or Home component
<Card onClick={() => onRestaurantClick(restaurant)}>
  {/* Card content */}
</Card>
```

## Styling

### CSS Features
- **Glassmorphism effects**: Modern translucent card designs
- **Gradient backgrounds**: Purple gradient theme matching app design
- **Smooth animations**: Hover effects, transforms, and transitions
- **Responsive design**: Mobile-first approach with breakpoints:
  - Desktop: 992px+
  - Tablet: 768px-991px
  - Mobile: < 768px
  - Small mobile: < 576px

### Key CSS Classes
- `.restaurant-hero`: Hero section with background image
- `.hero-overlay`: Gradient overlay on hero
- `.info-bar`: Quick information card
- `.restaurant-tabs`: Tabbed navigation interface
- `.content-card`: Reusable card with glassmorphism
- `.menu-item`: Individual menu item card
- `.photo-card`: Photo gallery card

## Responsive Behavior

### Desktop (992px+)
- Full hero height (400px)
- Multi-column layouts
- Hover effects enabled

### Tablet (768px-991px)
- Adjusted hero height (350px)
- 2-column layouts for amenities
- Simplified navigation

### Mobile (< 768px)
- Reduced hero height (300px)
- Single-column layouts
- Stack info bar vertically
- Simplified tabs (icons hidden)
- Full-width action buttons

## Default Data
The component includes comprehensive mock data for demonstration:
- Sample restaurant: "Bella Vista Restaurant"
- Complete menu with 10+ items
- 4 high-quality placeholder images
- Full week operating hours
- 5 amenities with icons
- Rating breakdown with 342 total reviews

## Features by Tab

### Overview Tab
- 📝 Detailed description
- ⭐ Specialties badges
- 🏢 Amenities grid
- 🕐 Hours table
- 📊 Rating distribution charts

### Menu Tab
- 🍽️ Categorized menu sections
- 💰 Pricing information
- 📖 Item descriptions
- Hover interactions

### Photos Tab
- 🖼️ Responsive grid layout
- 🔍 Zoom on hover
- 📱 Mobile-optimized

### Reviews Tab
- ⭐ Star ratings
- 💬 User comments
- ✍️ Add/edit/delete reviews
- 📅 Review dates

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Web Share API (with fallback for unsupported browsers)
- CSS Grid and Flexbox
- CSS backdrop-filter (with fallbacks)

## Future Enhancements
- [ ] Photo lightbox/carousel for full-screen viewing
- [ ] Interactive map integration in overview
- [ ] Reservation booking system
- [ ] Social media integration
- [ ] Print-friendly version
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Real-time availability updates
- [ ] Menu item search/filter
- [ ] Dietary restriction filters
- [ ] Photo upload functionality
