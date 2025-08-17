# <div align="center">**End-to-End Email Categorization (TF‑IDF + Word2Vec)**</div>

<div align="center">
  <img src="https://miro.medium.com/v2/1*2QYim4bJ9LyO1pziQNJXMA.jpeg" alt="Docker" width="80">
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg" alt="Flask" width="120">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXSQY3mAF3wblmN0G5jKuBLPZvvGHvEnh3eA&s" alt="spaCy" width="120">
  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" alt="Scikit-learn" width="120">

  <img src="https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2F20523795-74c3-431b-b744-d515fc74c336.jpg?source=next-article&fit=scale-down&quality=highest&width=700&dpr=1" alt="n8n" width="100">


</div>

---

## <div align="center">Project Overview</div>
This project is a component of a larger n8n automation workflow, showcasing how to categorize HR-related emails using modern NLP and machine learning techniques.
- 🚀 **Effortlessly manage HR emails** with a fast, production-ready pipeline.
- 📨 **Automatic categorization**: `high_priority`, `low_priority`, or `job_applicant`.
- 🧠 **Smarter text analysis** using TF‑IDF + Word2Vec.
- ⚡ **Rapid, memory-efficient predictions** with PCA & float16 quantization.
- 🔗 **Easy integration** via scalable Flask API & n8n workflows for automated routing.

---

## <div align="center">✨ Features Overview</div>

- 🧠 **NLP Preprocessing (spaCy)**:  
  Tokenization, lowercasing, stop-word filtering, and optional lemmatization for clean input.

- 🔀 **Hybrid Vectorization**:  
  - **TF‑IDF** baseline for lexical signals.  
  - **Word2Vec** for semantic signals, using **mean pooling** for robust document vectors.

- 🤖 **Modeling Choices**:  
  Compared **Logistic Regression** (selected), **Naive Bayes**, and **KNN** for best results.

- ⚡ **Dimensionality Reduction**:  
  **PCA** compresses vectors from **300 → 100 dims** for lightning-fast inference and compact storage.

- 💾 **Quantization**:  
  Vectors stored as **float16** to minimize memory usage.

- 🌐 **REST API Endpoints**:  
  `/classification` and `/vectorization` (GET) for easy integration.

- 🔗 **Workflow Automation (n8n)**:  
  Gmail Trigger → HTTP Request (API) → Switch & routing for seamless email management.

- 🚀 **Deployment Ready**:  
  Supports **Hugging Face Spaces**, **Vercel**, and traditional servers for flexible hosting.


---

## <div align="center">Project Structure</div>

```
Text-Categorization-TF-IDF-Word2Vec-Embeddings/
├─ Flask-API/                # Flask server (API endpoints, loading vectors/model)
├─ NLP_TF-IDF/               # TF-IDF experiments/baselines
├─ NLP_word2vec/             # Word2Vec + PCA reduction utilities and notebooks
├─ data/                     # dataset
├─ requirements.txt
├─ vercel.json               # (optional) hosting config
└─ README.md
```

---

# <div align="center">How to Run</div>

### 1. **Clone the Repository**
   ```bash
   git clone https://github.com/moghit-eou/Text-Categorization-TF-IDF-Word2Vec-Embeddings.git
   cd Text-Categorization-TF-IDF-Word2Vec-Embeddings
   ```

### 2. **Create Environment & Install Deps**
   ```bash
   python3.10 -m venv .venv
   # Windows: py -3.10 -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

  ### 3. **Prepare Word2Vec Vectors**

  1. **Download GoogleNews Word2Vec (300‑dim, ~3.5GB)**
    - Get the original `GoogleNews-vectors-negative300.bin` from [Hugging Face](https://huggingface.co/fse/word2vec-google-news-300/tree/main).

  2. **Reduce Dimensionality & Quantize**
    - Apply **PCA** to compress vectors from **300 → 100 dimensions**.
    - Save as **float16** keyed vectors for efficient storage.
    
<div align="center">
  <img src="https://i.ibb.co/ccvMrr4s/image.png" alt="PCA & Quantization" width="500">
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
  Training Logistic Regression classifier to predict the category (`high_priority`, `low_priority`, or `job_applicant`).
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

## <div align="center">Deploy on Hugging Face Spaces using Docker</div>
> **Note:** Only **Hugging Face Spaces** and **AWS EC2** worked for me 
> Free platforms like Vercel and similar only work for small models; for larger models/vectors, you need a paid plan.

1. **Ready-to-use Demo**  
  Access the live app: [Hugging Face Space](https://huggingface.co/spaces/moghit/word2vec-embeddings)  
  > Note: The Space may be in sleep mode; allow ~20s for startup.

2. **Dockerized Deployment**  
  The API is containerized for reproducible deployment.  
  - Build: `docker build -t email-categorizer .`
  - Run: `docker run -p 7860:7860 email-categorizer`

3. **Automatic Startup**  
  Hugging Face Spaces handles container orchestration and exposes the Flask API.

4. **Direct Access**  
  Test endpoints via browser or `curl` once the Space is active.

---  



---

## <div align="center">API Endpoints</div>


### `GET /classification`
<div align="center">
    <img src="https://i.ibb.co/Y7wncCm9/image.png" alt="Email Vectorization Example" width="500">
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

> Document vectors are **mean-pooled** Word2Vec embeddings .

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
  <img src="https://miro.medium.com/v2/1*2QYim4bJ9LyO1pziQNJXMA.jpeg" alt="Python" width="80">
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg" alt="Flask" width="120">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXSQY3mAF3wblmN0G5jKuBLPZvvGHvEnh3eA&s" alt="spaCy" width="120">
  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" alt="Scikit-learn" width="120">
   <img src="https://avatars.githubusercontent.com/u/45487711?s=200&v=4" alt="n8n" width="60">
  <img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="Hugging Face" width="80">
</div>



### Libraries
- **NLP**: spaCy, Gensim (Word2Vec)
- **ML**: scikit-learn (TF‑IDF, PCA, Logistic Regression)
- **Serving**: Flask
- **Automation**: n8n
- **Utilities**: NumPy, Pandas, Joblib

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
