const [selectedFile, setSelectedFile] = useState(null);
const [uploading, setUploading] = useState(false);

const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};

const handleUpload = async () => {
  if (!selectedFile) return;

  try {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("lesson_id", lessonId); // make sure you pass this prop or get it from route

    const res = await axios.post("/api/upload", formData);
    console.log("Upload success:", res.data);
  } catch (err) {
    console.error("Upload failed:", err);
  } finally {
    setUploading(false);
  }
};
