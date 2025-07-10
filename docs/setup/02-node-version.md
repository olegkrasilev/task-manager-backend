````markdown
# How to Lock Node.js Version for the Project

Follow these steps to ensure your project uses the correct Node.js version.

---

## 1. Check Your Current Node.js Version

Run the command:

```bash
node -v
```
````

Example output:

```
v24.3.0
```

---

## 2. Create a `.nvmrc` File

In the project root, create a file named `.nvmrc` and add your Node.js version:

```bash
echo "24.3.0" > .nvmrc
```

This helps tools like `nvm` to automatically switch to the correct Node version with:

```bash
nvm use
```

---

## 3. Specify Node.js Version in `package.json`

Open your `package.json` file and add the `engines` field with the version range:

```json
"engines": {
  "node": ">=24.3.0 <25"
}
```

- This means the project requires Node.js version 24.3.0 or higher but less than 25.0.0.
- It helps package managers and deployment platforms warn if the Node version is incompatible.
