"use client";

import { useState, useEffect } from "react";
import type { PortfolioData } from "@/components/portfolio/data";
import Editor from "@monaco-editor/react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [data, setData] = useState<PortfolioData | null>(null);
  
  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Editor State
  const [jsonText, setJsonText] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  // File Staging State
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  // Custom Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: "", onConfirm: () => {} });

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) {
        setIsAuthenticated(false);
      } else if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
        setJsonText(JSON.stringify(jsonData, null, 2));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      fetchData();
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  const requestConfirm = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const handleSaveData = () => {
    requestConfirm(
      "Are you sure you want to save these changes to your portfolio? This will update your live site.", 
      async () => {
        closeConfirm();
        setSaveStatus("Saving...");
        try {
          const parsedData = JSON.parse(jsonText);
          const res = await fetch("/api/admin/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsedData),
          });

          if (res.ok) {
            setSaveStatus("Content saved successfully!");
            setTimeout(() => setSaveStatus(""), 3000);
          } else {
            setSaveStatus("Error saving data.");
          }
        } catch (e) {
          setSaveStatus("Invalid JSON format. Please check for syntax errors.");
        }
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "photo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "resume") setSelectedResume(file);
    else setSelectedPhoto(file);
    
    // reset input value so re-selection of the same file works if removed
    e.target.value = '';
  };

  const handleUpload = (type: "resume" | "photo") => {
    const file = type === "resume" ? selectedResume : selectedPhoto;
    if (!file) return;

    requestConfirm(
      `Are you sure you want to upload this new ${type}? This will instantly replace the existing one.`,
      async () => {
        closeConfirm();
        setUploadStatus(`Uploading ${type}...`);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            setUploadStatus(`${type} uploaded successfully!`);
            if (type === "resume") setSelectedResume(null);
            else setSelectedPhoto(null);
            setTimeout(() => setUploadStatus(""), 4000);
          } else {
            setUploadStatus(`Error uploading ${type}.`);
          }
        } catch (error) {
          setUploadStatus(`Upload failed.`);
        }
      }
    );
  };

  const handleLogout = () => {
    requestConfirm(
      "Are you sure you want to log out of the Vault?",
      async () => {
        closeConfirm();
        await fetch("/api/admin/logout", { method: "POST" });
        setIsAuthenticated(false);
        setUsername("");
        setPassword("");
      }
    );
  };

  const inputStyle = { 
    padding: '0.85rem', 
    background: "var(--surface-strong)", 
    border: "1px solid var(--stroke)", 
    color: "var(--text)", 
    borderRadius: "12px", 
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    outline: 'none'
  };

  if (isAuthenticated === null) {
    return (
      <main className="page" style={{ paddingTop: '15vh', alignItems: 'center' }}>
        <p className="label">Accessing Vault...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="page" style={{ paddingTop: '15vh' }}>
        <section className="hero" style={{ maxWidth: '420px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           <h1 className="hero-name" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: 'var(--accent)', textAlign: 'center', width: '100%' }}>The Vault</h1>
           <p className="hero-about" style={{ textAlign: 'center', width: '100%', fontSize: '0.9rem' }}>Restricted Access</p>
           
           <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: '1.2rem', marginTop: '2rem' }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              {loginError && <p style={{ color: "var(--accent-2)", margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textAlign: 'center' }}>{loginError}</p>}
              <button type="submit" className="button-link primary" style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.7rem' }}>
                Enter Vault ↗
              </button>
           </form>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
         <div>
           <h1 className="hero-name" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: 'var(--accent)' }}>The Vault</h1>
           <p className="hero-about" style={{ marginTop: '0.5rem' }}>Admin Content Management System</p>
         </div>
         <button onClick={handleLogout} className="button-link" style={{ padding: '0.5rem 1.2rem', background: 'transparent', border: '1px solid var(--stroke)', color: 'var(--accent-2)', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
           <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Exit Vault</span>
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
             <polyline points="16 17 21 12 16 7"></polyline>
             <line x1="21" y1="12" x2="9" y2="12"></line>
           </svg>
         </button>
      </section>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
         <section className="panel">
            <div className="panel-head">
              <p className="label">Resume Upload</p>
            </div>
            <div className="entry" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface)' }}>
               <p className="entry-org">Select a PDF file to replace your current resume.</p>
               {!selectedResume ? (
                 <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={(e) => handleFileChange(e, "resume")} 
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}
                  />
               ) : (
                 <div style={{ padding: '1rem', border: '1px dashed var(--stroke)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                   <p style={{ margin: '0 0 0.8rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Selected: {selectedResume.name}</p>
                   <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                     <button onClick={() => handlePreview(selectedResume)} style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-strong)', color: 'var(--text)', border: '1px solid var(--stroke)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Preview</button>
                     <button onClick={() => setSelectedResume(null)} style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-strong)', color: 'var(--accent-2)', border: '1px solid var(--stroke)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Remove</button>
                     <button onClick={() => handleUpload("resume")} className="button-link primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', marginLeft: 'auto' }}>Upload ↗</button>
                   </div>
                 </div>
               )}
            </div>
         </section>

         <section className="panel">
            <div className="panel-head">
              <p className="label">Photo Upload</p>
            </div>
            <div className="entry" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface)' }}>
               <p className="entry-org">Select an image file to replace your profile photo.</p>
               {!selectedPhoto ? (
                 <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, "photo")} 
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}
                  />
               ) : (
                 <div style={{ padding: '1rem', border: '1px dashed var(--stroke)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                   <p style={{ margin: '0 0 0.8rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Selected: {selectedPhoto.name}</p>
                   <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                     <button onClick={() => handlePreview(selectedPhoto)} style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-strong)', color: 'var(--text)', border: '1px solid var(--stroke)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Preview</button>
                     <button onClick={() => setSelectedPhoto(null)} style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-strong)', color: 'var(--accent-2)', border: '1px solid var(--stroke)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Remove</button>
                     <button onClick={() => handleUpload("photo")} className="button-link primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', marginLeft: 'auto' }}>Upload ↗</button>
                   </div>
                 </div>
               )}
            </div>
         </section>
      </div>

      {uploadStatus && (
        <div className="panel" style={{ marginTop: '1rem', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
           <p className="label" style={{ color: uploadStatus.includes("Error") || uploadStatus.includes("failed") ? 'var(--accent-2)' : 'var(--accent)', margin: 0 }}>
             {uploadStatus}
           </p>
        </div>
      )}

      <section className="panel" style={{ marginTop: '1.5rem' }}>
         <div className="panel-head">
            <p className="label">Portfolio Content (JSON Editor)</p>
         </div>
         <div className="entry" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface)' }}>
           <p className="entry-org" style={{ marginBottom: '0.5rem' }}>
             Edit your portfolio data here. Make sure the JSON syntax is perfectly valid before saving.
           </p>
           <div style={{ width: "100%", height: "600px", border: "1px solid var(--stroke-strong)", borderRadius: "12px", overflow: "hidden", padding: "10px 0", background: "#0c0a08" }}>
             <Editor
                height="100%"
                language="json"
                theme="vault-dark"
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme('vault-dark', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [],
                    colors: {
                      'editor.background': '#0c0a08',
                      'editor.lineHighlightBackground': '#18150e',
                      'editorGutter.background': '#0c0a08'
                    }
                  });
                }}
                value={jsonText}
                onChange={(value) => setJsonText(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  formatOnPaste: true,
                  scrollBeyondLastLine: false,
                }}
              />
           </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: '0.8rem' }}>
              <button 
                onClick={handleSaveData} 
                className="button-link primary"
                style={{ padding: '0.6rem 1.5rem' }}
              >
                Save Changes ↗
              </button>
              {saveStatus && (
                <span className="label" style={{ color: saveStatus.includes("Error") || saveStatus.includes("Invalid") ? "var(--accent-2)" : "var(--accent)", fontSize: '0.75rem' }}>
                  {saveStatus}
                </span>
              )}
            </div>
         </div>
      </section>

      {/* Custom Confirm Dialog Overlay */}
      {confirmDialog.isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)'
        }}>
          <div className="panel" style={{ maxWidth: '440px', width: '90%', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '1px solid var(--accent)', background: 'var(--surface-strong)', padding: '2rem' }}>
            <h3 className="hero-name" style={{ fontSize: '1.5rem', margin: 0, color: 'var(--accent)' }}>Confirm Action</h3>
            <p className="entry-org" style={{ fontSize: '0.95rem', margin: 0, lineHeight: 1.5, color: 'var(--text)' }}>
              {confirmDialog.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={closeConfirm} 
                style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--stroke)', color: 'var(--text)', borderRadius: '999px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDialog.onConfirm} 
                className="button-link primary" 
                style={{ padding: '0.5rem 1.2rem' }}
              >
                Proceed ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
