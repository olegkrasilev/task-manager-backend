```markdown
# Git Branch Protection Cheat Sheet

This guide covers the essential branch protection settings you have enabled in your repository:

---

## Enabled Branch Protection Settings

### 1. Require Pull Request Reviews

- All merges to protected branches (e.g., `main`, `dev`) require at least one approved code review.
- Prevents merging without team review.

### 2. Require Status Checks to Pass Before Merging

- CI checks (like linting, tests, build) must succeed before merging a PR.
- Ensures code quality and passing tests.

### 3. Do Not Allow Bypass

- Applies branch protection rules to **all users including administrators**.
- Prevents anyone from pushing or merging code that bypasses these rules.

---

## What Happens When You Push or Merge

- **Direct pushes to protected branches are blocked.**
- Changes must be made via Pull Requests and pass all required status checks and reviews before merging.
- Attempting to push directly will produce an error like:
```

remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: - Changes must be made through a pull request.
remote: - Required status check "lint-test-build" is expected.

```

---

## Recommended Workflow

1. **Create a feature branch** off `main` or `dev`:
 `git checkout -b feature/your-feature`

2. **Commit changes** and push the branch:
 `git push origin feature/your-feature`

3. **Open a Pull Request** targeting the protected branch.

4. **Wait for CI status checks to pass** and get required code reviews.

5. **Merge the PR** once all checks and reviews are complete.

6. (Optional) **Delete the feature branch** after merge.

---

## Summary

| Setting                 | Purpose                                     |
|-------------------------|---------------------------------------------|
| Require PR Reviews      | Ensures code is reviewed before merging    |
| Require Status Checks   | Runs automated tests and linters before merge |
| Do Not Allow Bypass     | Enforces rules even for admins              |

---

## Useful Links

- [GitHub Docs: Protected Branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-protected-branches)
- [GitHub Docs: Required Status Checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/enabling-required-status-checks)

---

*This cheat sheet helps maintain code quality and enforce team workflows.*
```
