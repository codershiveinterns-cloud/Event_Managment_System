const { chromium } = require('playwright')

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1300 } })
  const logs = []
  page.on('console', (msg) => logs.push(`${msg.type()}: ${msg.text()}`))
  page.on('pageerror', (err) => logs.push(`pageerror: ${err.message}`))
  page.on('requestfailed', (req) => logs.push(`requestfailed: ${req.url()} ${req.failure()?.errorText}`))

  const base = 'http://127.0.0.1:5173'
  const stamp = Date.now()
  const email = `proadmin${stamp}@example.com`
  const eventName = `Royal Corporate Gala ${stamp}`
  const editedEventName = `${eventName} Updated`

  await page.goto(`${base}/admin/dashboard`, { waitUntil: 'networkidle' })
  const protectedRedirect = page.url().endsWith('/admin/login')

  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  const loginVisible = await page.getByRole('link', { name: 'Login' }).first().isVisible()

  await page.goto(`${base}/admin/signup`, { waitUntil: 'networkidle' })
  await page.locator('input[name="name"]').fill('Professional Admin')
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="password"]').fill('password123')
  await Promise.all([
    page.waitForURL('**/admin/dashboard', { timeout: 30000 }),
    page.getByRole('button', { name: 'Create Admin' }).click(),
  ])
  const dashboardTitle = await page.locator('h2').first().innerText()

  await page.goto(`${base}/admin/dashboard/events`, { waitUntil: 'networkidle' })
  await page.locator('input[name="name"]').fill(eventName)
  await page.locator('input[name="category"]').fill('Corporate Gala')
  await page.locator('input[name="price"]').fill('200000')
  await page.locator('input[name="shortSummary"]').fill('Luxury big-budget corporate gala with full premium operations.')
  await page.locator('textarea[name="description"]').fill('A professional premium event with planning, decor, stage, sound, light, hospitality and on-ground execution.')
  await page.locator('input[name="image"]').setInputFiles('C:/Users/coder/Desktop/event managment system/public/images/events/dj.jpg')
  await page.locator('input[name="featured"]').check()
  await page.getByRole('button', { name: 'Add Package' }).click()
  await page.locator('input[placeholder="Package name"]').fill('Platinum Experience')
  await page.locator('input[placeholder="Package price"]').fill('250000')
  await page.locator('textarea[placeholder="Package description"]').fill('Everything needed for a high-end gala event.')
  await page.locator('textarea[placeholder="Included services - one per line"]').fill('Stage design\nSound and lighting\nVIP hospitality\nEvent coordinator')
  await page.getByRole('button', { name: 'Add Event' }).click()
  await page.locator('text=Event added successfully').waitFor({ timeout: 10000 })

  const eventCard = page.locator('article').filter({ hasText: eventName }).first()
  await eventCard.getByRole('button', { name: 'Edit' }).click()
  await page.locator('input[name="name"]').fill(editedEventName)
  await page.getByRole('button', { name: 'Update Event' }).click()
  await page.locator('text=Event updated successfully').waitFor({ timeout: 10000 })

  await page.goto(`${base}/events`, { waitUntil: 'networkidle' })
  await page.locator(`text=${editedEventName}`).waitFor({ timeout: 10000 })
  const publicEventVisible = await page.locator(`text=${editedEventName}`).isVisible()

  await page.goto(`${base}/admin/dashboard/bookings`, { waitUntil: 'networkidle' })
  await page.locator('input[name="clientName"]').fill('Big Budget Client')
  await page.locator('input[name="mobileNo"]').fill('9876543210')
  await page.locator('input[name="address"]').fill('Premium Venue, Mumbai')
  await page.locator('select[name="eventId"]').selectOption({ label: editedEventName })
  await page.locator('select[name="packageId"]').selectOption({ label: 'Platinum Experience - ₹2,50,000' })
  await page.locator('input[name="fromDate"]').fill('2026-09-10')
  await page.locator('input[name="toDate"]').fill('2026-09-12')
  await page.locator('input[name="downPayment"]').fill('100000')
  await page.locator('textarea[name="notes"]').fill('Need VIP entry, LED wall and premium hospitality desk.')
  const daysText = await page.locator('text=No. of Days').locator('..').innerText()
  const totalText = await page.locator('text=Total Price').locator('..').innerText()
  const balanceText = await page.locator('div').filter({ hasText: /^Balance Due/ }).first().innerText()
  await page.getByRole('button', { name: 'Save Booking' }).click()
  await page.locator('text=Booking saved successfully').waitFor({ timeout: 10000 })
  const bookingVisible = await page.locator('text=Big Budget Client').first().isVisible()

  const bookingCard = page.locator('article').filter({ hasText: 'Big Budget Client' }).first()
  await bookingCard.getByRole('button', { name: 'Edit' }).click()
  await page.locator('select[name="status"]').selectOption('current')
  await page.getByRole('button', { name: 'Update Booking' }).click()
  await page.locator('text=Booking updated successfully').waitFor({ timeout: 10000 })

  await page.goto(`${base}/admin/dashboard/staff`, { waitUntil: 'networkidle' })
  await page.locator('input[name="name"]').fill('Operations Lead')
  await page.locator('input[name="mobileNo"]').fill('9000011111')
  await page.locator('input[name="designation"]').fill('Senior Event Operations Manager')
  await page.locator('input[name="totalSalary"]').fill('45000')
  await page.locator('input[name="address"]').fill('Team Office, Mumbai')
  await page.locator('select[name="assignedEventId"]').selectOption({ label: editedEventName })
  await page.locator('select[name="paymentStatus"]').selectOption('partial')
  await page.locator('textarea[name="duties"]').fill('Vendor coordination\nGuest flow management\nStage readiness\nVIP protocol')
  await page.locator('textarea[name="dutyNotes"]').fill('Report 4 hours before event start.')
  await page.getByRole('button', { name: 'Register Staff' }).click()
  await page.locator('text=Staff registered successfully').waitFor({ timeout: 10000 })
  const staffVisible = await page.locator('text=Operations Lead').first().isVisible()

  await page.goto(`${base}/admin/dashboard`, { waitUntil: 'networkidle' })
  await page.locator('text=Financial snapshot').waitFor({ timeout: 10000 })
  const dashboardBody = await page.locator('body').innerText()
  const hasKpis = dashboardBody.includes('Total Events') && dashboardBody.includes('Total Staff') && dashboardBody.includes('Outstanding') && dashboardBody.includes('Recent Bookings')

  await page.screenshot({ path: 'C:/Users/coder/Desktop/event managment system/pro-dashboard-verification.png', fullPage: true })
  console.log(JSON.stringify({ protectedRedirect, loginVisible, dashboardTitle, publicEventVisible, daysText, totalText, balanceText, bookingVisible, staffVisible, hasKpis, editedEventName, email, logs }, null, 2))
  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
