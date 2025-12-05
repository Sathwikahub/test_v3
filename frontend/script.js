document.getElementById("calculateBtn").addEventListener("click", async () => {
  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);
  const operation = document.getElementById("operation").value;

  try {
    const response = await fetch("http://127.0.0.1:5000/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ num1, num2, operator: operation })
    });

    const data = await response.json();
    
    if (response.ok) {
      document.getElementById("result").innerText = `Result: ${data.result}`;
      document.getElementById("result").style.background = "#d4edda";
    } else {
      document.getElementById("result").innerText = `Error: ${data.error}`;
      document.getElementById("result").style.background = "#f8d7da";
    }
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("result").innerText = "Error connecting to server";
    document.getElementById("result").style.background = "#f8d7da";
  }
});
