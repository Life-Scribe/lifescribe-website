# LifeScribe Website Deployment Guide

## Overview

This guide covers the deployment process for the LifeScribe marketing website using GitHub Pages with automatic deployment workflows.

## Deployment Architecture

### Hosting Platform
- **Provider**: GitHub Pages
- **Domain**: Custom domain via Route 53 DNS
- **SSL/TLS**: Automatic HTTPS via GitHub Pages
- **CDN**: GitHub's global CDN network

### Repository Structure
- **Repository**: `https://github.com/Life-Scribe/lifescribe-website.git`
- **Production Branch**: `main`
- **Deployment Trigger**: Push to `main` branch
- **Build Time**: 30-60 seconds typical

## Automatic Deployment

### GitHub Actions Workflow

The deployment is handled by `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Deployment Process

1. **Trigger**: Push to `main` branch or manual workflow dispatch
2. **Checkout**: Repository code is checked out
3. **Setup**: GitHub Pages environment configured
4. **Upload**: All files uploaded as deployment artifact
5. **Deploy**: Artifact deployed to GitHub Pages
6. **Live**: Website available at https://trylifescribe.com

## Manual Deployment

### Standard Deployment

```bash
# 1. Ensure you're on the main branch
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Make your changes to index.html or other files

# 4. Stage and commit changes
git add .
git commit -m "Descriptive commit message"

# 5. Push to trigger deployment
git push origin main

# 6. Monitor deployment
# Visit: https://github.com/Life-Scribe/lifescribe-website/actions
```

### Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and test locally
# Edit files as needed

# 3. Commit changes
git add .
git commit -m "Implement feature: description"

# 4. Push feature branch
git push origin feature/your-feature-name

# 5. Create Pull Request
# Via GitHub UI or gh CLI

# 6. Review and merge to main
# This will trigger automatic deployment
```

## Environment Configuration

### Domain Configuration

The custom domain is configured via:

1. **CNAME File**: Contains `trylifescribe.com`
2. **DNS Configuration**: Route 53 points to GitHub Pages
3. **SSL Certificate**: Automatically managed by GitHub

### DNS Settings (Route 53)
```
Type: CNAME
Name: trylifescribe.com
Value: life-scribe.github.io
TTL: 300
```

### Repository Settings
- **Pages Source**: Deploy from `main` branch
- **Custom Domain**: `trylifescribe.com`
- **HTTPS**: Enforced
- **Build Source**: GitHub Actions

## Deployment Verification

### Automated Checks

After each deployment, verify:

1. **Website Accessibility**
   ```bash
   curl -I https://trylifescribe.com
   # Should return HTTP 200
   ```

2. **Content Updates**
   ```bash
   curl -s https://trylifescribe.com | grep "Last-Modified"
   # Should show recent timestamp
   ```

3. **Chat Widget Functionality**
   ```bash
   curl -s https://trylifescribe.com | grep "BrevoConversationsID"
   # Should find widget configuration
   ```

### Manual Testing

After deployment, test:
- [ ] Homepage loads correctly
- [ ] All images display properly  
- [ ] Responsive design works on mobile
- [ ] Chat widget appears and functions
- [ ] All links work correctly
- [ ] Contact forms submit properly
- [ ] Legal documents are accessible

## Rollback Procedures

### Quick Rollback

If issues are detected after deployment:

```bash
# 1. Identify last known good commit
git log --oneline -5

# 2. Create rollback commit
git revert HEAD
# Or for multiple commits: git revert HEAD~n..HEAD

# 3. Push rollback
git push origin main
# This triggers automatic redeployment of previous version
```

### Emergency Rollback

For critical issues requiring immediate action:

1. **Disable Custom Domain** (temporary)
   - Remove CNAME file and push
   - Site will be accessible at life-scribe.github.io

2. **Revert to Previous Version**
   ```bash
   git reset --hard PREVIOUS_COMMIT_HASH
   git push --force origin main
   ```

3. **Re-enable Custom Domain**
   - Add CNAME file back
   - Wait for DNS propagation

## Monitoring & Alerts

### Deployment Status

Monitor deployments at:
- **GitHub Actions**: https://github.com/Life-Scribe/lifescribe-website/actions
- **Deployment History**: Repository > Environments > github-pages

### Website Monitoring

Regular monitoring should include:
- **Uptime**: Website accessibility
- **Performance**: Page load times
- **Functionality**: Chat widget, forms, links
- **SEO**: Meta tags, structured data

### Alert Triggers
- Deployment failures
- Website downtime (> 5 minutes)
- Performance degradation (> 3 second load time)
- Chat widget failures

## Security Considerations

### Repository Security
- **Branch Protection**: Main branch requires PR reviews
- **Secret Management**: No secrets in repository code
- **Access Control**: Limited push access to main branch

### Website Security
- **HTTPS Only**: All traffic encrypted
- **Content Security Policy**: Implemented for XSS protection
- **External Scripts**: Only trusted sources (Brevo CDN)
- **Form Security**: CSRF protection on contact forms

## Performance Optimization

### Build Optimization
- **Static Assets**: All assets served from CDN
- **Image Compression**: Optimized images with WebP format
- **CSS/JS Minification**: Manual minification for critical resources
- **Caching**: Proper cache headers set by GitHub Pages

### Runtime Optimization
- **Service Worker**: Caches resources for offline access
- **Lazy Loading**: Images load progressively
- **Critical CSS**: Inline critical path CSS
- **Async Scripts**: Non-blocking JavaScript loading

## Troubleshooting

### Common Deployment Issues

1. **Deployment Fails**
   ```bash
   # Check GitHub Actions logs
   # Look for file permission issues
   # Verify workflow file syntax
   ```

2. **Website Not Updating**
   ```bash
   # Check if deployment completed
   # Verify CDN cache (may take 5-10 minutes)
   # Hard refresh browser (Ctrl+F5)
   ```

3. **Custom Domain Issues**
   ```bash
   # Verify CNAME file exists and contains correct domain
   # Check DNS propagation: dig trylifescribe.com
   # Confirm GitHub Pages settings
   ```

4. **SSL Certificate Issues**
   ```bash
   # GitHub automatically manages SSL
   # May take 24-48 hours for new domains
   # Check repository settings > Pages
   ```

### Debug Commands

```bash
# Check deployment status
gh api repos/Life-Scribe/lifescribe-website/pages

# View recent deployments
gh api repos/Life-Scribe/lifescribe-website/deployments

# Check domain configuration
nslookup trylifescribe.com
dig trylifescribe.com CNAME
```

## Maintenance Tasks

### Regular Maintenance
- **Weekly**: Review deployment logs for errors
- **Monthly**: Update dependencies and check security
- **Quarterly**: Performance audit and optimization
- **Annually**: Review and update deployment procedures

### Scheduled Tasks
- **Backup**: Repository automatically backed up by GitHub
- **Updates**: Monitor GitHub Pages feature updates
- **Security**: Regular security scanning of external dependencies

## Contact & Support

### Internal Team
- **Primary Contact**: Development Team
- **Secondary**: DevOps Team
- **Emergency**: On-call engineer

### External Support
- **GitHub Support**: For GitHub Pages issues
- **Route 53 Support**: For DNS/domain issues
- **Brevo Support**: For chat widget issues

---

**Document Version**: 1.0
**Last Updated**: July 21, 2025
**Next Review**: October 21, 2025
**Maintained By**: LifeScribe Development Team