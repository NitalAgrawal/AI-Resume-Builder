import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../configs/api';

export const useDownloadPDF = (resumeId, template = "classic") => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const downloadPDF = async (overrideId, overrideTemplate) => {
    const finalId = overrideId || resumeId;
    const finalTemplate = overrideTemplate || template;
    
    setIsDownloading(true);
    try {
      const response = await api.get(`/api/pdf/download/${finalId}?template=${finalTemplate}`, {
        headers: { Authorization: token },
        responseType: "blob",
      });
      
      const blobUrl = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `resume-${finalId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      const status = error.response?.status;
      if (status === 403) {
        toast.error("Access denied");
      } else if (status === 500) {
        toast.error("PDF generation failed. Try again.");
      } else {
        toast.error("Download failed. Please try again.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPDF, isDownloading };
};
