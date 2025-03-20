
import React, { useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import { PinturaEditorModal } from "@pqina/react-pintura";
import { getEditorDefaults } from '@pqina/pintura';
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
import "@pqina/pintura/pintura.css";

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageCrop, FilePondPluginImageEdit);
const editorDefaults = getEditorDefaults();

function App() {
  const [files, setFiles] = useState([]);
  const [editorEnabled, setEditorEnabled] = useState(false);
  const [editorSrc, setEditorSrc] = useState(null);
  const fileInputRef = useRef(null);

  const handleEditImage = (file) => {
    if (!file) return;
    setEditorSrc(file.file);
    setEditorEnabled(true);
  };

  const handleEditorProcess = (imageState) => {
    const editedFile = new File([imageState.dest], files[0]?.file?.name, {
      type: imageState.dest.type,
      lastModified: Date.now(),
    });

    setFiles([{ source: editedFile }]);
    setEditorEnabled(false);
  };

  return (
    <div className="App">
      <h2>Upload & Edit Image</h2>

      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        acceptedFileTypes={["image/*"]}
        allowFilePoster={true}
        allowImageEdit={true}
        onactivatefile={(file) => handleEditImage(file)}
        name="file"
        labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
      />

      {editorEnabled && (
        <PinturaEditorModal
          {...editorDefaults}
          src={editorSrc}
          imageCropAspectRatio={1}
          onHide={() => setEditorEnabled(false)}
          onProcess={handleEditorProcess}
        />
      )}
    </div>
  );
}

export default App;
