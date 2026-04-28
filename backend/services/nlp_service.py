import spacy
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer

# Pre-load spacy model.
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("WARNING: Downloading en_core_web_sm fallback...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_concepts(text: str) -> list[str]:
    doc = nlp(text)
    concepts = set()
    
    # Extract named entities
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "ORG", "GPE", "PRODUCT", "EVENT", "WORK_OF_ART", "LAW"]:
            concepts.add(ent.text)
            
    # Extract noun chunks for subjects/topics
    for chunk in doc.noun_chunks:
        if chunk.root.pos_ != "PRON":
            cleaned = " ".join([token.text for token in chunk if not token.is_stop and not token.is_punct])
            if cleaned and len(cleaned) > 2:
                concepts.add(cleaned)
                
    return list(concepts)

def summarize_text(text: str, sentences_count: int = 2) -> str:
    # Handle very short texts
    if len(text.split()) < 15:
        return text
        
    try:
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = TextRankSummarizer()
        summary = summarizer(parser.document, sentences_count)
        res = " ".join([str(sentence) for sentence in summary])
        return res if res else text
    except Exception as e:
        print(f"Summarization error: {e}")
        return text
        
def process_note_text(text: str):
    concepts = extract_concepts(text)
    summary = summarize_text(text)
    
    # If concepts is empty, add a default fallback based on some logic (or just leave empty)
    if not concepts and len(text.split()) > 0:
        words = [token.text for token in nlp(text) if token.pos_ in ["NOUN", "PROPN"]]
        if words:
            # Fallback to most common noun
            from collections import Counter
            concepts = [Counter(words).most_common(1)[0][0]]
            
    return {
        "concepts": concepts,
        "summary": summary
    }
