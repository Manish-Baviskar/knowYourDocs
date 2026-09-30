import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Cloud, Tag, Sparkles, RefreshCw, Layers } from "lucide-react";

const API = "http://127.0.0.1:8000";

export function WordCloudTopicPage() {
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGlobalTopics();
  }, []);

  async function fetchGlobalTopics() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/documents/topics-global`);
      if (res.ok) {
        const data = await res.json();
        setTopicData(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        eyebrow="PROBLEM STATEMENT 26023 - MODULE 2"
        title="Automated Word Cloud & Topic Identification"
        description="AI-driven automatic theme extraction, keyword frequency clustering, and domain topic classification across CMPDI & CIL subsidiary documents."
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">AUTOMATED EXTRACTOR</div>
            <h2>Document Topic Classification</h2>
          </div>

          <button className="secondary-button small-btn" onClick={fetchGlobalTopics}>
            <RefreshCw size={14} /> Refresh Extraction
          </button>
        </div>

        {loading && <div className="loading">Analyzing document corpus &amp; generating Word Cloud...</div>}

        {topicData && (
          <div className="wordcloud-grid">
            <div className="wordcloud-card">
              <div className="card-title">
                <Cloud size={20} color="#b78645" />
                <h3>Automated Word Cloud</h3>
              </div>

              <div className="cloud-container">
                {topicData.word_cloud.map((w, idx) => {
                  const fontSize = Math.min(32, Math.max(12, 12 + w.value * 4));
                  const colors = ["#315d43", "#b78645", "#2e7d32", "#c62828", "#1565c0", "#7b1fa2"];
                  const color = colors[idx % colors.length];

                  return (
                    <span
                      key={idx}
                      className="word-bubble"
                      style={{ fontSize: `${fontSize}px`, color: color, fontWeight: 700 }}
                    >
                      {w.text} <small>({w.value})</small>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="topics-card">
              <div className="card-title">
                <Layers size={20} color="#315d43" />
                <h3>Identified Topic Categories</h3>
              </div>

              <div className="primary-topic-banner">
                <Sparkles size={18} color="#b78645" />
                <span>Primary Classification: <b>{topicData.primary_topic}</b></span>
              </div>

              <div className="topic-score-list">
                {topicData.topics.map((t, idx) => (
                  <div className="topic-item" key={idx}>
                    <div className="topic-label">
                      <Tag size={14} />
                      <span>{t.category}</span>
                    </div>

                    <div className="topic-bar-wrapper">
                      <div
                        className="topic-bar-fill"
                        style={{ width: `${Math.min(100, t.score * 12)}%` }}
                      ></div>
                    </div>

                    <span className="topic-val">{t.score} matches</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
