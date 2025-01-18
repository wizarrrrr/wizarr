## TODO

1. [ ] **Fix Vue Route State Flow**  
   - Ensure setup occurs **before** login state checks.

2. [ ] **Complete Invitation Screen**  
   - Finalize design and functionality.

3. [x] **Refactor API Endpoint**  
   - Moved `/bull` to `/api/bull` (Completed ✅).

4. [ ] **Add Preloading to Carousel**  
   - Improve UX by preloading carousel items.

5. [ ] **Implement Cache Auto-Clear**  
   - Automatically clear cache when a failed token has an invalid signature.

6. [ ] **Add Custom Onboarding**  
   - Pull onboarding functionality from the old repo into the new repo.

7. [ ] **Remove Database Selection from ENV**  
   - Allow users to select the database and other ENV options from the setup wizard.

8. [ ] **Fix Translations Workflow**  
   - Add Weblate and workflows for translations.

9. [ ] **Disable Sentry Reporting from Setup**  
   - Provide an option to disable Sentry reporting during the setup process.

10. [ ] **Disable Vue Cache for API Endpoint**  
    - Ensure Vue cache is disabled for API endpoints to prevent stale data issues.

11. [ ] **Enable/Disable `/api/bull` Screen**  
    - Add functionality to allow enabling or disabling the `/api/bull` screen.

12. [ ] **Verify Passkey Authentication**  
    - Ensure Passkey-based authentication is functional and secure.

13. [ ] **Add UI/CSS Customization**  
    - Allow users to customize the UI and CSS for branding purposes.

14. [ ] **Add Custom URL Redirect After Onboarding**  
    - Implement a feature to redirect users to a custom URL after onboarding.

15. [ ] **Invite Payments Using Stripe**  
    - Integrate Stripe for processing payments with invitation workflows.

16. [ ] **Connect Task Queue to Bull APIs**  
    - Link task queues UI screen to the Bull API system for job management.
