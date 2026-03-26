import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FileText,
  Plus,
  Clock,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface Document {
  id: number;
  title: string;
  content?: string;
  createdAt?: number[];
  updatedAt?: number[];
}

const MobileDocuments: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDocs = useCallback(async () => {
    try {
      const res = await api.get<any>('/documents');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.content || res.data?.data || [];
      setDocs(data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const formatDate = (dateArray?: number[] | null): string => {
    if (!dateArray || !Array.isArray(dateArray)) return '';
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3] || 0,
      dateArray[4] || 0
    );
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPreview = (content?: string): string => {
    if (!content) return 'No content yet...';
    // Strip any HTML/markdown
    const clean = content.replace(/<[^>]+>/g, '').replace(/[#*_~`]/g, '');
    return clean.length > 80 ? clean.substring(0, 80) + '...' : clean;
  };

  const handleCreateDoc = async () => {
    try {
      const res = await api.post('/documents', {
        title: 'Untitled Document',
        content: '',
      });
      const newDoc = res.data;
      navigate(`/documents/${newDoc.id}`);
    } catch {
      // error
    }
  };

  if (loading) {
    return (
      <div className="mobile-spinner">
        <Loader2 style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Doc count */}
      <p style={{ fontSize: '0.75rem', color: '#7C8B93', fontWeight: 600, margin: 0 }}>
        {docs.length} document{docs.length !== 1 ? 's' : ''}
      </p>

      {/* Document list */}
      {docs.length === 0 ? (
        <div className="mobile-empty-state">
          <div className="mobile-empty-state-icon">
            <FileText style={{ width: 24, height: 24 }} />
          </div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            No documents yet
          </p>
          <p style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>
            Tap the + button to create one
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="mobile-doc-card"
              onClick={() => navigate(`/documents/${doc.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(70,240,210,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileText style={{ width: 18, height: 18, color: '#46F0D2' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'white',
                      margin: '0 0 0.25rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {doc.title || 'Untitled'}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#7C8B93',
                      margin: '0 0 0.4rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getPreview(doc.content)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {(doc.updatedAt || doc.createdAt) && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.65rem',
                          color: '#4F5B62',
                        }}
                      >
                        <Clock style={{ width: 10, height: 10 }} />
                        {formatDate(doc.updatedAt || doc.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink
                  style={{ width: 14, height: 14, color: '#4F5B62', flexShrink: 0, marginTop: 4 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button className="mobile-fab" onClick={handleCreateDoc}>
        <Plus style={{ width: 26, height: 26 }} />
      </button>

      {/* Bottom spacer */}
      <div style={{ height: '1rem' }} />
    </div>
  );
};

export default MobileDocuments;
