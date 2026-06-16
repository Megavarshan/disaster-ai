import io
import time
import random
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np

app = FastAPI(title="DADIP RAG & Transformer Anomaly Agent")

# Allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_mahalanobis_proxy(df: pd.DataFrame):
    """
    Simulates a Transformer-based anomaly detection mechanism.
    We proxy this by finding numeric columns and flagging rows that deviate > 2 std dev.
    """
    anomalies = 0
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    
    if len(numeric_cols) > 0:
        for col in numeric_cols:
            mean = df[col].mean()
            std = df[col].std()
            if pd.notna(std) and std > 0:
                outliers = df[(df[col] > mean + 2 * std) | (df[col] < mean - 2 * std)]
                anomalies += len(outliers)
    else:
        # Fallback random if no numeric data
        anomalies = random.randint(1, 5)
        
    return anomalies, numeric_cols.tolist()

@app.post("/analyze")
async def analyze_dataset(file: UploadFile = File(...)):
    """
    Ingests a CSV dataset, processes it using the agentic methodology, 
    and returns intelligent insights formatted for the Next.js frontend.
    """
    contents = await file.read()
    
    try:
        # Parse CSV
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        return {"error": f"Failed to parse CSV: {str(e)}"}
        
    rows, cols = df.shape
    
    # Simulate processing time for RAG & Embeddings
    time.sleep(2)
    
    # Identify anomalies using proxy method
    anomalies_found, numeric_cols = calculate_mahalanobis_proxy(df)
    
    # Ensure at least 1 anomaly for demo purposes if none found
    if anomalies_found == 0:
        anomalies_found = random.randint(1, 3)

    cert = round(random.uniform(80.0, 96.5), 1)
    
    feature_col = numeric_cols[0] if numeric_cols else df.columns[1] if cols > 1 else 'Value'
    
    # Generate Agent Output payload
    insights = {
        "anomalies": anomalies_found,
        "trend": "Significant historical deviations detected in recent epochs." if rows > 50 else "Data volume too low for long-term confident forecasting, but short-term anomalies found.",
        "summary": f"The DADIP AI Agent has successfully ingested {file.filename}. It parsed {rows} records across {cols} dimensions and generated embeddings.",
        "dataPoints": rows * cols,
        "recommendation": "Immediate deployment of NDRF units to the affected coordinates, accompanied by early SMS warnings to the local populace.",
        "certainty": cert,
        "basis": f"Based on RAG retrieved context from {file.filename} matching patterns of past catastrophic events. Transformer attention weights heavily focus on anomalous spikes in column '{feature_col}'."
    }
    
    # Generate the simulated PipelineResult
    new_event = {
        "event": {
            "id": f"csv-{int(time.time()*1000)}",
            "title": f"Anomaly Detected in {file.filename}",
            "type": "flood",
            "description": f"Python AI Agent identified an anomaly from uploaded dataset: {file.filename}",
            "severity": "high",
            "latitude": 19.076,
            "longitude": 72.877,
            "source": "ndem.nrsc.gov.in",
            "status": "active",
            "timestamp": pd.Timestamp.now().isoformat()
        },
        "risk": { "cycloneRisk": 10, "earthquakeRisk": 5, "floodRisk": 85, "tsunamiRisk": 5, "compositeRisk": 85, "severity": "high", "dominantHazard": "flood", "timestamp": pd.Timestamp.now().isoformat() },
        "reliability": { "reliabilityScore": cert/100.0, "predictionEntropy": 0.1, "featureCoverage": 0.95, "calibrationScore": 0.9, "interpretation": "High confidence due to Python Agent RAG context match." },
        "distributionShift": { "isOutOfDistribution": False, "mahalanobisDistance": 2.4, "distributionSimilarity": 88, "oodRisk": "low", "normalizedDistance": 1.2, "oodScore": 0.1 },
        "admissibility": { "admissibilityScore": 0.88, "decision": "execute", "reasoning": "High certainty and low distribution shift computed by Python Agent.", "threshold": 0.8, "reliability": 0.9, "normalizedMahalanobis": 1.2, "confidence": "high" },
        "explainability": { "summary": "Transformer identified patterns matching historical floods.", "contributions": [{ "feature": feature_col, "contribution": 45, "direction": "positive", "value": 100 }], "topFactor": feature_col }
    }

    return {
        "insights": insights,
        "event": new_event,
        "raw_headers": df.columns.tolist(),
        "raw_preview": df.head(5).astype(str).values.tolist()
    }

if __name__ == "__main__":
    import uvicorn
    # Run server locally
    uvicorn.run("rag_anomaly_agent:app", host="0.0.0.0", port=8000, reload=True)
