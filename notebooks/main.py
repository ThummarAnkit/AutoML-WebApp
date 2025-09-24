# main.py
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
import os
import pickle
import numpy as np
import pandas as pd
import json

# Import utility functions
from functions import (
    load_and_validate_csv, clean_data, automated_train_test_split,
    feature_engineering, detect_problem_type, get_candidate_models, evaluate_model,
    train_candidates, select_best_model, tune_best_model, save_model,
    generate_report_json
)

app = FastAPI()

UPLOAD_DIR = "uploads"
MODEL_DIR = "models"
REPORT_DIR = "reports"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)


# --- Helper: Convert numpy types to JSON-safe types ---
def convert_numpy(obj):
    if isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy(i) for i in obj]
    elif isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj


# Step 1: Upload dataset
@app.post("/upload-dataset/")
async def upload_dataset(file: UploadFile):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    df = load_and_validate_csv(file_path)
    columns = df.columns.tolist()

    return {"message": "File uploaded successfully", "file_path": file_path, "columns": columns}


# Step 2: Run AutoML
@app.post("/run-automl/")
async def run_automl(file_path: str = Form(...), user_target: str = Form(...)):
    # Load dataset
    df = load_and_validate_csv(file_path)

    if user_target not in df.columns:
        return JSONResponse({"error": f"Target '{user_target}' not found in dataset."}, status_code=400)

    X = df.drop(columns=[user_target])
    y = df[user_target]

    # Split dataset
    X_train, X_test, y_train, y_test = automated_train_test_split(X, y)

    # Clean data
    X_train, X_test, imputers, cleaning_summary = clean_data(X_train, X_test)

    # Detect problem type
    problem_type = detect_problem_type(y)

    # Feature engineering
    X_train_enc, X_test_enc, y_train_enc, y_test_enc = feature_engineering(
        X_train, X_test, y_train, y_test
    )

    # find cadidate models
    candidates = get_candidate_models(problem_type)

    # Train and evaluate candidates
    metrics_list, scores_list, models_list, names_list = train_candidates(
        candidates, X_train, X_test, y_train, y_test, problem_type
    )

    # Select best model
    best_model, best_model_name, best_idx = select_best_model(scores_list, models_list, names_list)

    # Tune best model
    best_tuned_model = tune_best_model(best_model_name, best_model, X_train, y_train, problem_type)

    # Evaluate tuned model
    tuned_metrics, tuned_score, tuned_model = evaluate_model(best_tuned_model, X_train, X_test, y_train, y_test, problem_type)

    tuned_metrics["Model"] = best_model_name + " (Tuned)"
    metrics_list.append(tuned_metrics)

    metrics_df = pd.DataFrame(metrics_list).set_index("Model")
    best_model_name = best_model_name + "(Tuned)"

    # after best_model is selected
    save_model(best_tuned_model, f'{MODEL_DIR}/{best_model_name.replace(" ", "_")}', compress_level=3)

"""
    # Candidate models
    candidates = get_candidate_models(problem_type)

    # Train and evaluate
    metrics_list, scores_list, models_list, names_list = train_candidates(
        candidates, X_train_enc, X_test_enc, y_train_enc, y_test_enc, problem_type
    )

    # Select best model
    best_model, best_model_name, best_idx = select_best_model(scores_list, models_list, names_list)

    # Hyperparameter tuning
    tuned_model = tune_best_model(best_model_name, best_model, X_train_enc, y_train_enc, problem_type)

    # Save model
    model_path = os.path.join(MODEL_DIR, f"{best_model_name}.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(tuned_model, f)
"""


    # Feature engineering summary
    feature_eng_summary = {
        "categorical_features": X.select_dtypes(include=['object', 'category']).columns.tolist(),
        "numerical_features": X.select_dtypes(exclude=['object', 'category']).columns.tolist()
    }

    # Model comparison summary
    model_comparison = list(zip(names_list, scores_list))

    # Best model summary
    best_model_details = {
        "name": best_model_name,
        "score": scores_list[best_idx]
    }

    # Generate JSON report
    report_json = generate_report_json(
        df, cleaning_summary, feature_eng_summary, model_comparison, best_model_details, target=user_target
    )

    # Convert numpy objects to JSON-safe
    report_json_safe = convert_numpy(report_json)

    # Save JSON report to file
    report_path = os.path.join(REPORT_DIR, "automl_report.json")
    with open(report_path, "w") as f:
        json.dump(report_json_safe, f, indent=4)

    return {
        "message": "AutoML pipeline completed successfully",
        "best_model": best_model_name,
        "model_path": model_path,
        "report_path": report_path,
        "report": report_json_safe
    }


# Step 3: Download model
@app.get("/download-model/")
async def download_model(model_name: str):
    model_path = os.path.join(MODEL_DIR, f"{model_name}.pkl")
    if not os.path.exists(model_path):
        return JSONResponse({"error": "Model not found"}, status_code=404)
    return FileResponse(model_path, filename=f"{model_name}.pkl", media_type="application/octet-stream")
