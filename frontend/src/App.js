import React, { useEffect, useState } from "react";
import { fetchData } from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData()
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Flask + React</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
