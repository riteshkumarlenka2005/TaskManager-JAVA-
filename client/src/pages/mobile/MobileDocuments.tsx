import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FileText,
  Clock,
  Loader2,
  ChevronRight,
  Plus
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

  const parseDocDate = (dateVal: any): string => {
    if (!dateVal) return 'Recently';
    try {
      if (Array.isArray(dateVal)) {
        const d = new Date(dateVal[0], dateVal[1] - 1, dateVal[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      }
      return new Date(dateVal).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  const getPreview = (content?: string): string => {
    if (!content) return 'Empty document...';
    const clean = content.replace(/<[^>]+>/g, '').replace(/[#*_~`]/g, '');
    return clean.length > 60 ? clean.substring(0, 60) + '...' : clean;
  };

  const handleCreateDoc = async () => {
    try {
      const res = await api.post('/documents', {
        title: 'Untitled Document',
        content: '',
      });
      navigate(`/documents/${res.data.id}`);
    } catch {
      // error
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader2 className="animate-spin text-[#BEC4FF]" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Documents</h3>
        <button 
          onClick={handleCreateDoc}
          style={{ background: '#BEC4FF', color: 'black', borderRadius: '12px', padding: '0.5rem', border: 'none' }}
        >
          <Plus style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="mobile-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <FileText style={{ width: 48, height: 48, color: '#7C8B93', margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ color: '#7C8B93', fontWeight: 600 }}>No documents yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="mobile-panel"
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}
              onClick={() => navigate(`/documents/${doc.id}`)}
            >
              <div 
                style={{ 
                  width: 48, height: 48, borderRadius: '16px', background: '#222226', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}
              >
                <FileText style={{ width: 22, height: 22, color: '#BEC4FF' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }} className="truncate">
                  {doc.title || 'Untitled'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#7C8B93' }} className="truncate">
                  {getPreview(doc.content)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.65rem', color: '#7C8B93', fontWeight: 600 }}>
                  <Clock style={{ width: 10, height: 10 }} />
                  <span>{parseDocDate(doc.updatedAt || doc.createdAt)}</span>
                </div>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: '#7C8B93', opacity: 0.5 }} />
            </div>
          ))}
        </div>
      )}
      
      <div style={{ height: '1rem' }} />
    </div>
  );
};

export default MobileDocuments;
