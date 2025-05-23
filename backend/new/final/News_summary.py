from flask import Flask, jsonify
import torch
from transformers import BartForConditionalGeneration, BartTokenizer
from newspaper import Article
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow React frontend access

# Load model and tokenizer
model_name = "sshleifer/distilbart-cnn-12-6"
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)

# Predefined list of URLs
urls = [
    "https://edition.cnn.com/2025/02/01/us/did-you-see-that-the-moments-before-67-souls-perished-in-a-mid-air-collision-over-the-potomac/index.html",
    "https://www.moneycontrol.com/budget/budget-2025-market-verdict-big-voices-cheer-consumption-push-but-keep-an-eye-on-valuations-article-12927102.html",
    "https://www.moneycontrol.com/budget/govt-expects-10-increase-in-dividend-from-rbi-thanks-to-mega-dollar-sale-article-12927508.html",
    "https://www.moneycontrol.com/news/business/personal-finance/boost-to-shareholders-as-budget-doubles-tds-threshold-for-dividend-income-to-rs-10-000-12927469.html",
    "https://www.moneycontrol.com/news/business/fm-sitharaman-says-did-not-forego-capex-for-consumption-12927464.html",
    "https://www.moneycontrol.com/budget/union-budget-allowing-to-declare-two-houses-as-self-occupied-is-a-big-tax-relief-will-boost-rental-housing-say-experts-article-12927450.html",
    "https://www.thehindubusinessline.com/markets/budget-day-market-to-open-down-indicates-gift-nifty/article69167035.ece",


]

def summarize_article(url):
    """Fetch and summarize a news article from a given URL."""
    try:
        print(f"Downloading article: {url}")  # Debugging
        article = Article(url)
        article.download()
        article.parse()

        if not article.text:
            return {"url": url, "error": "Article content is empty."}

        print(f"Extracted Text (First 200 chars): {article.text[:200]}")  # Debugging

        inputs = tokenizer.encode("summarize: " + article.text[:2000], return_tensors="pt", truncation=True)
        with torch.no_grad():
            summary_ids = model.generate(inputs, max_length=250, min_length=150, num_beams=4)

        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        print(f"Generated Summary: {summary}")  # Debugging

        return {"url": url, "summary": summary}
    except Exception as e:
        print(f"Error summarizing {url}: {e}")  # Debugging
        return {"url": url, "error": str(e)}


@app.route("/", methods=["GET"])
def home():
    """Return summaries when React frontend loads the page."""
    summaries = [summarize_article(url) for url in urls]
    print(summaries[0])
    return jsonify({"summaries": summaries})  # Return as JSON object

if __name__ == "__main__":
    app.run(debug=True)
