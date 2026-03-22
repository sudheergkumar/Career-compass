import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pickle
import os

# Define career domains
domains = ['Software', 'Design', 'Finance', 'Healthcare', 'Engineering', 'Marketing', 'Education', 'Civil Services']

def generate_synthetic_data(num_samples=1500):
    np.random.seed(42)
    data = []
    
    for _ in range(num_samples):
        # Base features
        academic_score = np.random.uniform(60, 100)
        
        # We assign a ground truth domain, then generate features that make sense for that domain
        domain = np.random.choice(domains)
        
        # Default skills and RIASEC to somewhat random stats
        coding = np.random.uniform(0, 5)
        comm = np.random.uniform(2, 7)
        analytical = np.random.uniform(2, 7)
        creative = np.random.uniform(0, 5)
        
        R = np.random.uniform(2, 7)
        I = np.random.uniform(2, 7)
        A = np.random.uniform(2, 7)
        S = np.random.uniform(2, 7)
        E = np.random.uniform(2, 7)
        C = np.random.uniform(2, 7)
        
        # Boost features based on domain
        if domain == 'Software':
            coding = np.random.uniform(6, 10)
            analytical = np.random.uniform(6, 10)
            I = np.random.uniform(6, 10)
            C = np.random.uniform(5, 9)
        elif domain == 'Design':
            creative = np.random.uniform(7, 10)
            comm = np.random.uniform(5, 9)
            A = np.random.uniform(8, 10)
        elif domain == 'Finance':
            analytical = np.random.uniform(7, 10)
            comm = np.random.uniform(5, 8)
            C = np.random.uniform(7, 10)
            E = np.random.uniform(6, 9)
        elif domain == 'Healthcare':
            academic_score = np.random.uniform(80, 100)
            analytical = np.random.uniform(6, 9)
            S = np.random.uniform(7, 10)
            I = np.random.uniform(7, 10)
        elif domain == 'Engineering':
            academic_score = np.random.uniform(75, 100)
            analytical = np.random.uniform(7, 10)
            R = np.random.uniform(7, 10)
            I = np.random.uniform(6, 9)
        elif domain == 'Marketing':
            comm = np.random.uniform(7, 10)
            creative = np.random.uniform(6, 9)
            E = np.random.uniform(7, 10)
            S = np.random.uniform(6, 9)
        elif domain == 'Education':
            comm = np.random.uniform(7, 10)
            academic_score = np.random.uniform(70, 95)
            S = np.random.uniform(8, 10)
        elif domain == 'Civil Services':
            academic_score = np.random.uniform(75, 100)
            analytical = np.random.uniform(6, 9)
            E = np.random.uniform(7, 10)
            S = np.random.uniform(7, 10)
            
        data.append([
            academic_score, coding, comm, analytical, creative, 
            R, I, A, S, E, C, domain
        ])
        
    columns = [
        'academic_score', 'coding_skill', 'communication_skill', 'analytical_skill', 'creative_skill',
        'R', 'I', 'A', 'S', 'E', 'C', 'career_domain'
    ]
    return pd.DataFrame(data, columns=columns)

def train():
    print("Generating synthetic dataset...")
    df = generate_synthetic_data(1500)
    
    # Save dataset to CSV for reference
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/synthetic_dataset.csv', index=False)
    
    X = df.drop('career_domain', axis=1)
    y = df['career_domain']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted')
    rec = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    print("Model Evaluation Metrics:")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    
    os.makedirs('ml', exist_ok=True)
    with open('ml/model.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("Model saved to ml/model.pkl")

if __name__ == "__main__":
    train()
