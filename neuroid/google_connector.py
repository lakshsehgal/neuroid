"""
Connector for retrieving advertising performance data from the Google Ads API.

Google Ads requires a developer token, OAuth2 credentials and a refresh token.
This connector uses the official Google Ads API client library to fetch metrics
such as impressions, clicks, cost, average CPC, average CPM and conversions. ROAS
is computed by combining spend and revenue externally.

To set up credentials, follow Google's "Obtain a developer token" guide【372768418763066†L494-L543】
and create OAuth client credentials in Google Cloud. Use the OAuth flow to
generate a refresh token. See the README for detailed instructions.
"""

from typing import List, Dict, Any
from datetime import datetime

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException


class GoogleAdsConnector:
    def __init__(
        self,
        developer_token: str,
        client_id: str,
        client_secret: str,
        refresh_token: str,
        customer_id: str,
        login_customer_id: str = None,
    ):
        """
        Initialize the Google Ads connector.

        Parameters
        ----------
        developer_token : str
            Developer token obtained from the API Center in your Google Ads manager
            account【372768418763066†L494-L543】.
        client_id : str
            OAuth2 client ID from Google Cloud Console.
        client_secret : str
            OAuth2 client secret from Google Cloud Console.
        refresh_token : str
            OAuth2 refresh token generated via the OAuth consent flow.
        customer_id : str
            The Google Ads customer ID for the account whose data you want to fetch.
        login_customer_id : str, optional
            The manager account ID used for authentication if different from the
            customer ID. Set this when using an MCC account.
        """
        credentials = {
            "developer_token": developer_token,
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "use_proto_plus": True,
        }
        # Provide login_customer_id if supplied
        if login_customer_id:
            credentials["login_customer_id"] = login_customer_id
        self.client = GoogleAdsClient.load_from_dict(credentials)
        self.customer_id = customer_id

    def fetch_metrics(
        self,
        start_date: str,
        end_date: str,
        metrics: List[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Fetch campaign-level metrics for the date range.

        Parameters
        ----------
        start_date : str
            Start date in YYYY-MM-DD format.
        end_date : str
            End date in YYYY-MM-DD format.
        metrics : list of str, optional
            GAQL metrics to retrieve. Defaults to impressions, clicks, cost_micros,
            average_cpc, average_cpm and conversions.

        Returns
        -------
        list of dict
            A list of records with requested metrics.
        """
        if metrics is None:
            metrics = [
                "metrics.impressions",
                "metrics.clicks",
                "metrics.cost_micros",
                "metrics.average_cpc",
                "metrics.average_cpm",
                "metrics.conversions",
            ]
        ga_service = self.client.get_service("GoogleAdsService")

        query = (
            f"SELECT {', '.join(metrics)} "
            f"FROM customer "
            f"WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'"
        )
        try:
            response = ga_service.search(customer_id=self.customer_id, query=query)
        except GoogleAdsException as ex:
            raise RuntimeError(f"Google Ads API error: {ex.failure}") from ex

        results = []
        for row in response:
            record = {}
            # Each metric is nested; extract numeric values
            record["impressions"] = int(row.metrics.impressions)
            record["clicks"] = int(row.metrics.clicks)
            record["cost_micros"] = int(row.metrics.cost_micros)
            record["average_cpc"] = float(row.metrics.average_cpc) if row.metrics.average_cpc else None
            record["average_cpm"] = float(row.metrics.average_cpm) if row.metrics.average_cpm else None
            record["conversions"] = float(row.metrics.conversions) if row.metrics.conversions else 0.0
            results.append(record)
        return results


def compute_google_aggregates(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Aggregate Google Ads metrics into totals and averages.

    Parameters
    ----------
    data : list of dict
        Raw metric records returned by `GoogleAdsConnector.fetch_metrics()`.

    Returns
    -------
    dict
        A dictionary with total impressions, clicks, spend (converted from micros),
        average CPC, average CPM and total conversions.
    """
    total_impressions = 0
    total_clicks = 0
    total_cost_micros = 0
    total_conversions = 0.0
    for row in data:
        total_impressions += row.get("impressions", 0)
        total_clicks += row.get("clicks", 0)
        total_cost_micros += row.get("cost_micros", 0)
        total_conversions += row.get("conversions", 0)

    # Convert micros to standard currency unit
    total_spend = total_cost_micros / 1_000_000
    avg_cpc = (total_spend / total_clicks) if total_clicks else None
    avg_cpm = ((total_spend / total_impressions) * 1000) if total_impressions else None
    return {
        "impressions": total_impressions,
        "clicks": total_clicks,
        "spend": round(total_spend, 2),
        "cpc": round(avg_cpc, 4) if avg_cpc is not None else None,
        "cpm": round(avg_cpm, 4) if avg_cpm is not None else None,
        "conversions": round(total_conversions, 2),
    }