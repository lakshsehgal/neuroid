import os
from datetime import datetime, timedelta
from typing import List, Dict, Any

import requests


class MetaConnector:
    """
    Connector for retrieving advertising performance data from the Meta (Facebook) Ads API.

    This class uses the Meta Graph API's Ads Insights endpoint to collect metrics such as
    impressions, clicks, spend (ad spend), cost per click (CPC) and cost per thousand impressions (CPM).

    Usage:
        connector = MetaConnector(access_token=<token>, account_id=<ad_account_id>)
        data = connector.fetch_insights(start_date="2025-01-01", end_date="2025-01-31")
    """

    GRAPH_API_BASE = "https://graph.facebook.com/v18.0"

    def __init__(self, access_token: str, account_id: str):
        """
        Initialize the connector.

        Parameters
        ----------
        access_token : str
            A valid access token with the `ads_read` permission. You can generate this token
            via the Graph API Explorer by selecting your app, choosing a user token and adding
            the `ads_read` scope【274129808328909†L848-L864】. See README for details.
        account_id : str
            The ID of the Facebook Ads account you want to query. You can find this in
            Ads Manager or Business Manager.
        """
        self.access_token = access_token
        # Facebook ad account IDs should start with "act_" when used in the Graph API
        if not str(account_id).startswith("act_"):
            account_id = f"act_{account_id}"
        self.account_id = account_id

    def _request(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Internal helper to perform GET requests to the Meta Graph API."""
        url = f"{self.GRAPH_API_BASE}/{endpoint}"
        params = params.copy()
        params["access_token"] = self.access_token
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def fetch_insights(
        self,
        start_date: str,
        end_date: str,
        fields: List[str] = None,
        time_increment: str = "daily",
    ) -> List[Dict[str, Any]]:
        """
        Fetch advertising performance metrics for the given date range.

        Parameters
        ----------
        start_date : str
            Start date in YYYY-MM-DD format (inclusive).
        end_date : str
            End date in YYYY-MM-DD format (inclusive).
        fields : list of str, optional
            Fields/metrics to request from the API. Default fields are
            impressions, clicks, spend, cpc and cpm.【274129808328909†L893-L906】
        time_increment : str
            The granularity for the results. 'daily' returns one record per day. See Meta docs
            for other options (e.g., all_days).

        Returns
        -------
        list of dict
            A list of dictionaries, one per time period, containing requested metrics.
        """
        if fields is None:
            fields = [
                "date_start",
                "date_stop",
                "impressions",
                "clicks",
                "spend",
                "cpc",
                "cpm",
            ]

        import json
params = {
    "level": "account",
    "time_range": json.dumps({"since": start_date, "until": end_date}),
            "fields": ",".join(fields),
            "time_increment": time_increment,
        }

        endpoint = f"{self.account_id}/insights"
        result = self._request(endpoint, params)
        return result.get("data", [])


def compute_meta_aggregates(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Aggregate Meta Ads data to compute overall metrics.

    Parameters
    ----------
    data : list of dict
        The raw records returned by `MetaConnector.fetch_insights()`.

    Returns
    -------
    dict
        A dictionary containing total impressions, clicks, spend, CPC, CPM, and ROAS (placeholder).
        ROAS will be None here; it should be computed by joining with revenue data from Shopify.
    """
    total_impressions = 0
    total_clicks = 0
    total_spend = 0.0

    for row in data:
        total_impressions += int(row.get("impressions", 0))
        total_clicks += int(row.get("clicks", 0))
        try:
            total_spend += float(row.get("spend", 0))
        except (ValueError, TypeError):
            pass

    avg_cpc = (total_spend / total_clicks) if total_clicks else None
    avg_cpm = ((total_spend / total_impressions) * 1000) if total_impressions else None

    return {
        "impressions": total_impressions,
        "clicks": total_clicks,
        "spend": round(total_spend, 2),
        "cpc": round(avg_cpc, 4) if avg_cpc is not None else None,
        "cpm": round(avg_cpm, 4) if avg_cpm is not None else None,
        "roas": None,  # to be filled after merging with Shopify revenue
    }
