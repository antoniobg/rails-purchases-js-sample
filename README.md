# RevenueCat Purchases.js Test App

A Rails application for testing [RevenueCat purchases-js v1.5.3](https://revenuecat.github.io/purchases-js-docs/1.5.3/) with import maps and Stimulus.js. This project demonstrates how to integrate RevenueCat's JavaScript SDK in a Rails environment and reproduces common customer integration issues.

## 🚀 Quick Start with Dev Container

This project is configured to run in a development container, providing a consistent environment across different machines.

### Prerequisites

- **Cursor** (recommended) or **VS Code**
- **Dev Containers extension** (should be installed by default in Cursor)
- **Docker Desktop** running on your machine

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd store
   ```

2. **Open in Cursor/VS Code:**
   ```bash
   cursor .
   # or
   code .
   ```

3. **Open in Dev Container:**
   - Cursor/VS Code should detect the `.devcontainer` configuration
   - Click "Reopen in Container" when prompted
   - Or use the Command Palette: `Dev Containers: Reopen in Container`

4. **Wait for container setup:**
   - The container will build automatically (first time may take 5-10 minutes)
   - Dependencies will be installed via the `postCreateCommand`

5. **Start the Rails server:**
   ```bash
   bin/rails server -b 0.0.0.0
   ```

6. **Access the application:**
   - Main app: http://localhost:3000
   - RevenueCat test page: http://localhost:3000/purchases

## 🧪 Testing RevenueCat Integration

### Setup Your RevenueCat Configuration

1. **Get your API key:**
   - Sign up at [app.revenuecat.com](https://app.revenuecat.com)
   - Create a new project
   - Add a Web Billing app
   - Get your sandbox API key

2. **Update the API key:**
   - Edit `app/javascript/controllers/purchases_controller.js`
   - Replace `"your_api_key_here"` with your actual RevenueCat API key

3. **Configure products:**
   - Create products in your RevenueCat dashboard
   - Create an offering with packages
   - Link entitlements to your products

### Testing the Integration

1. **Visit the test page:** http://localhost:3000/purchases

2. **Initialize RevenueCat:**
   - Click "Initialize RevenueCat"
   - Check browser console for any errors

3. **Show Paywall:**
   - Click "Show Paywall"
   - This fetches offerings from RevenueCat and displays available packages

4. **Test Purchase Flow:**
   - Click "Subscribe Now" on any package
   - This will open the RevenueCat checkout flow
   - Use test payment methods in sandbox mode

## 🏗️ Project Structure

### Key Files

- **`app/javascript/controllers/purchases_controller.js`** - Stimulus controller with RevenueCat integration
- **`app/views/purchases/index.html.erb`** - Test interface for the paywall
- **`config/importmap.rb`** - Import map configuration including RevenueCat library
- **`.devcontainer/`** - Dev container configuration

### Technology Stack

- **Ruby 3.4.4** on **Rails 8.0.2**
- **Import Maps** for JavaScript dependencies
- **Stimulus.js** for frontend interactions
- **RevenueCat purchases-js v1.5.3**
- **Puma** web server

## 🔧 Development

### Common Commands

```bash
# Start Rails console
bin/rails console

# Run tests
bin/rails test

# Check routes
bin/rails routes

# Update import maps
./bin/importmap pin @revenuecat/purchases-js@1.5.3
```

### Browser Developer Tools

- Open Developer Tools (F12) to see console logs
- RevenueCat operations are logged to the console
- Network tab shows API calls to RevenueCat

## 🐛 Troubleshooting Common Issues

### Import/Export Errors

If you see errors like "does not provide an export named 'default'":

```javascript
// ❌ Wrong - tries to import default export
import Purchases from "@revenuecat/purchases-js"

// ✅ Correct - imports named export
import { Purchases } from "@revenuecat/purchases-js"
```

### API Key Issues

- Ensure you're using the correct sandbox/production API key
- Check that the API key matches your environment
- Verify the key in RevenueCat dashboard

### No Packages Available

- Confirm products are created in RevenueCat dashboard
- Check that offerings contain packages
- Verify products are enabled for Web Billing

## 🌐 Environment Configuration

### Dev Container Features

The development container includes:

- Ruby 3.4.4 with Rails 8.0.2
- Node.js for asset processing
- SQLite3 database
- GitHub CLI
- Docker-outside-of-Docker support

### Port Forwarding

- **Port 3000:** Rails application
- **Port 45678:** Capybara server (for testing)

## 📚 Additional Resources

- [RevenueCat Purchases.js Documentation](https://revenuecat.github.io/purchases-js-docs/1.5.3/)
- [RevenueCat Dashboard](https://app.revenuecat.com)
- [Rails Import Maps Guide](https://github.com/rails/importmap-rails)
- [Stimulus.js Handbook](https://stimulus.hotwired.dev/)

## 🤝 Contributing

This is a test application for reproducing RevenueCat integration issues. If you encounter problems:

1. Check browser console for JavaScript errors
2. Verify your RevenueCat configuration
3. Test with different package configurations
4. Check network requests in Developer Tools

---

**Note:** This application uses sandbox mode by default. For production use, replace the sandbox API key with your production key and ensure proper testing.
