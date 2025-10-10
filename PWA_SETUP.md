# PWA Setup for Foxy Confidential

## Overview
Foxy Confidential is now configured as a Progressive Web App (PWA), optimized for mobile devices and smaller screens with offline capabilities.

## Features

### ✅ Installable
- Can be installed on mobile devices and desktop
- Appears in app drawer/home screen
- Launches in standalone mode (no browser UI)

### ✅ Offline Support
- Works without internet connection
- Caches assets for fast loading
- Google Maps data cached for 7 days
- API responses cached for 5 minutes

### ✅ Mobile Optimized
- Portrait-first orientation
- Touch-friendly interface
- Responsive navigation
- Optimized for small screens

### ✅ Performance
- Fast load times with caching
- Background updates
- Lazy loading
- Image optimization

## Installation

### On Mobile Devices

#### iOS (Safari):
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm
5. App icon appears on home screen

#### Android (Chrome):
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen" or "Install App"
4. Confirm installation
5. App appears in app drawer

### On Desktop

#### Chrome/Edge:
1. Look for install icon in address bar
2. Click "Install Foxy Confidential"
3. App opens in standalone window

## Technical Setup

### 1. Service Worker Registration
The service worker is automatically registered in `src/index.js`:

```javascript
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

serviceWorkerRegistration.register({
  onSuccess: () => console.log('Service worker registered successfully'),
  onUpdate: (registration) => {
    // Handle updates
  }
});
```

### 2. Manifest Configuration
`public/manifest.json` contains PWA metadata:

```json
{
  "short_name": "Foxy Confidential",
  "name": "Foxy Confidential - Restaurant Reviews & Discovery",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#ff6b6b",
  "background_color": "#1a1a2e"
}
```

### 3. Caching Strategy

#### App Shell (Cache First)
- HTML, CSS, JavaScript
- Fonts
- Icons and images

#### Google Maps (Stale While Revalidate)
- Map tiles cached for 7 days
- API responses cached with background updates

#### API Data (Network First)
- Restaurant data cached for 5 minutes
- Falls back to cache if offline

#### Images (Cache First)
- Restaurant photos cached for 30 days
- Maximum 60 images

## Development

### Testing PWA Features

1. **Build for Production:**
   ```bash
   npm run build
   ```

2. **Serve Production Build:**
   ```bash
   npx serve -s build
   ```

3. **Test on Device:**
   - Use ngrok or similar to expose localhost
   - Test on actual mobile device
   - Check Chrome DevTools > Application > Service Workers

### Lighthouse Audit

Run Lighthouse audit in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Run audit

Target scores:
- ✅ Performance: 90+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 90+
- ✅ PWA: 100

## Required Dependencies

Install Workbox for service worker functionality:

```bash
npm install --save workbox-core workbox-expiration workbox-precaching workbox-routing workbox-strategies
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "workbox-core": "^7.0.0",
    "workbox-expiration": "^7.0.0",
    "workbox-precaching": "^7.0.0",
    "workbox-routing": "^7.0.0",
    "workbox-strategies": "^7.0.0"
  }
}
```

## Icons Required

Create app icons in `public/` directory:

- `favicon.ico` - 16x16, 32x32, 64x64
- `logo192.png` - 192x192 (for Android)
- `logo512.png` - 512x512 (for Android/iOS)
- `apple-touch-icon.png` - 180x180 (for iOS)

## Build Configuration

Update `package.json` scripts if using custom service worker:

```json
{
  "scripts": {
    "build": "react-scripts build && workbox generateSW workbox-config.js"
  }
}
```

## Mobile-Specific Optimizations

### 1. Touch Gestures
- Swipe to navigate
- Pull to refresh
- Touch-friendly buttons (min 48x48px)

### 2. Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
```

### 3. Performance
- Lazy load images
- Code splitting
- Minimize bundle size
- Use CDN for assets

### 4. Offline Experience
- Show offline indicator
- Queue actions when offline
- Sync when back online

## Update Strategy

### Automatic Updates
Service worker checks for updates:
- On page load
- Every hour (while app is open)
- When app returns from background

### Manual Update
Prompt user when update available:
```javascript
onUpdate: (registration) => {
  if (confirm('New version available! Refresh?')) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}
```

## Debugging

### Service Worker Issues

1. **Check Registration:**
   ```javascript
   navigator.serviceWorker.getRegistrations()
     .then(registrations => console.log(registrations));
   ```

2. **Clear Cache:**
   - DevTools > Application > Clear Storage
   - Or: `npx serve -s build --no-cache`

3. **Unregister:**
   ```javascript
   navigator.serviceWorker.getRegistrations()
     .then(registrations => {
       registrations.forEach(reg => reg.unregister());
     });
   ```

### Common Issues

#### "Service worker not registered"
- Build app: `npm run build`
- Serve with HTTPS or localhost
- Check console for errors

#### "Manifest not loading"
- Verify manifest.json is in public/
- Check Content-Type is application/json
- Validate JSON syntax

#### "Icons not showing"
- Ensure icons exist in public/
- Check file paths in manifest
- Clear browser cache

## Browser Support

### Full Support:
- ✅ Chrome 40+
- ✅ Edge 17+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Samsung Internet 4+

### Limited Support:
- ⚠️ iOS Safari (no background sync, push notifications)
- ⚠️ Firefox Android (no install prompt)

## Security

### HTTPS Required
PWA features require HTTPS except:
- localhost (for development)
- 127.0.0.1

### Content Security Policy
Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## Analytics

Track PWA metrics:
- Install rate
- Standalone usage
- Offline usage
- Update adoption

```javascript
// Track install
window.addEventListener('appinstalled', () => {
  console.log('App installed');
  // Send to analytics
});
```

## Future Enhancements

- [ ] Push notifications for restaurant deals
- [ ] Background sync for reviews
- [ ] Share target API
- [ ] Shortcuts menu
- [ ] Badging API for notifications
- [ ] File handling
- [ ] Contacts integration

## Testing Checklist

- [ ] Install on iOS device
- [ ] Install on Android device
- [ ] Test offline functionality
- [ ] Verify caching works
- [ ] Check update mechanism
- [ ] Test on slow 3G
- [ ] Lighthouse PWA score 100
- [ ] All icons display correctly
- [ ] Standalone mode works
- [ ] Theme color applies

## Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://web.dev/add-manifest/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
