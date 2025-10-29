# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 3.0.x   | :white_check_mark: |
| < 3.0   | :x:                |

## Reporting a Vulnerability

The OM Comparables Recipe team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories (Preferred)**
   - Navigate to the [Security tab](https://github.com/BetoIII/OM_Comparables_Recipe/security) of this repository
   - Click "Report a vulnerability"
   - Fill out the form with details of the vulnerability

2. **Email**
   - Send an email to the repository maintainers via GitHub
   - Include the word "SECURITY" in the subject line
   - Provide as much information as possible (see below)

### What to Include in Your Report

To help us better understand and resolve the issue, please include:

- **Type of vulnerability** (e.g., XSS, SQL injection, path traversal, etc.)
- **Full paths** of source file(s) related to the manifestation of the vulnerability
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the vulnerability (what an attacker could do)
- **Suggested fix** (if you have one)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We'll provide regular updates (at least every 7 days) on our progress
- **Timeline**: We aim to release a fix within 90 days of disclosure
- **Credit**: With your permission, we'll credit you in our release notes

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission of the account holder
- Do not exploit a security issue you discover for any reason (including demonstrating additional risk)
- Report the vulnerability promptly
- Give us reasonable time to resolve the issue before any disclosure to the public or a third party

We will not pursue legal action against researchers who follow these guidelines.

## Security Best Practices for Users

When using the OM Comparables Recipe:

### Data Privacy

1. **Sensitive Documents**
   - Never commit actual Offering Memorandum PDFs to version control
   - Store OM PDFs outside the repository directory
   - Review extracted data before sharing with others

2. **Output Data**
   - The `output/` and `comp_sets/` folders are gitignored by default
   - These folders may contain sensitive property and financial data
   - Ensure these folders are not accidentally committed or shared

3. **Environment Variables**
   - Use `.env.local` for any sensitive configuration (file is gitignored)
   - Never commit `.env` files with API keys or credentials
   - Use the provided `.env.example` as a template

### Application Security

1. **Dependencies**
   - Regularly run `npm audit` in the `comparables-app/` directory
   - Keep dependencies updated: `npm update`
   - Review and address security warnings promptly

2. **Local Development**
   - The Next.js app runs on localhost only by default
   - Do not expose the development server to the public internet
   - Use a reverse proxy with authentication if remote access is needed

3. **Data Access**
   - The application has read/write access to `output/` and `comp_sets/`
   - Ensure proper file system permissions on these folders
   - Regularly backup important comp set data

### Goose AI Integration

1. **API Keys**
   - Store Goose AI credentials securely (not in code or version control)
   - Follow Goose AI's security best practices for API key management
   - Rotate API keys periodically

2. **PDF Processing**
   - Only process OMs from trusted sources
   - Be aware that PDF content is sent to Goose AI for processing
   - Review Goose AI's data privacy policy for handling of uploaded content

## Known Security Considerations

### Current Limitations

1. **File-Based Storage**
   - Data is stored in JSON files without encryption
   - Physical access to the file system = access to all data
   - Consider encrypting the `comp_sets/` folder if storing highly sensitive data

2. **No Authentication**
   - The Next.js app has no built-in authentication
   - Anyone with access to localhost:3001 can view/edit data
   - For multi-user or remote deployments, add authentication layer

3. **Input Validation**
   - Limited validation of PDF extraction results
   - Malformed PDFs could cause parsing errors
   - Users should verify extracted data accuracy

### Planned Improvements

Future versions may include:
- Optional encryption for stored data
- Authentication/authorization system
- Enhanced input validation
- Audit logging for data changes
- Rate limiting for API routes

## Security Update Process

When a security vulnerability is identified and fixed:

1. A security patch will be released as soon as possible
2. The vulnerability will be disclosed in the release notes
3. Users will be notified via GitHub releases and security advisories
4. A CVE ID will be requested for high-severity issues

## Disclosure Policy

- We follow a **coordinated disclosure** policy
- Security fixes are released before full public disclosure
- We request 90 days before any public disclosure by reporters
- We may publicly disclose earlier if the vulnerability is being actively exploited

## Additional Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [npm Security Advisories](https://www.npmjs.com/advisories)

## Questions?

If you have questions about this security policy, please open a [GitHub Discussion](https://github.com/BetoIII/OM_Comparables_Recipe/discussions) or contact the maintainers.

---

**Last Updated:** January 2025
