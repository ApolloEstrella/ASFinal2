import React from "react";
import ReactDOM from "react-dom";
import { useDropzone } from "react-dropzone";

//import "./styles.css";

function Basic(props) {
  const [files, setFiles] = React.useState([]);
  const onDrop = React.useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const fileList = files.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const sendFileToServer = () => {
    var formData = new FormData();
    //formData.append("formFile", files[0]);
    //formData.append("fileName", files[0].name);
    //formData.append("FileNames", JSON.stringify(files));
    //formData.append("Files", files);

    for (let i = 0; i < files.length; i++) {
      formData.append("Files", files[i]);
    }

    formData.append("id", 123)

    fetch("https://localhost:44302/api/sales/AddUploadedFiles", {
      method: "POST",
      body: formData,
    })
      .then((results) => results.json())
      .then((data) => {})
      .catch(function (error) {
        console.log("network error");
      })
      .finally(function () {});
  };

  return (
    <form onSubmit={sendFileToServer}>
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{fileList}</ul>
        </aside>
        <div>
          <button type="submit">Save</button>
        </div>
      </section>
    </form>
  );
}

export default Basic;
