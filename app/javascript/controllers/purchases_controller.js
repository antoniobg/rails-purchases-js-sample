import { Controller } from "@hotwired/stimulus"
import { Purchases } from "@revenuecat/purchases-js"

export default class extends Controller {
  static targets = ["output", "initButton", "paywallButton", "packagesContainer"]

  connect() {
    console.log("Purchases controller connected")
    this.outputTarget.innerHTML = "Purchases controller loaded successfully"
  }

  async initialize() {
    try {
      console.log("Initializing RevenueCat...")
      this.outputTarget.innerHTML = "Initializing RevenueCat..."

      const apiKey = "your_api_key_here"
      const appUserId = Purchases.generateRevenueCatAnonymousAppUserId()

      await Purchases.configure(
        apiKey,
        appUserId
      )

      this.outputTarget.innerHTML = "RevenueCat initialized successfully!"
      console.log("RevenueCat initialized")

      // Enable paywall button
      this.paywallButtonTarget.disabled = false

    } catch (error) {
      console.error("Failed to initialize RevenueCat:", error)
      this.outputTarget.innerHTML = `Error initializing RevenueCat: ${error.message}`
    }
  }

  async showPaywall() {
    try {
      this.outputTarget.innerHTML = "Loading paywall..."

      const offerings = await Purchases.getSharedInstance().getOfferings()
      console.log("Offerings:", offerings)

      if (offerings.current && offerings.current.availablePackages.length > 0) {
        this.renderPaywall(offerings.current)
      } else {
        this.outputTarget.innerHTML = "No packages available for purchase"
      }

    } catch (error) {
      console.error("Failed to load paywall:", error)
      this.outputTarget.innerHTML = `Error loading paywall: ${error.message}`
    }
  }

  renderPaywall(offering) {
    const packages = offering.availablePackages

    this.outputTarget.innerHTML = `
      <div class="paywall">
        <h3>Choose Your Plan</h3>
        <p>Offering: ${offering.identifier}</p>
        <div class="packages-grid">
          ${packages.map(pkg => this.renderPackage(pkg)).join('')}
        </div>
      </div>
    `

    // Add event listeners to purchase buttons
    packages.forEach(pkg => {
      const button = document.getElementById(`purchase-${pkg.identifier}`)
      if (button) {
        button.addEventListener('click', () => this.purchasePackage(pkg))
      }
    })
  }

  renderPackage(pkg) {
    const product = pkg.rcBillingProduct
    const price = product.currentPrice || product.defaultPrice

    return `
      <div class="package-card" style="border: 1px solid #ddd; padding: 20px; margin: 10px; border-radius: 8px; background: white;">
        <h4>${product.displayName || pkg.identifier}</h4>
        <p class="price" style="font-size: 24px; font-weight: bold; color: #007bff;">
          ${price.formattedPrice}
        </p>
        <p class="period" style="color: #666;">
          ${this.formatPeriod(price.period)}
        </p>
        <p class="description" style="font-size: 14px; color: #555;">
          ${product.description || 'Premium features and benefits'}
        </p>
        <button
          id="purchase-${pkg.identifier}"
          class="purchase-btn"
          style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
          Subscribe Now
        </button>
      </div>
    `
  }

  formatPeriod(period) {
    if (!period) return 'One-time'

    const { unit, unitCount } = period
    const periodMap = {
      'day': 'day',
      'week': 'week',
      'month': 'month',
      'year': 'year'
    }

    const periodName = periodMap[unit] || unit
    return unitCount === 1 ? `per ${periodName}` : `per ${unitCount} ${periodName}s`
  }

  async purchasePackage(pkg) {
    try {
      this.outputTarget.innerHTML = `Purchasing ${pkg.identifier}...`

      console.log("Starting purchase for package:", pkg)

      const result = await Purchases.getSharedInstance().purchase({
        rcPackage: pkg,
        customerEmail: "test@example.com" // Optional: you can collect this from user
      })

      console.log("Purchase result:", result)

      this.outputTarget.innerHTML = `
        <div class="purchase-success" style="padding: 20px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; color: #155724;">
          <h4>✅ Purchase Successful!</h4>
          <p>Package: ${pkg.identifier}</p>
          <p>User ID: ${result.customerInfo.originalAppUserId}</p>
          <p>Active Entitlements: ${Object.keys(result.customerInfo.entitlements.active).join(', ') || 'None'}</p>
          ${result.redemptionInfo ? `<p>Redemption URL: <a href="${result.redemptionInfo.redeemUrl}" target="_blank">Access Content</a></p>` : ''}
        </div>
      `

    } catch (error) {
      console.error("Purchase failed:", error)

      let errorMessage = error.message
      if (error.errorCode === 1) { // UserCancelledError
        errorMessage = "Purchase was cancelled by user"
      }

      this.outputTarget.innerHTML = `
        <div class="purchase-error" style="padding: 20px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; color: #721c24;">
          <h4>❌ Purchase Failed</h4>
          <p>Error: ${errorMessage}</p>
          <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Try Again
          </button>
        </div>
      `
    }
  }
}
