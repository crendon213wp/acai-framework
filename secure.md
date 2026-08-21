# Security Notes

## What This Framework Does

Acai is a static frontend starter and Gulp build workflow. It creates files for a browser to serve. It does not provide:

- A backend or API
- A database
- User accounts or authentication
- A payment system
- A secret-management service

Security still matters. The finished website, its dependencies, its content, and its hosting environment are the responsibility of the project owner.

## Keep Secrets Private

Never put passwords, API keys, access tokens, private certificates, or other credentials in files inside `src/`. Anything placed in HTML, CSS, JavaScript, images, or public configuration can be downloaded by website visitors.

Local environment files are ignored by Git:

```text
.env
.env.*
!.env.example
```

This starter does not load environment variables by itself. An ignored file is not a security system; it only helps prevent accidental commits.

## Dependencies

Keep `package.json` and `package-lock.json` together. Install the exact locked versions in automated or deployment environments:

```bash
npm ci
```

Use `npm install` when intentionally changing dependencies. Review the lockfile changes before committing them.

Check dependencies from time to time:

```bash
npm audit
npm outdated
```

Review the results before applying updates. Run `gulp` after dependency changes and inspect the generated site.

## Third-Party Assets

The source pages may load assets from services such as a CDN or Google Fonts. Before publishing:

- Keep external URLs versioned where possible.
- Confirm the service, package, and version before accepting an update.
- Remove assets the site does not need.
- Review privacy requirements for third-party requests.
- Consider self-hosting important assets when availability or supply-chain control matters.
- Add Subresource Integrity (`integrity` and `crossorigin`) when stable hashes are available.

## Development Server

`gulp` starts BrowserSync and serves the generated `dist/` folder for local development. BrowserSync is not a production web server. Stop the development process before deployment and use a properly configured static host to serve the site.

## Build and Deployment

The `dist/` folder is generated output and is ignored by Git. Before publishing it:

1. Run `gulp` from the project folder.
2. Review the files in `dist/`.
3. Check that no credentials, private notes, source-only files, or development URLs were included.
4. Confirm the production URL in `site.config.js` before generating the sitemap.
5. Serve the site over HTTPS.
6. Configure security headers through the hosting provider, including a suitable Content Security Policy, `Referrer-Policy`, and `X-Content-Type-Options`.

The framework does not configure HTTPS, DNS, hosting access, security headers, or server infrastructure.

## Frontend Boundaries

Treat user-provided content as untrusted. Escape or sanitize it before inserting it into HTML. Avoid unsafe dynamic HTML insertion unless the input is trusted or sanitized. Keep third-party scripts to the minimum required by the site.

## Reporting a Problem

Report security problems privately to the project maintainer before making them public. Include the affected file or dependency, clear reproduction steps, potential impact, and a suggested fix when possible. Never include live credentials in a report.

## Final Reminder

Acai is a starting point, not a complete security solution. Review the generated website, dependencies, third-party services, and hosting configuration before every production release.