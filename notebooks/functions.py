# functions.py
import pandas as pd
import numpy as np
from scipy import stats
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.svm import SVC, SVR
from xgboost import XGBClassifier, XGBRegressor
from sklearn.metrics import accuracy_score, f1_score, r2_score, mean_squared_error, mean_absolute_error, roc_auc_score
from sklearn.utils.class_weight import compute_sample_weight
from sklearn.impute import SimpleImputer
import matplotlib.pyplot as plt
import seaborn as sns
import os
import joblib
import pickle
import io
import base64

# -----------------------------
# Basic Data Functions
# -----------------------------
def load_and_validate_csv(file_path):
    df = pd.read_csv(file_path)
    if df.empty:
        raise ValueError("Dataset is empty")
    return df

# -----------------------------
# Train-Test Split
# -----------------------------
def automated_train_test_split(X, y, test_size=0.2, random_state=42):
    """
    Wrapper around sklearn's train_test_split for consistencyor any changes provided by others.
    """
    return train_test_split(X, y, test_size=test_size, random_state=random_state)

# -----------------------------
# Data Cleaning
# -----------------------------
def impute_missing(X_train, X_test, strategies=None, default="auto"):
    """
    Impute missing values safely (fit only on train, apply to both train/test).
    
    Parameters
    ----------
    X_train : pd.DataFrame
    X_test : pd.DataFrame
    strategies : dict {col: method} (optional)
    default : str, default="auto"
        "auto" => numeric=median, categorical=mode
        other options: "mean", "median", "mode", "ffill", "bfill"
    
    Returns
    -------
    X_train_imputed, X_test_imputed, imputers
    """
    X_train, X_test = X_train.copy(), X_test.copy()
    imputers = {}

    for col in X_train.columns:
        # Choose strategy
        if strategies and col in strategies:
            method = strategies[col]
        else:
            if default == "auto":
                method = "median" if pd.api.types.is_numeric_dtype(X_train[col]) else "most_frequent"
            else:
                method = default

        # Create imputer
        if method in ["mean", "median", "most_frequent"]:
            imputer = SimpleImputer(strategy=method)
            X_train[[col]] = imputer.fit_transform(X_train[[col]])
            X_test[[col]] = imputer.transform(X_test[[col]])
            imputers[col] = imputer

        elif method in ["ffill", "bfill"]:
            X_train[col].fillna(method=method, inplace=True)
            X_test[col].fillna(method=method, inplace=True)
            imputers[col] = method

    return X_train, X_test, imputers

def remove_duplicates(df):
    return df.drop_duplicates()

def fit_outlier_caps(X_train, method="iqr"):
    """Compute outlier caps/thresholds from training data only."""
    caps = {}
    num_cols = X_train.select_dtypes(include=[np.number]).columns
    
    for col in num_cols:
        if method == "iqr":
            Q1, Q3 = X_train[col].quantile([0.25, 0.75])
            IQR = Q3 - Q1
            lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
        elif method == "zscore":
            mean, std = X_train[col].mean(), X_train[col].std()
            lower, upper = mean - 3*std, mean + 3*std
        else:
            continue
        caps[col] = (lower, upper)
    return caps


def apply_outlier_caps(df, caps):
    """Apply the fitted caps to any dataset (train/test)."""
    df = df.copy()
    for col, (lower, upper) in caps.items():
        df[col] = df[col].clip(lower=lower, upper=upper)
    return df

def clean_data(X_train, X_test, strategies=None, default_missing="auto", outlier_method="iqr", verbose=True):
    """
    Clean train/test data safely (no data leakage).
    - Imputation is fitted on train, applied to both.
    - Duplicates & outliers handled on train, bounds applied to test.
    """
    # Imputation
    X_train, X_test, imputers = impute_missing(
        X_train, X_test, strategies=strategies, default=default_missing
    )

    # Remove duplicates (train only)
    before = X_train.shape[0]
    X_train = remove_duplicates(X_train)
    dupes_removed = before - X_train.shape[0]

    # Outlier handling (fit on train, apply to test if provided)
    before = X_train.shape[0]

    if outlier_method is not None:
        # Fit caps on train
        caps = fit_outlier_caps(X_train, method=outlier_method)

        # Apply to both train and test
        X_train = apply_outlier_caps(X_train, caps)
        X_test = apply_outlier_caps(X_test, caps)

    outliers_removed = before - X_train.shape[0]

    # Summary
    if verbose:
        print("\n--- Data Cleaning Summary ---")
        print(f"Final train shape: {X_train.shape}")
        print(f"Final test shape: {X_test.shape}")
        print(f"Duplicates removed (train): {dupes_removed}")
        print(f"Outliers removed (train): {outliers_removed}")
        print("-----------------------------\n")

    results = {
        "duplicates_removed": dupes_removed,
        "outliers_removed": outliers_removed,
        "final_train_shape": X_train.shape,
    }

    return (X_train, X_test, imputers, results)


