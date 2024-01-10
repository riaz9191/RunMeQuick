import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import MonacoEditor from "react-monaco-editor";
import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const CodeExecution = () => {
  const { user } = useContext(AuthContext);
  const [code, setCode] = useState("");
  const [runtime, setRuntime] = useState("");
  const [executionStatus, setExecutionStatus] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cancelBtnVisible, setCancelBtnVisible] = useState(false);
  const [fetchController, setFetchController] = useState(null);
  const [cancelBtnFunction, setCancelBtnFunction] = useState(null);

  const userEmail = user?.email || "";
  useTitle("Code Execution");

  const executeCode = async () => {
    if (!code || !runtime || isButtonDisabled) {
      return;
    }

    setExecutionStatus("Queued");
    setExecutionResult(null);
    setIsButtonDisabled(true);
    setCancelBtnVisible(true);

    //a 2-second delay with the option to cancel
    const delayPromise = new Promise((resolve) => {
      let cancelTimeout = false;
      const timeoutId = setTimeout(() => {
        if (!cancelTimeout) {
          resolve();
        }
      }, 1000);

      // Function to cancel the timeout
      const cancelTimeoutFunction = () => {
        clearTimeout(timeoutId);
        cancelTimeout = true;
        setCancelBtnVisible(false);
        setIsButtonDisabled(false);
        setExecutionStatus("Cancelled");
      };

      setCancelBtnVisible(true);
      setCancelBtnFunction(() => cancelTimeoutFunction);
    });

    // Wait for the delay/cancellation
    await delayPromise;

    // Continue with the fetch logic
    const controller = new AbortController();
    setFetchController(controller);

    try {
      const response = await fetch(
        "https://runmequick-server.vercel.app/api/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            runtime,
            userEmail,
            createdAt: new Date().toLocaleString("en-GB", {
              dateStyle: "short",
              timeStyle: "short",
            }),
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      setExecutionStatus(result.status);

      if (result.status === "Execution Complete") {
        setExecutionResult(result.result);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        setExecutionStatus("Cancelled");
      } else {
        console.error("Error executing code:", error);
        setExecutionStatus("Something is Wrong, Try Again!");
      }
    } finally {
      setCancelBtnVisible(false);
      setFetchController(null);

      const cooldownDuration = 5;
      setCountdown(cooldownDuration);

      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            setIsButtonDisabled(false);
            return null;
          }
          return prevCountdown - 0;
        });
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        setIsButtonDisabled(false);
        setCountdown(null);
      }, cooldownDuration * 1000);
    }
  };

  const cancelExecution = () => {
    if (cancelBtnFunction) {
      cancelBtnFunction();
    }
    if (fetchController) {
      fetchController.abort();
    }

    // Reset state after cancellation
    setExecutionStatus("Cancelled");
    setIsButtonDisabled(false);
    setCancelBtnVisible(false);
    setCountdown(null);
  };

  useEffect(() => {
    if (countdown === null) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [countdown]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 mt-16 text-white text-center">
        Code Execution
      </h1>
      <hr className="my-4 max-w-2xl mx-auto" />
      {user ? (
        <div className="space-y-4">
          <MonacoEditor
            width="100%"
            height="300"
            defaultLanguage="javascript"
            theme="vs-dark"
            className=""
            value={code}
            onChange={setCode}
            options={{
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: "line",
              automaticLayout: true,
              minimap: {
                enabled: false,
              },
            }}
          />
          <div className="flex gap-4 w-full justify-end mb-4">
            <select
              value={runtime}
              onChange={(e) => setRuntime(e.target.value)}
              className="w-1/4 p-2 border rounded focus:outline-none bg-slate-900 text-white border-blue-800 focus:border-blue-500 "
            >
              <option value="">Select Runtime</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="go">Go</option>
              <option value="c++">C++</option>
              <option value="php">PHP</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={executeCode}
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue ${
                  isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={isButtonDisabled}
              >
                Execute Code
              </button>
            </div>
            {cancelBtnVisible && (
              <button
                onClick={cancelExecution}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
              >
                Cancel
              </button>
            )}
            {countdown !== null && (
              <div className="text-gray-500 text-sm mt-2 flex gap-2 items-center justify-center">
                <div>
                  <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                  </div>
                </div>{" "}
                Cooldown: {countdown}
              </div>
            )}
          </div>
          <div className="text-white">
            <strong>Status:</strong> {executionStatus}
          </div>
          {executionResult && (
            <div className="text-white">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Result:
              </label>
              <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-md  border-blue-600 border">
                <code
                  value={executionResult}
                  className="text-green-400 font-mono "
                >
                  {executionResult}
                </code>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-red-800 text-center text-3xl font-bold font-mono">
            <span className="hover:underline hover:text-red-600 hover:transition duration-500">
              <Link to="/login">Login</Link>
            </span>{" "}
            to save your progress
          </h1>
          <MonacoEditor
            width="100%"
            height="300"
            defaultLanguage="javascript"
            theme="vs-dark"
            className=""
            value={code}
            onChange={setCode}
            options={{
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: "line",
              automaticLayout: true,
              minimap: {
                enabled: false,
              },
            }}
          />
          <select
            value={runtime}
            onChange={(e) => setRuntime(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none bg-slate-900 text-white border-blue-800 focus:border-blue-500 "
          >
            <option value="">Select Runtime</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="go">Go</option>
            <option value="c++">C++</option>
            <option value="php">PHP</option>
          </select>
          <div className="flex gap-4">
            <button
              onClick={executeCode}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue ${
                isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isButtonDisabled}
            >
              Execute Code
            </button>
            {cancelBtnVisible && (
              <button
                onClick={cancelExecution}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
              >
                Cancel
              </button>
            )}
            {countdown !== null && (
              <div className="text-gray-500 text-sm mt-2 flex gap-2 items-center justify-center">
                <div>
                  <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                  </div>
                </div>{" "}
                Cooldown: {countdown}
              </div>
            )}
          </div>
          <div className="text-white">
            <strong>Status:</strong> {executionStatus}
          </div>
          {executionResult && (
            <div className="text-white">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Result:
              </label>
              <div className="bg-slate-900 p-4 rounded-lg shadow-md  border-blue-600 border">
                <code
                  value={executionResult}
                  className="text-green-400 font-mono "
                >
                  {executionResult}
                </code>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeExecution;
