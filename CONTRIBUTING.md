# Contributing to OM Comparables Recipe

Thank you for your interest in contributing to the OM Comparables Recipe project! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- **Report Bugs:** Submit detailed bug reports via GitHub Issues
- **Suggest Features:** Propose new features or enhancements
- **Improve Documentation:** Help make our docs clearer and more comprehensive
- **Submit Code:** Fix bugs, add features, or improve performance
- **Share Feedback:** Tell us about your experience using the tool

## 🐛 Reporting Bugs

Before submitting a bug report, please:

1. **Search existing issues** to avoid duplicates
2. **Test with the latest version** to ensure the bug still exists
3. **Gather information:**
   - Operating system and version
   - Node.js and npm versions
   - Goose AI version
   - Steps to reproduce the bug
   - Expected vs. actual behavior
   - Screenshots or error messages

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Run command '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g., macOS 14.0, Windows 11]
- Node.js version: [e.g., 18.17.0]
- npm version: [e.g., 9.6.7]
- Goose version: [e.g., 1.2.3]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Features

We love hearing ideas for new features! When suggesting a feature:

1. **Check existing issues** to see if it's already been proposed
2. **Describe the use case:** Why would this feature be valuable?
3. **Provide examples:** How would users interact with this feature?
4. **Consider alternatives:** Are there other ways to solve the problem?

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Use case**
How would you or other CRE professionals use this feature?

**Additional context**
Any other context, screenshots, or mockups.
```

## 🔧 Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git
- Goose AI CLI

### Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/OM_Comparables_Recipe.git
   cd OM_Comparables_Recipe
   ```

3. **Install dependencies**
   ```bash
   cd comparables-app
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

5. **Make your changes**
   - Follow the coding standards below
   - Write clear, concise commit messages
   - Test your changes thoroughly

6. **Run the dev server**
   ```bash
   npm run dev
   ```

7. **Test your changes**
   - Test the Next.js app manually
   - Verify API routes work correctly
   - Test with sample data

## 📝 Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** rules (see `.eslintrc`)
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions
- Keep functions **small and focused**

### React Components

- Use **functional components** with hooks
- Follow the **component structure**:
  ```typescript
  // Imports
  import { useState } from 'react';

  // Interfaces
  interface MyComponentProps {
    title: string;
  }

  // Component
  export default function MyComponent({ title }: MyComponentProps) {
    // Hooks
    const [state, setState] = useState();

    // Event handlers
    const handleClick = () => {
      // ...
    };

    // Render
    return (
      <div>{title}</div>
    );
  }
  ```
- Use **semantic HTML** elements
- Keep components **reusable** and **composable**

### File Naming

- Components: `PascalCase.tsx` (e.g., `PropertyCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `api.ts`, `xlsExport.ts`)
- Pages: `lowercase.tsx` or `page.tsx` (Next.js convention)

### CSS

- Use **CSS Modules** or **global styles**
- Follow **BEM naming** for class names when applicable
- Keep styles **organized** and **documented**
- Use **CSS variables** for colors and common values

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat(comp-sets): add export to Excel functionality

fix(api): handle missing comparables_data.json gracefully

docs(readme): update troubleshooting section

refactor(PropertyCard): extract unit mix table to separate component
```

## 🧪 Testing

Currently, the project doesn't have automated tests, but manual testing is crucial:

### Testing Checklist

- [ ] Next.js app starts without errors
- [ ] All pages load correctly
- [ ] Property cards display data properly
- [ ] Comp set CRUD operations work
- [ ] Toolbar selection and saving work
- [ ] No console errors in browser
- [ ] API routes return expected data
- [ ] Recipe extraction still works

### Future: Automated Testing

We welcome contributions to add:
- Unit tests (Jest + React Testing Library)
- Integration tests for API routes
- E2E tests (Playwright or Cypress)

## 📥 Submitting Pull Requests

1. **Ensure your code follows** the coding standards
2. **Test thoroughly** using the checklist above
3. **Update documentation** if needed
4. **Write a clear PR description:**
   - What problem does this solve?
   - What changes were made?
   - How to test the changes?
   - Screenshots (if UI changes)

### PR Title Format

Use the same format as commit messages:
```
feat(comp-sets): add bulk delete functionality
fix(api): handle race condition in comp set updates
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Description of testing performed.

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings or errors
- [ ] I have tested that my changes work
```

## 🔍 Code Review Process

1. **Maintainers will review** your PR within a few days
2. **Address feedback** by pushing new commits to your branch
3. **Once approved**, a maintainer will merge your PR
4. **Your contribution** will be included in the next release!

## 📚 Documentation

When adding features or making changes:

- Update **README.md** if user-facing behavior changes
- Update **CHANGELOG.md** (if it exists)
- Add **JSDoc comments** to new functions
- Update **TypeScript types** if data structures change
- Consider adding examples to **batch_processing_example.md**

## 🏆 Recognition

Contributors will be:
- Listed in the project's contributors page
- Mentioned in release notes (for significant contributions)
- Forever appreciated for making this tool better!

## ❓ Questions?

- **General questions:** Open a [GitHub Discussion](https://github.com/BetoIII/OM_Comparables_Recipe/discussions)
- **Bug reports:** Open a [GitHub Issue](https://github.com/BetoIII/OM_Comparables_Recipe/issues)
- **Security issues:** See [SECURITY.md](SECURITY.md)

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the OM Comparables Recipe project! Your efforts help commercial real estate professionals work more efficiently.
