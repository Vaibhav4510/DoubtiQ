import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './DoubtUploader.css';

const DoubtUploader = ({ onUpload, onUploadStart, disabled }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !content.trim()) {
      alert('Please upload an image or enter text');
      return;
    }

    setUploading(true);
    if (onUploadStart) onUploadStart();
    
    try {
      const formData = new FormData();
      formData.append('title', title || 'Untitled Doubt');
      if (content) formData.append('content', content);
      if (file) formData.append('image', file);

      const res = await axios.post('/api/doubts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (onUpload) onUpload(res.data);
      
      // Reset form
      setTitle('');
      setContent('');
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading doubt. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="doubt-uploader card">
      <div className="form-group">
        <label>Title (Optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter doubt title"
        />
      </div>

      <div className="form-group">
        <label>Or Type Your Doubt</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your doubt here..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Or Upload an Image</label>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="remove-image"
              >
                Remove
              </button>
            </div>
          ) : (
            <p>
              {isDragActive
                ? 'Drop the image here...'
                : 'Drag & drop an image here, or click to select'}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={uploading || disabled}
      >
        {uploading ? 'Uploading...' : 'Upload Doubt'}
      </button>
    </form>
  );
};

export default DoubtUploader;
