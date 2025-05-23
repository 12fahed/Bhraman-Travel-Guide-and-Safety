import streamlit as st
import pandas as pd
import google.generativeai as genai
from plotly import graph_objects as go
import plotly.express as px
import os
from datetime import datetime
import io
import seaborn as sns
import matplotlib.pyplot as plt

# Set color palette
COLOR_PALETTE = [
    '#4361EE', '#3A0CA3', '#7209B7', '#F72585', '#4CC9F0',
    '#4895EF', '#560BAD', '#B5179E', '#F15BB5'
]

def configure_gemini():
    genai.configure(api_key="AIzaSyD_11usmBhIPe1b5pF-Li-Dvmu_QFAzo4A")
    model = genai.GenerativeModel('gemini-pro')
    return model

def create_comparison_chart(start_value, end_value, metric_name):
    """Create a comparison chart using Plotly with enhanced aesthetics"""
    fig = go.Figure(data=[
        go.Bar(
            x=['Start of Year', 'End of Year'],
            y=[start_value, end_value],
            text=[f'₹{start_value:,.2f}', f'₹{end_value:,.2f}'],
            textposition='auto',
            marker_color=[COLOR_PALETTE[0], COLOR_PALETTE[2]]
        )
    ])
    
    fig.update_layout(
        title=f'{metric_name} Comparison',
        yaxis_title=metric_name,
        height=400,
        template='plotly_white',
        showlegend=False
    )
    
    return fig

def create_regional_distribution(df, title):
    """Create a pie chart showing regional distribution"""
    regional_data = df.groupby('region')['revenue'].sum()
    
    fig = go.Figure(data=[
        go.Pie(
            labels=regional_data.index,
            values=regional_data.values,
            hole=0.4,
            marker_colors=COLOR_PALETTE
        )
    ])
    
    fig.update_layout(
        title=title,
        height=400,
        template='plotly_white'
    )
    
    return fig

def create_correlation_heatmap(df):
    """Create a correlation heatmap for numeric columns"""
    numeric_cols = ['revenue', 'profit', 'operating_costs', 'customer_count']
    correlation = df[numeric_cols].corr()
    
    fig = go.Figure(data=go.Heatmap(
        z=correlation,
        x=numeric_cols,
        y=numeric_cols,
        colorscale='RdBu',
        zmin=-1,
        zmax=1
    ))
    
    fig.update_layout(
        title='Metric Correlations',
        height=400,
        template='plotly_white'
    )
    
    return fig

def create_scatter_plot(df, x_col, y_col):
    """Create a scatter plot with trend line"""
    fig = px.scatter(
        df,
        x=x_col,
        y=y_col,
        trendline="ols",
        color='region',
        color_discrete_sequence=COLOR_PALETTE
    )
    
    fig.update_layout(
        title=f'{x_col.title()} vs {y_col.title()}',
        height=400,
        template='plotly_white'
    )
    
    return fig

def generate_pdf_report(start_df, end_df, analysis_text):
    """Generate a PDF report"""
    buffer = io.BytesIO()
    
    # Create PDF content
    pdf_content = f"""
    # Annual Business Performance Analysis Report
    Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    
    ## Executive Summary
    {analysis_text}
    
    ## Key Metrics Comparison
    Start of Year Total Revenue: ₹{start_df['revenue'].sum():,.2f}
    End of Year Total Revenue: ₹{end_df['revenue'].sum():,.2f}
    
    Start of Year Total Profit: ₹{start_df['profit'].sum():,.2f}
    End of Year Total Profit: ₹{end_df['profit'].sum():,.2f}
    
    ## Regional Performance
    {start_df.groupby('region')['revenue'].sum().to_markdown()}
    
    ## Recommendations
    [AI-generated recommendations will be included here]
    """
    
    return pdf_content

