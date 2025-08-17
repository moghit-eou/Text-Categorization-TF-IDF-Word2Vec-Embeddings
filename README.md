# <div align="center">**End-to-End Email Categorization (TF‑IDF + Word2Vec)**</div>

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" width="60">
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg" alt="Flask" width="120">
  <img src="https://raw.githubusercontent.com/explosion/spaCy/master/website/static/img/logo.svg" alt="spaCy" width="120">
  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" alt="Scikit-learn" width="120">
  <img src="https://raw.githubusercontent.com/RaRe-Technologies/gensim/develop/docs/src/_static/images/gensim_logo.png" alt="Gensim" width="150">
  <img src="https://avatars.githubusercontent.com/u/45487711?s=200&v=4" alt="n8n" width="60">
  <img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="Hugging Face" width="120">
</div>

---

## <div align="center">Project Overview</div>

This project delivers a **production-ready pipeline** to classify incoming **emails** into three HR-related categories: **`high_priority`**, **`low_priority`**, and **`job_applicant`**.  
It combines **classical NLP** (TF‑IDF) with **semantic embeddings** (Word2Vec), reduces dimensionality with **PCA (300→100)**, applies **precision quantization**, and serves predictions through a **Flask API** consumed by **n8n**.

---

## <div align="center">Features</div>

- **NLP Preprocessing (spaCy)**: tokenization, lowercasing, stop-word filtering, optional lemmatization.
- **Hybrid Vectorization**:
  - **TF‑IDF** baseline (lexical signal).
  - **Word2Vec** (semantic signal) with **mean pooling** for document vectors.
- **Modeling**: compared **Logistic Regression** (selected), **Naive Bayes**, **KNN**.
- **Dimensionality Reduction**: **PCA** from **300 → 100 dims** for faster inference and smaller artifacts.
- **Quantization**: store vectors as **float16** to cut memory footprint.
- **REST API**: `/classification` and `/vectorization` endpoints (GET).
- **Workflow Automation (n8n)**: Gmail Trigger → HTTP Request (API) → Switch & routing.
- **Deployment**: ready for **Hugging Face Spaces** / **Vercel** / traditional servers.

---

## <div align="center">Project Structure</div>

```mermaid
graph TD;
  A[Repo Root] --> B[Flask-API/];
  A --> C[NLP_TF-IDF/];
  A --> D[NLP_word2vec/];
  A --> E[data/];
  A --> F[requirements.txt];
  A --> G[vercel.json];
  A --> H[README.md];

  C --> C1[Experiments & baselines];
  D --> D1[PCA reduction & saving];
  E --> E1[Models & artifacts];
  B --> B1[app.py - API];
```

---

## <div align="center">How to Run</div>

1. **Clone the Repository**
   ```bash
   git clone https://github.com/moghit-eou/Text-Categorization-TF-IDF-Word2Vec-Embeddings.git
   cd Text-Categorization-TF-IDF-Word2Vec-Embeddings
   ```

