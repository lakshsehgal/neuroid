"""
Streamlit dashboard for Neuroid data integration tool.

This simple dashboard allows a user to enter API credentials for Meta (Facebook) Ads
and Shopify, specify a reporting date range, and view aggregated advertising and
sales metrics. It's intended as a proof‑of‑concept; in production you would
securely store tokens, refresh them automatically and build multi‑client views.
"""

import os
from datetime import datetime, timedelta

import streamlit as st
import pandas as pd

# Use absolute imports rather than package‑relative imports so the
# dashboard can be run as a standalone script. When using "from .module"
# Python expects the current file to be part of a package, which isn't the
# case when launching this file directly via `streamlit run dashboard.py`.
from aggregator import aggregate_metrics
from meta_connector import MetaConnector, compute_meta_aggregates
from shopify_connector import ShopifyConnector, compute_shopify_metrics


def main():
    st.set_page_config(page_title="Neuroid Performance Dashboard", layout="wide")
    st.title("Neuroid Performance Dashboard")
    st.write("Enter your API credentials and select a date range to view metrics.")

    # Sidebar for inputs
    st.sidebar.header("API Credentials")
    st.sidebar.subheader("Meta (Facebook) Ads")
    meta_token = st.sidebar.text_input("Access token", type="password")
    meta_account_id = st.sidebar.text_input("Ad account ID (without 'act_')")

    st.sidebar.subheader("Shopify")
    shop_domain = st.sidebar.text_input("Store domain (e.g. example.myshopify.com)")
    shop_token = st.sidebar.text_input("Admin API token", type="password")

    st.sidebar.subheader("Google Ads (optional)")
    google_developer_token = st.sidebar.text_input("Developer token")
    google_client_id = st.sidebar.text_input("Client ID")
    google_client_secret = st.sidebar.text_input("Client secret", type="password")
    google_refresh_token = st.sidebar.text_input("Refresh token", type="password")
    google_customer_id = st.sidebar.text_input("Customer ID")
    google_login_customer_id = st.sidebar.text_input("Login customer ID (MCC)")

    # Date range selection
    today = datetime.today()
    default_start = today - timedelta(days=30)
    start_date = st.sidebar.date_input("Start date", value=default_start).strftime("%Y-%m-%d")
    end_date = st.sidebar.date_input("End date", value=today).strftime("%Y-%m-%d")

    if st.sidebar.button("Fetch data"):
        if not (meta_token and meta_account_id and shop_domain and shop_token):
            st.error("Please fill out Meta and Shopify credentials before fetching data.")
        else:
            with st.spinner("Fetching data..."):
                metrics = aggregate_metrics(
                    meta_token=meta_token,
                    meta_account_id=meta_account_id,
                    shop_domain=shop_domain,
                    shop_token=shop_token,
                    start_date=start_date,
                    end_date=end_date,
                    google_developer_token=google_developer_token or None,
                    google_client_id=google_client_id or None,
                    google_client_secret=google_client_secret or None,
                    google_refresh_token=google_refresh_token or None,
                    google_customer_id=google_customer_id or None,
                    google_login_customer_id=google_login_customer_id or None,
                )
            st.success("Data fetched successfully!")

            # Display Meta metrics
            st.subheader("Meta (Facebook) Ads Metrics")
            meta = metrics["meta"]
            col1, col2, col3, col4, col5 = st.columns(5)
            col1.metric("Impressions", f"{meta['impressions']:,}")
            col2.metric("Clicks", f"{meta['clicks']:,}")
            col3.metric("Spend", f"${meta['spend']:,}")
            col4.metric("Average CPC", f"${meta['cpc']:.4f}" if meta['cpc'] is not None else "N/A")
            col5.metric("Average CPM", f"${meta['cpm']:.4f}" if meta['cpm'] is not None else "N/A")
            st.metric("ROAS", f"{meta['roas']:.2f}" if meta['roas'] is not None else "N/A")

            # Display Google metrics if available
            if metrics["google"]:
                st.subheader("Google Ads Metrics")
                google = metrics["google"]
                col1, col2, col3, col4, col5 = st.columns(5)
                col1.metric("Impressions", f"{google['impressions']:,}")
                col2.metric("Clicks", f"{google['clicks']:,}")
                col3.metric("Spend", f"${google['spend']:,}")
                col4.metric("Average CPC", f"${google['cpc']:.4f}" if google['cpc'] is not None else "N/A")
                col5.metric("Average CPM", f"${google['cpm']:.4f}" if google['cpm'] is not None else "N/A")
                st.metric("ROAS", f"{google['roas']:.2f}" if google.get('roas') is not None else "N/A")

            # Display Shopify metrics
            st.subheader("Shopify Sales Metrics")
            shop = metrics["shopify"]
            col1, col2, col3 = st.columns(3)
            col1.metric("Total Sales", f"${shop['total_sales']:,}")
            col2.metric("Total Orders", f"{shop['total_orders']:,}")
            col3.metric("Average Order Value", f"${shop['average_order_value']:.2f}" if shop['average_order_value'] is not None else "N/A")

            # Display overall totals
            st.subheader("Overall Advertising Totals")
            overall = metrics["overall"]
            col1, col2, col3 = st.columns(3)
            col1.metric("Total Impressions", f"{overall['impressions']:,}")
            col2.metric("Total Clicks", f"{overall['clicks']:,}")
            col3.metric("Total Spend", f"${overall['spend']:,}")
            st.metric("Overall ROAS", f"{overall['roas']:.2f}" if overall['roas'] is not None else "N/A")

            st.markdown("---")
            st.write("### Notes")
            st.write(
                "ROAS metrics are computed per channel by dividing total Shopify revenue by each platform's ad spend. "
                "The overall ROAS compares total revenue to combined spend across all channels."
            )


if __name__ == "__main__":
    main()