def main():
    st.set_page_config(layout="wide")
    st.title("Annual Business Performance Analysis")
    st.write("Compare and analyze business metrics between start and end of year")
    
    # File upload
    col1, col2 = st.columns(2)
    with col1:
        start_year_file = st.file_uploader("Upload Start of Year Data (CSV)", type=['csv'])
    with col2:
        end_year_file = st.file_uploader("Upload End of Year Data (CSV)", type=['csv'])
    
    if start_year_file and end_year_file:
        start_df = pd.read_csv(start_year_file)
        end_df = pd.read_csv(end_year_file)
        
        # Generate and Download Report
        st.header("Analysis Report")
        if st.button("Generate Comprehensive Analysis"):
            with st.spinner("Generating analysis..."):
                model = configure_gemini()
                report_prompt = f"""
                Based on the following metrics, provide a comprehensive business analysis report:
                
                Start of Year:
                - Revenue: ₹{start_df['revenue'].sum():,.2f}
                - Profit: ₹{start_df['profit'].sum():,.2f}
                - Operating Costs: ₹{start_df['operating_costs'].sum():,.2f}
                - Customer Count: {start_df['customer_count'].sum():,}
                
                End of Year:
                - Revenue: ₹{end_df['revenue'].sum():,.2f}
                - Profit: ₹{end_df['profit'].sum():,.2f}
                - Operating Costs: ₹{end_df['operating_costs'].sum():,.2f}
                - Customer Count: {end_df['customer_count'].sum():,}
                
                Please include these as header starting with # :
                1. Executive Summary
                2. Key Performance Indicators Analysis
                3. Growth Trends
                4. Areas of Concern
                5. Strategic Recommendations
                """
                
                report = model.generate_content(report_prompt)
                st.write(report.text)
                
                # Generate downloadable PDF report
                pdf_content = generate_pdf_report(start_df, end_df, report.text)
                pdf_buffer = io.BytesIO(pdf_content.encode('utf-8'))
                st.download_button(
                    label="Download Full Report as PDF",
                    data=pdf_buffer,
                    file_name=f"business_analysis_report_{datetime.now().strftime('%Y%m%d')}.pdf",
                    mime="application/pdf"
                )
    
        # Overview Section
        st.header("Performance Overview")
        col1, col2 = st.columns(2)
        
        # Revenue and Profit Analysis
        with col1:
            st.plotly_chart(
                create_comparison_chart(
                    start_df['revenue'].sum(),
                    end_df['revenue'].sum(),
                    'Revenue'
                ),
                use_container_width=True
            )
        
        with col2:
            st.plotly_chart(
                create_comparison_chart(
                    start_df['profit'].sum(),
                    end_df['profit'].sum(),
                    'Profit'
                ),
                use_container_width=True
            )
        
        # Regional Analysis
        st.header("Regional Analysis")
        col1, col2 = st.columns(2)
        
        with col1:
            st.plotly_chart(
                create_regional_distribution(start_df, "Start of Year Regional Distribution"),
                use_container_width=True
            )
        
        with col2:
            st.plotly_chart(
                create_regional_distribution(end_df, "End of Year Regional Distribution"),
                use_container_width=True
            )
        
        # Correlation Analysis
        st.header("Metric Correlations")
        col1, col2 = st.columns(2)
        
        with col1:
            st.plotly_chart(
                create_correlation_heatmap(start_df),
                use_container_width=True
            )
        
        with col2:
            st.plotly_chart(
                create_correlation_heatmap(end_df),
                use_container_width=True
            )
        
        # Scatter Plots
        st.header("Relationship Analysis")
        col1, col2 = st.columns(2)
        
        with col1:
            scatter_fig = create_scatter_plot(end_df, 'revenue', 'profit')
            st.plotly_chart(scatter_fig, use_container_width=True)
        
        with col2:
            scatter_fig = create_scatter_plot(end_df, 'customer_count', 'revenue')
            st.plotly_chart(scatter_fig, use_container_width=True)
        
        # Detailed Metrics Table
        st.header("Detailed Metrics Comparison")
        metrics_comparison = pd.DataFrame({
            'Metric': ['Revenue', 'Profit', 'Operating Costs', 'Customer Count'],
            'Start of Year': [
                start_df['revenue'].sum(),
                start_df['profit'].sum(),
                start_df['operating_costs'].sum(),
                start_df['customer_count'].sum()
            ],
            'End of Year': [
                end_df['revenue'].sum(),
                end_df['profit'].sum(),
                end_df['operating_costs'].sum(),
                end_df['customer_count'].sum()
            ]
        })
        
        metrics_comparison['Change %'] = (
            (metrics_comparison['End of Year'] - metrics_comparison['Start of Year']) 
            / metrics_comparison['Start of Year'] * 100
        ).round(2)
        
        st.dataframe(metrics_comparison)
        
      
    else:
        st.info("Please upload both start and end of year data files to begin analysis")

if __name__ == "__main__":
    main()