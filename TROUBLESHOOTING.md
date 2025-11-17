# Quick Troubleshooting Guide

## The location detection feature has been fixed!

### What was wrong:
1. **Incorrect function signature**: The `calculateDistance` function expects two coordinate objects `{lat, lng}`, but was being called with 4 separate parameters
2. **Timing issue**: The restaurants list wasn't being passed correctly to the hook

### What was fixed:
✅ Updated all `calculateDistance` calls to use correct signature
✅ Simplified the App.js flow to pass restaurants directly
✅ Added more mock restaurants for better testing

## How to test:

### Step 1: Override Your Browser Location
**Chrome/Edge:**
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+P` and type "Show Sensors"
3. In the Sensors tab, find "Location"
4. Select "Other..." and enter coordinates:
   - **Bella Vista**: `40.7580, -73.9855`
   - **Sakura Sushi**: `40.7614, -73.9776`
   - **Burger Haven**: `40.7489, -73.9680`

### Step 2: Reload the App
1. Refresh the page (`F5`)
2. Wait for the splash screen to complete
3. When prompted, **click "Allow" for location permission**
4. You should see the modal appear! 🎉

### Step 3: Test the Buttons
- Click "Quick Rating" → Should navigate to restaurant page
- Or click "Find Restaurants" → Should open dashboard

## Still not working?

### Check Browser Console
Press `F12` and look for errors in the Console tab.

### Common Issues:

**❌ "Location detection failed"**
- Make sure you granted location permission
- Check that coordinates are set in DevTools Sensors

**❌ Modal doesn't appear**
- Your location might be too far from mock restaurants
- Try using exact coordinates from above
- Check proximity is within 100 meters

**❌ "calculateDistance is not a function"**
- Clear browser cache and reload
- Make sure all files are saved

### Debug Mode

Add this to your browser console to see what's happening:
```javascript
// Check if user location is being detected
window.addEventListener('message', (e) => console.log('Location:', e));

// Force open the location check (if app is already loaded)
// This won't work without proper state, but you can check values
```

## Expected Behavior

1. ✅ App loads with splash screen
2. ✅ Location permission requested
3. ✅ Loading spinner: "Checking your location..."
4. ✅ If within 100m of restaurant → Modal appears
5. ✅ If not at restaurant → Normal home screen

## Testing Different Scenarios

### ✅ Test 1: At Bella Vista Restaurant
- DevTools Location: `40.7580, -73.9855`
- Expected: Modal shows "Bella Vista Restaurant"

### ✅ Test 2: At Sakura Sushi Bar  
- DevTools Location: `40.7614, -73.9776`
- Expected: Modal shows "Sakura Sushi Bar"

### ✅ Test 3: Not at a Restaurant
- DevTools Location: `40.7000, -74.0000` (random location)
- Expected: No modal, app loads normally

### ✅ Test 4: Permission Denied
- Block location in browser settings
- Expected: App continues to home screen (no crash)

## Need More Help?

1. Check the browser console for JavaScript errors
2. Verify the `calculateDistance` function is exported from `googlePlacesService.js`
3. Make sure all files are saved and app reloaded
4. Try hard refresh: `Ctrl+Shift+R` or `Ctrl+F5`

---

The feature should now work correctly! 🎉