# -----------------------------
# Feature Engineering
# -----------------------------
def feature_engineering(X_train, X_test, y_train, y_test):
    cat_cols = X_train.select_dtypes(include=['object', 'category']).columns
    for col in cat_cols:
        le = LabelEncoder()
        X_train[col] = le.fit_transform(X_train[col].astype(str))
        X_test[col] = le.transform(X_test[col].astype(str))

    num_cols = X_train.select_dtypes(include=[np.number]).columns
    scaler = StandardScaler()
    X_train[num_cols] = scaler.fit_transform(X_train[num_cols])
    X_test[num_cols] = scaler.transform(X_test[num_cols])

    if y_train.dtype == 'object' or y_train.dtype.name == 'category':
        le_target = LabelEncoder()
        y_train = le_target.fit_transform(y_train)
        y_test = le_target.transform(y_test)

    return X_train, X_test, y_train, y_test

# -----------------------------
# Problem Detection
# -----------------------------
def detect_problem_type(y):
    if y.dtype == 'object' or y.dtype.name == 'category':
        return "classification"
    elif y.nunique() <= 20 and y.dtype in [int, np.int64]:
        return "classification"
    else:
        return "regression"

# -----------------------------
# Candidate Models
# -----------------------------
def get_candidate_models(problem_type="classification"):
    if problem_type == "classification":
        models = {
            "LogisticRegression": LogisticRegression(max_iter=500, C=1.0, solver='lbfgs'),
            "SVC": SVC(probability=True, C=1.0, kernel='rbf'),
            "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=None),
            "XGBoost": XGBClassifier(n_estimators=100, max_depth=3, learning_rate=0.1,
                                     use_label_encoder=False, eval_metric='logloss', )
        }
    else:
        models = {
            "LinearRegression": LinearRegression(),
            "SVR": SVR(C=1.0, kernel='rbf', gamma='scale'),
            "RandomForest": RandomForestRegressor(n_estimators=100, max_depth=None),
            "XGBoost": XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.1)
        }
    return models

# -----------------------------
# Model Evaluation & Training
# -----------------------------
def evaluate_model(model, X_train, X_test, y_train, y_test, problem_type="classification"):
    if problem_type == "classification":
        if hasattr(model, "class_weight"):
            model.set_params(class_weight="balanced")
        else:
            class_weights = compute_sample_weight("balanced", y_train)
            model.set_params(sample_weight=class_weights)

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    if problem_type == "classification":
        y_proba = model.predict_proba(X_test) if hasattr(model, "predict_proba") else None
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

        roc_auc = np.nan
        if y_proba is not None:
            if len(np.unique(y_test)) <= 2 and y_proba.ndim == 2 and y_proba.shape[1] == 2:
                roc_auc = roc_auc_score(y_test, y_proba[:, 1])
            elif len(np.unique(y_test)) > 2 and y_proba.ndim > 1:
                roc_auc = roc_auc_score(y_test, y_proba, multi_class="ovr")

        metrics = {"Accuracy": acc, "F1": f1, "ROC_AUC": roc_auc}
        score = f1
    else:
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        metrics = {"MAE": mae, "RMSE": rmse, "R2": r2}
        score = r2

    return metrics, score, model

def train_candidates(candidates, X_train, X_test, y_train, y_test, problem_type):
    metrics_list, scores_list, models_list, names_list = [], [], [], []

    for name, model in candidates.items():
        metrics, score, trained_model = evaluate_model(
            model, X_train, X_test, y_train, y_test, problem_type
        )
        metrics["Model"] = name
        metrics_list.append(metrics)
        scores_list.append(score)
        models_list.append(trained_model)
        names_list.append(name)

    return metrics_list, scores_list, models_list, names_list

def select_best_model(scores_list, models_list, names_list):
    best_idx = np.argmax(scores_list)
    return models_list[best_idx], names_list[best_idx], best_idx

def tune_best_model(best_model_name, best_model, X_train, y_train, problem_type="classification",
                    n_iter=20, random_state=42):
    if problem_type == "classification":
        param_distributions = {
            "LogisticRegression": {"C": [0.01,0.1,1,10], "solver": ["lbfgs"]},
            "SVC": {"C": [0.1,1,10], "kernel": ["linear","rbf"], "gamma": ["scale","auto"]},
            "RandomForest": {"n_estimators":[50,100,200], "max_depth":[None,5,10]},
            "XGBoost": {"n_estimators":[50,100,200], "max_depth":[3,5,7], "learning_rate":[0.01,0.05,0.1]}
        }
        scoring = "f1_weighted"
    else:
        param_distributions = {
            "LinearRegression": {},
            "SVR": {"C":[0.1,1,10], "kernel":["linear","rbf"], "gamma":["scale","auto"], "epsilon":[0.01,0.1,0.2]},
            "RandomForest": {"n_estimators":[50,100,200], "max_depth":[None,5,10]},
            "XGBoost": {"n_estimators":[50,100,200], "max_depth":[3,5,7], "learning_rate":[0.01,0.05,0.1]}
        }
        scoring = "r2"

    if best_model_name in param_distributions and param_distributions[best_model_name]:
        random_search = RandomizedSearchCV(
            estimator=best_model,
            param_distributions=param_distributions[best_model_name],
            n_iter=n_iter,
            cv=3,
            scoring=scoring,
            n_jobs=-1,
            random_state=random_state
        )
        random_search.fit(X_train, y_train)
        best_model = random_search.best_estimator_

    return best_model

