# Google Maps API Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Your API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Name it "Foxy Confidential" and click "Create"

### Step 2: Enable Required APIs
1. In the search bar, type "Maps JavaScript API"
2. Click on it and press "Enable"
3. (Optional) Also enable "Geocoding API" for address lookups

### Step 3: Create API Key
1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "API Key"
3. Your API key will be generated
4. (Recommended) Click "Restrict Key" to add restrictions

### Step 4: Configure the Application
1. In the project root, create a file named `.env`
2. Add the following line:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual API key
4. Save the file

### Step 5: Restart the Server
```bash
# Stop the current server (Ctrl+C)
npm start
# The map will now work!
```

## API Key Restrictions (Recommended)

### Application Restrictions
- Select "HTTP referrers (web sites)"
- Add: `http://localhost:3000/*`
- Add your production domain when deploying

### API Restrictions
- Select "Restrict key"
- Choose:
  - Maps JavaScript API
  - Geocoding API (if enabled)

## Billing Information

Google Maps provides:
- **$200 free credit per month**
- This covers approximately:
  - 28,000 map loads
  - 40,000 geocoding requests
- For a small to medium app, this is usually sufficient

## Troubleshooting

### Map not showing?
1. Check that `.env` file is in the project root
2. Verify the API key is correct (no extra spaces)
3. Make sure you restarted the dev server after creating `.env`
4. Check browser console for error messages

### "This page can't load Google Maps correctly"?
1. The API key may be invalid
2. Billing might not be enabled (required even for free tier)
3. The API might not be enabled in Cloud Console

### Still having issues?
1. Check the browser console for specific error messages
2. Verify APIs are enabled in Google Cloud Console
3. Make sure billing is set up (even for free tier)
4. Try generating a new API key

## Example .env File

```env
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Other environment variables can go here
```

## Security Note

- **Never commit your `.env` file to git**
- The `.gitignore` file should include `.env`
- For production, use environment variables on your hosting platform

## Support

For more detailed information:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
