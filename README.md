# LifeScribe Website

The official marketing website for LifeScribe - an AI-powered storytelling platform for capturing, preserving, and sharing life stories.

## 🌐 Live Website

**Production URL**: [https://trylifescribe.com](https://trylifescribe.com)

## 📋 Overview

LifeScribe helps users transform their memories into beautifully written chapters using AI assistance. This repository contains the marketing website that showcases the platform's features, pricing, and onboarding experience.

### Key Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Fast loading with progressive enhancement
- **Customer Support**: Integrated Brevo Conversations chat widget
- **Progressive Web App**: PWA capabilities with offline support
- **SEO Optimized**: Meta tags, structured data, and semantic HTML

## 🛠 Technology Stack

- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript
- **Hosting**: GitHub Pages
- **Domain**: Custom domain via Route 53 DNS
- **Chat Support**: Brevo Conversations widget
- **Analytics**: Google Analytics ready
- **Performance**: Service Worker for caching

## 🚀 Deployment

### Automatic Deployment

The website uses GitHub Pages with automatic deployment:

1. **Trigger**: Push to `main` branch
2. **Workflow**: `.github/workflows/pages.yml`
3. **Build Time**: ~30-60 seconds
4. **Live URL**: https://trylifescribe.com

### Manual Deployment

```bash
# Push changes to main branch
git push origin main

# GitHub Actions will automatically deploy
# Monitor at: https://github.com/Life-Scribe/lifescribe-website/actions
```

## 💬 Chat Support Integration

### Brevo Conversations Widget

The website includes an integrated customer support chat widget powered by Brevo Conversations.

#### Configuration
- **Widget ID**: `687010eb98c0fc1b3b0d39b7`
- **Provider**: Brevo Conversations
- **Placement**: HTML `<head>` section for optimal loading
- **Loading**: Asynchronous to prevent performance impact

#### Implementation Details
```html
<!-- Brevo Conversations Widget -->
<script>
    (function(d, w, c) {
        w.BrevoConversationsID = '687010eb98c0fc1b3b0d39b7';
        w[c] = w[c] || function() {
            (w[c].q = w[c].q || []).push(arguments);
        };
        var s = d.createElement('script');
        s.async = true;
        s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
        if (d.head) d.head.appendChild(s);
    })(document, window, 'BrevoConversations');
</script>
```

#### Features
- **Responsive**: Works on all devices and screen sizes
- **Asynchronous Loading**: No impact on page performance
- **Customizable**: Styled to match LifeScribe branding
- **Analytics**: All conversations tracked in Brevo dashboard

## 📁 File Structure

```
lifescribe-website/
├── .github/
│   └── workflows/
│       └── pages.yml          # GitHub Pages deployment workflow
├── images/                    # Image assets organized by category
├── index.html                 # Main website file
├── popup-system.js           # Marketing popup functionality
├── CNAME                     # Custom domain configuration
├── .gitignore               # Git ignore rules
├── *.jpg, *.png, *.webp     # Website images and assets
├── *.pdf                    # Legal documents (Terms, Privacy, etc.)
└── README.md                # This documentation file
```

## 🎨 Design System

### Colors
- **Primary Green**: `#1D7E6F`
- **Accent Orange**: `#FE5E2E` 
- **Gold**: `#FDB913`
- **Background**: `#FFFFFF`
- **Text**: `#000000`

### Typography
- **Headings**: Playfair Display (serif)
- **Body Text**: Inter (sans-serif)
- **Responsive**: `clamp()` functions for fluid typography

### Responsive Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`
- **Large Desktop**: `> 1440px`

## 🔧 Development

### Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/Life-Scribe/lifescribe-website.git
   cd lifescribe-website
   ```

2. **Start Local Server**
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Using Node.js (if you have http-server installed)
   npx http-server -p 8080
   
   # Using PHP (if available)
   php -S localhost:8080
   ```

3. **Open in Browser**
   ```
   http://localhost:8080
   ```

### Making Changes

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Edit `index.html` for content/structure changes
   - Modify styles in the `<style>` section
   - Update JavaScript in the `<script>` section

3. **Test Locally**
   - Verify responsive design
   - Check all interactive elements
   - Test chat widget functionality
   - Validate HTML/CSS

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Create PR against `main` branch
   - Include screenshots if applicable
   - Test in staging environment

6. **Deploy**
   - Merge PR to `main` branch
   - GitHub Actions will automatically deploy
   - Verify changes on live site

## 📊 Performance

### Metrics
- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Page Load Time**: < 1 second
- **Time to Interactive**: < 2 seconds
- **First Contentful Paint**: < 0.5 seconds

### Optimizations
- **Image Optimization**: WebP format with fallbacks
- **Lazy Loading**: Progressive image loading
- **Service Worker**: Caching for repeat visits
- **CSS**: Inline critical CSS, external non-critical
- **JavaScript**: Async loading, progressive enhancement

## 🔐 Security

### Content Security Policy
- External scripts limited to trusted domains
- Inline scripts with nonces where necessary
- Form submissions over HTTPS only

### Privacy
- **GDPR Compliant**: Privacy policy and cookie notice
- **Data Protection**: Minimal data collection
- **Secure Transmission**: All traffic over HTTPS

## 📈 Analytics & Tracking

### Chat Analytics
- **Platform**: Brevo Conversations Dashboard
- **Metrics**: Conversations, response times, user satisfaction
- **Integration**: Automatic tracking of all chat interactions

### Website Analytics (Ready for Integration)
- **Google Analytics**: Tracking code ready for implementation
- **Performance Monitoring**: Core Web Vitals tracking
- **Conversion Tracking**: Button clicks and form submissions

## 🚨 Troubleshooting

### Common Issues

1. **Chat Widget Not Loading**
   - Verify `BrevoConversationsID` is correct
   - Check console for JavaScript errors
   - Ensure HTTPS is enabled

2. **Deployment Failures**
   - Check GitHub Actions logs
   - Verify CNAME file is present
   - Confirm repository settings

3. **Performance Issues**
   - Check image sizes and formats
   - Verify service worker is functioning
   - Test with browser dev tools

### Support Contacts
- **Technical Issues**: Development team
- **Content Changes**: Marketing team
- **Domain/DNS Issues**: Infrastructure team

## 📝 Changelog

### Recent Updates

**2025-07-21**: Brevo Chat Widget Integration
- Added Brevo Conversations widget with ID `687010eb98c0fc1b3b0d39b7`
- Implemented asynchronous loading for optimal performance
- Updated documentation with implementation details
- Added `.gitignore` for better repository management

**2025-07-08**: Domain Configuration
- Added redirect page for troubleshooting
- Restored CNAME configuration for custom domain
- Updated GitHub Pages deployment workflow

## 🤝 Contributing

### Development Guidelines
1. **Mobile First**: Design for mobile, enhance for desktop
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Maintain 95+ Lighthouse scores
5. **SEO**: Semantic HTML and proper meta tags

### Code Style
- **HTML**: Semantic, valid HTML5
- **CSS**: BEM methodology for class naming
- **JavaScript**: ES6+ features with fallbacks
- **Images**: Optimized, responsive, with alt tags

## 📄 License

This project is proprietary to LifeScribe. All rights reserved.

## 📞 Contact

- **Website**: https://trylifescribe.com
- **Support**: Available via chat widget on website
- **Email**: hello@trylifescribe.com

---

**Last Updated**: July 21, 2025
**Repository**: [lifescribe-website](https://github.com/Life-Scribe/lifescribe-website)
**Maintainers**: LifeScribe Development Team