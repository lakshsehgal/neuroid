# Neuroid Data Integration Tool

This directory contains a simple prototype for a data integration and reporting
tool that aggregates advertising performance from Meta (Facebook) Ads and
sales data from Shopify. It was built in response to a request to create a
custom dashboard like Adriel for an agency. Google Ads support can be added
following a similar pattern once API credentials and access are available.

## Features

- **Connect to Meta (Facebook) Ads** using an `ads_read` access token and ad
  account ID. Fetches impressions, clicks, spend, CPC and CPM using the
  Ads Insights API【274129808328909†L848-L864】.
- **Connect to Shopify** using a custom app's Admin API token to pull orders
  and compute total sales, total orders and average order value (AOV)【26989075357435†L166-L170】.
- **Aggregate metrics** from both platforms and calculate return on ad spend
  (ROAS) by comparing Shopify revenue with Meta ad spend.
- **Streamlit dashboard** to input credentials, select a date range and view
  the aggregated metrics in a clean, interactive interface.

## Setup

1. **Install dependencies:**

   ```bash
   pip install requests streamlit pandas google-ads==23.0.0
   ```

   The `google-ads` library is required only if you plan to integrate Google Ads. You
   may omit it if you’re only using Meta and Shopify.

2. **Meta (Facebook) Ads access token:**

   - Create a Meta app in the [Meta Developer portal](https://developers.facebook.com/apps/).
   - Using **Graph API Explorer**, generate a user access token with the
     `ads_read` permission【274129808328909†L848-L864】.
   - The token should begin with `EAA…` and can be extended to ~90 days via the
     Access Token Tool.
   - Note your ad account ID (e.g., `123456789`) from Ads Manager. When used in
     API calls the prefix `act_` is automatically added by the code.

3. **Shopify Admin API token:**

   - Log into your store’s admin and go to **Settings → Apps and sales channels → Develop apps**.
   - Enable custom app development if necessary and create a new app. Grant the
     appropriate **Admin API scopes** (at minimum `read_orders`)【26989075357435†L120-L170】.
   - Install the app and click **Reveal token once** to copy the Admin API
     access token【26989075357435†L166-L170】.

4. **Run the dashboard:**

   ```bash
   streamlit run neuroid/dashboard.py
   ```

   Enter your Meta token, ad account ID, Shopify domain (e.g., `store.myshopify.com`)
   and Shopify token. Select a date range and click **Fetch data**.

5. **Google Ads (optional) credentials:**

   To pull Google Ads metrics you need several credentials:

   - **Developer token:** apply for one in your Google Ads manager account’s API Center【372768418763066†L494-L543】.
   - **Client ID and Client Secret:** create OAuth 2.0 credentials in Google Cloud Console.
   - **Refresh token:** run the OAuth consent flow to authorize your Google Ads account and generate a refresh token. Google’s developer guides describe this step.
   - **Customer ID:** the Google Ads account you want to report on.
   - **Login customer ID (optional):** if using a manager (MCC) account, provide the manager ID here.

   Enter these values in the Google Ads section of the sidebar to include Google Ads data in the report.

## Extending the Tool

- **Google Ads API:** Implementing Google Ads support requires obtaining a
  developer token (via the Google Ads API Center)【372768418763066†L494-L543】, creating OAuth
  credentials and using the Google Ads client library to run GAQL queries.
- **Database storage:** For persistent reporting, data can be stored in a
  database (e.g., PostgreSQL) instead of being pulled live on each dashboard
  refresh. Scheduled ETL jobs can update the database daily.
- **Multi‑client support:** In a production system, tokens should be stored
  securely and associated with individual clients. Authentication can be
  added to restrict dashboard access.

## Disclaimer

This prototype is a demonstration. Before using it in production, consider
implementing proper error handling, token refresh logic, pagination for
Shopify orders, caching, and secure storage of credentials.