# Page snapshot

```yaml
- main:
  - region "Join the 1.2K early risers that have joined so far":
    - paragraph: Join the 1.2K early risers that have joined so far
    - text: 1234 people have joined the waiting list
- region "Notifications alt+T"
- dialog "Join the Morning Buddy Waiting List":
  - heading "Join the Morning Buddy Waiting List" [level=2]
  - paragraph: Be the first to know when Morning Buddy launches. We'll send you early access and keep you updated on our progress.
  - text: Name (optional)
  - textbox "Name (optional)"
  - paragraph: Optional field for your name
  - text: Email address *
  - textbox "Email address required": john@example.com
  - paragraph: Required field for your email address to receive Morning Buddy updates
  - checkbox "I agree to receive early-access emails about Morning Buddy required" [checked]
  - text: I agree to receive early-access emails about Morning Buddy *
  - paragraph: We'll only send you updates about Morning Buddy. You can unsubscribe at any time.
  - button "Cancel and close modal": Cancel
  - button "Submit form to join waiting list": Join Waiting List
  - paragraph: We respect your privacy. Your email will only be used for Morning Buddy updates and you can unsubscribe at any time.
  - button "Close"
```