# Testing Location Detection - Quick Guide

## Quick Test Setup

To test the location detection feature, you can simulate being at a restaurant using browser developer tools.

### Chrome/Edge DevTools Method

1. **Open DevTools**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

2. **Open Sensors Tab**:
   - Click the three dots menu (⋮) in DevTools
   - More tools → Sensors
   - Or press `Ctrl+Shift+P` and type "Show Sensors"

3. **Override Geolocation**:
   - In the Sensors tab, find "Location" section
   - Select "Other..." from the dropdown
   - Enter coordinates for one of our mock restaurants:

### Mock Restaurant Coordinates

Use these coordinates to test at different restaurants:

| Restaurant Name | Latitude | Longitude | Coordinates String |
|----------------|----------|-----------|-------------------|
| **Bella Vista Restaurant** | 40.7580 | -73.9855 | `40.7580, -73.9855` |
| **Sakura Sushi Bar** | 40.7614 | -73.9776 | `40.7614, -73.9776` |
| **Burger Haven** | 40.7489 | -73.9680 | `40.7489, -73.9680` |
| **Dragon Palace** | 40.7516 | -73.9755 | `40.7516, -73.9755` |
| **Le Petit Bistro** | 40.7639 | -73.9719 | `40.7639, -73.9719` |

4. **Reload the App**:
   - Refresh the page (`F5`)
   - Wait for the splash screen to complete
   - You should see the location detection modal!

### Firefox Method

1. **Open DevTools**: Press `F12`
2. **Type in Console**:
   ```javascript
   // Override geolocation
   navigator.geolocation.getCurrentPosition = function(success) {
     success({
       coords: {
         latitude: 40.7580,
         longitude: -73.9855,
         accuracy: 50
       }
     });
   };
   ```
3. **Reload the page**

### Test Scenarios

#### ✅ Scenario 1: At a Restaurant
- **Setup**: Use coordinates from table above
- **Expected**: Modal appears with restaurant name and two options
- **Actions to Test**:
  - Click "Quick Rating" → Should navigate to restaurant page
  - Click "Find Restaurants" → Should open dashboard
  - Click X button → Modal closes

#### ✅ Scenario 2: Not at a Restaurant
- **Setup**: Use random coordinates far from restaurants
  - Example: `40.7000, -74.0000`
- **Expected**: No modal appears, app loads normally

#### ✅ Scenario 3: Location Permission Denied
- **Setup**: Block location permission in browser settings
- **Expected**: Error message displays (no modal)

#### ✅ Scenario 4: Close to Restaurant (Edge Case)
- **Setup**: Use coordinates ~90 meters from a restaurant
  - Add/subtract ~0.001 from latitude or longitude
  - Example: `40.7590, -73.9855` (about 110m from Bella Vista)
- **Expected**: Still detects restaurant (within 100m threshold)

### Adjusting Detection Threshold

If you want to test with different proximity thresholds:

1. **Open**: `src/hooks/useLocationDetection.js`
2. **Find**: `const PROXIMITY_THRESHOLD = 0.1;` (line ~15)
3. **Change**: 
   - `0.05` = 50 meters (stricter)
   - `0.1` = 100 meters (default)
   - `0.2` = 200 meters (more lenient)
   - `0.5` = 500 meters (very lenient)

### Adding Your Own Test Restaurant

To add a restaurant at your current location:

1. **Get your coordinates**:
   - Visit: https://www.latlong.net/
   - Or check Google Maps (right-click → "What's here?")

2. **Add to mock data** in `src/App.js`:
   ```javascript
   const mockRestaurants = [
     // ... existing restaurants
     {
       id: 99,
       name: "My Test Restaurant",
       cuisine: "Test Cuisine",
       rating: 4.5,
       priceRange: "$$",
       address: "My Address",
       position: { lat: YOUR_LAT, lng: YOUR_LNG }
     }
   ];
   ```

3. **Reload app** and test!

### Mobile Testing

#### On Android (Chrome)
1. Connect device via USB
2. Enable USB debugging
3. Chrome DevTools → Remote Devices
4. Override geolocation same as desktop

#### On iOS (Safari)
1. Settings → Safari → Advanced → Web Inspector
2. Connect to Mac
3. Safari → Develop → [Your Device]
4. Use actual device location or simulator

### Production Testing

For real-world testing:

1. Deploy app to HTTPS server (required for geolocation API)
2. Visit actual restaurant locations
3. Open app on mobile device
4. Grant location permission
5. Modal should appear automatically

### Troubleshooting

**Modal doesn't appear?**
- Check browser console for errors
- Verify coordinates are correct
- Ensure proximity threshold is appropriate
- Check that location permission is granted

**Wrong restaurant detected?**
- Check coordinate accuracy
- Verify restaurant list includes correct positions
- Adjust proximity threshold if needed

**Error messages?**
- Enable location services on device
- Grant browser location permission
- Ensure HTTPS in production
- Check for JavaScript errors in console

### Reset Everything

If things get stuck:
1. Clear browser cache
2. Reload page with `Ctrl+F5` (hard refresh)
3. Reset DevTools (Settings → Restore defaults)
4. Try incognito/private browsing mode

---

**Happy Testing! 🎉**
