import React, { useState, useEffect } from "react";
import axios from 'axios'
import Papa from "papaparse";
import './App.css'

const allowedExtensions = ["csv"];

function App() {

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [subject, setSubject] = useState("");
  const [link, setLink] = useState("");
  const [body, setBody] = useState("");

  const handleFileChange = (e) => {
    setError("");

    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      setFile(inputFile);
    }
  };
  const handleParse = () => {
    if (!file) return setError("Enter a valid file");

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      // const columns = Object.keys(parsedData[0]);
      setData(parsedData);
    };
    reader.readAsText(file);
  };

  const sendEmail = async () => {
    let confirmation = confirm("Do you want to send mails to all these users?")
    if (confirmation) {
      const response = await axios.post("https://email-server.vercel.app/sendit", {
        subject,
        body,
        data,
        link
      })

      alert(response.data.message);
    }
  }

  return (
    <div className="App">
      <div class="form">
        <div class="title">Email Server</div>
        <div class="input-container ic1">
          <input id="emailSubject" class="input" type="text" onChange={(e) => { setSubject(e.target.value) }} placeholder="Subject" />
        </div>
        <div class="input-container ic2">
          <textarea name="emailBody" id="emailBody" cols="90" rows="10" onChange={(e) => { setBody(e.target.value) }} placeholder='Body'></textarea>
        </div>
        <div class="input-container ic2">
          <input id="emailLink" class="input" type="text" onChange={(e) => { setLink(e.target.value) }} placeholder="Link" />
        </div>
        <div class="input-container ic2">
          <input type="file" style={{ color: "white" }} onChange={handleFileChange} id="csvInput" name="file" />
        </div>
        <button type="text" onClick={handleParse}>Load Data</button>
        <button type="text" onClick={sendEmail} class="submit">Send Email</button>
      </div>

      <div style={{ marginTop: "1rem", color: "white" }}>
        {error ? error : <div className="table">
          <div class="datatable-container">
            <table class="datatable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {data.map((col,
                  idx) => <tr key={idx}>
                    <td>{col.name}</td>
                    <td>{col.email}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
      </div>

    </div>
  )
}

export default App
