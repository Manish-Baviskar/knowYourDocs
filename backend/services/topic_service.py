import re
from collections import Counter

STOP_WORDS = {
  "the", "and", "is", "in", "to", "of", "a", "for", "on", "with", "as", "by", "at", "an",
  "be", "this", "that", "which", "are", "from", "it", "was", "or", "have", "has", "had",
  "not", "been", "were", "than", "more", "also", "their", "will", "may", "can", "should"
}

TOPIC_CATEGORIES = {
  "Geology & Exploration": ["geology", "borehole", "seam", "thickness", "stratigraphic", "reserve", "coal", "formation", "dip", "fault"],
  "Mine Operations & Production": ["production", "excavation", "overburden", "stripping", "tonnes", "output", "grade", "opencast", "underground"],
  "Mine Safety & Risk": ["safety", "hazard", "slope", "stability", "bench", "wall", "monitoring", "accident", "risk", "inspection"],
  "Equipment & Maintenance": ["excavator", "dumper", "haul", "drill", "dozer", "fleet", "breakdown", "utilization", "downtime", "hours"],
  "Environmental & Compliance": ["reclamation", "dust", "effluent", "plantation", "environmental", "clearence", "topography", "water", "ecology"],
}


def extract_word_cloud_and_topics(text: str) -> dict:
    """
    Automated Word Cloud and Topic Identification Module
    as required by Problem Statement 26023 (Ministry of Coal / CIL / CMPDI).
    """
    if not text or not text.strip():
        return {
            "word_cloud": [],
            "topics": [],
            "primary_topic": "Uncategorized",
            "total_words": 0,
        }

    # Clean text and extract words
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    filtered_words = [w for w in words if w not in STOP_WORDS]

    # Calculate word frequency for Word Cloud
    counts = Counter(filtered_words)
    top_words = [{"text": word, "value": count} for word, count in counts.most_common(25)]

    # Identify Topic Distributions
    topic_scores = {}
    for cat, keywords in TOPIC_CATEGORIES.items():
        score = sum(counts[kw] for kw in keywords)
        if score > 0:
            topic_scores[cat] = score

    sorted_topics = sorted(topic_scores.items(), key=lambda x: x[1], reverse=True)
    topics_list = [{"category": cat, "score": score} for cat, score in sorted_topics]

    primary = sorted_topics[0][0] if sorted_topics else "General Mining Intelligence"

    return {
        "word_cloud": top_words,
        "topics": topics_list,
        "primary_topic": primary,
        "total_words": len(words),
    }
