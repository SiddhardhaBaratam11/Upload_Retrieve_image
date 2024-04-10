import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  }

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:3000/upload", formData);
      setImageUrl(res.data);
      await axios.post("http://localhost:3000/updateProfilePic", { imagePath: res.data });
      getUserInfo();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  const getUserInfo = async () => {
    try {
      const res = await axios.get("http://localhost:3000/userInfo");
      setUserInfo(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  const updateUserInfo = async () => {
    const userInfoData = {
      name: name,
      email: email
    };
    try {
      await axios.post("http://localhost:3000/updateUserInfo", userInfoData);
      setUpdateMessage("User info updated successfully");
      getUserInfo();
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  }

  return (
    <div className="App">
      <h2>User Info</h2>
      {userInfo && (
        <div>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <br />
          <button onClick={updateUserInfo}>Update User Info</button>
          <br /> <br />
          <label>
            Profile Pic:
            <input type="file" onChange={handleFileChange} />
            <button onClick={upload}>Upload Your Profile Pic</button>
          </label>
          <br />
          {updateMessage && <p>{updateMessage}</p>}
          <br />
          <div className="card">
          <div className="card-header"><h3>Updated User Info</h3></div>
            <div className="card-body">
              <p>Name: {userInfo.name}</p> 
              <p>Email: {userInfo.email}</p>
              <p>Profile Pic: <br /> <br />
                {imageUrl && <img className="profile-pic" src={imageUrl} alt="Profile Pic" />}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
