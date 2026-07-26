"""
backfill_embeddings.py

Precomputes TF-IDF vector signatures, N-gram keyword indices, and inverse document frequency (IDF) weights
for all 2,003 FIR cases from fir_dataset.csv, saving a trained RAG index to appsail/rag_index.json.

Run via:
    python appsail/backfill_embeddings.py
"""

import sys
import logging
import os
import re
import math
import json
from collections import Counter

from ingest_fir_csv import parse_fir_csv

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("backfill")

INDEX_JSON_PATH = os.path.join(os.path.dirname(__file__), "rag_index.json")

def tokenize(text: str):
    """Tokenize text into lowercase words and 2-grams."""
    words = [w.lower() for w in re.findall(r'\w+', text) if len(w) > 1]
    bigrams = [f"{words[i]}_{words[i+1]}" for i in range(len(words)-1)]
    return words + bigrams

def build_vector_index():
    records = parse_fir_csv()
    N = len(records)
    logger.info(f"Loaded {N} FIR records from fir_dataset.csv for RAG Vector Model Training.")

    # 1. Calculate Document Frequency (DF) for each term
    df_counter = Counter()
    doc_tokens = []

    for r in records:
        tokens = set(tokenize(r["rag_narrative"]))
        doc_tokens.append(tokens)
        df_counter.update(tokens)

    # 2. Calculate Inverse Document Frequency (IDF)
    idf_dict = {}
    for term, count in df_counter.items():
        idf_dict[term] = math.log((N + 1) / (count + 1)) + 1.0

    # 3. Calculate TF-IDF vectors for top records
    indexed_docs = []
    for i, r in enumerate(records):
        tokens = tokenize(r["rag_narrative"])
        tf_counter = Counter(tokens)
        doc_len = len(tokens) or 1
        
        # Sparse TF-IDF dict
        tfidf_vec = {}
        for term, freq in tf_counter.items():
            tf = freq / doc_len
            tfidf_vec[term] = round(tf * idf_dict[term], 4)

        indexed_docs.append({
            "id": r["id"],
            "fir": r["fir"],
            "crimeNo": r["crimeNo"],
            "title": r["title"],
            "crime_type": r["crime_type"],
            "station": r["station"],
            "accused": r["accused"],
            "victim": r["victim"],
            "address": r["address"],
            "phone": r["phone"],
            "officer": r["officer"],
            "status": r["status"],
            "evidence": r["evidence"],
            "date": r["date"],
            "rag_narrative": r["rag_narrative"],
            "tfidf": tfidf_vec
        })

    index_data = {
        "total_documents": N,
        "vocabulary_size": len(idf_dict),
        "idf": idf_dict,
        "documents": indexed_docs
    }

    with open(INDEX_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2)

    logger.info(f"✅ Trained RAG Vector Index with {len(idf_dict)} vocabulary terms across {N} FIR records.")
    logger.info(f"✅ Trained index saved to: {INDEX_JSON_PATH}")
    return 0

if __name__ == "__main__":
    sys.exit(build_vector_index())