2. **Create Environment & Install Deps**
   ```bash
   python3.10 -m venv .venv
   # Windows: py -3.10 -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Prepare Word2Vec Vectors**
  ### 3. **Prepare Word2Vec Vectors**

  1. **Download GoogleNews Word2Vec (300‑dim, ~3.5GB)**
    - Get the original `GoogleNews-vectors-negative300.bin` from [Hugging Face](https://huggingface.co/fse/word2vec-google-news-300/tree/main).

  2. **Reduce Dimensionality & Quantize**
    - Apply **PCA** to compress vectors from **300 → 100 dimensions**.
    - Save as **float16** keyed vectors for efficient storage.
    
<div align="center">
  <img src="https://i.ibb.co/ccvMrr4s/image.png" alt="PCA & Quantization" width="300">
</div>

<details>
  <summary><strong>Why PCA & Quantization? <sup>▼</sup></strong></summary>

  <div style="background-color:#f6f8fa; padding:10px; border-radius:6px;">

  - **PCA** shrinks the original 300-dim Word2Vec vectors to 100 dimensions, reducing  size from ~3.5GB to just ~600MB, speeding up inference, and making deployment practical for cloud/serverless.
  - **Quantization** (float16) further cuts memory footprint.
  <p align="center">
    <img src="https://i.ibb.co/mrkfVrVz/image.png" alt="PCA Comparison: 300D vs 100D" width="600">
  </p>

  **Visualization:**  
  The image above shows a 2D projection of document vectors for the three categories  before and after PCA reduction (300D → 100D).  
  As seen, the separation between classes remains clear, indicating that dimensionality reduction does **not significantly impact model accuracy**.
  </div>
</details>





---






4. **Transform Text & Classify**

- **Vectorize Email**:  
  Convert the email body into a vector using mean-pooled Word2Vec embeddings:
  <div align="center">
    <img src="https://i.ibb.co/21rXJ7qS/image.png" alt="Email Vectorization Example" width="500">
  </div>
<details>
  <summary><strong>Making sure mean-pooling is applied correctly ?<sup>▼</sup></strong></summary>

  <div style="background-color:#f6f8fa; padding:10px; border-radius:6px;">

  After representing each email with a **single vector** (via mean-pooling of Word2Vec embeddings),  
  I can **visualize these document vectors** in 2D space using **PCA**.  

  As shown below, the clusters demonstrate that it’s possible to **separate and classify emails** into their categories.

  <div align="center">
    <img src="https://i.ibb.co/7xHW6vVP/image.png" alt="Mean Pooling PCA Visualization" width="500">
  </div>

  </div>
</details>

- **Classify with ML Model**:  
  Feed the vector into the trained Logistic Regression classifier to predict the category (`high_priority`, `low_priority`, or `job_applicant`).
  | Model                | Accuracy | Macro‑F1 |
  |----------------------|---------:|---------:|
  | Naive Bayes          |   0.83   |   0.82   |
  | KNN                  |   0.61   |   0.85   |
  | **Logistic Regression** | **0.90** | **0.89** |

  > Metrics are indicative; expect variation with dataset size, class balance, preprocessing, and PCA dimension.

 <details>
  <summary><strong>Confusion Matrix of the Classifier <sup>▼</sup></strong></summary>

  <div style="background-color:#f6f8fa; padding:10px; border-radius:6px;">

  The **confusion matrix** shows how well the classifier distinguishes between  
  the three categories: **High Priority**, **Low Priority**, and **Job Applicant**.  

  It helps to identify where misclassifications occur (e.g., borderline cases between high and low priority).  

  <div align="center">
    <img src="https://i.ibb.co/Kp8wwxY1/image.png" alt="Confusion Matrix" width="500">
  </div>

  </div>
</details>





---

## <div align="center">API Endpoints</div>


### `GET /classification`
<div align="center">
    <img src="https://i.ibb.co/Y7wncCm9/image.png" alt="Email Vectorization Example" width="300">
  </div>

- **Query**: `email_body` (string)

```bash
curl --get "URL/classification" \
     --data-urlencode "email_body=Hello HR, I’m applying for the Data Analyst role. CV attached."
```
**Example Response**
```json
{"prediction":"job_applicant"}
```


### `GET /vectorization`
- **Query**: `text` (string)

```bash
curl --get "http://localhost:7860/vectorization" \
     --data-urlencode "text=Schedule an urgent meeting for project X today at 3pm."
```
**Example Response**
```json
{"vector":[0.0132,-0.0479,0.0211, ... 100 dims ...]}
```

> Document vectors are **mean-pooled** Word2Vec embeddings (OOV tokens skipped).

---

## <div align="center">N8N Flow</div>
<div align="center">
    <img src="https://i.ibb.co/6cttNzMq/image.png" alt="Email Vectorization Example" width="500">
  </div>

**Node Hints**
- **HTTP Request**: `GET YOUR_API_URL/classification?email_body={{$json.email_body}}`
- **Switch**: route on `{{$json.prediction}}`


---

## <div align="center">Technologies Used</div>

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" width="60">
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg" alt="Flask" width="120">
  <img src="https://raw.githubusercontent.com/explosion/spaCy/master/website/static/img/logo.svg" alt="spaCy" width="120">
  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" alt="Scikit-learn" width="120">
  <img src="https://raw.githubusercontent.com/RaRe-Technologies/gensim/develop/docs/src/_static/images/gensim_logo.png" alt="Gensim" width="150">
  <img src="https://avatars.githubusercontent.com/u/45487711?s=200&v=4" alt="n8n" width="60">
  <img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="Hugging Face" width="120">
</div>

### Libraries
- **NLP**: spaCy, Gensim (Word2Vec)
- **ML**: scikit-learn (TF‑IDF, PCA, Logistic Regression)
- **Serving**: Flask
- **Automation**: n8n
- **Utilities**: NumPy, Pandas, Joblib

---



---

## <div align="center">License</div>

This project is licensed under the **MIT License**. You are free to use, modify, and distribute with attribution.

<div align="center">
  <h4>Happy Automating!</h4>
</div>

<div align="center">
  <h3>⭐ If you found this project useful, please give it a star!</h3>
  <a href="https://github.com/moghit-eou/Text-Categorization-TF-IDF-Word2Vec-Embeddings">
    <img src="https://img.shields.io/github/stars/moghit-eou/Text-Categorization-TF-IDF-Word2Vec-Embeddings?style=social" alt="GitHub stars">
  </a>
</div>
