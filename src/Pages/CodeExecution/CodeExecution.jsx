// CodeExecution.js
import { useState, useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";

const CodeExecution = () => {
  const { user } = useContext(AuthContext);
  const [code, setCode] = useState("");
  const [runtime, setRuntime] = useState("");
  const [executionStatus, setExecutionStatus] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);

  const executeCode = async () => {
    if (!code || !runtime) {
      return;
    }

    setExecutionStatus("Queued");
    setExecutionResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          runtime,
        }),
      });
      console.log(response);

      const result = await response.json();
      console.log(result);

      setExecutionStatus(result.status);

      if (result.status === "Execution Complete") {
        setExecutionResult(result.result);
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setExecutionStatus("Error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 mt-16 text-white text-center">
        --- Code Execution ---
      </h1>
      <hr className="my-4 max-w-2xl mx-auto" />
      {user ? (
        <div className="space-y-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here"
            rows="10"
            className="w-full p-2 border bg-slate-900 text-white rounded focus:outline-none border-blue-900 focus:border-blue-500"
          ></textarea>
          <select
            value={runtime}
            onChange={(e) => setRuntime(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none bg-slate-900 text-white border-blue-800 focus:border-blue-500"
          >
            <option value="">Select Runtime</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="go">Go</option>
            <option value="c++">C++</option>
          </select>
          <button
            onClick={executeCode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          >
            Execute Code
          </button>
          <div className="text-white">
            <strong>Status:</strong> {executionStatus}
          </div>
          {executionResult && (
            <div className="text-white">
              {/* <strong>Result:</strong> {executionResult} */}
              

              <label
                for="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
               Result:
              </label>
              <textarea
                id="message"
                rows="10"
                col="10"
                disabled
                placeholder={executionResult}
                className="block p-2.5 w-full text-sm text-gray-900  border focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  border-green-500 rounded-xl bg-slate-900"
                
              ></textarea>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-white border-2 max-w-xl mx-auto border-blue-600">
          Please log in to execute code.
        </p>
      )}
    </div>
  );
};

export default CodeExecution;
