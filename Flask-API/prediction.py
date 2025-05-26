from joblib import load
import spacy 
from gensim.models import KeyedVectors
import numpy as np
import string


model = load('../word2vec/logistic_model.joblib')
wv = KeyedVectors.load("../word2vec/word2vec-google-news-100-pca-fp16.model")
nlp_small = spacy.load("../word2vec/en_core_web_sm_dir")
stop_words_small = nlp_small.Defaults.stop_words

def tokenizer(sentence):
    punctuations = string.punctuation
                   
    doc = nlp_small(sentence)  # -> tokenization

    mytokens = []
    for word in doc:
        lemma = word.lemma_.lower().strip() # removing the whitespace & lemmatization and lowercuase
        mytokens.append(lemma)

    filtered_tokens = []
    for word in mytokens:
        if word not in stop_words_small and word not in punctuations:
            filtered_tokens.append(word)

    return filtered_tokens

def avg_vector(sent):
    vector_size = wv.vectors.shape[1]
    average_vector = np.zeros(vector_size)
    valid_word_count = 0

    for word in sent:
        if word in wv:
            average_vector += wv[word]
            valid_word_count += 1

    if valid_word_count > 0:
        average_vector /= valid_word_count
    return average_vector

def predict_(sentence):
    words = tokenizer(sentence)
    average_vector = avg_vector(words)
    return model.predict([average_vector])