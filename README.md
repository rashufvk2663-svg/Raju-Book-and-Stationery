# RAJU BOOK & STATIONERY
Offline-first, mobile-friendly stock and business manager.

## Included in this release
- Dashboard with daily sales, estimated profit, stock and low-stock overview
- Product catalogue with categories, SKU, prices, minimum stock and camera/gallery photos
- Base-unit inventory and configurable purchase unit conversions (e.g. dozen=12, box=100)
- Purchase entries with additional costs and latest-cost update
- Multi-item sales bills with stock validation and profit snapshot
- Weekly physical stock reconciliation kept separate from sales
- Daily, weekly, monthly and all-time reports
- Transaction history, JSON backup and restore
- Installable PWA shell and offline app-shell cache
- Basic Hindi speech commands where browser speech recognition is supported

## Run
Open the GitHub Pages URL in a modern browser. The app stores business data locally in IndexedDB on that device/browser. Export regular backups. Clearing browser data can remove local records.

## Important limitations
- This is a single-device offline app; there is no cloud account, multi-device sync or server integration.
- Voice commands are browser speech-recognition commands, not a connected generative-AI assistant.
- Browser camera/gallery access depends on device/browser permissions.
- GitHub Pages serves the PWA; it does not produce an Android APK. APK packaging requires a separate Android build workflow.
- Verify all financial records and take a backup before using for live business operations. Test with sample records first.
