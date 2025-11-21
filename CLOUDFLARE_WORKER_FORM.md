# Cloudflare Worker Form Integration

## ✅ Successfully Merged from index_new.html

The signup form now uses a Cloudflare Worker backend instead of Tally.

### What Changed:

1. **Custom Form Inputs**
   - Name field (optional)
   - Email field (required)
   - Clean, simple styling

2. **Cloudflare Worker Backend**
   - Endpoint: `https://morningbuddysignup.jameslapslie.workers.dev/`
   - Handles form submissions
   - Stores data securely

3. **JavaScript Form Handling**
   - Prevents default form submission
   - Validates email field
   - Shows loading state
   - Displays success/error messages
   - Resets form on success

4. **Visual Feedback**
   - Success: Green border with shadow
   - Error: Pink border with shadow
   - Loading: Neutral message


### Form Structure:

```html
<form id="signup-form" action="..." method="POST">
  <input name="name" type="text" placeholder="Buddy name (optional)" />
  <input name="email" type="email" placeholder="you@example.com" required />
  <button type="submit">Join the waiting list</button>
  <p id="signup-message"></p>
</form>
```

### Messages:

- **Loading**: "Adding you to the list…"
- **Success**: "You're on the list! We'll email you when buddies are ready for early access."
- **Error**: "Something went wrong. Please try again..."
- **Validation**: "Pop your email in so we know where to send your invite."

### CSS Classes:

- `.signup-message` - Base message styling
- `.signup-message--success` - Green success state
- `.signup-message--error` - Pink error state

### Testing:

1. Start local server: `python3 -m http.server 8000`
2. Visit: http://localhost:8000/#signup
3. Try submitting with/without email
4. Check success/error messages

### Worker Endpoint:

The Cloudflare Worker at `morningbuddysignup.jameslapslie.workers.dev` should:
- Accept POST requests with JSON: `{ name, email }`
- Return 200 OK on success
- Handle errors gracefully
