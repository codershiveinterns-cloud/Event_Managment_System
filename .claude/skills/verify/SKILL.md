# Verify Skill

Use this recipe to verify the React/Vite + Express/MongoDB event management system through the running app.

1. Install/build if needed:
   - `npm install`
   - `npm run build`
2. Ensure MongoDB is running locally or `.env` points to MongoDB Atlas.
3. Start the app:
   - `npm run dev`
   - This starts the Express backend and Vite frontend together.
   - Backend normally runs on `http://localhost:5000`.
   - Frontend normally runs on `http://localhost:5173`, or the next free Vite port.
4. Drive these public flows in a browser or Playwright:
   - Home page loads with premium hero text and real gallery images.
   - Header navigation opens About, Events, Contact, and Login.
   - Events page shows event cards with image, name, short description, price, and Book Now.
   - Book Now navigates to `/contact?event=<event-id>` and preselects the event in the contact form.
5. Drive these admin/backend flows:
   - Open `/admin/signup` and create an admin account.
   - Confirm redirect to `/admin/dashboard`.
   - Use Login button / `/admin/login` for login flow if needed.
   - Open Add Event and create an event with image, name, category, description, price, and featured flag.
   - Confirm the new event appears on public `/events`.
   - Open All Events / booking manager and create a booking.
   - Confirm event dropdown includes the admin-added event.
   - Confirm from/to date calculates number of days and total price.
   - Confirm booking appears in the booking list with status.
   - Open Add Staff and register staff assigned to the admin-added event.
   - Confirm staff appears in the staff list.
6. Probe at least one adjacent case:
   - Try an invalid booking date range where To Date is before From Date and confirm backend rejects it, or open `/admin/dashboard` without token and confirm redirect to login.

Screenshots from verification can be saved at workspace root, for example `admin-dashboard-verification.png`.
