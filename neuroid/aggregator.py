from datetime import datetime
from typing import Dict, Any

# Use absolute imports rather than package‑relative imports. Relative imports
# (prefixed with a dot) require the module to be part of a Python package.
from meta_connector import MetaConnector, compute_meta_aggregates
from shopify_connector import ShopifyConnector, compute_shopify_metrics
from google_connector import GoogleAdsConnector, compute_google_aggregates


def aggregate_metrics(
    meta_token: str,
    meta_account_id: str,
    shop_domain: str,
    shop_token: str,
    start_date: str,
    end_date: str,
    # Google credentials (optional)
    google_developer_token: str = None,
    google_client_id: str = None,
    google_client_secret: str = None,
    google_refresh_token: str = None,
    google_customer_id: str = None,
    google_login_customer_id: str = None,
) -> Dict[str, Any]:
    """
    Fetch and aggregate metrics from Meta Ads, Google Ads (optional) and Shopify.

    Parameters
    ----------
    meta_token : str
        Meta Ads API access token.
    meta_account_id : str
        Facebook Ads account ID (without or with 'act_' prefix).
    shop_domain : str
        Shopify store domain (e.g., 'example.myshopify.com').
    shop_token : str
        Shopify Admin API access token.
    start_date, end_date : str
        Date range in YYYY-MM-DD format.
    google_developer_token, google_client_id, google_client_secret, google_refresh_token : str
        Credentials for Google Ads API. If any of these are missing, Google Ads
        data will be skipped.
    google_customer_id : str
        The Google Ads customer ID for the account you want to query.
    google_login_customer_id : str, optional
        The manager account ID used for authentication if necessary.

    Returns
    -------
    dict
        Aggregated metrics for each advertising channel and Shopify, along with
        overall totals and ROAS.
    """
    # Fetch Meta data
    meta_conn = MetaConnector(access_token=meta_token, account_id=meta_account_id)
    meta_data = meta_conn.fetch_insights(start_date=start_date, end_date=end_date)
    meta_metrics = compute_meta_aggregates(meta_data)

    # Fetch Shopify data
    shop_conn = ShopifyConnector(shop_domain=shop_domain, access_token=shop_token)
    orders = shop_conn.fetch_orders(start_date=start_date, end_date=end_date)
    shop_metrics = compute_shopify_metrics(orders)

    # Fetch Google Ads data if credentials provided
    google_metrics = None
    if all([
        google_developer_token,
        google_client_id,
        google_client_secret,
        google_refresh_token,
        google_customer_id,
    ]):
        google_conn = GoogleAdsConnector(
            developer_token=google_developer_token,
            client_id=google_client_id,
            client_secret=google_client_secret,
            refresh_token=google_refresh_token,
            customer_id=google_customer_id,
            login_customer_id=google_login_customer_id,
        )
        google_data = google_conn.fetch_metrics(start_date=start_date, end_date=end_date)
        google_metrics = compute_google_aggregates(google_data)

    # Compute ROAS per channel
    revenue = shop_metrics.get("total_sales")
    # Meta ROAS
    meta_spend = meta_metrics.get("spend")
    meta_roas = (revenue / meta_spend) if meta_spend and meta_spend > 0 else None
    meta_metrics["roas"] = round(meta_roas, 2) if meta_roas is not None else None

    # Google ROAS
    if google_metrics:
        google_spend = google_metrics.get("spend")
        google_roas = (revenue / google_spend) if google_spend and google_spend > 0 else None
        google_metrics["roas"] = round(google_roas, 2) if google_roas is not None else None

    # Overall advertising totals (Meta + Google)
    total_impressions = meta_metrics["impressions"] + (google_metrics["impressions"] if google_metrics else 0)
    total_clicks = meta_metrics["clicks"] + (google_metrics["clicks"] if google_metrics else 0)
    total_spend = meta_metrics["spend"] + (google_metrics["spend"] if google_metrics else 0)
    overall_roas = (revenue / total_spend) if total_spend > 0 else None

    # Compose result
    result = {
        "meta": meta_metrics,
        "shopify": shop_metrics,
        "google": google_metrics,
        "overall": {
            "impressions": total_impressions,
            "clicks": total_clicks,
            "spend": round(total_spend, 2),
            "roas": round(overall_roas, 2) if overall_roas is not None else None,
        },
    }
    return result