def save_model(model, path, compress_level=3):
    """
    Save model with joblib compression.

    Args:
        model: trained ML model
        path: file path ending with .pkl
        compress_level: 0–9 (higher = more compression, slower save/load)
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(model, path, compress=compress_level)
    print(f"Model saved at {path} with compression={compress_level}")

# Main Function
def train_and_evaluate(X_train, y_train, X_test, y_test, problem_type="classification"):
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
    save_model(best_tuned_model, f'models/{best_model_name.replace(" ", "_")}', compress_level=3)
    return best_model_name, metrics_df

# -----------------------------
# EDA & JSON Report Generation
# -----------------------------
def generate_report_json(df, cleaning_summary, feature_eng_summary, model_comparison, best_model_details, target=None):
    import warnings
    warnings.filterwarnings("ignore")
    
    report = {}
    report['dataset_summary'] = {
        "shape": df.shape,
        "columns": df.columns.tolist(),
        "target": target
    }
    report['cleaning_summary'] = cleaning_summary
    report['feature_engineering'] = feature_eng_summary

    # --- EDA ---
    eda = {}
    # Missing values
    eda['missing_values'] = df.isnull().sum().to_dict()
    
    # Numeric features
    num_cols = df.select_dtypes(include=[np.number]).columns
    numeric_summary = {}
    plots = {}

    for col in num_cols:
        numeric_summary[col] = {
            "mean": df[col].mean(),
            "median": df[col].median(),
            "std": df[col].std(),
            "min": df[col].min(),
            "max": df[col].max(),
            "outliers": int(((df[col] < (df[col].quantile(0.25)-1.5*(df[col].quantile(0.75)-df[col].quantile(0.25)))) |
                             (df[col] > (df[col].quantile(0.75)+1.5*(df[col].quantile(0.75)-df[col].quantile(0.25))))).sum())
        }

        # Histogram
        fig, ax = plt.subplots(figsize=(5,4))
        sns.histplot(df[col], kde=True, bins=30, ax=ax)
        ax.set_title(f"Histogram - {col}")
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        plots[f"hist_{col}"] = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)

        # Boxplot
        fig, ax = plt.subplots(figsize=(5,4))
        sns.boxplot(x=df[col], ax=ax)
        ax.set_title(f"Boxplot - {col}")
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        plots[f"box_{col}"] = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)

    eda['numeric_summary'] = numeric_summary

    # Categorical features
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    categorical_summary = {}
    for col in cat_cols:
        counts = df[col].value_counts()
        categorical_summary[col] = counts.to_dict()

        # Countplot
        fig, ax = plt.subplots(figsize=(5,4))
        sns.countplot(x=df[col], order=counts.index[:10], ax=ax)
        ax.set_title(f"Countplot - {col}")
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        plots[f"count_{col}"] = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)

        # Pie chart if categories <=6
        if df[col].nunique() <= 6:
            fig, ax = plt.subplots(figsize=(4,4))
            counts.plot.pie(autopct="%1.1f%%", startangle=90, ax=ax)
            ax.set_ylabel("")
            ax.set_title(f"Pie Chart - {col}")
            buf = io.BytesIO()
            plt.savefig(buf, format="png")
            buf.seek(0)
            plots[f"pie_{col}"] = base64.b64encode(buf.read()).decode('utf-8')
            plt.close(fig)

    eda['categorical_summary'] = categorical_summary

    # Correlation with target
    target_corr = None
    if target and target in df.columns and df[target].dtype in [np.float64, np.int64]:
        target_corr = df.corr(numeric_only=True)[target].sort_values(ascending=False).to_dict()
    eda['target_correlation'] = target_corr

    # Correlation heatmap
    if len(num_cols) > 1:
        fig, ax = plt.subplots(figsize=(6,5))
        sns.heatmap(df[num_cols].corr(), annot=True, fmt=".2f", cmap="coolwarm", ax=ax)
        ax.set_title("Correlation Heatmap")
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        plots["correlation_heatmap"] = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)

    report['eda'] = eda
    report['plots'] = plots
    report['model_comparison'] = model_comparison
    report['best_model'] = best_model_details

    return report
